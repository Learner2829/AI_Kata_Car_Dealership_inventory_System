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

# inventory/tests.py (append this class)
from django.urls import reverse
from rest_framework.test import APITestCase
from rest_framework import status
from django.contrib.auth import get_user_model
from decimal import Decimal
from .models import Vehicle

User = get_user_model()

class VehicleAPITests(APITestCase):
    def setUp(self):
        # Create users
        self.buyer = User.objects.create_user(username='buyer', password='password123')
        self.admin = User.objects.create_superuser(username='admin', password='password123')
        
        # Create test vehicles
        self.vehicle1 = Vehicle.objects.create(
            make='Toyota', model='Camry', category='Sedan', price=Decimal('25000.00'), quantity=5
        )
        self.vehicle2 = Vehicle.objects.create(
            make='Ford', model='F-150', category='Truck', price=Decimal('40000.00'), quantity=2
        )
        
        # Endpoints
        self.list_url = '/api/vehicles/'
        self.search_url = '/api/vehicles/search/'
        self.detail_url = f'/api/vehicles/{self.vehicle1.id}/'
        
    def test_get_vehicles_authenticated(self):
        """Test authenticated buyers can view the vehicle list."""
        self.client.force_authenticate(user=self.buyer)
        response = self.client.get(self.list_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 2)
        
    def test_get_vehicles_unauthenticated(self):
        """Test unauthenticated users are rejected."""
        response = self.client.get(self.list_url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        
    def test_create_vehicle_admin(self):
        """Test admin can create a vehicle."""
        self.client.force_authenticate(user=self.admin)
        data = {'make': 'Honda', 'model': 'Civic', 'category': 'Sedan', 'price': '22000.00', 'quantity': 10}
        response = self.client.post(self.list_url, data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        
    def test_create_vehicle_buyer_forbidden(self):
        """Test buyer cannot create a vehicle."""
        self.client.force_authenticate(user=self.buyer)
        data = {'make': 'Honda', 'model': 'Civic', 'category': 'Sedan', 'price': '22000.00', 'quantity': 10}
        response = self.client.post(self.list_url, data)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        
    def test_search_vehicles_by_make(self):
        """Test search endpoint filters correctly."""
        self.client.force_authenticate(user=self.buyer)
        response = self.client.get(self.search_url, {'make': 'Toyota'})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['make'], 'Toyota')


# inventory/tests.py (append this class)
class VehicleActionTests(APITestCase):
    def setUp(self):
        # Create users
        self.buyer = User.objects.create_user(username='buyer2', password='password123')
        self.admin = User.objects.create_superuser(username='admin2', password='password123')
        
        # Create a test vehicle with 1 in stock
        self.vehicle = Vehicle.objects.create(
            make='Tesla', model='Model 3', category='Sedan', price=Decimal('45000.00'), quantity=1
        )
        
        # Action Endpoints
        self.purchase_url = f'/api/vehicles/{self.vehicle.id}/purchase/'
        self.restock_url = f'/api/vehicles/{self.vehicle.id}/restock/'

    def test_purchase_vehicle_success(self):
        """Test a buyer can purchase a vehicle and reduce stock by 1."""
        self.client.force_authenticate(user=self.buyer)
        response = self.client.post(self.purchase_url)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.vehicle.refresh_from_db()  # Reload from DB to check new quantity
        self.assertEqual(self.vehicle.quantity, 0)

    def test_purchase_out_of_stock_vehicle(self):
        """Test purchasing an out-of-stock vehicle returns a 400 error."""
        # Set stock to 0 first
        self.vehicle.quantity = 0
        self.vehicle.save()
        
        self.client.force_authenticate(user=self.buyer)
        response = self.client.post(self.purchase_url)
        
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data['error'], 'Vehicle is out of stock.')

    def test_restock_vehicle_admin_success(self):
        """Test an admin can restock a vehicle, increasing stock by 1."""
        self.client.force_authenticate(user=self.admin)
        response = self.client.post(self.restock_url)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.vehicle.refresh_from_db()
        self.assertEqual(self.vehicle.quantity, 2)

    def test_restock_vehicle_buyer_forbidden(self):
        """Test a standard buyer cannot restock a vehicle."""
        self.client.force_authenticate(user=self.buyer)
        response = self.client.post(self.restock_url)
        
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)