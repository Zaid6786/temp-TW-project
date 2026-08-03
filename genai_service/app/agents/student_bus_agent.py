import json
from typing import Any

from langchain_core.prompts import ChatPromptTemplate
from langchain_groq import ChatGroq

from app.core.config import get_settings
from app.services.conversation_memory_service import conversation_memory
from app.models.schemas import (
    ChatIntent,
    StudentBusChatRequest,
)
from app.prompts.bus_assistant_prompt import (
    STUDENT_BUS_SYSTEM_PROMPT,
    STUDENT_BUS_USER_PROMPT,
)


def create_llm() -> ChatGroq:
    """
    Create the Groq language model used by the chatbot.
    """

    settings = get_settings()

    return ChatGroq(
        api_key=settings.groq_api_key,
        model=settings.groq_model,
        temperature=0,
        max_tokens=120,
        max_retries=2,
    )


def format_json(data: Any) -> str:
    
    if data is None:
        return "Information is not available."

    if hasattr(data, "model_dump"):
        data = data.model_dump(mode="json")

    return json.dumps(
        data,
        indent=2,
        ensure_ascii=False,
        default=str,
    )


def create_warning_text(
    request: StudentBusChatRequest,
) -> str:
    """
    Create warnings for missing or old transport information.
    """

    warnings: list[str] = []

    if request.assigned_bus is None:
        warnings.append(
            "No assigned bus information is available."
        )

    if request.pickup_stop is None:
        warnings.append(
            "Pickup stop information is unavailable."
        )

    if request.live_tracking is None:
        warnings.append(
            "Live tracking information is unavailable."
        )

    if (
        request.live_tracking is not None
        and request.live_tracking.last_updated_at is None
    ):
        warnings.append(
            "The live tracking update time is unavailable."
        )

    if (
        request.delay is not None
        and request.delay.is_delayed
        and not request.delay.reason_description
    ):
        warnings.append(
            "The exact delay reason has not been provided."
        )

    if request.fee is None:
        warnings.append(
            "Transport fee information is unavailable."
        )

    if not warnings:
        return "No important warnings."

    return "\n".join(warnings)


def generate_fallback_answer(
    request: StudentBusChatRequest,
    intent: ChatIntent,
) -> str:
    

    bus = request.assigned_bus
    tracking = request.live_tracking
    delay = request.delay
    fee = request.fee
    stop = request.pickup_stop

    if intent == "BUS_LOCATION":
        if bus and tracking and tracking.current_location_name:
            answer = (
                f"Your bus {bus.bus_number} is currently near "
                f"{tracking.current_location_name}."
            )

            if tracking.estimated_arrival_minutes is not None:
                answer += (
                    f" It should reach your stop in about "
                    f"{tracking.estimated_arrival_minutes} minutes."
                )

            return answer

        return "Your bus location is currently unavailable."

    if intent == "ARRIVAL_TIME":
        if tracking:
            if tracking.estimated_arrival_minutes is not None:
                return (
                    "Your bus is expected to reach your stop in about "
                    f"{tracking.estimated_arrival_minutes} minutes."
                )

            if tracking.estimated_arrival_time:
                return (
                    "Your bus is expected to reach your stop at about "
                    f"{tracking.estimated_arrival_time}."
                )

        return "The estimated arrival time is currently unavailable."

    if intent in {"DELAY_STATUS", "DELAY_REASON"}:
        if delay and delay.is_delayed:
            answer = "Sorry for the delay."

            if delay.delay_minutes > 0:
                answer += (
                    f" Your bus is running about "
                    f"{delay.delay_minutes} minutes late."
                )

            if delay.reason_description:
                answer += (
                    f" The reason is {delay.reason_description}."
                )
            else:
                answer += (
                    " The exact reason has not yet been provided "
                    "by the transport team."
                )

            return answer

        return "Your bus is not currently reported as delayed."

    if intent == "ASSIGNED_BUS_DETAILS":
        if bus:
            return (
                f"Your assigned bus is {bus.bus_number} "
                f"on the {bus.route_name} route."
            )

        return "Your assigned bus information is unavailable."

    if intent == "PICKUP_STOP":
        if stop:
            answer = f"Your pickup stop is {stop.stop_name}."

            if stop.scheduled_time:
                answer += (
                    f" The scheduled pickup time is "
                    f"{stop.scheduled_time}."
                )

            return answer

        return "Your pickup stop information is unavailable."

    if intent == "DRIVER_DETAILS":
        if bus and bus.driver_name:
            answer = f"Your driver is {bus.driver_name}."

            if bus.driver_phone_masked:
                answer += (
                    f" Contact: {bus.driver_phone_masked}."
                )

            return answer

        return "Driver information is currently unavailable."

    if intent == "FEE_DUE":
        if fee and fee.status != "NOT_AVAILABLE":
            if fee.status == "PAID" or fee.amount_due == 0:
                return "Your transport fee is fully paid."

            if fee.amount_due is not None:
                return (
                    f"Your pending transport fee is "
                    f"₹{fee.amount_due:,.0f}."
                )

        return "Your transport fee information is unavailable."

    if intent == "FEE_DUE_DATE":
        if fee and fee.due_date:
            return (
                f"Your transport fee due date is "
                f"{fee.due_date.strftime('%d %B %Y')}."
            )

        return "Your transport fee due date is unavailable."

    if intent == "FEE_STATUS":
        if fee and fee.status != "NOT_AVAILABLE":
            if fee.status == "PAID":
                return "Your transport fee is fully paid."

            if fee.status == "PARTIALLY_PAID":
                return (
                    "Your transport fee is partially paid. "
                    f"Pending amount: ₹{(fee.amount_due or 0):,.0f}."
                )

            if fee.status == "UNPAID":
                return (
                    "Your transport fee is unpaid. "
                    f"Pending amount: ₹{(fee.amount_due or 0):,.0f}."
                )

        return "Your transport fee status is unavailable."

    if intent == "GENERAL_HELP":
        return (
            "I can help with your assigned bus, current location, "
            "arrival time, delay, pickup stop, driver, and transport fee."
        )

    return (
        "I can only help with your assigned college bus "
        "and transport fee information."
    )


