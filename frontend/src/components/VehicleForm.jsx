import { useState, useEffect } from 'react';

const EMPTY_FORM = {
  make: '',
  model: '',
  category: '',
  price: '',
  quantity: 0,
};

export default function VehicleForm({ vehicle, onSubmit, onClose }) {
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const isEditing = !!vehicle;

  useEffect(() => {
    if (vehicle) {
      setFormData({
        make: vehicle.make,
        model: vehicle.model,
        category: vehicle.category,
        price: vehicle.price,
        quantity: vehicle.quantity,
      });
    } else {
      setFormData(EMPTY_FORM);
    }
  }, [vehicle]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.make.trim()) newErrors.make = 'Make is required';
    if (!formData.model.trim()) newErrors.model = 'Model is required';
    if (!formData.category.trim()) newErrors.category = 'Category is required';
    if (!formData.price || Number(formData.price) <= 0) newErrors.price = 'Valid price is required';
    if (formData.quantity < 0) newErrors.quantity = 'Quantity cannot be negative';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    onSubmit({
      ...formData,
      price: Number(formData.price),
      quantity: Number(formData.quantity),
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
        {/* Header */}
        <div className="px-6 py-4 border-b">
          <h3 className="text-lg font-bold text-gray-800">
            {isEditing ? 'Edit Vehicle' : 'Add New Vehicle'}
          </h3>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-6 py-4">
          {/* Make */}
          <div className="mb-4">
            <label htmlFor="make" className="block mb-1 text-sm font-medium text-gray-700">Make</label>
            <input
              id="make"
              name="make"
              type="text"
              value={formData.make}
              onChange={handleChange}
              placeholder="e.g. Toyota"
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.make && <p className="text-red-500 text-xs mt-1">{errors.make}</p>}
          </div>

          {/* Model */}
          <div className="mb-4">
            <label htmlFor="model" className="block mb-1 text-sm font-medium text-gray-700">Model</label>
            <input
              id="model"
              name="model"
              type="text"
              value={formData.model}
              onChange={handleChange}
              placeholder="e.g. Camry"
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.model && <p className="text-red-500 text-xs mt-1">{errors.model}</p>}
          </div>

          {/* Category */}
          <div className="mb-4">
            <label htmlFor="category" className="block mb-1 text-sm font-medium text-gray-700">Category</label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select category</option>
              <option value="Sedan">Sedan</option>
              <option value="SUV">SUV</option>
              <option value="Truck">Truck</option>
              <option value="Coupe">Coupe</option>
              <option value="Hatchback">Hatchback</option>
              <option value="Convertible">Convertible</option>
              <option value="Van">Van</option>
              <option value="Electric">Electric</option>
            </select>
            {errors.category && <p className="text-red-500 text-xs mt-1">{errors.category}</p>}
          </div>

          {/* Price */}
          <div className="mb-4">
            <label htmlFor="price" className="block mb-1 text-sm font-medium text-gray-700">Price ($)</label>
            <input
              id="price"
              name="price"
              type="number"
              step="0.01"
              min="0"
              value={formData.price}
              onChange={handleChange}
              placeholder="e.g. 25000.00"
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.price && <p className="text-red-500 text-xs mt-1">{errors.price}</p>}
          </div>

          {/* Quantity */}
          <div className="mb-6">
            <label htmlFor="quantity" className="block mb-1 text-sm font-medium text-gray-700">Quantity</label>
            <input
              id="quantity"
              name="quantity"
              type="number"
              min="0"
              value={formData.quantity}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.quantity && <p className="text-red-500 text-xs mt-1">{errors.quantity}</p>}
          </div>

          {/* Buttons */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 rounded-md text-sm font-semibold border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 rounded-md text-sm font-semibold bg-blue-600 text-white hover:bg-blue-700 transition-colors"
            >
              {isEditing ? 'Update' : 'Add Vehicle'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
