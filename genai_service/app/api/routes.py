from fastapi import APIRouter, HTTPException

from app.agents.student_bus_agent import generate_student_bus_answer
from app.models.schemas import (
    StudentBusChatRequest,
    StudentBusChatResponse,
)
from app.services.conversation_memory_service import (
    conversation_memory,
)
from app.services.intent_service import detect_intent


router = APIRouter(
    prefix="/api/v1",
    tags=["Student Bus Chatbot"],
)


@router.post(
    "/student-bus-chat",
    response_model=StudentBusChatResponse,
)
def student_bus_chat(
    request: StudentBusChatRequest,
) -> StudentBusChatResponse:
    """
    Answer questions about the authenticated student's assigned bus,
    live location, arrival time, delay, pickup stop, driver, and fee.
    """

    try:
        intent = detect_intent(request.question)

        # Generate the answer using the conversation history
        # that already exists for this session.
        answer = generate_student_bus_answer(
            request=request,
            intent=intent,
        )

        # Save the current exchange only after generating the answer.
        # This avoids adding the current question twice in the prompt.
        conversation_memory.add_message(
            session_id=request.session_id,
            role="student",
            content=request.question,
        )

        conversation_memory.add_message(
            session_id=request.session_id,
            role="assistant",
            content=answer,
        )

        assigned_bus_number = (
            request.assigned_bus.bus_number
            if request.assigned_bus
            else None
        )

        current_location_name = (
            request.live_tracking.current_location_name
            if request.live_tracking
            else None
        )

        estimated_arrival_minutes = (
            request.live_tracking.estimated_arrival_minutes
            if request.live_tracking
            else None
        )

        estimated_arrival_time = (
            request.live_tracking.estimated_arrival_time
            if request.live_tracking
            else None
        )

        delay_minutes = (
            request.delay.delay_minutes
            if request.delay
            else None
        )

        fee_due = (
            request.fee.amount_due
            if request.fee
            else None
        )

        fee_due_date = (
            request.fee.due_date
            if request.fee
            else None
        )

        warnings: list[str] = []

        if request.assigned_bus is None:
            warnings.append(
                "Assigned bus information is unavailable."
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

        data_available = any(
            [
                request.assigned_bus is not None,
                request.pickup_stop is not None,
                request.live_tracking is not None,
                request.delay is not None,
                request.fee is not None,
            ]
        )

        return StudentBusChatResponse(
            answer=answer,
            intent=intent,
            assigned_bus_number=assigned_bus_number,
            current_location_name=current_location_name,
            estimated_arrival_minutes=estimated_arrival_minutes,
            estimated_arrival_time=estimated_arrival_time,
            delay_minutes=delay_minutes,
            fee_due=fee_due,
            fee_due_date=fee_due_date,
            data_available=data_available,
            warnings=warnings,
        )

    except Exception as error:
        raise HTTPException(
            status_code=500,
            detail="Unable to process the student bus chatbot request.",
        ) from error


@router.delete(
    "/student-bus-chat/sessions/{session_id}",
    status_code=204,
)
def clear_chat_session(session_id: str) -> None:
    

    conversation_memory.clear_session(session_id)