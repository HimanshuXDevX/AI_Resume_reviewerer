from fastapi import APIRouter, HTTPException, File, UploadFile, Form, Request
from datetime import datetime
from services.generator import ResumeReviewGenerator
from models.user import User, Feedback
from services.cache import redis_client
from utils.auth import authenticate_and_get_user_details
import uuid, json, logging
import cloudinary.uploader

logger = logging.getLogger("uvicorn.error")

router = APIRouter(
    prefix="/resume",
    tags=["Resume Analysis"]
)

@router.post("/analyze", response_model=dict)
async def analyze_resume(
    request: Request,
    jobTitle: str = Form(...),
    jobDescription: str = Form(...),
    resume: UploadFile = File(...),
):
    try:
        logger.info("Start resume analysis")

        user_details = authenticate_and_get_user_details(request)
        clerk_id = user_details.get("user_id")
        logger.info(f"Authenticated user: {clerk_id}")

        resume_bytes = await resume.read()
        logger.info(f"Resume file read: {len(resume_bytes)} bytes")

        # Generate feedback
        try:
            feedback_data = ResumeReviewGenerator.review_resume(
                file_bytes=resume_bytes,
                content_type=resume.content_type,
                job_title=jobTitle,
                job_description=jobDescription,
            )
            feedback_obj = Feedback(**feedback_data)
        except Exception as review_error:
            logger.exception("Resume review failed")
            raise HTTPException(status_code=500, detail=f"Resume review error: {review_error}")

        # Upload to Cloudinary
        try:
            resume_result = cloudinary.uploader.upload(
                resume_bytes,
                resource_type="auto",
                public_id=f"resumes/{uuid.uuid4()}_{resume.filename}",
                type="upload"
            )
            resume_url = resume_result["secure_url"]
        
        except Exception as upload_error:
            logger.exception("Cloudinary upload failed")
            raise HTTPException(status_code=500, detail=f"Cloudinary upload failed: {upload_error}")

        image_url = resume_url.replace("/upload/", "/upload/pg_1,f_png/")
        resume_id = str(uuid.uuid4())

        # Cache in Redis
        cache_data = {
            "clerk_id": clerk_id,
            "job_title": jobTitle,
            "job_description": jobDescription,
            "resume_url": resume_url,
            "image_url": image_url,
            "feedback": feedback_obj.dict(),
        }
        redis_client.setex(f"resume:{resume_id}", 60 * 60 * 24, json.dumps(cache_data))

        # Save/update in MongoDB
        user = await User.find_one({"clerk_id": clerk_id})
        if not user:
            user = User(
                clerk_id=clerk_id,
                resume_url=resume_url,
                image_url=image_url,
                job_title=jobTitle,
                job_description=jobDescription,
                feedback=feedback_obj,
            )
            await user.insert()
        else:
            user.resume_url = resume_url
            user.image_url = image_url
            user.job_title = jobTitle
            user.job_description = jobDescription
            user.feedback = feedback_obj
            user.updated_at = datetime.utcnow()
            await user.save()

        return {
            "id": resume_id,
            "resume_url": resume_url,
            "image_url": image_url,
            "message": "Resume analyzed, uploaded, cached, and saved."
        }

    except Exception as e:
        logger.exception("Error analyzing resume")
        raise HTTPException(status_code=500, detail=f"Error: {repr(e)}")


@router.get("/resume-feedback/{resume_id}", response_model=dict)
async def get_resume_feedback(resume_id: str):
    try:
        redis_key = f"resume:{resume_id}"
        data = redis_client.get(redis_key)
        if not data:
            raise HTTPException(status_code=404, detail="Resume not found or expired.")

        if isinstance(data, bytes):
            data = data.decode("utf-8")

        result = json.loads(data)
        return {
            "image_url": result.get("image_url"),
            "resume_url": result.get("resume_url"),
            "feedback": result.get("feedback"),
        }

    except Exception as e:
        logger.exception("Error retrieving resume feedback")
        raise HTTPException(status_code=500, detail=f"Error: {repr(e)}")


@router.get("/user-resumes", response_model=list[dict])
async def get_user_resumes(request: Request):
    try:
        user_details = authenticate_and_get_user_details(request)
        clerk_id = user_details.get("user_id")

        resumes = []
        for key in redis_client.scan_iter("resume:*"):
            data = redis_client.get(key)
            if not data:
                continue
            if isinstance(data, bytes):
                data = data.decode("utf-8")
            resume = json.loads(data)
            if resume.get("clerk_id") == clerk_id:
                resume_id = key.decode("utf-8").split(":")[-1] if isinstance(key, bytes) else key.split(":")[-1]
                resumes.append({
                    "resume_id": resume_id,
                    "resume_url": resume.get("resume_url"),
                    "image_url": resume.get("image_url"),
                    "job_title": resume.get("job_title"),
                    "feedback": resume.get("feedback"),
                })

        # If nothing in Redis, fallback to MongoDB
        if not resumes:
            user = await User.find_one({"clerk_id": clerk_id})
            if user:
                resumes.append({
                    "resume_id": str(user.id),
                    "resume_url": user.resume_url,
                    "image_url": user.image_url,
                    "job_title": user.job_title,
                    "feedback": user.feedback.dict() if user.feedback else {},
                })

        return resumes

    except Exception as e:
        logger.exception("Error retrieving user resumes")
        raise HTTPException(status_code=500, detail=f"Error: {repr(e)}")