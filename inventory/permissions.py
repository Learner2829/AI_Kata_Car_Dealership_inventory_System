# inventory/permissions.py
from rest_framework.permissions import BasePermission, SAFE_METHODS

class IsAdminOrReadOnly(BasePermission):
    """
    Custom permission to only allow admins (staff) to create, edit, or delete.
    Standard authenticated users have read-only access.
    """
    def has_permission(self, request, view):
        # All users must be authenticated
        if not request.user or not request.user.is_authenticated:
            return False
            
        # Allow GET, HEAD, OPTIONS requests for any authenticated user
        if request.method in SAFE_METHODS:
            return True
            
        # Write permissions are only allowed for admin (staff) users
        return request.user.is_staff