from django.test import TestCase

# Create your tests here.
# inventory/tests.py
from decimal import Decimal
from django.test import TestCase
from .models import Vehicle

class VehicleModelTests(TestCase):
    def test_create_vehicle_successful(self):
        """Test that a vehicle is created with all required fields."""
        vehicle = Vehicle.objects.create(
            make="Toyota",
            model="Camry",
            category="Sedan",
            price=Decimal("25500.00"),
            quantity=5
        )
        
        self.assertIsNotNone(vehicle.id)  # Unique ID (Primary Key) created automatically
        self.assertEqual(vehicle.make, "Toyota")
        self.assertEqual(vehicle.model, "Camry")
        self.assertEqual(vehicle.category, "Sedan")
        self.assertEqual(vehicle.price, Decimal("25500.00"))
        self.assertEqual(vehicle.quantity, 5)

    def test_vehicle_string_representation(self):
        """Test the __str__ method of the Vehicle model."""
        vehicle = Vehicle.objects.create(
            make="Honda",
            model="Civic",
            category="Sedan",
            price=Decimal("22000.00"),
            quantity=3
        )
        self.assertEqual(str(vehicle), "Honda Civic")