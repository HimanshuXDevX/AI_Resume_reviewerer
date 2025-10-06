RESUME_PROMPT = """
                You are an expert in ATS (Applicant Tracking Systems) and professional resume analysis. 
                Your task is to provide a highly detailed, objective evaluation of the provided resume 
                against the target job.

                Analyze the provided resume and perform the following steps:
                1. **Score and Evaluate:** Rate each category from **0 to 100**. 
                The final 'overallScore' must be the **average** of all category scores, 
                rounded to the nearest whole number.
                2. **Job Relevance Check:** Explicitly analyze the resume's alignment with the 
                keywords, requirements, and responsibilities in the 'Job Description' to inform 
                the 'ATS'.
                3. **Provide Actionable Tips:** For every category, provide specific, actionable advice. 
                Use 'good' for identified strengths and 'improve' for identified weaknesses. 
                Tips must be specific to the resume content and the Job Description, not generic advice.
                4. **Recommendations:** Suggest a list of 2–5 potential job titles (roles) that align with the resume and job description, 
                as well as 3–6 key responsibilities that the candidate could add or emphasize in their resume 
                to better match the job description.


                Job Title: ${jobTitle}
                Job Description: ${jobDescription}

                Return **only** a JSON object that strictly matches this schema:
                ${AIResponseFormat}
                No extra text, no Markdown, no backticks—just valid JSON.
                """

json_structure = """
                {
                "overallScore": 0,
                "ATS": {
                    "score": 0,
                    "tips": [
                        { "type": "good", "tip": "Keyword-rich formatting" },
                        { "type": "improve", "tip": "Optimize for ATS parsing" }
                    ]
                },
                "toneAndStyle": {
                    "score": 0,
                    "tips": [
                        {
                            "type": "good",
                            "tip": "Professional yet approachable",
                            "explanation": "The tone balances formal and friendly language, suitable for most professional roles."
                        }
                    ]   
                },
                "content": {
                    "score": 0,
                    "tips": [
                        {
                            "type": "improve",
                            "tip": "Add measurable achievements with metrics",
                            "explanation": "Include concrete metrics (e.g., revenue growth, user numbers) to strengthen impact."
                        }
                    ]
                },
                "structure": {
                    "score": 0,
                    "tips": [
                        {
                            "type": "improve",
                            "tip": "Reorder sections",
                            "explanation": "Place the most relevant experience at the top to capture attention quickly."
                        }
                    ]
                },
                "skills": {
                    "score": 0,
                    "tips": [
                        {
                            "type": "good",
                            "tip": "Relevant technical skills",
                            "explanation": "Your listed skills match the target roles and are easy to read."
                        }
                    ]
                },
                "recommendation": {
                    "roles": [
                        "DevOps Engineer",
                        "Site Reliability Engineer",
                        "Cloud Infrastructure Engineer"
                    ],
                    "responsibilities": [
                        "Design and implement scalable CI/CD pipelines using Jenkins, GitLab, or GitHub Actions.",
                        "Automate infrastructure provisioning with Terraform and AWS CloudFormation.",
                        "Monitor and optimize cloud infrastructure performance using Prometheus, Grafana, or CloudWatch.",
                        "Collaborate with development teams to containerize applications using Docker and Kubernetes.",
                        "Ensure security best practices in cloud deployments and perform regular compliance audits."
                    ]
                }
            }
            """