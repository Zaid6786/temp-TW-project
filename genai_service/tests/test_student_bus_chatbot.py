from uuid import uuid4
from fastapi.testclient import TestClient

from app.main import app


client = TestClient(app)


BASE_REQUEST = {
    "session_id": "student-501-test-session",
    "student": {
        "student_id": 501,
        "student_name": "Praveen",
        "registration_number": "22CSE101",
    },
    "assigned_bus": {
        "bus_id": 104,
        "bus_number": "BUS-104",
        "registration_number": "AP39AB1234",
        "route_name": "Railway Station to College",
        "driver_name": "Ramesh",
        "driver_phone_masked": "******3210",
        "status": "DELAYED",
    },
    "pickup_stop": {
        "stop_id": 15,
        "stop_name": "Railway Station",
        "latitude": 17.1234,
        "longitude": 82.1234,
        "scheduled_time": "08:10",
    },
    "live_tracking": {
        "current_location_name": "RTC Complex",
        "latitude": 17.1345,
        "longitude": 82.1456,
        "distance_to_stop_km": 4.2,
        "estimated_arrival_minutes": 12,
        "estimated_arrival_time": "08:25",
        "last_updated_at": "2026-07-16T08:13:00+05:30",
    },
    "delay": {
        "is_delayed": True,
        "delay_minutes": 10,
        "reason_code": "TRAFFIC",
        "reason_description": "Heavy traffic near the railway bridge",
    },
    "fee": {
        "total_fee": 12000,
        "amount_paid": 9500,
        "amount_due": 2500,
        "due_date": "2026-08-10",
        "status": "PARTIALLY_PAID",
    },
}


def send_question(question: str) -> dict:
   

    payload = {
        **BASE_REQUEST,
        "session_id": f"test-session-{uuid4()}",
        "question": question,
    }

    response = client.post(
        "/api/v1/student-bus-chat",
        json=payload,
    )

    if response.status_code != 200:
        print("Validation error:", response.json())

    assert response.status_code == 200

    return response.json()
    response = client.post(
        "/api/v1/student-bus-chat",
        json=payload,
    )

    assert response.status_code == 200

    return response.json()


def test_bus_location() -> None:
    result = send_question("Where is my bus?")

    assert result["intent"] == "BUS_LOCATION"
    assert result["assigned_bus_number"] == "BUS-104"
    assert result["current_location_name"] == "RTC Complex"
    assert result["estimated_arrival_minutes"] == 12


def test_arrival_time() -> None:
    result = send_question("When will my bus reach my stop?")

    assert result["intent"] == "ARRIVAL_TIME"
    assert result["estimated_arrival_minutes"] == 12
    assert result["estimated_arrival_time"] == "08:25"


def test_delay_reason() -> None:
    result = send_question("Why is my bus delayed?")

    assert result["intent"] == "DELAY_REASON"
    assert result["delay_minutes"] == 10

    answer = result["answer"].lower()

    assert "sorry" in answer
    assert "delay" in answer or "late" in answer


def test_assigned_bus_details() -> None:
    result = send_question("What is my assigned bus number?")

    assert result["intent"] == "ASSIGNED_BUS_DETAILS"
    assert result["assigned_bus_number"] == "BUS-104"


def test_driver_details() -> None:
    result = send_question("Who is my driver?")

    assert result["intent"] == "DRIVER_DETAILS"
    assert "ramesh" in result["answer"].lower()


def test_pickup_stop() -> None:
    result = send_question("Where should I wait for my bus?")

    assert result["intent"] == "PICKUP_STOP"
    assert "railway station" in result["answer"].lower()


def test_fee_due() -> None:
    result = send_question("How much transport fee is pending?")

    assert result["intent"] == "FEE_DUE"
    assert result["fee_due"] == 2500


def test_fee_due_date() -> None:
    result = send_question("When is my transport fee due?")

    assert result["intent"] == "FEE_DUE_DATE"
    assert result["fee_due_date"] == "2026-08-10"


def test_fee_status() -> None:
    result = send_question("Is my transport fee paid?")

    assert result["intent"] == "FEE_STATUS"
    assert result["fee_due"] == 2500


def test_out_of_scope_question() -> None:
    result = send_question("Tell me a movie story")

    assert result["intent"] == "OUT_OF_SCOPE"

    answer = result["answer"].lower()

    assert "bus" in answer or "transport" in answer


def test_missing_tracking_data() -> None:
    payload = {
        "session_id": f"missing-data-session-{uuid4()}",
        "student": BASE_REQUEST["student"],
        "question": "Where is my bus?",
        "assigned_bus": BASE_REQUEST["assigned_bus"],
        "pickup_stop": BASE_REQUEST["pickup_stop"],
        "live_tracking": None,
        "delay": None,
        "fee": None,
    }

    response = client.post(
        "/api/v1/student-bus-chat",
        json=payload,
    )

    if response.status_code != 200:
        print("Validation error:", response.json())

    assert response.status_code == 200

    result = response.json()

    assert result["current_location_name"] is None
    assert (
        "Live tracking information is unavailable."
        in result["warnings"]
    )

    response = client.post(
        "/api/v1/student-bus-chat",
        json=payload,
    )

    assert response.status_code == 200

    result = response.json()

    assert result["current_location_name"] is None
    assert "Live tracking information is unavailable." in result["warnings"]