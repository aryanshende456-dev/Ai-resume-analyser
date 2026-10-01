const express = require("express");
const cors = require("cors");
const multer = require("multer");
const { PDFParse } = require("pdf-parse");

const { extractSkills } = require("./utils/skillExtractor");
const { analyzeJobDescription } = require("./utils/jobAnalyzer");
const { calculateMatch } = require("./utils/matchEngine");
const { analyzeResumeWithAI } = require("./utils/aiAnalyzer");

const app = express();


// ======================================
// Middleware
// ======================================

app.use(cors());
app.use(express.json());


// ======================================
// File Upload Configuration
// ======================================

const upload = multer({
  storage: multer.memoryStorage(),
});


// ======================================
// Test Route
// ======================================

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "AI Resume Analyzer Backend is running",
  });
});


// ======================================
// Resume Analysis Route
// ======================================

app.post(
  "/api/analyze",
  upload.single("resume"),
  async (req, res) => {

    try {

      console.log("\n================================");
      console.log("ANALYSIS STARTED");
      console.log("================================");


      // ======================================
      // 1. Check Resume
      // ======================================

      if (!req.file) {

        console.log("ERROR: No resume received");

        return res.status(400).json({
          success: false,
          message: "Resume PDF is required",
        });
      }

      console.log(
        "PDF received:",
        req.file.originalname
      );


      // ======================================
      // 2. Check Job Description
      // ======================================

      const { jobDescription } = req.body;

      if (
        !jobDescription ||
        !jobDescription.trim()
      ) {

        console.log(
          "ERROR: No job description"
        );

        return res.status(400).json({
          success: false,
          message: "Job description is required",
        });
      }

      console.log(
        "Job description received"
      );


      // ======================================
      // 3. Extract Text From PDF
      // ======================================

      console.log(
        "Extracting text from PDF..."
      );

      const parser = new PDFParse({
        data: req.file.buffer,
      });

      const pdfData = await parser.getText();

      const resumeText = pdfData.text;

      await parser.destroy();

      console.log(
        "PDF text extracted successfully"
      );

      console.log(
        "Resume text length:",
        resumeText.length
      );


      // ======================================
      // 4. Extract Resume Skills
      // ======================================

      console.log(
        "Extracting resume skills..."
      );

      const resumeSkills =
        extractSkills(resumeText);

      console.log(
        "Resume skills:"
      );

      console.log(resumeSkills);


      // ======================================
      // 5. Analyze Job Description
      // ======================================

      console.log(
        "Analyzing job description..."
      );

      const jobAnalysis =
        analyzeJobDescription(
          jobDescription
        );

      const requiredSkills =
        jobAnalysis.requiredSkills;

      console.log(
        "Required job skills:"
      );

      console.log(requiredSkills);


      // ======================================
      // 6. Calculate Skill Match
      // ======================================

      console.log(
        "Calculating skill match..."
      );

      const matchResult =
        calculateMatch(
          resumeSkills,
          requiredSkills
        );

      console.log(
        "Match result:"
      );

      console.log(matchResult);


      // ======================================
      // 7. AI Analysis
      // ======================================

      let aiAnalysis = null;

      let aiAvailable = false;

      let aiError = null;


      // Check whether API key exists

      if (process.env.OPENAI_API_KEY) {

        console.log(
          "OpenAI API key found."
        );

        try {

          console.log(
            "Running AI analysis..."
          );


          aiAnalysis =
            await analyzeResumeWithAI(
              resumeText,
              jobDescription
            );


          aiAvailable = true;

          console.log(
            "AI analysis completed successfully."
          );

        } catch (error) {

          console.error(
            "AI analysis failed:",
            error.message
          );

          console.error(
            error.message
          );


          aiAvailable = false;

          aiError =
            "AI analysis is currently unavailable. Normal resume analysis is still available.";
        }

      } else {

        console.log(
          "OPENAI_API_KEY not found."
        );

        console.log(
          "Skipping AI analysis."
        );


        aiAvailable = false;

        aiError =
          "AI analysis is unavailable because no OpenAI API key is configured.";
      }


      // ======================================
      // 8. Send Final Response
      // ======================================

      console.log(
        "Sending response..."
      );


      return res.json({

        success: true,

        message:
          "Resume analyzed successfully",


        // Resume information

        resumeSkills:
          resumeSkills,


        // Job information

        requiredSkills:
          requiredSkills,


        // Match information

        matchPercentage:
          matchResult.matchPercentage,

        matchedSkills:
          matchResult.matchedSkills,

        missingSkills:
          matchResult.missingSkills,


        // AI information

        aiAvailable:
          aiAvailable,

        aiAnalysis:
          aiAnalysis,

        aiError:
          aiError,
      });

    } catch (error) {

      console.error(
        "\n================================"
      );

      console.error(
        "ANALYSIS ERROR"
      );

      console.error(
        "================================"
      );

      console.error(
        error
      );


      return res.status(500).json({

        success: false,

        message:
          "Failed to analyze resume",

        error:
          error.message,
      });
    }
  }
);


// ======================================
// Start Server
// ======================================

const PORT = 5001;

app.listen(PORT, () => {

  console.log(
    `Server running on http://localhost:${PORT}`
  );

});

