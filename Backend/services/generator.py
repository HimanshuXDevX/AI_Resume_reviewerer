import os
import io
import json
import logging
import re
from dotenv import load_dotenv
import pdfplumber
import google.generativeai as genai

load_dotenv()
logger = logging.getLogger("uvicorn.error")

from services.prompts import RESUME_PROMPT, json_structure

class ResumeReviewGenerator:

    @classmethod
    def _get_llm(cls):
        gemini_api_key = os.getenv("GEMINI_API_KEY")
        if not gemini_api_key:
            raise ValueError("GEMINI_API_KEY not set in environment variables.")
        genai.configure(api_key=gemini_api_key)
        return genai

    @classmethod
    def extract_text_from_pdf(cls, file_bytes: bytes) -> str:
        text = ""
        try:
            with pdfplumber.open(io.BytesIO(file_bytes)) as pdf:
                for page in pdf.pages:
                    page_text = page.extract_text()
                    if page_text:
                        text += page_text + "\n"
        except Exception as e:
            logger.exception("Failed to extract text from PDF")
            raise ValueError(f"Failed to extract text from PDF: {e}")
        return text

    @classmethod
    def generate_prompt(cls, job_title: str, job_description: str) -> str:
        return RESUME_PROMPT.replace("${jobTitle}", job_title)\
                            .replace("${jobDescription}", job_description)\
                            .replace("${AIResponseFormat}", json_structure)

    @classmethod
    def call_gemini(cls, prompt: str, resume_text: str) -> str:
        client = cls._get_llm()
        model = client.GenerativeModel("gemini-2.5-flash-lite")
        full_content = f"{prompt}\n\nResume:\n{resume_text}"

        try:
            response = model.generate_content(
                contents=full_content
            )
            return response.text
        except Exception as e:
            logger.exception("Error calling Gemini model")
            raise RuntimeError(f"LLM generation failed: {e}")

    @classmethod
    def parse_llm_response(cls, llm_response: str) -> dict:
        cleaned_response = re.search(r"\{.*\}|\[.*\]", llm_response, re.DOTALL)
        if cleaned_response:
            json_string = cleaned_response.group(0)
        else:
            json_string = llm_response.strip()

        try:
            data = json.loads(json_string)
            return data
        except json.JSONDecodeError:
            logger.error("LLM response is not valid JSON. Raw start: %s", llm_response[:100].replace('\n',' '))
            logger.error("Attempted parse: %s", json_string[:200].replace('\n',' '))
            raise ValueError("LLM response is not valid JSON")
        except Exception as e:
            raise ValueError(f"Error parsing LLM response: {e}")

    @classmethod
    def review_resume(cls, file_bytes: bytes, content_type: str, job_title: str, job_description: str) -> dict:
        if content_type == "application/pdf":
            resume_text = cls.extract_text_from_pdf(file_bytes)
            logger.info("Extracted %d characters from PDF", len(resume_text))
        else:
            resume_text = file_bytes.decode("utf-8", errors="ignore")
            logger.info("Decoded %d characters from text resume", len(resume_text))

        prompt = cls.generate_prompt(job_title, job_description)
        llm_response = cls.call_gemini(prompt, resume_text)
        logger.info("Received LLM response (first 200 chars): %s", llm_response[:200].replace('\n', ' '))

        feedback = cls.parse_llm_response(llm_response)
        return feedback
