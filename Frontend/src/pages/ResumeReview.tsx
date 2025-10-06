import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Summary from "../components/Summary";
import Ats from "../components/Ats";
import Details from "../components/Details";
import { useApi } from "../utils/api";

interface Tip {
  type: "good" | "improve";
  tip: string;
  explanation: string | null;
}

interface Category {
  score: number;
  tips: Tip[];
}

interface RecommendationCategory {
  roles: string[];
  responsibilities: string[];
}

interface Feedback {
  overallScore: number;
  ATS: Category;
  toneAndStyle: Category;
  content: Category;
  structure: Category;
  skills: Category;
  recommendation: RecommendationCategory;
}

const initialFeedback: Feedback = {
  overallScore: 0,
  ATS: { score: 0, tips: [] },
  toneAndStyle: { score: 0, tips: [] },
  content: { score: 0, tips: [] },
  structure: { score: 0, tips: [] },
  skills: { score: 0, tips: [] },
  recommendation: { roles: [], responsibilities: [] }, // 👈 fixed
};

const ResumeReview = () => {
  const { id } = useParams();
  const { makeRequest } = useApi();

  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [resumeUrl, setResumeUrl] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<Feedback>(initialFeedback);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const loadResume = async () => {
      if (!id) return;
      setIsLoaded(false);

      try {
        const data = await makeRequest(`resume/resume-feedback/${id}`, {
          method: "GET",
        });

        if (data.feedback) {
          setFeedback(prev => ({ ...prev, ...data.feedback }));
          setIsLoaded(true);
        }

        setResumeUrl(data.resume_url || null);
        setImageUrl(data.image_url || null);
      } catch (err) {
        console.error("Failed to load resume:", err);
        setIsLoaded(true);
      }
    };

    loadResume();
  }, [id, makeRequest]);

  return (
    <main className="!pt-0">
      <div className="flex flex-row w-full max-lg:flex-col-reverse">
        {/* Resume preview panel */}
        <section className="feedback-section bg-[url('/images/bg-small.svg')] bg-cover h-[100vh] sticky top-0 items-center justify-center">
          {imageUrl && resumeUrl && (
            <div className="animate-in fade-in duration-1000 gradient-border max-sm:m-0 h-[90%] max-wxl:h-fit w-fit">
              <a href={resumeUrl} target="_blank" rel="noopener noreferrer">
                <img
                  src={imageUrl}
                  className="w-full h-full object-contain rounded-2xl"
                  title="resume"
                />
              </a>
            </div>
          )}
        </section>

        {/* Feedback panel */}
        <section className="feedback-section">
          <h2 className="text-4xl text-black font-bold">Resume Review</h2>
          {isLoaded ? (
            <div className="flex flex-col gap-3 animate-in fade-in duration-1000">
              <Summary feedback={feedback} />
              <Ats score={feedback.ATS.score} suggestions={feedback.ATS.tips} />
              <Details feedback={feedback} /> {/* ✅ now includes Recommendations accordion */}
            </div>
          ) : (
            <img src="/images/resume-scan-2.gif" className="w-full" />
          )}
        </section>
      </div>
    </main>
  );
};

export default ResumeReview;
