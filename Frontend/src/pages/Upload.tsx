import { useState, type FormEvent } from "react";
import Fileuploader from "../components/Fileuploader";
import { useApi } from "../utils/api";
import { useNavigate } from "react-router";

const Upload = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [statusText, setStatusText] = useState("");
  const navigate = useNavigate();
  const [file, setFile] = useState<File | null>(null);
  const { makeRequest } = useApi();

  const handleFileSelect = (selectedFile: File | null) => {
    console.log("Selected file:", selectedFile);
    setFile(selectedFile);
  };

  const handleAnalyze = async ({
    jobTitle,
    jobDescription,
    file,
  }: {
    jobTitle: string;
    jobDescription: string;
    file: File;
  }) => {
    console.log("Starting analysis with:", { jobTitle, jobDescription, file });
    setIsProcessing(true);
    setStatusText("Uploading the file...");

    const formData = new FormData();
    formData.append("jobTitle", jobTitle);
    formData.append("jobDescription", jobDescription);
    formData.append("resume", file);

    try {
      const res = await makeRequest("resume/analyze", {
        method: "POST",
        body: formData,
      });

      console.log("API response:", res); 

      setStatusText(`Analysis complete: ${res.message}`);
      navigate(`/ResumeReview/${res.id}`);
    } catch (err: any) {
      console.error("Error during analysis:", err);
      setStatusText(`Error: ${err.message}`);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!file) return;

    const form = e.currentTarget;
    const formData = new FormData(form);

    handleAnalyze({
      jobTitle: formData.get("jobTitle") as string,
      jobDescription: formData.get("jobDescription") as string,
      file: file!,
    });
  };

  return (
    <main className="bg-[url('/images/bg-main.svg')] bg-cover">
      <section className="main-section">
        <div className="page-heading">
          <h1>Smart feedback for your dream job</h1>

          {isProcessing ? (
            <>
              <h2>{statusText}</h2>
              <img src="/images/resume-scan.gif" alt="Scanning…" />
            </>
          ) : (
            <>
              <h2>Drop your resume for an ATS score and improvement tips</h2>
              <form
                id="upload-form"
                onSubmit={handleSubmit}
                className="flex flex-col gap-8"
              >
                <div className="form-div">
                  <label htmlFor="job-title">Job title</label>
                  <input
                    type="text"
                    id="job-title"
                    name="jobTitle"
                    placeholder="Job title"
                  />
                </div>

                <div className="form-div">
                  <label htmlFor="job-description">Job description</label>
                  <textarea
                    rows={6}
                    id="job-description"
                    name="jobDescription"
                    placeholder="Job description"
                  />
                </div>

                <div className="form-div">
                  <label htmlFor="uploader">Upload Resume</label>
                  <Fileuploader onFileSelect={handleFileSelect} />
                </div>

                <button className="primary-button" type="submit">
                  Analyze Resume
                </button>
              </form>
            </>
          )}
        </div>
      </section>
    </main>
  );
};

export default Upload;
