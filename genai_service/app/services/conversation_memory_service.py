from collections import defaultdict
from threading import Lock


MAX_MESSAGES_PER_SESSION = 10


class ConversationMemoryService:
    

    def __init__(self) -> None:
        self._sessions: dict[str, list[dict[str, str]]] = defaultdict(list)
        self._lock = Lock()

    def add_message(
        self,
        session_id: str,
        role: str,
        content: str,
    ) -> None:
        

        cleaned_session_id = session_id.strip()
        cleaned_content = content.strip()

        if not cleaned_session_id or not cleaned_content:
            return

        if role not in {"student", "assistant"}:
            raise ValueError(
                "role must be either 'student' or 'assistant'"
            )

        with self._lock:
            self._sessions[cleaned_session_id].append(
                {
                    "role": role,
                    "content": cleaned_content,
                }
            )

            self._sessions[cleaned_session_id] = (
                self._sessions[cleaned_session_id][
                    -MAX_MESSAGES_PER_SESSION:
                ]
            )

    def get_messages(
        self,
        session_id: str,
    ) -> list[dict[str, str]]:
        

        cleaned_session_id = session_id.strip()

        if not cleaned_session_id:
            return []

        with self._lock:
            return list(
                self._sessions.get(
                    cleaned_session_id,
                    [],
                )
            )

    def format_history(
        self,
        session_id: str,
    ) -> str:
        

        messages = self.get_messages(session_id)

        if not messages:
            return "No previous conversation."

        formatted_lines: list[str] = []

        for message in messages:
            role_name = (
                "Student"
                if message["role"] == "student"
                else "Assistant"
            )

            formatted_lines.append(
                f"{role_name}: {message['content']}"
            )

        return "\n".join(formatted_lines)

    def clear_session(
        self,
        session_id: str,
    ) -> None:
        

        cleaned_session_id = session_id.strip()

        with self._lock:
            self._sessions.pop(
                cleaned_session_id, 
                None,
            )


conversation_memory = ConversationMemoryService()