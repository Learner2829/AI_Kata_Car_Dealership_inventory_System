from decimal import Decimal
from django.test import TestCase
from django.contrib.auth import get_user_model
from rest_framework.test import APITestCase
from rest_framework import status
from .models import Vehicle

User = get_user_model()


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

        self.assertIsNotNone(vehicle.id)
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
            quantity=3,
            year=2024
        )
        self.assertEqual(str(vehicle), "2024 Honda Civic")

    def test_vehicle_default_quantity(self):
        """Test that vehicle quantity defaults to zero."""
        vehicle = Vehicle.objects.create(
            make="BMW", model="X5", category="SUV",
            price=Decimal("60000.00")
        )
        self.assertEqual(vehicle.quantity, 0)


class VehicleAPITests(APITestCase):
    def setUp(self):
        self.buyer = User.objects.create_user(username='buyer', password='password123')
        self.admin = User.objects.create_superuser(username='admin', password='password123')

        self.vehicle1 = Vehicle.objects.create(
            make='Toyota', model='Camry', category='Sedan',
            price=Decimal('25000.00'), quantity=5
        )
        self.vehicle2 = Vehicle.objects.create(
            make='Ford', model='F-150', category='Truck',
            price=Decimal('40000.00'), quantity=2
        )
        self.vehicle3 = Vehicle.objects.create(
            make='Toyota', model='RAV4', category='SUV',
            price=Decimal('35000.00'), quantity=0
        )

        self.list_url = '/api/vehicles/'
        self.search_url = '/api/vehicles/search/'
        self.detail_url = f'/api/vehicles/{self.vehicle1.id}/'

    def test_get_vehicles_authenticated(self):
        """Test authenticated buyers can view the vehicle list."""
        self.client.force_authenticate(user=self.buyer)
        response = self.client.get(self.list_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 3)

    def test_get_vehicles_unauthenticated(self):
        """Test unauthenticated users can browse vehicles (public read access)."""
        response = self.client.get(self.list_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_create_vehicle_admin(self):
        """Test admin can create a vehicle."""
        self.client.force_authenticate(user=self.admin)
        data = {'make': 'Honda', 'model': 'Civic', 'category': 'Sedan',
                'price': '22000.00', 'quantity': 10}
        response = self.client.post(self.list_url, data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Vehicle.objects.count(), 4)

    def test_create_vehicle_buyer_forbidden(self):
        """Test buyer cannot create a vehicle."""
        self.client.force_authenticate(user=self.buyer)
        data = {'make': 'Honda', 'model': 'Civic', 'category': 'Sedan',
                'price': '22000.00', 'quantity': 10}
        response = self.client.post(self.list_url, data)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_retrieve_vehicle_detail(self):
        """Test any authenticated user can retrieve a single vehicle."""
        self.client.force_authenticate(user=self.buyer)
        response = self.client.get(self.detail_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['make'], 'Toyota')
        self.assertEqual(response.data['model'], 'Camry')

    def test_retrieve_vehicle_not_found(self):
        """Test retrieving a non-existent vehicle returns 404."""
        self.client.force_authenticate(user=self.buyer)
        response = self.client.get('/api/vehicles/9999/')
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_update_vehicle_admin(self):
        """Test admin can update a vehicle via PUT."""
        self.client.force_authenticate(user=self.admin)
        data = {'make': 'Toyota', 'model': 'Camry', 'category': 'Sedan',
                'price': '27000.00', 'quantity': 10}
        response = self.client.put(self.detail_url, data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.vehicle1.refresh_from_db()
        self.assertEqual(self.vehicle1.price, Decimal('27000.00'))
        self.assertEqual(self.vehicle1.quantity, 10)

    def test_partial_update_vehicle_admin(self):
        """Test admin can partially update a vehicle via PATCH."""
        self.client.force_authenticate(user=self.admin)
        response = self.client.patch(self.detail_url, {'price': '29000.00'})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.vehicle1.refresh_from_db()
        self.assertEqual(self.vehicle1.price, Decimal('29000.00'))

    def test_update_vehicle_buyer_forbidden(self):
        """Test buyer cannot update a vehicle."""
        self.client.force_authenticate(user=self.buyer)
        data = {'make': 'Toyota', 'model': 'Camry', 'category': 'Sedan',
                'price': '99999.00', 'quantity': 0}
        response = self.client.put(self.detail_url, data)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_delete_vehicle_admin(self):
        """Test admin can delete a vehicle."""
        self.client.force_authenticate(user=self.admin)
        response = self.client.delete(self.detail_url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(Vehicle.objects.count(), 2)

    def test_delete_vehicle_buyer_forbidden(self):
        """Test buyer cannot delete a vehicle."""
        self.client.force_authenticate(user=self.buyer)
        response = self.client.delete(self.detail_url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_search_vehicles_by_make(self):
        """Test search filters by make."""
        self.client.force_authenticate(user=self.buyer)
        response = self.client.get(self.search_url, {'make': 'Toyota'})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 2)

    def test_search_vehicles_by_model(self):
        """Test search filters by model."""
        self.client.force_authenticate(user=self.buyer)
        response = self.client.get(self.search_url, {'model': 'F-150'})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['model'], 'F-150')

    def test_search_vehicles_by_category(self):
        """Test search filters by category."""
        self.client.force_authenticate(user=self.buyer)
        response = self.client.get(self.search_url, {'category': 'Sedan'})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)

    def test_search_vehicles_by_price_range(self):
        """Test search filters by min and max price."""
        self.client.force_authenticate(user=self.buyer)
        response = self.client.get(self.search_url, {
            'min_price': '30000', 'max_price': '45000'
        })
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 2)  # Ford F-150 (40k) and Toyota RAV4 (35k)

    def test_search_vehicles_multiple_filters(self):
        """Test search with multiple filters combined."""
        self.client.force_authenticate(user=self.buyer)
        response = self.client.get(self.search_url, {'make': 'Toyota', 'category': 'SUV'})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['model'], 'RAV4')

    def test_search_no_results(self):
        """Test search returns empty list when nothing matches."""
        self.client.force_authenticate(user=self.buyer)
        response = self.client.get(self.search_url, {'make': 'Ferrari'})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 0)


class VehicleActionTests(APITestCase):
    def setUp(self):
        self.buyer = User.objects.create_user(username='buyer2', password='password123')
        self.admin = User.objects.create_superuser(username='admin2', password='password123')

        self.vehicle = Vehicle.objects.create(
            make='Tesla', model='Model 3', category='Sedan',
            price=Decimal('45000.00'), quantity=1
        )

        self.purchase_url = f'/api/vehicles/{self.vehicle.id}/purchase/'
        self.restock_url = f'/api/vehicles/{self.vehicle.id}/restock/'

    def test_purchase_vehicle_success(self):
        """Test a buyer can purchase a vehicle and reduce stock by 1."""
        self.client.force_authenticate(user=self.buyer)
        response = self.client.post(self.purchase_url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.vehicle.refresh_from_db()
        self.assertEqual(self.vehicle.quantity, 0)

    def test_purchase_out_of_stock_vehicle(self):
        """Test purchasing an out-of-stock vehicle returns a 400 error."""
        self.vehicle.quantity = 0
        self.vehicle.save()

        self.client.force_authenticate(user=self.buyer)
        response = self.client.post(self.purchase_url)

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data['error'], 'Vehicle is out of stock.')

    def test_purchase_nonexistent_vehicle(self):
        """Test purchasing a non-existent vehicle returns 404."""
        self.client.force_authenticate(user=self.buyer)
        response = self.client.post('/api/vehicles/9999/purchase/')
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

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
