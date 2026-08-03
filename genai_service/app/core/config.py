from functools import lru_cache

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    

    app_name: str = "College Bus GenAI Service"
    app_env: str = "development"

    groq_api_key: str
    groq_model: str = "llama-3.3-70b-versatile"

    spring_boot_base_url: str = "http://localhost:8085"

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
        extra="ignore",
    )


@lru_cache
def get_settings() -> Settings:
    

    return Settings()