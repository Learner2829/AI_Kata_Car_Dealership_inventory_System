# inventory/urls.py
from django.urls import path
from .views import VehicleListCreateView, VehicleDetailView, VehicleSearchView

urlpatterns = [
    path('vehicles/', VehicleListCreateView.as_view(), name='vehicle-list-create'),
    # Note: search must be placed BEFORE the <int:pk> route to prevent 'search' from being read as an ID
    path('vehicles/search/', VehicleSearchView.as_view(), name='vehicle-search'),
    path('vehicles/<int:pk>/', VehicleDetailView.as_view(), name='vehicle-detail'),
]