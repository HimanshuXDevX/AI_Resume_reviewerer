# from fastapi import APIRouter, Request, HTTPException
# from models.user import User
# from svix.webhooks import Webhook
# import os, json
# from datetime import datetime

# router = APIRouter()

# @router.post("/clerk")
# async def handle_clerk_webhook(request: Request):
#     """
#     Clerk webhook for 'user.created' events.
#     Creates a User document in MongoDB if it doesn't already exist.
#     """
#     webhook_secret = os.getenv("CLERK_WEBHOOK_SECRET")
#     if not webhook_secret:
#         raise HTTPException(status_code=500, detail="Webhook secret not configured")

#     body = await request.body()
#     payload = body.decode("utf-8")
#     headers = dict(request.headers)

#     try:
#         # Verify webhook signature
#         wh = Webhook(webhook_secret)
#         wh.verify(payload, headers)

#         data = json.loads(payload)
#         if data.get("type") != "user.created":
#             return {"status": "ignored"}

#         # Extract fields from Clerk payload
#         user_data = data.get("data", {})
#         clerk_id   = user_data.get("id")
#         email      = user_data.get("email_addresses", [{}])[0].get("email_address")
#         first_name = user_data.get("first_name")
#         last_name  = user_data.get("last_name")
#         phone      = user_data.get("phone_numbers", [{}])[0].get("phone_number")
#         profile_img = user_data.get("profile_image_url")

#         # Upsert to avoid duplicates if the webhook is re-sent
#         existing = await User.find_one(User.clerk_id == clerk_id)
#         if existing:
#             existing.email = email
#             existing.first_name = first_name
#             existing.last_name = last_name
#             existing.phone_number = phone
#             existing.profile_image_url = profile_img
#             existing.updated_at = datetime.utcnow()
#             await existing.save()
#         else:
#             new_user = User(
#                 clerk_id=clerk_id,
#                 email=email,
#                 first_name=first_name,
#                 last_name=last_name,
#                 phone_number=phone,
#                 profile_image_url=profile_img,
#             )
#             await new_user.insert()

#         return {"status": "success"}

#     except Exception as e:
#         raise HTTPException(status_code=401, detail=str(e))
