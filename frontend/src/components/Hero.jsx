import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Hero() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/cars?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate('/cars');
    }
  };

  const categories = [
    { id: 'SUV', label: 'SUV', icon: '🚙' },
    { id: 'Sedan', label: 'Sedan', icon: '🚗' },
    { id: 'Truck', label: 'Truck', icon: '🛻' },
    { id: 'Electric', label: 'Electric', icon: '⚡' },
    { id: 'Coupe', label: 'Coupe', icon: '🏎️' },
    { id: 'Convertible', label: 'Convertible', icon: '☔' },
  ];

  return (
    <section className="relative bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle at 25% 25%, white 1px, transparent 1px)',
          backgroundSize: '50px 50px'
        }}></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 py-16 md:py-24">
        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight">
            Find Your <span className="text-orange-400">Perfect Car</span>
          </h1>
          <p className="text-lg md:text-xl text-blue-100 max-w-2xl mx-auto">
            Browse through hundreds of quality vehicles at Kata Car Dealership
          </p>
        </div>

        {/* Search Bar */}
        <div className="max-w-3xl mx-auto mb-10">
          <form onSubmit={handleSearch} className="bg-white rounded-2xl shadow-2xl p-2 flex items-center gap-2">
            <div className="flex-1 flex items-center px-4">
              <svg className="w-5 h-5 text-gray-400 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search by make, model, or category..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full py-3 text-gray-700 placeholder-gray-400 focus:outline-none text-sm md:text-base"
              />
            </div>
            <button
              type="submit"
              className="bg-orange-500 hover:bg-orange-600 text-white px-6 md:px-8 py-3 rounded-xl font-semibold transition-colors flex-shrink-0 text-sm md:text-base"
            >
              Search Cars
            </button>
          </form>
        </div>

        {/* Quick category buttons */}
        <div className="flex flex-wrap justify-center gap-3">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => navigate(`/cars?category=${cat.id}`)}
              className="bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 flex items-center gap-2 border border-white/20 hover:border-white/40"
            >
              <span>{cat.icon}</span>
              <span>{cat.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Bottom wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 60" fill="none" className="w-full">
          <path d="M0 60L60 52C120 44 240 28 360 24C480 20 600 28 720 32C840 36 960 36 1080 32C1200 28 1320 20 1380 16L1440 12V60H0Z" fill="#f9fafb"/>
        </svg>
      </div>
    </section>
  );
}
