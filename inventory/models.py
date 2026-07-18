from django.db import models

CATEGORY_CHOICES = [
    ('SUV', 'SUV'),
    ('Sedan', 'Sedan'),
    ('Hatchback', 'Hatchback'),
    ('Coupe', 'Coupe'),
    ('Convertible', 'Convertible'),
    ('Truck', 'Truck'),
    ('Van', 'Van'),
    ('Electric', 'Electric'),
]


class Vehicle(models.Model):
    """
    Model representing a vehicle in the dealership inventory.
    The unique ID (Primary Key) is automatically added by Django.
    """
    make = models.CharField(max_length=100)
    model = models.CharField(max_length=100)
    category = models.CharField(max_length=50, choices=CATEGORY_CHOICES)
    price = models.DecimalField(max_digits=12, decimal_places=2)
    quantity = models.PositiveIntegerField(default=0)
    image_url = models.URLField(max_length=500, blank=True, default='')
    year = models.PositiveIntegerField(default=2024)
    color = models.CharField(max_length=50, default='White')
    mileage = models.PositiveIntegerField(default=0, help_text='Miles driven')
    fuel_type = models.CharField(max_length=20, default='Gasoline', choices=[
        ('Gasoline', 'Gasoline'),
        ('Diesel', 'Diesel'),
        ('Electric', 'Electric'),
        ('Hybrid', 'Hybrid'),
    ])
    transmission = models.CharField(max_length=20, default='Automatic', choices=[
        ('Automatic', 'Automatic'),
        ('Manual', 'Manual'),
    ])

    class Meta:
        ordering = ['-id']

    def __str__(self):
        return f"{self.year} {self.make} {self.model}"