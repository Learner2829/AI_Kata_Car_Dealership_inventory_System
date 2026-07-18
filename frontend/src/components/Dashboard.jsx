import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import VehicleCard from './VehicleCard';
import VehicleForm from './VehicleForm';
import SearchBar from './SearchBar';

export default function Dashboard() {
  const { isStaff } = useContext(AuthContext);
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState(null);
  const [searchMode, setSearchMode] = useState(false);

  const fetchVehicles = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await api.get('vehicles/');
      setVehicles(response.data);
    } catch (err) {
      setError('Failed to load vehicles. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const searchVehicles = async (params) => {
    setLoading(true);
    setError('');
    setSearchMode(true);
    try {
      const response = await api.get('vehicles/search/', { params });
      setVehicles(response.data);
    } catch (err) {
      setError('Search failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const clearSearch = () => {
    setSearchMode(false);
    fetchVehicles();
  };

  useEffect(() => {
    fetchVehicles();
  }, []);

  // Purchase a vehicle
  const handlePurchase = async (id) => {
    try {
      await api.post(`vehicles/${id}/purchase/`);
      // Update local state to reflect the purchase
      setVehicles((prev) =>
        prev.map((v) =>
          v.id === id ? { ...v, quantity: Math.max(0, v.quantity - 1) } : v
        )
      );
    } catch (err) {
      const msg = err.response?.data?.error || 'Purchase failed.';
      alert(msg);
    }
  };

  // Admin: Restock a vehicle
  const handleRestock = async (id) => {
    try {
      await api.post(`vehicles/${id}/restock/`);
      setVehicles((prev) =>
        prev.map((v) => (v.id === id ? { ...v, quantity: v.quantity + 1 } : v))
      );
    } catch (err) {
      alert('Restock failed. Admin only.');
    }
  };

  // Admin: Open form to add new vehicle
  const handleAdd = () => {
    setEditingVehicle(null);
    setShowForm(true);
  };

  // Admin: Open form to edit existing vehicle
  const handleEdit = (vehicle) => {
    setEditingVehicle(vehicle);
    setShowForm(true);
  };

  // Admin: Submit add or edit
  const handleFormSubmit = async (data) => {
    try {
      if (editingVehicle) {
        const response = await api.put(`vehicles/${editingVehicle.id}/`, data);
        setVehicles((prev) =>
          prev.map((v) => (v.id === editingVehicle.id ? response.data : v))
        );
      } else {
        const response = await api.post('vehicles/', data);
        setVehicles((prev) => [...prev, response.data]);
      }
      setShowForm(false);
      setEditingVehicle(null);
    } catch (err) {
      const data = err.response?.data;
      if (data) {
        const messages = Object.entries(data)
          .map(([field, msgs]) => `${field}: ${Array.isArray(msgs) ? msgs.join(', ') : msgs}`)
          .join('. ');
        alert(messages);
      } else {
        alert('Operation failed. Please try again.');
      }
    }
  };

  // Admin: Delete a vehicle
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this vehicle?')) return;
    try {
      await api.delete(`vehicles/${id}/`);
      setVehicles((prev) => prev.filter((v) => v.id !== id));
    } catch (err) {
      alert('Delete failed. Admin only.');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Vehicle Inventory</h1>
          <p className="text-sm text-gray-500 mt-1">
            {vehicles.length} vehicle{vehicles.length !== 1 ? 's' : ''} available
          </p>
        </div>
        {isStaff && (
          <button
            onClick={handleAdd}
            className="px-6 py-2 bg-green-600 text-white rounded-md text-sm font-semibold hover:bg-green-700 transition-colors"
          >
            + Add Vehicle
          </button>
        )}
      </div>

      {/* Search */}
      <SearchBar onSearch={searchVehicles} onClear={clearSearch} />

      {searchMode && (
        <p className="text-sm text-gray-600 mb-4">
          Showing search results.{' '}
          <button onClick={clearSearch} className="text-blue-600 hover:underline">
            View all vehicles
          </button>
        </p>
      )}

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {/* Loading */}
      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="mt-2 text-gray-500">Loading vehicles...</p>
        </div>
      ) : vehicles.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <p className="text-gray-500 text-lg">No vehicles found.</p>
          {isStaff && (
            <button
              onClick={handleAdd}
              className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-md text-sm font-semibold hover:bg-blue-700"
            >
              Add Your First Vehicle
            </button>
          )}
        </div>
      ) : (
        /* Vehicle Grid */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {vehicles.map((vehicle) => (
            <VehicleCard
              key={vehicle.id}
              vehicle={vehicle}
              onPurchase={handlePurchase}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onRestock={handleRestock}
            />
          ))}
        </div>
      )}

      {/* Vehicle Form Modal */}
      {showForm && (
        <VehicleForm
          vehicle={editingVehicle}
          onSubmit={handleFormSubmit}
          onClose={() => {
            setShowForm(false);
            setEditingVehicle(null);
          }}
        />
      )}
    </div>
  );
}
