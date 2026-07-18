from django.contrib import admin

# Register your models here.
# inventory/admin.py
from django.contrib import admin
from .models import Vehicle

@admin.register(Vehicle)
class VehicleAdmin(admin.ModelAdmin):
    list_display = ('id', 'make', 'model', 'category', 'price', 'quantity')
    search_fields = ('make', 'model', 'category')
    list_filter = ('category', 'make')