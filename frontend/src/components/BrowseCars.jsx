import { useState, useEffect, useContext } from 'react';
import { useSearchParams } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import VehicleCard from './VehicleCard';
import VehicleForm from './VehicleForm';

const CATEGORIES = ['All', 'SUV', 'Sedan', 'Truck', 'Electric', 'Coupe', 'Convertible', 'Hatchback', 'Van'];

export default function BrowseCars() {
  const { isStaff } = useContext(AuthContext);
  const [searchParams, setSearchParams] = useSearchParams();
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState(null);
  const [searchInput, setSearchInput] = useState(searchParams.get('search') || '');

  const activeCategory = searchParams.get('category') || 'All';
  const searchQuery = searchParams.get('search') || '';

  const fetchVehicles = async (params = {}) => {
    setLoading(true);
    setError('');
    try {
      let response;
      const hasFilter = Object.keys(params).length > 0 || searchQuery;
      if (hasFilter) {
        const queryParams = { ...params };
        if (searchQuery) {
          queryParams.search = searchQuery;
        }
        response = await api.get('vehicles/search/', { params: queryParams });
      } else {
        response = await api.get('vehicles/');
      }
      setVehicles(response.data);
    } catch (err) {
      setError('Failed to load vehicles');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const params = {};
    if (activeCategory && activeCategory !== 'All') {
      params.category = activeCategory;
    }
    fetchVehicles(params);
  }, [activeCategory, searchQuery]);

  const handleSearch = (e) => {
    e.preventDefault();
    const newParams = new URLSearchParams(searchParams);
    if (searchInput.trim()) {
      newParams.set('search', searchInput.trim());
    } else {
      newParams.delete('search');
    }
    setSearchParams(newParams);
  };

  const handleClearSearch = () => {
    setSearchInput('');
    const newParams = new URLSearchParams(searchParams);
    newParams.delete('search');
    setSearchParams(newParams);
  };

  const handleCategoryChange = (cat) => {
    const newParams = new URLSearchParams(searchParams);
    if (cat === 'All') {
      newParams.delete('category');
    } else {
      newParams.set('category', cat);
    }
    setSearchParams(newParams);
  };

  const handlePurchase = async (id) => {
    try {
      await api.post(`vehicles/${id}/purchase/`);
      setVehicles((prev) =>
        prev.map((v) => v.id === id ? { ...v, quantity: Math.max(0, v.quantity - 1) } : v)
      );
    } catch (err) {
      alert(err.response?.data?.error || 'Purchase failed');
    }
  };

  const handleRestock = async (id) => {
    try {
      await api.post(`vehicles/${id}/restock/`);
      setVehicles((prev) =>
        prev.map((v) => v.id === id ? { ...v, quantity: v.quantity + 1 } : v)
      );
    } catch (err) {
      alert('Restock failed');
    }
  };

  const handleEdit = (vehicle) => {
    setEditingVehicle(vehicle);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this vehicle?')) return;
    try {
      await api.delete(`vehicles/${id}/`);
      setVehicles((prev) => prev.filter((v) => v.id !== id));
    } catch (err) {
      alert('Delete failed');
    }
  };

  const handleFormSubmit = async (data) => {
    try {
      if (editingVehicle) {
        const response = await api.put(`vehicles/${editingVehicle.id}/`, data);
        setVehicles((prev) =>
          prev.map((v) => (v.id === editingVehicle.id ? response.data : v))
        );
      } else {
        const response = await api.post('vehicles/', data);
        setVehicles((prev) => [response.data, ...prev]);
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
      }
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {searchQuery ? `Results for "${searchQuery}"` : activeCategory !== 'All' ? `${activeCategory} Cars` : 'All Cars'}
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            {vehicles.length} vehicle{vehicles.length !== 1 ? 's' : ''} found
          </p>
        </div>
        {isStaff && (
          <button
            onClick={() => { setEditingVehicle(null); setShowForm(true); }}
            className="btn-primary flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Vehicle
          </button>
        )}
      </div>

      {/* Search bar */}
      <form onSubmit={handleSearch} className="flex gap-2 mb-6">
        <div className="flex-1 flex items-center bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
          <svg className="w-5 h-5 text-gray-400 ml-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search by make, model, or keyword..."
            className="w-full px-3 py-3 text-sm focus:outline-none"
          />
          {searchInput && (
            <button type="button" onClick={handleClearSearch} className="px-3 text-gray-400 hover:text-gray-600">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
        <button type="submit" className="px-6 py-3 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 transition-colors shadow-sm">
          Search
        </button>
      </form>

      {/* Category tabs */}
      <div className="flex flex-wrap gap-2 mb-6 pb-4 border-b border-gray-200">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => handleCategoryChange(cat)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              activeCategory === cat
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      {/* Results */}
      {loading ? (
        <div className="text-center py-16">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-3 text-gray-500">Loading vehicles...</p>
        </div>
      ) : vehicles.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl shadow-sm">
          <p className="text-gray-500 text-lg mb-4">No vehicles found</p>
          {isStaff && (
            <button onClick={() => { setEditingVehicle(null); setShowForm(true); }} className="btn-primary">
              Add Your First Vehicle
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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
          onClose={() => { setShowForm(false); setEditingVehicle(null); }}
        />
      )}
    </div>
  );
}
