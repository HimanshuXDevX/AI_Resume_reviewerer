🧠 AI Resume Reviewer:

An intelligent Resume Review Tool that uses AI to evaluate resumes, check ATS (Applicant Tracking System) compatibility, and provide actionable improvement suggestions. It also generates role-specific responsibilities and scores the resume out of 100 based on formatting, keywords, and content relevance.

🚀 Features:

✅ ATS Compatibility Check — Analyze resume structure, formatting, and keyword optimization.
📊 Resume Scoring System — Get an overall score (0–100) for your resume.
💡 Improvement Suggestions — Personalized tips to improve your resume’s performance.
🧩 Role-Based Recommendations — AI suggests relevant roles and responsibilities to include.
⚡ Fast & Interactive UI — Built with React for a smooth user experience.
⚙️ High-Performance Backend — Powered by FastAPI and integrated with AI models.

🏗️ Tech Stack:

Frontend: React.js, TailwindCSS
Backend: FastAPI (Python)
AI/ML: OpenAI / Gemini
Database MongoDB
Others:	Pydantic, JWT, Docker, Reddis, Clerk

⚙️ Installation & Setup
1️⃣ Clone the repository
git clone https://github.com/HimanshuXDevX/AI_Resume_reviewerer.git

2️⃣ Backend Setup (FastAPI)
1. cd backend
2. python -m venv venv
3. venv\Scripts\activate
4. pip install -r requirements.txt
6. fill the sample env with your API wherever reequired(e.g reddis)
5. Python server.py

3️⃣ Frontend Setup (React)
1. cd frontend
2. npm install
3. npm run dev

🔗 API Endpoints
http://localhost:8000/docs

** port will backend's port

🧠 How It Works
1. Upload your resume (PDF).
2. The backend extracts text using NLP.
3. AI model evaluates content and structure.
4. ATS compatibility and keyword density are analyzed.
5. A detailed report with score and suggestions is returned to the frontend.
