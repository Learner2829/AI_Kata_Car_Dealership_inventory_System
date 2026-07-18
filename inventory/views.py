from django.shortcuts import render

# Create your views here.
# inventory/views.py
from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from .models import Vehicle
from .serializers import VehicleSerializer
from .permissions import IsAdminOrReadOnly

class VehicleListCreateView(generics.ListCreateAPIView):
    """
    GET: List all vehicles (Requires JWT)
    POST: Create a new vehicle (Requires Admin JWT)
    """
    queryset = Vehicle.objects.all()
    serializer_class = VehicleSerializer
    permission_classes = [IsAdminOrReadOnly]

class VehicleDetailView(generics.RetrieveUpdateDestroyAPIView):
    """
    GET: Retrieve a vehicle (Requires JWT) - Handled safely, though not explicitly requested, good practice.
    PUT: Update a vehicle (Requires Admin JWT)
    DELETE: Delete a vehicle (Requires Admin JWT)
    """
    queryset = Vehicle.objects.all()
    serializer_class = VehicleSerializer
    permission_classes = [IsAdminOrReadOnly]

class VehicleSearchView(generics.ListAPIView):
    """
    GET: Search vehicles by make, model, category, or price range.
    """
    serializer_class = VehicleSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        queryset = Vehicle.objects.all()
        
        # Retrieve query parameters
        make = self.request.query_params.get('make', None)
        model = self.request.query_params.get('model', None)
        category = self.request.query_params.get('category', None)
        min_price = self.request.query_params.get('min_price', None)
        max_price = self.request.query_params.get('max_price', None)
        
        # Apply filters conditionally
        if make:
            queryset = queryset.filter(make__icontains=make)
        if model:
            queryset = queryset.filter(model__icontains=model)
        if category:
            queryset = queryset.filter(category__icontains=category)
        if min_price:
            queryset = queryset.filter(price__gte=min_price)
        if max_price:
            queryset = queryset.filter(price__lte=max_price)
            
        return queryset