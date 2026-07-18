from django.db import models

class Vehicle(models.Model):
    """
    Model representing a vehicle in the dealership inventory.
    The unique ID (Primary Key) is automatically added by Django.
    """
    make = models.CharField(max_length=100)
    model = models.CharField(max_length=100)
    category = models.CharField(max_length=50)
    price = models.DecimalField(max_digits=12, decimal_places=2)
    quantity = models.PositiveIntegerField(default=0)

    def __str__(self):
        return f"{self.make} {self.model}"