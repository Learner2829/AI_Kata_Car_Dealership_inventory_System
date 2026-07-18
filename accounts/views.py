from rest_framework import generics
from rest_framework.permissions import AllowAny
from .serializers import UserRegistrationSerializer


class RegisterView(generics.CreateAPIView):
    """Public endpoint for new user registration."""
    serializer_class = UserRegistrationSerializer
    permission_classes = [AllowAny]
