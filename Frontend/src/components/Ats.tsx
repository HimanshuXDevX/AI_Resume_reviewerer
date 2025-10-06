import React from "react";

interface Suggestion {
  type: "good" | "improve";
  tip: string;
}

interface ATSProps {
  score: number;
  suggestions: Suggestion[];
}

const Ats: React.FC<ATSProps> = ({ score, suggestions }) => {
  const gradientClass =
    score > 69
      ? "from-green-900/40"
      : score > 49
      ? "from-yellow-900/40"
      : "from-red-900/40";

  const iconSrc =
    score > 69
      ? "/icons/ats-good.svg"
      : score > 49
      ? "/icons/ats-warning.svg"
      : "/icons/ats-bad.svg";

  const subtitle = score > 69 ? "Great Job!" : score > 49 ? "Good Start" : "Needs Improvement";

  return (
    <div
      className={`bg-gradient-to-b ${gradientClass} to-gray-800 rounded-xl shadow-lg shadow-gray-900 p-3 text-white`}
    >
      <div className="flex items-center gap-2 mb-3">
        <img src={iconSrc} alt="ATS Score Icon" className="w-6 h-6" />
        <div>
          <h2 className="text-lg font-extrabold text-white">
            ATS Score - <span className="text-white">{score} </span>/<span className="text-white"> {100}</span>
          </h2>
        </div>
      </div>

      <div className="mb-3">
        <h3 className="text-sm font-semibold mb-1">{subtitle}</h3>
        <p className="text-gray-400 mb-2 text-xs">
          This score represents how well your resume is likely to perform in Applicant Tracking Systems used by employers.
        </p>

        <div className="space-y-1">
          {suggestions.map((suggestion, index) => (
            <div key={index} className="flex items-start gap-2">
              <img
                src={suggestion.type === "good" ? "/icons/check.svg" : "/icons/warning.svg"}
                alt={suggestion.type === "good" ? "Check" : "Warning"}
                className="w-3 h-3 mt-0.5"
              />
              <p
                className={
                  suggestion.type === "good" ? "text-green-400 text-xs" : "text-amber-400 text-xs"
                }
              >
                {suggestion.tip}
              </p>
            </div>
          ))}
        </div>
      </div>

      <p className="text-gray-400 italic text-xs">
        Keep refining your resume to improve your chances of getting past ATS filters and into the hands of recruiters.
      </p>
    </div>
  );
};

export default Ats;
