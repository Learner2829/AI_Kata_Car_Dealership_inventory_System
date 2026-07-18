from django.db import models

# Create your models here.
# accounts/models.py
from django.contrib.auth.models import AbstractUser
from django.db import models

class CustomUser(AbstractUser):
    """
    Custom user model for the Car Dealership System.
    Extends AbstractUser to natively support standard users (buyers)
    and admin users (staff) via the 'is_staff' flag.
    """
    
    def __str__(self):
        return self.username