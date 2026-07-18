import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import VehicleCard from './VehicleCard';
import VehicleForm from './VehicleForm';

export default function AdminPanel() {
  const { isStaff } = useContext(AuthContext);
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState(null);

  const fetchVehicles = async () => {
    setLoading(true);
    try {
      const response = await api.get('vehicles/');
      setVehicles(response.data);
    } catch (err) {
      console.error('Failed to load vehicles');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchVehicles(); }, []);

  if (!isStaff) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl font-semibold text-gray-600 mb-2">Access Denied</p>
          <p className="text-gray-500">You need admin privileges to access this page.</p>
        </div>
      </div>
    );
  }

  const handleRestock = async (id) => {
    try {
      await api.post(`vehicles/${id}/restock/`);
      setVehicles((prev) => prev.map((v) => v.id === id ? { ...v, quantity: v.quantity + 1 } : v));
    } catch (err) { alert('Restock failed'); }
  };

  const handleEdit = (vehicle) => { setEditingVehicle(vehicle); setShowForm(true); };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this vehicle permanently?')) return;
    try {
      await api.delete(`vehicles/${id}/`);
      setVehicles((prev) => prev.filter((v) => v.id !== id));
    } catch (err) { alert('Delete failed'); }
  };

  const handleFormSubmit = async (data) => {
    try {
      if (editingVehicle) {
        const response = await api.put(`vehicles/${editingVehicle.id}/`, data);
        setVehicles((prev) => prev.map((v) => v.id === editingVehicle.id ? response.data : v));
      } else {
        const response = await api.post('vehicles/', data);
        setVehicles((prev) => [response.data, ...prev]);
      }
      setShowForm(false); setEditingVehicle(null);
    } catch (err) {
      const data = err.response?.data;
      if (data) alert(Object.entries(data).map(([k, v]) => `${k}: ${Array.isArray(v) ? v.join(', ') : v}`).join('. '));
    }
  };

  const totalStock = vehicles.reduce((sum, v) => sum + v.quantity, 0);
  const outOfStock = vehicles.filter((v) => v.quantity === 0).length;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Admin Panel</h1>
          <p className="text-sm text-gray-500 mt-1">Manage your vehicle inventory</p>
        </div>
        <button
          onClick={() => { setEditingVehicle(null); setShowForm(true); }}
          className="btn-primary flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add New Vehicle
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <p className="text-sm text-gray-500">Total Vehicles</p>
          <p className="text-2xl font-bold text-gray-900">{vehicles.length}</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <p className="text-sm text-gray-500">Total Stock</p>
          <p className="text-2xl font-bold text-blue-600">{totalStock}</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <p className="text-sm text-gray-500">Out of Stock</p>
          <p className="text-2xl font-bold text-red-600">{outOfStock}</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <p className="text-sm text-gray-500">In Stock</p>
          <p className="text-2xl font-bold text-green-600">{vehicles.length - outOfStock}</p>
        </div>
      </div>

      {/* Vehicle list */}
      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mx-auto"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {vehicles.map((vehicle) => (
            <VehicleCard
              key={vehicle.id}
              vehicle={vehicle}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onRestock={handleRestock}
            />
          ))}
        </div>
      )}

      {showForm && (
        <VehicleForm
          vehicle={editingVehicle}
          onSubmit={handleFormSubmit}
          onClose={() => { setShowForm(false); setEditingVehicle(null); }}
        />
      )}
    </div>
  );
}
