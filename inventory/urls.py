# inventory/urls.py
from django.urls import path
from .views import (
    VehicleListCreateView,
    VehicleDetailView,
    VehicleSearchView,
    PurchaseVehicleView,
    RestockVehicleView
)

# Note: search must be placed BEFORE the <int:pk> route
# to prevent 'search' from being read as an ID
urlpatterns = [
    path('vehicles/', VehicleListCreateView.as_view(), name='vehicle-list-create'),
    path('vehicles/search/', VehicleSearchView.as_view(), name='vehicle-search'),
    path('vehicles/<int:pk>/', VehicleDetailView.as_view(), name='vehicle-detail'),
    path('vehicles/<int:pk>/purchase/', PurchaseVehicleView.as_view(), name='vehicle-purchase'),
    path('vehicles/<int:pk>/restock/', RestockVehicleView.as_view(), name='vehicle-restock'),
]