def generate_student_bus_answer(
    request: StudentBusChatRequest,
    intent: ChatIntent,
) -> str:
    

    prompt = ChatPromptTemplate.from_messages(
        [
            (
                "system",
                STUDENT_BUS_SYSTEM_PROMPT,
            ),
            (
                "human",
                STUDENT_BUS_USER_PROMPT,
            ),
        ]
    )

    chain = prompt | create_llm()

    try:
        response = chain.invoke(
            {
                "intent": intent,
                "question": request.question,
                "student_information": format_json(
                    request.student
                ),
                "assigned_bus_information": format_json(
                    request.assigned_bus
                ),
                "pickup_stop_information": format_json(
                    request.pickup_stop
                ),
                "live_tracking_information": format_json(
                    request.live_tracking
                ),
                "delay_information": format_json(
                    request.delay
                ),
                "fee_information": format_json(
                    request.fee
                ),
                "warnings": create_warning_text(request),
            }
        )

        answer = str(response.content).strip()

        if answer:
            return answer

    except Exception:
        pass

    return generate_fallback_answer(
        request=request,
        intent=intent,
    ) 
import json
from typing import Any

from langchain_core.prompts import ChatPromptTemplate
from langchain_groq import ChatGroq

from app.core.config import get_settings
from app.models.schemas import (
    ChatIntent,
    StudentBusChatRequest,
)
from app.prompts.bus_assistant_prompt import (
    STUDENT_BUS_SYSTEM_PROMPT,
    STUDENT_BUS_USER_PROMPT,
)
from app.services.conversation_memory_service import (
    conversation_memory,
)


def create_llm() -> ChatGroq:
    
    settings = get_settings()

    return ChatGroq(
        api_key=settings.groq_api_key,
        model=settings.groq_model,
        temperature=0,
        max_tokens=120,
        max_retries=2,
    )


def format_json(data: Any) -> str:
    """
    Convert Python or Pydantic data into readable JSON text.
    """

    if data is None:
        return "Information is not available."

    if hasattr(data, "model_dump"):
        data = data.model_dump(mode="json")

    return json.dumps(
        data,
        indent=2,
        ensure_ascii=False,
        default=str,
    )


def create_warning_text(
    request: StudentBusChatRequest,
) -> str:
    """
    Create warnings for missing transport information.
    """

    warnings: list[str] = []

    if request.assigned_bus is None:
        warnings.append(
            "No assigned bus information is available."
        )

    if request.pickup_stop is None:
        warnings.append(
            "Pickup stop information is unavailable."
        )

    if request.live_tracking is None:
        warnings.append(
            "Live tracking information is unavailable."
        )

    if (
        request.live_tracking is not None
        and request.live_tracking.last_updated_at is None
    ):
        warnings.append(
            "The live tracking update time is unavailable."
        )

    if (
        request.delay is not None
        and request.delay.is_delayed
        and not request.delay.reason_description
    ):
        warnings.append(
            "The exact delay reason has not been provided."
        )

    if request.fee is None:
        warnings.append(
            "Transport fee information is unavailable."
        )

    if not warnings:
        return "No important warnings."

    return "\n".join(warnings)


