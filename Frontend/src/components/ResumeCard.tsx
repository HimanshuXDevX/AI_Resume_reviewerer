  import ScoreCircle from "./ScoreCircle";

interface Resume {
  id: string;
  jobTitle: string;
  feedback: { overallScore: number };
  imagePath: string;
  resumePath?: string;
}

const ResumeCard = ({ resume }: { resume: Resume }) => {
  const { id, jobTitle, feedback, imagePath, resumePath } = resume;

  return (
    <div className="resume-card animate-in fade-in duration-1000">
      {/* Header */}
      <div className="resume-card-header">
        <div className="flex flex-col gap-1">
          {jobTitle && (
            <h3 className="text-2xl font-bold break-words text-gray-200">{jobTitle}</h3>
          )}
        </div>
        <div className="flex-shrink-0">
          <ScoreCircle score={feedback.overallScore} />
        </div>
      </div>

      {/* Image Preview */}
      {imagePath && (
        <div className="gradient-border animate-in fade-in duration-1000">
          <div className="w-full h-full">
            <a
              href={resumePath || imagePath}
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                src={imagePath}
                alt="resume"
                className="w-full h-[350px] max-sm:h-[200px] object-cover object-top cursor-pointer"
              />
            </a>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResumeCard;
