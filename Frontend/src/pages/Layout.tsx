import { SignedIn, SignedOut, SignInButton } from "@clerk/clerk-react";
import Navbar from '../components/Navbar';
import ResumeCard from '../components/ResumeCard';
import { Outlet, useLocation, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useApi } from "../utils/api";

interface Resume {
  id: string;
  jobTitle: string;
  feedback: { overallScore: number };
  imagePath: string;
  resumePath: string;
}

const Layout = () => {
  const location = useLocation();
  const { makeRequest } = useApi();

  const [resumes, setResumes] = useState<Resume[]>([]);
  const [loadingResumes, setLoadingResumes] = useState(false);

  useEffect(() => {
    const loadResumes = async () => {
      setLoadingResumes(true);
      try {
        const data = await makeRequest("resume/user-resumes", { method: "GET" });
        const mappedResumes: Resume[] = data.map((r: any, index: number) => ({
          id: `resume-${index}`,
          jobTitle: r.job_title,
          feedback: r.feedback,
          imagePath: r.image_url,
          resumePath: r.resume_url,
        }));
        setResumes(mappedResumes);
      } catch (err) {
        console.error("Error loading resumes:", err);
      }
      setLoadingResumes(false);
    };

    loadResumes();
  }, [makeRequest]);

  return (
    <div className="relative min-h-screen">

      {/* Background image layer */}
      <div
        className="absolute inset-0 bg-[url('/images/bg-main.jpg')] bg-cover bg-fixed z-0"
      ></div>

      {/* Netflix-style overlay layer */}
      <div className="overlay-gradient animate z-5"></div>

      {/* Content layer */}
      <div className="relative z-10">
        <SignedIn>
          <Navbar />

          <main>
            <Outlet />

            {location.pathname === "/" && (
              <section className="main-section">
                <div className="page-heading py-12">
                  <h1 className="text-5xl">Track Your Applications & Resume Ratings</h1>
                  {!loadingResumes && resumes.length === 0 ? (
                    <h2 className="text-2xl">No resumes found. Upload your first resume to get feedback.</h2>
                  ) : (
                    <h2 className="text-2xl">Review your submissions and check AI-powered feedback.</h2>
                  )}

                  <div className="mt-4">
                    <Link
                      to="/upload"
                      className="primary-button w-fit text-lg font-semibold"
                    >
                      Upload Resume
                    </Link>
                  </div>
                </div>

                {loadingResumes && (
                  <div className="flex flex-col items-center justify-center">
                    <img
                      src="/images/resume-scan-2.gif"
                      className="w-[160px]"  // smaller gif
                      alt="Loading resumes"
                    />
                  </div>
                )}

                {!loadingResumes && resumes.length > 0 && (
                  <div className="resumes-section">
                    {resumes.map((resume) => (
                      <ResumeCard key={resume.id} resume={resume} />
                    ))}
                  </div>
                )}
              </section>
            )}
          </main>
        </SignedIn>

        <SignedOut>
          <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-red-800 to-neutral-900">
            <div className="bg-gray-900/90 rounded-xl shadow-lg p-8 max-w-sm w-full text-center">
              <h1 className="text-3xl font-bold mb-4 text-white">Hi There! Welcome</h1>
              <p className="text-gray-400 mb-6 text-sm">
                Sign in to track your resumes and get AI feedback.
              </p>
              <SignInButton mode="modal">
                <button className="w-full bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-semibold py-2.5 px-5 rounded-lg shadow-md hover:scale-105 transition-transform text-sm">
                  Sign In
                </button>
              </SignInButton>
              <p className="mt-4 text-gray-500 text-xs">
                Don't worry, your data is safe with us.
              </p>
            </div>
          </div>
        </SignedOut>
      </div>
    </div>
  );
};

export default Layout;
