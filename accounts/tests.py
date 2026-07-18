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