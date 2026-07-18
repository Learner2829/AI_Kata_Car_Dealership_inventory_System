import os
import requests
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from inventory.models import Vehicle

HF_API_URL = "https://router.huggingface.co/v1/chat/completions"
HF_TOKEN = os.environ.get("HF_TOKEN", "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")
HF_MODEL = "deepseek-ai/DeepSeek-R1-0528:novita"

SALES_PROMPT = """You are Rahul, a friendly and experienced car sales consultant at Kata Car Dealership in India. 
You are warm, professional, and genuinely helpful — like a trusted friend who happens to know everything about cars.

YOUR GOAL: Help the customer find the perfect car for their needs and guide them toward a purchase.

CONVERSATION FLOW:
1. Greet the customer warmly and introduce yourself.
2. Ask about their budget (in Indian Rupees ₹).
3. Ask where they are from (city/state) — mention we deliver across India.
4. Ask what type of car they prefer (Sedan, SUV, Hatchback, Electric, Luxury, Sports).
5. Based on their answers, recommend 2-3 cars from our inventory.
6. For each recommendation, highlight: key features, why it suits them, price, and financing options.
7. Create urgency: mention limited stock, ongoing offers, festival season discounts.
8. Offer to book a test drive — say they can call us at +91 98765 43210.
9. If they hesitate, address concerns: resale value, maintenance cost, warranty, EMI options.

IMPORTANT RULES:
- Always communicate in Indian English with a friendly tone.
- Prices are in Indian Rupees (₹). Use Indian numbering: lakhs and crores.
- Always mention ex-showroom prices and tell them on-road price will be slightly higher.
- Offer EMI calculations: "That's just ₹X per month on a 5-year loan!"
- Mention free services: free insurance for first year, 3-year warranty, free home delivery.
- Be persuasive but not pushy. Listen more than you talk.
- If the customer asks something unrelated to cars, gently steer back to car buying.

OUR DEALERSHIP INFO:
- Name: Kata Car Dealership
- Phone: +91 98765 43210
- Email: sales@katacardealership.in
- Location: Mumbai, Maharashtra (deliver across India)
- USP: Best prices, genuine vehicles, hassle-free paperwork, instant loan approval
- Offers: 0% down payment available, exchange bonus up to ₹50,000, festive season discounts"""


def build_vehicle_context():
    vehicles = Vehicle.objects.all()
    if not vehicles.exists():
        return "No vehicles currently in inventory."

    lines = ["CURRENT INVENTORY (all 2024 models):"]
    for v in vehicles:
        from django.contrib.humanize.templatetags.humanize import intcomma
        price_str = f"₹{intcomma(int(v.price))}"
        stock = "In Stock" if v.quantity > 0 else "SOLD OUT"
        lines.append(
            f"- {v.year} {v.make} {v.model} | {v.category} | {price_str} | "
            f"{v.color} | {v.fuel_type} | {v.transmission} | "
            f"{v.mileage} km | Stock: {v.quantity} units ({stock})"
        )
    return "\n".join(lines)


class ChatView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        messages = request.data.get("messages", [])
        if not messages:
            return Response(
                {"error": "messages field is required"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        vehicle_context = build_vehicle_context()

        system_message = {
            "role": "system",
            "content": f"{SALES_PROMPT}\n\n{vehicle_context}",
        }

        api_messages = [system_message] + messages

        payload = {
            "messages": api_messages,
            "model": HF_MODEL,
        }

        headers = {
            "Authorization": f"Bearer {HF_TOKEN}",
            "Content-Type": "application/json",
        }

        try:
            response = requests.post(
                HF_API_URL, headers=headers, json=payload, timeout=60
            )
            response.raise_for_status()
            data = response.json()

            reply = data["choices"][0]["message"]["content"].strip()

            if reply.startswith("<think>"):
                import re
                think_match = re.search(r"<think>(.*?)</think>", reply, re.DOTALL)
                if think_match:
                    after_think = reply[think_match.end():].strip()
                    if after_think:
                        reply = after_think

            return Response({"reply": reply}, status=status.HTTP_200_OK)

        except requests.exceptions.Timeout:
            return Response(
                {"error": "AI service timed out. Please try again."},
                status=status.HTTP_504_GATEWAY_TIMEOUT,
            )
        except requests.exceptions.RequestException as e:
            return Response(
                {"error": f"AI service error: {str(e)}"},
                status=status.HTTP_502_BAD_GATEWAY,
            )
        except (KeyError, IndexError):
            return Response(
                {"error": "Invalid response from AI service."},
                status=status.HTTP_502_BAD_GATEWAY,
            )
