import { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import VehicleCard from './VehicleCard';
import Hero from './Hero';

const BRANDS = ['Toyota', 'Honda', 'Ford', 'BMW', 'Tesla', 'Chevrolet', 'Hyundai', 'Jeep', 'Mercedes-Benz', 'Audi', 'Nissan', 'Kia', 'Mazda'];

export default function Home() {
  const { isAuthenticated, isStaff } = useContext(AuthContext);
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const response = await api.get('vehicles/');
        setVehicles(response.data);
      } catch (err) {
        console.error('Failed to load vehicles');
      } finally {
        setLoading(false);
      }
    };
    if (isAuthenticated) fetchVehicles();
    else setLoading(false);
  }, [isAuthenticated]);

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

  const featured = vehicles.slice(0, 8);
  const popularMakes = [...new Set(vehicles.map(v => v.make))];
  const categoryCounts = vehicles.reduce((acc, v) => {
    acc[v.category] = (acc[v.category] || 0) + 1;
    return acc;
  }, {});

  return (
    <div>
      <Hero />

      {/* Stats bar */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <p className="text-3xl font-bold text-blue-600">{vehicles.length}</p>
              <p className="text-sm text-gray-500">Cars Available</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-blue-600">{popularMakes.length}</p>
              <p className="text-sm text-gray-500">Top Brands</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-blue-600">{Object.keys(categoryCounts).length}</p>
              <p className="text-sm text-gray-500">Categories</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-blue-600">24/7</p>
              <p className="text-sm text-gray-500">Customer Support</p>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Cars */}
      {isAuthenticated && featured.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 py-12">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Featured Cars</h2>
              <p className="text-sm text-gray-500 mt-1">Handpicked vehicles for you</p>
            </div>
            <Link to="/cars" className="text-blue-600 hover:text-blue-700 font-semibold text-sm flex items-center gap-1">
              View All
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/></svg>
            </Link>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featured.map((vehicle) => (
                <VehicleCard
                  key={vehicle.id}
                  vehicle={vehicle}
                  onPurchase={handlePurchase}
                />
              ))}
            </div>
          )}
        </section>
      )}

      {/* Browse by Category */}
      <section className="bg-white py-12">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-gray-900 mb-2 text-center">Browse by Category</h2>
          <p className="text-sm text-gray-500 text-center mb-8">Find the perfect car for your lifestyle</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
            {Object.entries(categoryCounts).map(([category, count]) => (
              <Link
                key={category}
                to={`/cars?category=${category}`}
                className="bg-gray-50 hover:bg-blue-50 border border-gray-200 hover:border-blue-300 rounded-xl p-4 text-center transition-all group"
              >
                <span className="text-2xl block mb-2">
                  {category === 'SUV' ? '🚙' : category === 'Sedan' ? '🚗' : category === 'Truck' ? '🛻' : category === 'Electric' ? '⚡' : category === 'Coupe' ? '🏎️' : category === 'Convertible' ? '☔' : '🚘'}
                </span>
                <p className="font-semibold text-gray-900 group-hover:text-blue-600 text-sm">{category}</p>
                <p className="text-xs text-gray-500">{count} cars</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Browse by Brand */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-2 text-center">Popular Brands</h2>
        <p className="text-sm text-gray-500 text-center mb-8">Explore cars from top manufacturers</p>
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4">
          {popularMakes.map((make) => (
            <Link
              key={make}
              to={`/cars?search=${make}`}
              className="bg-white border border-gray-200 hover:border-blue-400 rounded-xl p-4 text-center transition-all hover:shadow-md"
            >
              <p className="font-bold text-gray-900 text-sm">{make}</p>
              <p className="text-xs text-gray-500 mt-1">
                {vehicles.filter(v => v.make === make).length} models
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      {!isAuthenticated && (
        <section className="bg-blue-800 py-12">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold text-white mb-4">Ready to Find Your Dream Car?</h2>
            <p className="text-blue-100 mb-6">Join thousands of happy customers who found their perfect vehicle at Kata Car Dealership.</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link to="/register" className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-xl font-bold text-lg transition-colors">
                Get Started Free
              </Link>
              <Link to="/cars" className="border-2 border-white text-white px-8 py-3 rounded-xl font-bold text-lg hover:bg-white/10 transition-colors">
                Browse Cars
              </Link>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
