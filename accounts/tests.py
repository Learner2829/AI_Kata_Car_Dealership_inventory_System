from django.test import TestCase

# Create your tests here.
# accounts/tests.py
from django.contrib.auth import get_user_model
from django.test import TestCase

class CustomUserTests(TestCase):
    def test_create_standard_user(self):
        """Test creating a standard user (buyer) with default permissions."""
        User = get_user_model()
        user = User.objects.create_user(
            username='buyer1',
            email='buyer@dealership.com',
            password='securepassword123'
        )
        
        self.assertEqual(user.username, 'buyer1')
        self.assertEqual(user.email, 'buyer@dealership.com')
        self.assertTrue(user.is_active)
        self.assertFalse(user.is_staff)  # Should not have admin privileges
        self.assertFalse(user.is_superuser)

    def test_create_admin_user(self):
        """Test creating an admin user (staff) with elevated permissions."""
        User = get_user_model()
        admin_user = User.objects.create_superuser(
            username='admin1',
            email='admin@dealership.com',
            password='securepassword123'
        )
        
        self.assertEqual(admin_user.username, 'admin1')
        self.assertEqual(admin_user.email, 'admin@dealership.com')
        self.assertTrue(admin_user.is_active)
        self.assertTrue(admin_user.is_staff)  # Must have admin privileges
        self.assertTrue(admin_user.is_superuser)


# accounts/tests.py (append this to the file)
from django.urls import reverse
from rest_framework.test import APITestCase
from rest_framework import status
from django.contrib.auth import get_user_model

User = get_user_model()

class AuthAPITests(APITestCase):
    def setUp(self):
        # We will map these URLs in the next step
        self.register_url = '/api/auth/register/'
        self.login_url = '/api/auth/login/'
        self.user_data = {
            'username': 'testbuyer',
            'email': 'buyer@dealership.com',
            'password': 'SecurePassword123'
        }

    def test_user_registration(self):
        """Test API can successfully register a new user."""
        response = self.client.post(self.register_url, self.user_data)
        
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(User.objects.count(), 1)
        self.assertEqual(User.objects.get().username, 'testbuyer')
        # The password should be hashed, not stored as plain text
        self.assertNotEqual(User.objects.get().password, 'SecurePassword123')

    def test_user_login(self):
        """Test API can successfully log in a user and return a JWT."""
        # First, create a user
        User.objects.create_user(**self.user_data)
        
        # Attempt login
        login_data = {
            'username': 'testbuyer',
            'password': 'SecurePassword123'
        }
        response = self.client.post(self.login_url, login_data)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('access', response.data)  # JWT Access Token
        self.assertIn('refresh', response.data) # JWT Refresh Token