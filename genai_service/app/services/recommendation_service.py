from app.models.schemas import (
    BusComparison,
    BusInfo,
    BusRecommendationRequest,
    BusRecommendationResponse,
)


UNAVAILABLE_STATUSES = {"CANCELLED", "DEPARTED"}


def calculate_bus_score(bus: BusInfo) -> float:
    """
    Calculate a score for one bus.

    A lower score means that the bus is a better choice.

    Occupancy receives greater importance than arrival time because
    the project's main purpose is to help students avoid crowded buses.
    """

    occupancy_score = bus.occupancy_percentage * 0.60
    arrival_score = bus.arrival_minutes * 0.30
    delay_score = bus.delay_minutes * 0.10

    status_penalty = 0.0

    if bus.status == "DELAYED":
        status_penalty = 10.0
    elif bus.status == "ARRIVING":
        status_penalty = -3.0

    full_bus_penalty = 0.0

    if bus.occupancy_percentage >= 95 or bus.available_seats == 0:
        full_bus_penalty = 50.0

    return (
        occupancy_score
        + arrival_score
        + delay_score
        + status_penalty
        + full_bus_penalty
    )


def get_confidence(
    sorted_buses: list[BusInfo],
) -> str:
    """
    Estimate recommendation confidence by comparing the best two buses.
    """

    if len(sorted_buses) == 1:
        return "HIGH"

    best_score = calculate_bus_score(sorted_buses[0])
    second_best_score = calculate_bus_score(sorted_buses[1])

    score_difference = second_best_score - best_score

    if score_difference >= 15:
        return "HIGH"

    if score_difference >= 5:
        return "MEDIUM"

    return "LOW"


def build_comparison(
    buses: list[BusInfo],
) -> list[BusComparison]:
    """
    Convert bus data into the smaller comparison format used in the response.
    """

    return [
        BusComparison(
            bus_number=bus.bus_number,
            arrival_minutes=bus.arrival_minutes,
            occupancy_percentage=bus.occupancy_percentage,
            crowd_level=bus.crowd_level,
            status=bus.status,
        )
        for bus in buses
    ]


def generate_warnings(
    buses: list[BusInfo],
) -> list[str]:
    """
    Generate useful warnings based on the received bus information.
    """

    warnings: list[str] = []

    cancelled_buses = [
        bus.bus_number
        for bus in buses
        if bus.status == "CANCELLED"
    ]

    delayed_buses = [
        bus.bus_number
        for bus in buses
        if bus.status == "DELAYED"
    ]

    highly_crowded_buses = [
        bus.bus_number
        for bus in buses
        if bus.occupancy_percentage >= 90
    ]

    if cancelled_buses:
        warnings.append(
            f"Cancelled buses: {', '.join(cancelled_buses)}."
        )

    if delayed_buses:
        warnings.append(
            f"Delayed buses: {', '.join(delayed_buses)}."
        )

    if highly_crowded_buses:
        warnings.append(
            "Highly crowded buses: "
            f"{', '.join(highly_crowded_buses)}."
        )

    return warnings


def recommend_best_bus(
    request: BusRecommendationRequest,
) -> BusRecommendationResponse:
    """
    Select the best available bus and return a structured recommendation.
    """

    available_buses = [
        bus
        for bus in request.buses
        if bus.status not in UNAVAILABLE_STATUSES
    ]

    compared_buses = build_comparison(request.buses)
    warnings = generate_warnings(request.buses)

    if not available_buses:
        return BusRecommendationResponse(
            recommended_bus_id=None,
            recommended_bus_number=None,
            recommendation=(
                "No bus can currently be recommended."
            ),
            reason=(
                "All supplied buses are cancelled or have already departed."
            ),
            confidence="HIGH",
            compared_buses=compared_buses,
            warnings=warnings,
        )

    sorted_buses = sorted(
        available_buses,
        key=calculate_bus_score,
    )

    best_bus = sorted_buses[0]
    confidence = get_confidence(sorted_buses)

    recommendation = (
        f"Take {best_bus.bus_number}. "
        f"It is expected to arrive in "
        f"{best_bus.arrival_minutes} minutes and is "
        f"{best_bus.occupancy_percentage:.0f}% occupied."
    )

    reason = (
        f"{best_bus.bus_number} provides the best balance of "
        f"arrival time, crowd level, available seats, and delay status. "
        f"It currently has approximately "
        f"{best_bus.available_seats} available seats."
    )

    if best_bus.status == "DELAYED":
        warnings.append(
            f"{best_bus.bus_number} is delayed by "
            f"{best_bus.delay_minutes} minutes."
        )

    return BusRecommendationResponse(
        recommended_bus_id=best_bus.bus_id,
        recommended_bus_number=best_bus.bus_number,
        recommendation=recommendation,
        reason=reason,
        confidence=confidence,
        compared_buses=compared_buses,
        warnings=warnings,
    )