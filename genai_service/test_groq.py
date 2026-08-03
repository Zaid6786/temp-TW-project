from langchain_groq import ChatGroq

from app.core.config import get_settings


settings = get_settings()

llm = ChatGroq(
    api_key=settings.groq_api_key,
    model=settings.groq_model,
    temperature=0,
)

response = llm.invoke(
    "Reply with exactly: Groq connection successful"
)

print(response.content)