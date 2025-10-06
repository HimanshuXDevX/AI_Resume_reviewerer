import redis
from services.config import settings

redis_client = redis.Redis.from_url(settings.REDIS_URL, decode_responses=True)
