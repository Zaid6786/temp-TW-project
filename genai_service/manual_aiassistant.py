from app.agents.bus_assistant_agent import generate_ai_explanation
from app.models.schemas import (
    BusInfo,
    BusRecommendationRequest,
)
from app.services.recommendation_service import recommend_best_bus


request = BusRecommendationRequest(
    student_id=501,
    student_question=(
        "Which bus should I take now? "
        "I prefer a less crowded bus."
    ),
    student_stop="Railway Station",
    destination="College",
    buses=[
        BusInfo(
            bus_id=101,
            bus_number="BUS-101",
            route_name="Railway Station to College",
            arrival_minutes=4,
            occupancy_percentage=92,
            capacity=50,
            available_seats=4,
            crowd_level="FULL",
            status="ON_TIME",
            delay_minutes=0,
        ),
        BusInfo(
            bus_id=104,
            bus_number="BUS-104",
            route_name="Railway Station to College",
            arrival_minutes=8,
            occupancy_percentage=35,
            capacity=50,
            available_seats=32,
            crowd_level="LOW",
            status="ON_TIME",
            delay_minutes=0,
        ),
        BusInfo(
            bus_id=108,
            bus_number="BUS-108",
            route_name="Railway Station to College",
            arrival_minutes=20,
            occupancy_percentage=20,
            capacity=50,
            available_seats=40,
            crowd_level="LOW",
            status="ON_TIME",
            delay_minutes=0,
        ),
    ],
)

base_result = recommend_best_bus(request)

ai_answer = generate_ai_explanation(
    request=request,
    base_result=base_result,
)

print("Selected bus:", base_result.recommended_bus_number)
print()
print("AI answer:")
print(ai_answer)