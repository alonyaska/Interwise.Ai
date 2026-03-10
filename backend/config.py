
import os

from pydantic_settings import BaseSettings, SettingsConfigDict
from dotenv import load_dotenv


load_dotenv()


class Settings(BaseSettings):
    GEMINI_API_KEY: str = ""
    SYSTEM_PROMPT: str = ""
    DB_HOST: str
    DB_PORT: int
    DB_USER: str
    DB_PASS: int
    DB_NAME: str
    SECRET_KEY:str
    ALGORITHM:str

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore"
    )

    @property
    def DATABASE_URL(self) -> str:
        return  f"postgresql+asyncpg://{self.DB_USER}:{self.DB_PASS}@{self.DB_HOST}:{self.DB_PORT}/{self.DB_NAME}"




settings = Settings(
    GEMINI_API_KEY=os.getenv("GEMINI_API_KEY", ""),
    SYSTEM_PROMPT=os.getenv("SYSTEM_PROMPT", "Ты - AI-ассистент для собеседований.")
)