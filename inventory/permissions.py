# inventory/permissions.py
from rest_framework.permissions import BasePermission, SAFE_METHODS

class IsAdminOrReadOnly(BasePermission):
    """
    Custom permission: anyone can read (GET), only admins can write.
    """
    def has_permission(self, request, view):
        # Allow read access for everyone (authenticated or not)
        if request.method in SAFE_METHODS:
            return True

        # Write permissions require admin (staff) authentication
        return request.user and request.user.is_authenticated and request.user.is_staff