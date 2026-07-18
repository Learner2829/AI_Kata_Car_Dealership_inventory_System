import { useState } from 'react';

export default function SearchBar({ onSearch, onClear }) {
  const [filters, setFilters] = useState({
    make: '',
    model: '',
    category: '',
    min_price: '',
    max_price: '',
  });

  const handleChange = (e) => {
    setFilters((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const params = {};
    Object.entries(filters).forEach(([key, value]) => {
      if (value.trim() !== '') {
        params[key] = value.trim();
      }
    });
    onSearch(params);
  };

  const handleClear = () => {
    setFilters({ make: '', model: '', category: '', min_price: '', max_price: '' });
    onClear();
  };

  const hasFilters = Object.values(filters).some((v) => v.trim() !== '');

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-4 mb-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        {/* Make */}
        <input
          type="text"
          name="make"
          placeholder="Make"
          value={filters.make}
          onChange={handleChange}
          className="px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
        />

        {/* Model */}
        <input
          type="text"
          name="model"
          placeholder="Model"
          value={filters.model}
          onChange={handleChange}
          className="px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
        />

        {/* Category */}
        <select
          name="category"
          value={filters.category}
          onChange={handleChange}
          className="px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
        >
          <option value="">All Categories</option>
          <option value="Sedan">Sedan</option>
          <option value="SUV">SUV</option>
          <option value="Truck">Truck</option>
          <option value="Coupe">Coupe</option>
          <option value="Hatchback">Hatchback</option>
          <option value="Convertible">Convertible</option>
          <option value="Van">Van</option>
          <option value="Electric">Electric</option>
        </select>

        {/* Price Range */}
        <input
          type="number"
          name="min_price"
          placeholder="Min Price"
          min="0"
          step="0.01"
          value={filters.min_price}
          onChange={handleChange}
          className="px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
        />

        <input
          type="number"
          name="max_price"
          placeholder="Max Price"
          min="0"
          step="0.01"
          value={filters.max_price}
          onChange={handleChange}
          className="px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
        />
      </div>

      <div className="mt-3 flex gap-2">
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-semibold hover:bg-blue-700 transition-colors"
        >
          Search
        </button>
        {hasFilters && (
          <button
            type="button"
            onClick={handleClear}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md text-sm font-semibold hover:bg-gray-50 transition-colors"
          >
            Clear
          </button>
        )}
      </div>
    </form>
  );
}
