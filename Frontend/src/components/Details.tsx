import { cn } from "../utils/utils";
import {
  Accordion,
  AccordionContent,
  AccordionHeader,
  AccordionItem,
} from "./Accordion";

interface Feedback {
  overallScore: number;
  ATS: { score: number; tips: { type: "good" | "improve"; tip: string; explanation: string | null }[] };
  toneAndStyle: { score: number; tips: { type: "good" | "improve"; tip: string; explanation: string | null }[] };
  content: { score: number; tips: { type: "good" | "improve"; tip: string; explanation: string | null }[] };
  structure: { score: number; tips: { type: "good" | "improve"; tip: string; explanation: string | null }[] };
  skills: { score: number; tips: { type: "good" | "improve"; tip: string; explanation: string | null }[] };
  recommendation: {
    roles: string[];
    responsibilities: string[];
  };
}

const ScoreBadge = ({ score }: { score: number }) => (
  <div
    className={cn(
      "flex flex-row gap-1 items-center px-1.5 py-0 rounded-[96px]",
      score > 69
        ? "bg-badge-green"
        : score > 39
        ? "bg-badge-yellow"
        : "bg-badge-red"
    )}
  >
    <img
      src={score > 69 ? "/icons/check.svg" : "/icons/warning.svg"}
      alt="score"
      className="size-4"
    />
    <p className="text-sm font-bold flex gap-1">
      <span
        className={
          score > 69
            ? "text-badge-green-text"
            : score > 39
            ? "text-badge-yellow-text"
            : "text-badge-red-text"
        }
      >
        {score}
      </span>
      <span className="text-white">/ 100</span>
    </p>
  </div>
);

const CategoryHeader = ({ title, categoryScore }: { title: string; categoryScore?: number }) => (
  <div className="flex flex-row gap-3 items-center py-1.5">
    <p className="text-xl font-bold text-white">{title}</p>
    {categoryScore !== undefined && <ScoreBadge score={categoryScore} />}
  </div>
);

const CategoryContent = ({
  tips,
}: {
  tips: { type: "good" | "improve"; tip: string; explanation: string | null }[];
}) => (
  <div className="flex flex-col gap-2 items-center w-full">
    <div className="flex flex-col gap-2 w-full p-2">
      {tips.map((tip, index) => (
        <div
          key={index + tip.tip}
          className={cn(
            "flex flex-col gap-2 rounded-xl p-2",
            tip.type === "good"
              ? "bg-green-900 border border-green-700 text-white"
              : "bg-yellow-900 border border-yellow-700 text-white"
          )}
        >
          <div className="flex flex-row gap-1 items-center">
            <img
              src={tip.type === "good" ? "/icons/check.svg" : "/icons/warning.svg"}
              alt="tip icon"
              className="size-4"
            />
            <p className="text-sm">{tip.tip}</p>
          </div>
          {tip.explanation && (
            <p className="text-sm font-medium text-gray-200">{tip.explanation}</p>
          )}
        </div>
      ))}
    </div>
  </div>
);

const RecommendationContent = ({
  roles,
  responsibilities,
}: {
  roles: string[];
  responsibilities: string[];
}) => (
  <div className="flex flex-col gap-2 items-center w-full">
    <div className="flex flex-col gap-3 w-full p-2">
      {/* Roles block */}
      <div className="flex flex-col gap-2 rounded-xl p-3 bg-blue-900 border border-blue-700 text-white">
        <h3 className="text-lg font-semibold">Suggested Roles</h3>
        <ul className="list-disc pl-5 text-gray-200">
          {roles.map((role, idx) => (
            <li key={idx} className="text-sm">{role}</li>
          ))}
        </ul>
      </div>

      {/* Responsibilities block */}
      <div className="flex flex-col gap-2 rounded-xl p-3 bg-purple-900 border border-purple-700 text-white">
        <h3 className="text-lg font-semibold">Key Responsibilities</h3>
        <ul className="list-disc pl-5 text-gray-200">
          {responsibilities.map((res, idx) => (
            <li key={idx} className="text-sm">{res}</li>
          ))}
        </ul>
      </div>
    </div>
  </div>
);

// --- Main Details Component ---
const Details = ({ feedback }: { feedback: Feedback }) => {
  return (
    <div className="flex flex-col gap-3 w-full">
      <Accordion>
        <AccordionItem id="tone-style">
          <AccordionHeader itemId="tone-style">
            <CategoryHeader title="Tone & Style" categoryScore={feedback.toneAndStyle.score} />
          </AccordionHeader>
          <AccordionContent itemId="tone-style">
            <CategoryContent tips={feedback.toneAndStyle.tips} />
          </AccordionContent>
        </AccordionItem>

        <AccordionItem id="content">
          <AccordionHeader itemId="content">
            <CategoryHeader title="Content" categoryScore={feedback.content.score} />
          </AccordionHeader>
          <AccordionContent itemId="content">
            <CategoryContent tips={feedback.content.tips} />
          </AccordionContent>
        </AccordionItem>

        <AccordionItem id="structure">
          <AccordionHeader itemId="structure">
            <CategoryHeader title="Structure" categoryScore={feedback.structure.score} />
          </AccordionHeader>
          <AccordionContent itemId="structure">
            <CategoryContent tips={feedback.structure.tips} />
          </AccordionContent>
        </AccordionItem>

        <AccordionItem id="skills">
          <AccordionHeader itemId="skills">
            <CategoryHeader title="Skills" categoryScore={feedback.skills.score} />
          </AccordionHeader>
          <AccordionContent itemId="skills">
            <CategoryContent tips={feedback.skills.tips} />
          </AccordionContent>
        </AccordionItem>

        {/* New Recommendations Accordion */}
        <AccordionItem id="recommendations">
          <AccordionHeader itemId="recommendations">
            <CategoryHeader title="Recommendations" />
          </AccordionHeader>
          <AccordionContent itemId="recommendations">
            <RecommendationContent
              roles={feedback.recommendation.roles}
              responsibilities={feedback.recommendation.responsibilities}
            />
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default Details;
