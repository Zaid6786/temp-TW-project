from app.agents.student_bus_agent import (
    generate_student_bus_answer,
)
from app.models.schemas import StudentBusChatRequest
from app.services.intent_service import detect_intent


request = StudentBusChatRequest(
    session_id="test-session-123",
    student={
        "student_id": 501,
        "student_name": "Praveen",
        "registration_number": "22CSE101",
    },
    question="Why is my bus delayed?",
    assigned_bus={
        "bus_id": 104,
        "bus_number": "BUS-104",
        "registration_number": "AP39AB1234",
        "route_name": "Railway Station to College",
        "driver_name": "Ramesh",
        "driver_phone_masked": "******3210",
        "status": "DELAYED",
    },
    pickup_stop={
        "stop_id": 15,
        "stop_name": "Railway Station",
        "scheduled_time": "08:10",
    },
    live_tracking={
        "current_location_name": "RTC Complex",
        "distance_to_stop_km": 4.2,
        "estimated_arrival_minutes": 12,
        "estimated_arrival_time": "08:25",
        "last_updated_at": "2026-07-16T08:13:00+05:30",
    },
    delay={
        "is_delayed": True,
        "delay_minutes": 10,
        "reason_code": "TRAFFIC",
        "reason_description": (
            "Heavy traffic near the railway bridge"
        ),
    },
    fee={
        "total_fee": 12000,
        "amount_paid": 9500,
        "amount_due": 2500,
        "due_date": "2026-08-10",
        "status": "PARTIALLY_PAID",
    },
)

intent = detect_intent(request.question)

answer = generate_student_bus_answer(
    request=request,
    intent=intent,
)

print("Intent:", intent)
print("Answer:", answer)