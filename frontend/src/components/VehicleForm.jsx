import { useState, useEffect } from 'react';

const EMPTY_FORM = {
  make: '', model: '', category: '', price: '', quantity: 0,
  year: 2024, color: 'White', mileage: 0, fuel_type: 'Gasoline',
  transmission: 'Automatic', image_url: '',
};

export default function VehicleForm({ vehicle, onSubmit, onClose }) {
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const isEditing = !!vehicle;

  useEffect(() => {
    if (vehicle) {
      setFormData({
        make: vehicle.make, model: vehicle.model, category: vehicle.category,
        price: vehicle.price, quantity: vehicle.quantity, year: vehicle.year || 2024,
        color: vehicle.color || 'White', mileage: vehicle.mileage || 0,
        fuel_type: vehicle.fuel_type || 'Gasoline', transmission: vehicle.transmission || 'Automatic',
        image_url: vehicle.image_url || '',
      });
    } else {
      setFormData(EMPTY_FORM);
    }
  }, [vehicle]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.make.trim()) newErrors.make = 'Required';
    if (!formData.model.trim()) newErrors.model = 'Required';
    if (!formData.category) newErrors.category = 'Required';
    if (!formData.price || Number(formData.price) <= 0) newErrors.price = 'Required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    onSubmit({ ...formData, price: Number(formData.price), quantity: Number(formData.quantity),
      year: Number(formData.year), mileage: Number(formData.mileage) });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between rounded-t-2xl">
          <h3 className="text-lg font-bold text-gray-900">{isEditing ? 'Edit Vehicle' : 'Add New Vehicle'}</h3>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Make *</label>
              <input name="make" value={formData.make} onChange={handleChange}
                placeholder="e.g. Toyota" className="input-field text-sm" />
              {errors.make && <p className="text-red-500 text-xs mt-1">{errors.make}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Model *</label>
              <input name="model" value={formData.model} onChange={handleChange}
                placeholder="e.g. Camry" className="input-field text-sm" />
              {errors.model && <p className="text-red-500 text-xs mt-1">{errors.model}</p>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
              <select name="category" value={formData.category} onChange={handleChange} className="input-field text-sm">
                <option value="">Select</option>
                <option value="SUV">SUV</option><option value="Sedan">Sedan</option>
                <option value="Truck">Truck</option><option value="Coupe">Coupe</option>
                <option value="Convertible">Convertible</option><option value="Hatchback">Hatchback</option>
                <option value="Van">Van</option><option value="Electric">Electric</option>
              </select>
              {errors.category && <p className="text-red-500 text-xs mt-1">{errors.category}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
              <input name="year" type="number" min="1990" max="2030" value={formData.year} onChange={handleChange} className="input-field text-sm" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Price (₹) *</label>
              <input name="price" type="number" step="0.01" min="0" value={formData.price} onChange={handleChange}
                placeholder="25000" className="input-field text-sm" />
              {errors.price && <p className="text-red-500 text-xs mt-1">{errors.price}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
              <input name="quantity" type="number" min="0" value={formData.quantity} onChange={handleChange} className="input-field text-sm" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Color</label>
              <input name="color" value={formData.color} onChange={handleChange} className="input-field text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Mileage (mi)</label>
              <input name="mileage" type="number" min="0" value={formData.mileage} onChange={handleChange} className="input-field text-sm" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Fuel Type</label>
              <select name="fuel_type" value={formData.fuel_type} onChange={handleChange} className="input-field text-sm">
                <option value="Gasoline">Gasoline</option><option value="Diesel">Diesel</option>
                <option value="Electric">Electric</option><option value="Hybrid">Hybrid</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Transmission</label>
              <select name="transmission" value={formData.transmission} onChange={handleChange} className="input-field text-sm">
                <option value="Automatic">Automatic</option><option value="Manual">Manual</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
            <input name="image_url" value={formData.image_url} onChange={handleChange}
              placeholder="https://..." className="input-field text-sm" />
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose}
              className="flex-1 py-2.5 border border-gray-300 rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors">
              Cancel
            </button>
            <button type="submit"
              className="flex-1 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors">
              {isEditing ? 'Update Vehicle' : 'Add Vehicle'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
