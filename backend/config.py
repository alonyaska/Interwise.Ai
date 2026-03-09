
import os
from pathlib import Path
from pydantic_settings import BaseSettings, SettingsConfigDict
from dotenv import load_dotenv


load_dotenv()


class Settings(BaseSettings):
    GEMINI_API_KEY: str = ""
    SYSTEM_PROMPT: str = ""

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore"
    )


settings = Settings(
    GEMINI_API_KEY=os.getenv("GEMINI_API_KEY", ""),
    SYSTEM_PROMPT=os.getenv("SYSTEM_PROMPT", "Ты - AI-ассистент для собеседований.")
)