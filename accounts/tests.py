from django.contrib.auth import get_user_model
from django.test import TestCase
from rest_framework.test import APITestCase
from rest_framework import status

User = get_user_model()


class CustomUserTests(TestCase):
    def test_create_standard_user(self):
        """Test creating a standard user (buyer) with default permissions."""
        user = User.objects.create_user(
            username='buyer1',
            email='buyer@dealership.com',
            password='securepassword123'
        )

        self.assertEqual(user.username, 'buyer1')
        self.assertEqual(user.email, 'buyer@dealership.com')
        self.assertTrue(user.is_active)
        self.assertFalse(user.is_staff)
        self.assertFalse(user.is_superuser)

    def test_create_admin_user(self):
        """Test creating an admin user (staff) with elevated permissions."""
        admin_user = User.objects.create_superuser(
            username='admin1',
            email='admin@dealership.com',
            password='securepassword123'
        )

        self.assertEqual(admin_user.username, 'admin1')
        self.assertEqual(admin_user.email, 'admin@dealership.com')
        self.assertTrue(admin_user.is_active)
        self.assertTrue(admin_user.is_staff)
        self.assertTrue(admin_user.is_superuser)

    def test_user_str_representation(self):
        """Test the __str__ method of CustomUser."""
        user = User.objects.create_user(username='johndoe', password='pass123')
        self.assertEqual(str(user), 'johndoe')


class AuthAPITests(APITestCase):
    def setUp(self):
        self.register_url = '/api/auth/register/'
        self.login_url = '/api/auth/login/'
        self.refresh_url = '/api/auth/token/refresh/'
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
        self.assertNotEqual(User.objects.get().password, 'SecurePassword123')

    def test_user_login(self):
        """Test API can successfully log in a user and return a JWT."""
        User.objects.create_user(**self.user_data)

        login_data = {
            'username': 'testbuyer',
            'password': 'SecurePassword123'
        }
        response = self.client.post(self.login_url, login_data)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('access', response.data)
        self.assertIn('refresh', response.data)

    def test_duplicate_username_registration(self):
        """Test registration with an existing username fails."""
        User.objects.create_user(**self.user_data)

        response = self.client.post(self.register_url, self.user_data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_missing_fields_registration(self):
        """Test registration with missing required fields fails."""
        response = self.client.post(self.register_url, {'username': 'onlyuser'})
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_invalid_login_credentials(self):
        """Test login with wrong password fails."""
        User.objects.create_user(**self.user_data)

        response = self.client.post(self.login_url, {
            'username': 'testbuyer',
            'password': 'WrongPassword'
        })
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_token_refresh(self):
        """Test JWT refresh endpoint returns a new access token."""
        User.objects.create_user(**self.user_data)

        login_response = self.client.post(self.login_url, {
            'username': 'testbuyer',
            'password': 'SecurePassword123'
        })
        refresh_token = login_response.data['refresh']

        response = self.client.post(self.refresh_url, {'refresh': refresh_token})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('access', response.data)
