import os
import requests
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from inventory.models import Vehicle

HF_API_URL = "https://router.huggingface.co/v1/chat/completions"
HF_TOKEN = "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"
HF_MODEL = "deepseek-ai/DeepSeek-R1-0528:novita"

SALES_PROMPT = """You are Rahul from Kata Car Dealership. Be concise — max 2-3 sentences per reply.

WHEN ASKING CHOICES: Use this exact format on a new line:
[OPTIONS]Choice 1|Choice 2|Choice 3|Choice 4[/OPTIONS]
Example: [OPTIONS]Under ₹5 Lakh|₹5-10 Lakh|₹10-20 Lakh|Above ₹20 Lakh[/OPTIONS]

CRITICAL RULES:
- You MUST ONLY recommend cars listed in the INVENTORY section below. Never invent, fabricate, or suggest any car model that is NOT in the inventory list.
- If the customer asks for a car not in our inventory, tell them we don't have it and redirect them to what we DO have.
- Always push cars from our stock. Say things like "We currently have..." or "In stock right now we have..."
- Always mention quantity remaining to create urgency: "Only X units left."
- Always mention the exact price from inventory. Never guess or make up prices.

FLOW:
1. Greet briefly, then ask budget using [OPTIONS] format.
2. Ask car type preference: [OPTIONS]Sedan|SUV|Hatchback|Electric|Coupe|Van[/OPTIONS]
3. Match their answers to INVENTORY cars. Recommend 2-3 from our stock with exact price and key specs.
4. Push hard: mention limited stock, EMI options, exchange bonus.

RULES:
- Keep replies under 80 words. No emojis. No exclamation marks. Be professional but persuasive.
- Prices in ₹. Always say ex-showroom, on-road slightly higher.
- If unrelated to cars, say "I can only help with car purchases" and ask how to assist.
- If no inventory car matches their needs, say so honestly and suggest the closest match we have.

DEALERSHIP: Kata Car Dealership, Mumbai | +91 9428046494 | 0% down payment, exchange bonus up to ₹50,000"""


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
