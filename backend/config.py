from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

    assemblyai_api_key: str = ""
    anthropic_api_key: str = ""
    linkedin_client_id: str = ""
    linkedin_client_secret: str = ""
    linkedin_redirect_uri: str = "http://localhost:8000/api/linkedin/callback"
    secret_key: str = "dev-secret-change-in-production"
    frontend_url: str = "http://localhost:5173"
    cors_origins: str = "http://localhost:5173"
    max_upload_size_mb: int = 2000
    upload_temp_dir: str = "/tmp/uploads"
    backend_host: str = "0.0.0.0"
    backend_port: int = 8000

    @property
    def cors_origins_list(self) -> list[str]:
        return [o.strip() for o in self.cors_origins.split(",")]

    @property
    def max_upload_size_bytes(self) -> int:
        return self.max_upload_size_mb * 1024 * 1024


settings = Settings()
