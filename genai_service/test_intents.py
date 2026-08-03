from app.services.intent_service import detect_intent


questions = [
    "Where is my bus?",
    "When will it reach my stop?",
    "Why is my bus delayed?",
    "Is my bus delayed?",
    "What is my assigned bus number?",
    "Where should I wait?",
    "Who is the driver?",
    "How much bus fee is pending?",
    "When is my fee due?",
    "Is my fee paid?",
    "What can you do?",
    "Tell me a movie story",
]


for question in questions:
    intent = detect_intent(question)

    print(f"Question: {question}")
    print(f"Intent:   {intent}")
    print("-" * 50)