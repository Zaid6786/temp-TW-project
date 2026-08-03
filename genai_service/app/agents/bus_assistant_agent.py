import json

from langchain_core.prompts import ChatPromptTemplate
from langchain_groq import ChatGroq

from app.core.config import get_settings
from app.models.schemas import (
    BusInfo,
    BusRecommendationRequest,
    BusRecommendationResponse,
)
from app.prompts.bus_assistant_prompt import (
    BUS_ASSISTANT_SYSTEM_PROMPT,
    BUS_ASSISTANT_USER_PROMPT,
)


def create_llm() -> ChatGroq:
    """
    Create and configure the Groq language model.
    """

    settings = get_settings()

    return ChatGroq(
    api_key=settings.groq_api_key,
    model=settings.groq_model,
    temperature=0,
    max_tokens=120,
)


def format_bus_information(buses: list[BusInfo]) -> str:
    """
    Convert bus objects into readable JSON for the language model.
    """

    bus_data = [
        {
            "bus_id": bus.bus_id,
            "bus_number": bus.bus_number,
            "route_name": bus.route_name,
            "arrival_minutes": bus.arrival_minutes,
            "occupancy_percentage": bus.occupancy_percentage,
            "capacity": bus.capacity,
            "available_seats": bus.available_seats,
            "crowd_level": bus.crowd_level,
            "status": bus.status,
            "delay_minutes": bus.delay_minutes,
        }
        for bus in buses
    ]

    return json.dumps(
        bus_data,
        indent=2,
        ensure_ascii=False,
    )


def generate_ai_explanation(
    request: BusRecommendationRequest,
    base_result: BusRecommendationResponse,
) -> str:
    """
    Generate a student-friendly explanation using the recommendation
    already selected by the deterministic Python engine.
    """

    if base_result.recommended_bus_number is None:
        return base_result.recommendation

    prompt = ChatPromptTemplate.from_messages(
        [
            (
                "system",
                BUS_ASSISTANT_SYSTEM_PROMPT,
            ),
            (
                "human",
                BUS_ASSISTANT_USER_PROMPT,
            ),
        ]
    )

    llm = create_llm()
    chain = prompt | llm

    warnings_text = (
        "\n".join(base_result.warnings)
        if base_result.warnings
        else "No important warnings."
    )

    response = chain.invoke(
        {
            "student_question": request.student_question,
            "student_stop": request.student_stop,
            "destination": request.destination,
            "recommended_bus_number": (
                base_result.recommended_bus_number
            ),
            "base_recommendation": base_result.recommendation,
            "base_reason": base_result.reason,
            "confidence": base_result.confidence,
            "warnings": warnings_text,
            "bus_information": format_bus_information(
                request.buses
            ),
        }
    )

    explanation = str(response.content).strip()

    if not explanation:
        return base_result.recommendation

    return explanation