def generate_fallback_answer(
    request: StudentBusChatRequest,
    intent: ChatIntent,
) -> str:
    

    bus = request.assigned_bus
    tracking = request.live_tracking
    delay = request.delay
    fee = request.fee
    stop = request.pickup_stop

    if intent == "BUS_LOCATION":
        if bus and tracking and tracking.current_location_name:
            answer = (
                f"Your bus {bus.bus_number} is currently near "
                f"{tracking.current_location_name}."
            )

            if tracking.estimated_arrival_minutes is not None:
                answer += (
                    f" It should reach your stop in about "
                    f"{tracking.estimated_arrival_minutes} minutes."
                )

            return answer

        return "Your bus location is currently unavailable."

    if intent == "ARRIVAL_TIME":
        if tracking:
            if tracking.estimated_arrival_minutes is not None:
                return (
                    "Your bus is expected to reach your stop in about "
                    f"{tracking.estimated_arrival_minutes} minutes."
                )

            if tracking.estimated_arrival_time:
                return (
                    "Your bus is expected to reach your stop at about "
                    f"{tracking.estimated_arrival_time}."
                )

        return "The estimated arrival time is currently unavailable."

    if intent in {"DELAY_STATUS", "DELAY_REASON"}:
        if delay and delay.is_delayed:
            answer = "Sorry for the delay."

            if delay.delay_minutes > 0:
                answer += (
                    f" Your bus is running about "
                    f"{delay.delay_minutes} minutes late."
                )

            if delay.reason_description:
                answer += (
                    f" The reason is {delay.reason_description}."
                )
            else:
                answer += (
                    " The exact reason has not yet been provided "
                    "by the transport team."
                )

            return answer

        return "Your bus is not currently reported as delayed."

    if intent == "ASSIGNED_BUS_DETAILS":
        if bus:
            return (
                f"Your assigned bus is {bus.bus_number} "
                f"on the {bus.route_name} route."
            )

        return "Your assigned bus information is unavailable."

    if intent == "PICKUP_STOP":
        if stop:
            answer = f"Your pickup stop is {stop.stop_name}."

            if stop.scheduled_time:
                answer += (
                    f" The scheduled pickup time is "
                    f"{stop.scheduled_time}."
                )

            return answer

        return "Your pickup stop information is unavailable."

    if intent == "DRIVER_DETAILS":
        if bus and bus.driver_name:
            answer = f"Your driver is {bus.driver_name}."

            if bus.driver_phone_masked:
                answer += (
                    f" Contact: {bus.driver_phone_masked}."
                )

            return answer

        return "Driver information is currently unavailable."

    if intent == "FEE_DUE":
        if fee and fee.status != "NOT_AVAILABLE":
            if fee.status == "PAID" or fee.amount_due == 0:
                return "Your transport fee is fully paid."

            if fee.amount_due is not None:
                answer = (
                    f"Your pending transport fee is "
                    f"₹{fee.amount_due:,.0f}."
                )

                if fee.due_date:
                    answer += (
                        f" Please pay it before "
                        f"{fee.due_date.strftime('%d %B %Y')}."
                    )

                return answer

        return "Your transport fee information is unavailable."

    if intent == "FEE_DUE_DATE":
        if fee and fee.due_date:
            return (
                f"Your transport fee due date is "
                f"{fee.due_date.strftime('%d %B %Y')}."
            )

        return "Your transport fee due date is unavailable."

    if intent == "FEE_STATUS":
        if fee and fee.status != "NOT_AVAILABLE":
            if fee.status == "PAID":
                return "Your transport fee is fully paid."

            if fee.status == "PARTIALLY_PAID":
                return (
                    "Your transport fee is partially paid. "
                    f"Pending amount: ₹{(fee.amount_due or 0):,.0f}."
                )

            if fee.status == "UNPAID":
                return (
                    "Your transport fee is unpaid. "
                    f"Pending amount: ₹{(fee.amount_due or 0):,.0f}."
                )

        return "Your transport fee status is unavailable."

    if intent == "GENERAL_HELP":
        return (
            "I can help with your assigned bus, current location, "
            "arrival time, delay, pickup stop, driver, and transport fee."
        )

    return (
        "I can only help with your assigned college bus "
        "and transport fee information."
    )


def generate_student_bus_answer(
    request: StudentBusChatRequest,
    intent: ChatIntent,
) -> str:
    """
    Generate the final short chatbot answer using Groq.

    Previous messages from the same session are included in the prompt.
    If Groq fails, a deterministic fallback response is returned.
    """

    prompt = ChatPromptTemplate.from_messages(
        [
            (
                "system",
                STUDENT_BUS_SYSTEM_PROMPT,
            ),
            (
                "human",
                STUDENT_BUS_USER_PROMPT,
            ),
        ]
    )

    chain = prompt | create_llm()

    conversation_history = conversation_memory.format_history(
        request.session_id
    )

    try:
        response = chain.invoke(
            {
                "intent": intent,
                "question": request.question,
                "conversation_history": conversation_history,
                "student_information": format_json(
                    request.student
                ),
                "assigned_bus_information": format_json(
                    request.assigned_bus
                ),
                "pickup_stop_information": format_json(
                    request.pickup_stop
                ),
                "live_tracking_information": format_json(
                    request.live_tracking
                ),
                "delay_information": format_json(
                    request.delay
                ),
                "fee_information": format_json(
                    request.fee
                ),
                "warnings": create_warning_text(request),
            }
        )

        answer = str(response.content).strip()

        if answer:
            return answer

    except Exception as error:
        print(
            "Groq response generation failed. "
            f"Using fallback response. Error: {error}"
        )

    return generate_fallback_answer(
        request=request,
        intent=intent,
    )