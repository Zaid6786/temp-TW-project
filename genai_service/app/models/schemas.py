from datetime import date, datetime
from typing import Literal

from pydantic import BaseModel, Field, field_validator


BusStatus = Literal[
    "ON_TIME",
    "DELAYED",
    "ARRIVING",
    "STOPPED",
    "COMPLETED",
    "CANCELLED",
]

FeeStatus = Literal[
    "PAID",
    "PARTIALLY_PAID",
    "UNPAID",
    "NOT_AVAILABLE",
]

ChatIntent = Literal[
    "BUS_LOCATION",
    "ARRIVAL_TIME",
    "DELAY_STATUS",
    "DELAY_REASON",
    "ASSIGNED_BUS_DETAILS",
    "PICKUP_STOP",
    "DRIVER_DETAILS",
    "FEE_DUE",
    "FEE_DUE_DATE",
    "FEE_STATUS",
    "GENERAL_HELP",
    "OUT_OF_SCOPE",
]


class StudentContext(BaseModel):
    """
    Basic details of the authenticated student.
    """

    student_id: int = Field(
        gt=0,
        examples=[501],
    )

    student_name: str = Field(
        min_length=1,
        max_length=100,
        examples=["Praveen"],
    )

    registration_number: str = Field(
        min_length=1,
        max_length=50,
        examples=["22CSE101"],
    )

    @field_validator(
        "student_name",
        "registration_number",
    )
    @classmethod
    def clean_student_text(cls, value: str) -> str:
        cleaned = value.strip()

        if not cleaned:
            raise ValueError("Value cannot be empty")

        return cleaned


class AssignedBus(BaseModel):
    """
    Bus assigned to the student by college management.
    """

    bus_id: int = Field(
        gt=0,
        examples=[104],
    )

    bus_number: str = Field(
        min_length=1,
        max_length=30,
        examples=["BUS-104"],
    )

    registration_number: str | None = Field(
        default=None,
        max_length=30,
        examples=["AP39AB1234"],
    )

    route_name: str = Field(
        min_length=1,
        max_length=150,
        examples=["Railway Station to College"],
    )

    driver_name: str | None = Field(
        default=None,
        max_length=100,
        examples=["Ramesh"],
    )

    driver_phone_masked: str | None = Field(
        default=None,
        max_length=30,
        examples=["******3210"],
    )

    status: BusStatus = Field(
        examples=["DELAYED"],
    )

    @field_validator(
        "bus_number",
        "route_name",
    )
    @classmethod
    def clean_required_bus_text(cls, value: str) -> str:
        cleaned = value.strip()

        if not cleaned:
            raise ValueError("Value cannot be empty")

        return cleaned


class PickupStop(BaseModel):
    """
    Pickup-stop details assigned to the student.
    """

    stop_id: int = Field(
        gt=0,
        examples=[15],
    )

    stop_name: str = Field(
        min_length=1,
        max_length=120,
        examples=["Railway Station"],
    )

    latitude: float | None = Field(
        default=None,
        ge=-90,
        le=90,
    )

    longitude: float | None = Field(
        default=None,
        ge=-180,
        le=180,
    )

    scheduled_time: str | None = Field(
        default=None,
        max_length=20,
        examples=["08:10"],
    )

    @field_validator("stop_name")
    @classmethod
    def clean_stop_name(cls, value: str) -> str:
        cleaned = value.strip()

        if not cleaned:
            raise ValueError("stop_name cannot be empty")

        return cleaned


class LiveTracking(BaseModel):
    """
    Latest known live-tracking information for the assigned bus.
    """

    current_location_name: str | None = Field(
        default=None,
        max_length=150,
        examples=["RTC Complex"],
    )

    latitude: float | None = Field(
        default=None,
        ge=-90,
        le=90,
    )

    longitude: float | None = Field(
        default=None,
        ge=-180,
        le=180,
    )

    distance_to_stop_km: float | None = Field(
        default=None,
        ge=0,
        le=500,
        examples=[4.2],
    )

    estimated_arrival_minutes: int | None = Field(
        default=None,
        ge=0,
        le=600,
        examples=[12],
    )

    estimated_arrival_time: str | None = Field(
        default=None,
        max_length=30,
        examples=["08:25"],
    )

    last_updated_at: datetime | None = Field(
        default=None,
        examples=["2026-07-16T08:13:00+05:30"],
    )


class DelayInformation(BaseModel):
    """
    Delay information provided by transport management or backend logic.
    """

    is_delayed: bool = Field(
        default=False,
    )

    delay_minutes: int = Field(
        default=0,
        ge=0,
        le=600,
        examples=[10],
    )

    reason_code: str | None = Field(
        default=None,
        max_length=50,
        examples=["TRAFFIC"],
    )

    reason_description: str | None = Field(
        default=None,
        max_length=300,
        examples=["Heavy traffic near the railway bridge"],
    )


class FeeInformation(BaseModel):
    """
    Student transport-fee information.

    This can contain temporary sample data until the backend database
    includes real fee records.
    """

    total_fee: float | None = Field(
        default=None,
        ge=0,
        examples=[12000],
    )

    amount_paid: float | None = Field(
        default=None,
        ge=0,
        examples=[9500],
    )

    amount_due: float | None = Field(
        default=None,
        ge=0,
        examples=[2500],
    )

    due_date: date | None = Field(
        default=None,
        examples=["2026-08-10"],
    )

    status: FeeStatus = Field(
        default="NOT_AVAILABLE",
        examples=["PARTIALLY_PAID"],
    )


class StudentBusChatRequest(BaseModel):

    
    """
    Complete context sent by Spring Boot to the GenAI chatbot.
    """
    session_id: str = Field(
        min_length=1,
        max_length=100,
        description="Unique chat-session identifier",
        examples=["student-501-session-1"],
    )

    student: StudentContext

    question: str = Field(
        min_length=2,
        max_length=500,
        examples=["Why is my bus delayed?"],
    )

    assigned_bus: AssignedBus | None = None

    pickup_stop: PickupStop | None = None

    live_tracking: LiveTracking | None = None

    delay: DelayInformation | None = None

    fee: FeeInformation | None = None

    @field_validator("question")
    @classmethod
    def clean_question(cls, value: str) -> str:
        cleaned = value.strip()

        if not cleaned:
            raise ValueError("question cannot be empty")

        return cleaned


class StudentBusChatResponse(BaseModel):
    """
    Response returned by the GenAI service to Spring Boot.
    """

    answer: str = Field(
        min_length=1,
        max_length=1500,
    )

    intent: ChatIntent

    assigned_bus_number: str | None = None

    current_location_name: str | None = None

    estimated_arrival_minutes: int | None = None

    estimated_arrival_time: str | None = None

    delay_minutes: int | None = None

    fee_due: float | None = None

    fee_due_date: date | None = None

    data_available: bool = True

    warnings: list[str] = Field(
        default_factory=list,
    )