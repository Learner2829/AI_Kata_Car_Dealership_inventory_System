# inventory/views.py
from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from django.shortcuts import get_object_or_404
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
    GET: Retrieve a vehicle (Requires JWT)
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

        make = self.request.query_params.get('make', None)
        model = self.request.query_params.get('model', None)
        category = self.request.query_params.get('category', None)
        min_price = self.request.query_params.get('min_price', None)
        max_price = self.request.query_params.get('max_price', None)

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


class PurchaseVehicleView(APIView):
    """
    POST: Purchase a vehicle (decrease quantity by 1).
    Requires standard JWT authentication.
    """
    permission_classes = [IsAuthenticated]

    def post(self, request, pk):
        vehicle = get_object_or_404(Vehicle, pk=pk)

        if vehicle.quantity > 0:
            vehicle.quantity -= 1
            vehicle.save()
            return Response({
                'message': 'Vehicle purchased successfully.',
                'quantity': vehicle.quantity
            }, status=status.HTTP_200_OK)

        return Response({
            'error': 'Vehicle is out of stock.'
        }, status=status.HTTP_400_BAD_REQUEST)


class RestockVehicleView(APIView):
    """
    POST: Restock a vehicle (increase quantity by 1).
    Requires Admin (staff) JWT authentication.
    """
    permission_classes = [IsAdminUser]

    def post(self, request, pk):
        vehicle = get_object_or_404(Vehicle, pk=pk)

        vehicle.quantity += 1
        vehicle.save()

        return Response({
            'message': 'Vehicle restocked successfully.',
            'quantity': vehicle.quantity
        }, status=status.HTTP_200_OK)
