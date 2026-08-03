from app.services.conversation_memory_service import (
    conversation_memory,
)


session_id = "student-501-session-1"

conversation_memory.clear_session(session_id)

conversation_memory.add_message(
    session_id=session_id,
    role="student",
    content="Where is my bus?",
)

conversation_memory.add_message(
    session_id=session_id,
    role="assistant",
    content="BUS-104 is near RTC Complex.",
)

conversation_memory.add_message(
    session_id=session_id,
    role="student",
    content="Why is it late?",
)

print(conversation_memory.format_history(session_id))