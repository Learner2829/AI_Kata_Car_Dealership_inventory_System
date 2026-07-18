import { useState, useEffect, useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';

const PLACEHOLDER_IMG = 'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=800&h=500&fit=crop';

export default function CarDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, isStaff } = useContext(AuthContext);
  const [vehicle, setVehicle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchVehicle = async () => {
      try {
        const response = await api.get(`vehicles/${id}/`);
        setVehicle(response.data);
      } catch (err) {
        setError('Vehicle not found');
      } finally {
        setLoading(false);
      }
    };
    fetchVehicle();
  }, [id]);

  const handlePurchase = async () => {
    try {
      await api.post(`vehicles/${id}/purchase/`);
      setVehicle((prev) => ({ ...prev, quantity: prev.quantity - 1 }));
    } catch (err) {
      alert(err.response?.data?.error || 'Purchase failed');
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !vehicle) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl font-semibold text-gray-600 mb-4">{error || 'Vehicle not found'}</p>
          <Link to="/cars" className="btn-primary">Browse All Cars</Link>
        </div>
      </div>
    );
  }

  const outOfStock = vehicle.quantity === 0;
  const specs = [
    { label: 'Year', value: vehicle.year, icon: '📅' },
    { label: 'Fuel Type', value: vehicle.fuel_type, icon: '⛽' },
    { label: 'Transmission', value: vehicle.transmission, icon: '⚙️' },
    { label: 'Color', value: vehicle.color, icon: '🎨' },
    { label: 'Mileage', value: `${vehicle.mileage} mi`, icon: '🛣️' },
    { label: 'Stock', value: outOfStock ? 'Sold Out' : `${vehicle.quantity} available`, icon: '📦' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <Link to="/" className="hover:text-blue-600">Home</Link>
        <span>/</span>
        <Link to="/cars" className="hover:text-blue-600">Browse Cars</Link>
        <span>/</span>
        <span className="text-gray-900">{vehicle.year} {vehicle.make} {vehicle.model}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Image */}
        <div className="card overflow-hidden">
          <img
            src={vehicle.image_url || PLACEHOLDER_IMG}
            alt={`${vehicle.make} ${vehicle.model}`}
            className="w-full h-80 lg:h-[450px] object-cover"
            onError={(e) => { e.target.src = PLACEHOLDER_IMG; }}
          />
        </div>

        {/* Details */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-sm font-semibold text-blue-600 uppercase tracking-wider">{vehicle.make}</span>
            <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">{vehicle.category}</span>
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-2">{vehicle.model}</h1>
          <p className="text-sm text-gray-500 mb-4">Stock ID: #{vehicle.id}</p>

          <div className="bg-gray-50 rounded-xl p-6 mb-6">
            <p className="text-sm text-gray-500 mb-1">Starting at</p>
            <p className="text-4xl font-bold text-gray-900">${Number(vehicle.price).toLocaleString()}</p>
            <p className="text-xs text-gray-400 mt-1">Ex-showroom price</p>
          </div>

          {/* Specs grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
            {specs.map((spec) => (
              <div key={spec.label} className="bg-white border border-gray-200 rounded-lg p-3 text-center">
                <span className="text-lg mb-1 block">{spec.icon}</span>
                <p className="text-xs text-gray-500">{spec.label}</p>
                <p className="text-sm font-semibold text-gray-900">{spec.value}</p>
              </div>
            ))}
          </div>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            {!isStaff && (
              <button
                onClick={handlePurchase}
                disabled={outOfStock}
                className={`flex-1 py-3 rounded-xl font-bold text-lg transition-all ${
                  outOfStock
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    : 'bg-orange-500 text-white hover:bg-orange-600 shadow-lg hover:shadow-xl'
                }`}
              >
                {outOfStock ? 'Currently Unavailable' : 'Buy Now'}
              </button>
            )}
            <Link
              to="/cars"
              className="flex-1 py-3 rounded-xl font-bold text-lg text-center border-2 border-gray-200 text-gray-700 hover:bg-gray-50 transition-all"
            >
              View All Cars
            </Link>
          </div>

          {isStaff && (
            <div className="mt-4 p-4 bg-orange-50 border border-orange-200 rounded-xl">
              <p className="text-sm font-semibold text-orange-800 mb-2">Admin Controls</p>
              <div className="flex gap-2">
                <button
                  onClick={async () => {
                    await api.post(`vehicles/${id}/restock/`);
                    setVehicle((prev) => ({ ...prev, quantity: prev.quantity + 1 }));
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700"
                >
                  Restock (+1)
                </button>
                <button
                  onClick={async () => {
                    if (window.confirm('Delete this vehicle?')) {
                      await api.delete(`vehicles/${id}/`);
                      navigate('/cars');
                    }
                  }}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-semibold hover:bg-red-700"
                >
                  Delete Vehicle
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
