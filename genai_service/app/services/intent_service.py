from app.models.schemas import ChatIntent


def normalize_question(question: str) -> str:
    

    return " ".join(question.lower().strip().split())


def contains_any(text: str, keywords: tuple[str, ...]) -> bool:
    

    return any(keyword in text for keyword in keywords)


def detect_intent(question: str) -> ChatIntent:
   

    text = normalize_question(question)

    # Delay reason must be checked before general delay status.
    if contains_any(
        text,
        (
            "why delayed",
            "why delay",
            "why late",
            "why is my bus delayed",
            "why is the bus delayed",
            "why is my bus late",
            "reason for delay",
            "reason for late",
            "what caused the delay",
        ),
    ):
        return "DELAY_REASON"

    if contains_any(
        text,
        (
            "is my bus delayed",
            "is the bus delayed",
            "bus delayed",
            "bus late",
            "how late",
            "delay status",
            "delay minutes",
        ),
    ):
        return "DELAY_STATUS"

    # Fee due date must be checked before general fee questions.
    if contains_any(
        text,
        (
            "when is fee due",
            "when is my fee due",
            "when is my transport fee due",
            "when is the transport fee due",
            "fee due date",
            "transport fee due date",
            "payment due date",
            "last date to pay",
            "when should i pay",
            "when do i need to pay",
        ),
    ):
        return "FEE_DUE_DATE"

    # Fee status must also be checked before general fee questions.
    if contains_any(
        text,
        (
            "fee status",
            "transport fee status",
            "is fee paid",
            "is my fee paid",
            "is my transport fee paid",
            "is the transport fee paid",
            "payment status",
            "have i paid",
            "have i paid my fee",
            "fee paid or not",
        ),
    ):
        return "FEE_STATUS"

    if contains_any(
        text,
        (
            "fee due",
            "pending fee",
            "pending transport fee",
            "pending amount",
            "how much fee",
            "how much transport fee",
            "how much should i pay",
            "amount due",
            "bus fee",
            "transport fee",
        ),
    ):
        return "FEE_DUE"

    if contains_any(
        text,
        (
            "where is my bus",
            "where is the bus",
            "bus location",
            "current location",
            "track my bus",
            "location of my bus",
        ),
    ):
        return "BUS_LOCATION"

    if contains_any(
        text,
        (
            "when will it arrive",
            "when will my bus arrive",
            "when will my bus reach",
            "when will the bus reach",
            "when will it reach",
            "when will it reach my stop",
            "when will my bus reach my stop",
            "arrival time",
            "expected arrival",
            "what is the eta",
            "eta",
            "how long will it take",
            "time to reach my stop",
        ),
    ):
        return "ARRIVAL_TIME"

    if contains_any(
        text,
        (
            "which bus is assigned",
            "assigned bus",
            "my assigned bus",
            "my bus number",
            "what is my bus number",
            "what is my assigned bus number",
            "bus details",
            "registration number of bus",
            "bus registration",
        ),
    ):
        return "ASSIGNED_BUS_DETAILS"

    if contains_any(
        text,
        (
            "my pickup stop",
            "pickup stop",
            "where should i wait",
            "where should i wait for my bus",
            "boarding stop",
            "stop assigned to me",
            "scheduled pickup time",
        ),
    ):
        return "PICKUP_STOP"

    if contains_any(
        text,
        (
            "driver name",
            "who is the driver",
            "who is my driver",
            "my driver",
            "driver details",
            "driver phone",
            "driver contact",
            "contact the driver",
        ),
    ):
        return "DRIVER_DETAILS"

    if contains_any(
        text,
        (
            "help",
            "what can you do",
            "how can you help",
            "available options",
            "show commands",
        ),
    ):
        return "GENERAL_HELP"

    transport_keywords = (
        "bus",
        "route",
        "stop",
        "driver",
        "fee",
        "arrival",
        "delay",
        "location",
        "college transport",
    )

    if contains_any(text, transport_keywords):
        return "GENERAL_HELP"

    return "OUT_OF_SCOPE"