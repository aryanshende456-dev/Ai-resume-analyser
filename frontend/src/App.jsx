import { useState } from "react";

function App() {
  const [resume, setResume] = useState(null);
  const [jobDescription, setJobDescription] = useState("");
  const [analysis, setAnalysis] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // ======================================
  // Resume Selection
  // ======================================

  const handleResumeChange = (event) => {
    const file = event.target.files[0];

    if (file) {
      setResume(file);
      setAnalysis(null);
      setMessage("");
    }
  };

  // ======================================
  // Analyze Resume
  // ======================================

  const handleAnalyze = async () => {
    if (!resume) {
      setMessage("Please upload your resume PDF.");
      return;
    }

    if (!jobDescription.trim()) {
      setMessage("Please enter a job description.");
      return;
    }

    setLoading(true);
    setMessage("");
    setAnalysis(null);

    try {
      const formData = new FormData();

      formData.append("resume", resume);
      formData.append("jobDescription", jobDescription);

      const response = await fetch(
        "http://127.0.0.1:5001/api/analyze",
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();

      console.log("Backend response:", data);

      if (!response.ok) {
        setMessage(
          data.message || "Analysis failed."
        );
        return;
      }

      setAnalysis(data);

      setMessage(
        data.message || "Resume analyzed successfully."
      );
    } catch (error) {
      console.error(
        "Connection error:",
        error
      );

      setMessage(
        "Unable to connect to backend. Make sure the server is running."
      );
    } finally {
      setLoading(false);
    }
  };

  // ======================================
  // UI
  // ======================================

  return (
    <div className="min-h-screen bg-gray-100 px-4 py-10">

      <div className="mx-auto max-w-4xl">

        {/* ==================================
            HEADER
        ================================== */}

        <div className="text-center">

          <h1 className="text-4xl font-bold text-gray-900">
            AI Resume & Job Analyzer
          </h1>

          <p className="mt-3 text-gray-600">
            Analyze your resume against a job description
          </p>

        </div>


        {/* ==================================
            INPUT CARD
        ================================== */}

        <div className="mt-10 rounded-2xl bg-white p-8 shadow-lg">

          {/* Resume Upload */}

          <div>

            <h2 className="mb-3 text-xl font-semibold text-gray-800">
              Upload Your Resume
            </h2>

            <input
              type="file"
              accept=".pdf"
              onChange={handleResumeChange}
              className="w-full rounded-lg border border-gray-300 p-3"
            />

            {resume && (
              <p className="mt-2 text-sm text-green-600">
                Selected: {resume.name}
              </p>
            )}

          </div>


          {/* Job Description */}

          <div className="mt-8">

            <h2 className="mb-3 text-xl font-semibold text-gray-800">
              Job Description
            </h2>

            <textarea
              value={jobDescription}
              onChange={(event) =>
                setJobDescription(
                  event.target.value
                )
              }
              placeholder="Paste the job description here..."
              rows="10"
              className="w-full resize-none rounded-lg border border-gray-300 p-4 outline-none focus:border-blue-500"
            />

          </div>


          {/* Analyze Button */}

          <button
            onClick={handleAnalyze}
            disabled={loading}
            className="mt-8 w-full rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-400"
          >

            {loading
              ? "Analyzing..."
              : "Analyze Resume"}

          </button>


          {/* Message */}

          {message && (
            <div className="mt-5 rounded-lg bg-gray-100 p-4 text-center text-gray-700">
              {message}
            </div>
          )}

        </div>


        {/* ==================================
            RESULTS
        ================================== */}

        {analysis && (

          <div className="mt-8 space-y-6">


            {/* ==================================
                MATCH SCORE
            ================================== */}

            <div className="rounded-2xl bg-white p-8 text-center shadow-lg">

              <h2 className="text-2xl font-bold text-gray-800">
                Resume Match Score
              </h2>

              <div className="mt-6 text-6xl font-bold text-blue-600">
                {analysis.matchPercentage}%
              </div>

              <p className="mt-3 text-gray-500">
                Based on matching job skills
              </p>

            </div>


            {/* ==================================
                AI STATUS
            ================================== */}

            {analysis.aiAvailable ? (

              <div className="rounded-2xl bg-green-50 p-6">

                <h2 className="text-xl font-bold text-green-700">
                  ✓ AI Analysis Available
                </h2>

                <p className="mt-2 text-green-700">
                  Your resume was successfully analyzed using AI.
                </p>

              </div>

            ) : (

              <div className="rounded-2xl bg-yellow-50 p-6">

                <h2 className="text-xl font-bold text-yellow-700">
                  AI Analysis Unavailable
                </h2>

                <p className="mt-2 text-yellow-700">
                  {analysis.aiError ||
                    "AI analysis is currently unavailable."}
                </p>

                <p className="mt-2 text-sm text-yellow-600">
                  Your normal resume matching results are still available below.
                </p>

              </div>

            )}


            {/* ==================================
                AI ANALYSIS
            ================================== */}

            {analysis.aiAnalysis && (

              <div className="rounded-2xl bg-white p-8 shadow-lg">

                <h2 className="text-2xl font-bold text-gray-800">
                  AI Resume Analysis
                </h2>


                {/* Summary */}

                <div className="mt-6">

                  <h3 className="text-lg font-semibold text-blue-600">
                    Resume Summary
                  </h3>

                  <p className="mt-2 leading-7 text-gray-600">
                    {analysis.aiAnalysis.summary}
                  </p>

                </div>


                {/* Strengths */}

                <div className="mt-8">

                  <h3 className="text-lg font-semibold text-green-600">
                    Your Strengths
                  </h3>

                  <ul className="mt-3 space-y-2">

                    {analysis.aiAnalysis.strengths?.length > 0 ? (

                      analysis.aiAnalysis.strengths.map(
                        (strength, index) => (

                          <li
                            key={index}
                            className="rounded-lg bg-green-50 p-3 text-gray-700"
                          >
                            ✓ {strength}
                          </li>

                        )
                      )

                    ) : (

                      <li className="text-gray-500">
                        No strengths available.
                      </li>

                    )}

                  </ul>

                </div>


                {/* Missing Skills */}

                <div className="mt-8">

                  <h3 className="text-lg font-semibold text-red-600">
                    Skills to Improve
                  </h3>

                  <div className="mt-3 flex flex-wrap gap-2">

                    {analysis.aiAnalysis.missingSkills?.length > 0 ? (

                      analysis.aiAnalysis.missingSkills.map(
                        (skill, index) => (

                          <span
                            key={index}
                            className="rounded-full bg-red-100 px-4 py-2 text-sm font-medium text-red-700"
                          >
                            {skill}
                          </span>

                        )
                      )

                    ) : (

                      <p className="text-gray-500">
                        No major missing skills identified.
                      </p>

                    )}

                  </div>

                </div>


                {/* Suggestions */}

                <div className="mt-8">

                  <h3 className="text-lg font-semibold text-purple-600">
                    Personalized Suggestions
                  </h3>

                  <ul className="mt-3 space-y-2">

                    {analysis.aiAnalysis.suggestions?.length > 0 ? (

                      analysis.aiAnalysis.suggestions.map(
                        (suggestion, index) => (

                          <li
                            key={index}
                            className="rounded-lg bg-purple-50 p-3 text-gray-700"
                          >
                            💡 {suggestion}
                          </li>

                        )
                      )

                    ) : (

                      <li className="text-gray-500">
                        No suggestions available.
                      </li>

                    )}

                  </ul>

                </div>

              </div>

            )}


            {/* ==================================
                MATCHED / MISSING SKILLS
            ================================== */}

            <div className="grid gap-6 md:grid-cols-2">


              {/* Matched Skills */}

              <div className="rounded-2xl bg-white p-6 shadow-lg">

                <h2 className="text-xl font-bold text-green-600">
                  ✓ Matched Skills
                </h2>

                <div className="mt-4 flex flex-wrap gap-2">

                  {analysis.matchedSkills?.length > 0 ? (

                    analysis.matchedSkills.map(
                      (skill) => (

                        <span
                          key={skill}
                          className="rounded-full bg-green-100 px-3 py-2 text-sm font-medium text-green-700"
                        >
                          {skill}
                        </span>

                      )
                    )

                  ) : (

                    <p className="text-gray-500">
                      No matching skills found.
                    </p>

                  )}

                </div>

              </div>


              {/* Missing Skills */}

              <div className="rounded-2xl bg-white p-6 shadow-lg">

                <h2 className="text-xl font-bold text-red-600">
                  ✗ Missing Skills
                </h2>

                <div className="mt-4 flex flex-wrap gap-2">

                  {analysis.missingSkills?.length > 0 ? (

                    analysis.missingSkills.map(
                      (skill) => (

                        <span
                          key={skill}
                          className="rounded-full bg-red-100 px-3 py-2 text-sm font-medium text-red-700"
                        >
                          {skill}
                        </span>

                      )
                    )

                  ) : (

                    <p className="text-gray-500">
                      No missing skills.
                    </p>

                  )}

                </div>

              </div>

            </div>


            {/* ==================================
                RESUME SKILLS
            ================================== */}

            <div className="rounded-2xl bg-white p-6 shadow-lg">

              <h2 className="text-xl font-bold text-gray-800">
                Skills Found in Resume
              </h2>

              <div className="mt-4 flex flex-wrap gap-2">

                {analysis.resumeSkills?.length > 0 ? (

                  analysis.resumeSkills.map(
                    (skill) => (

                      <span
                        key={skill}
                        className="rounded-full bg-blue-100 px-3 py-2 text-sm font-medium text-blue-700"
                      >
                        {skill}
                      </span>

                    )
                  )

                ) : (

                  <p className="text-gray-500">
                    No skills detected.
                  </p>

                )}

              </div>

            </div>


            {/* ==================================
                REQUIRED JOB SKILLS
            ================================== */}

            <div className="rounded-2xl bg-white p-6 shadow-lg">

              <h2 className="text-xl font-bold text-gray-800">
                Skills Required by Job
              </h2>

              <div className="mt-4 flex flex-wrap gap-2">

                {analysis.requiredSkills?.length > 0 ? (

                  analysis.requiredSkills.map(
                    (skill) => (

                      <span
                        key={skill}
                        className="rounded-full bg-purple-100 px-3 py-2 text-sm font-medium text-purple-700"
                      >
                        {skill}
                      </span>

                    )
                  )

                ) : (

                  <p className="text-gray-500">
                    No required skills detected.
                  </p>

                )}

              </div>

            </div>

          </div>

        )}

      </div>

    </div>
  );
}

export default App;

