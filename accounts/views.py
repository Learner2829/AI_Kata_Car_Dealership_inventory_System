from rest_framework import generics
from rest_framework.permissions import AllowAny
from rest_framework_simplejwt.views import TokenObtainPairView
from .serializers import UserRegistrationSerializer, CustomTokenObtainPairSerializer


class RegisterView(generics.CreateAPIView):
    """Public endpoint for new user registration."""
    serializer_class = UserRegistrationSerializer
    permission_classes = [AllowAny]


class CustomTokenObtainPairView(TokenObtainPairView):
    """Custom login view that includes is_staff in the JWT token."""
    serializer_class = CustomTokenObtainPairSerializer
