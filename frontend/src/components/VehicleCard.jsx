import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const PLACEHOLDER_IMG = 'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=800&h=500&fit=crop';

export default function VehicleCard({ vehicle, onPurchase, onEdit, onDelete, onRestock }) {
  const { isStaff } = useContext(AuthContext);
  const outOfStock = vehicle.quantity === 0;
  const lowStock = vehicle.quantity > 0 && vehicle.quantity <= 3;

  return (
    <div className="card group">
      {/* Image */}
      <div className="relative overflow-hidden">
        <Link to={`/cars/${vehicle.id}`}>
          <img
            src={vehicle.image_url || PLACEHOLDER_IMG}
            alt={`${vehicle.make} ${vehicle.model}`}
            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
            onError={(e) => { e.target.src = PLACEHOLDER_IMG; }}
          />
        </Link>

        {/* Badges */}
        <div className="absolute top-3 left-3 flex gap-2">
          {vehicle.fuel_type === 'Electric' && (
            <span className="bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-md">EV</span>
          )}
          {vehicle.year >= 2024 && (
            <span className="bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded-md">{vehicle.year}</span>
          )}
        </div>

        {/* Stock badge */}
        <div className="absolute top-3 right-3">
          {outOfStock && (
            <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-md">Sold Out</span>
          )}
          {lowStock && (
            <span className="bg-amber-500 text-white text-xs font-bold px-2 py-1 rounded-md">Only {vehicle.quantity} left</span>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <div>
            <p className="text-xs text-blue-600 font-semibold uppercase tracking-wider">{vehicle.make}</p>
            <Link to={`/cars/${vehicle.id}`}>
              <h3 className="text-lg font-bold text-gray-900 hover:text-blue-600 transition-colors">
                {vehicle.model}
              </h3>
            </Link>
          </div>
          <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded">
            {vehicle.category}
          </span>
        </div>

        {/* Specs row */}
        <div className="flex items-center gap-3 text-xs text-gray-500 mb-3">
          <span className="flex items-center gap-1">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
            {vehicle.fuel_type}
          </span>
          <span className="flex items-center gap-1">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
            {vehicle.transmission}
          </span>
          <span>{vehicle.color}</span>
        </div>

        {/* Price */}
        <div className="flex items-end justify-between border-t pt-3">
          <div>
            <p className="text-xs text-gray-400">Starting at</p>
            <p className="text-xl font-bold text-gray-900">
              ${Number(vehicle.price).toLocaleString()}
            </p>
          </div>

          <div className="flex gap-2">
            {!isStaff && (
              <button
                onClick={() => onPurchase(vehicle.id)}
                disabled={outOfStock}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                  outOfStock
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    : 'bg-orange-500 text-white hover:bg-orange-600 shadow-sm hover:shadow'
                }`}
              >
                {outOfStock ? 'Unavailable' : 'Buy Now'}
              </button>
            )}
            {isStaff && (
              <>
                <button
                  onClick={() => onRestock(vehicle.id)}
                  className="px-3 py-2 rounded-lg text-sm font-semibold bg-blue-100 text-blue-700 hover:bg-blue-200 transition-colors"
                  title="Restock"
                >
                  +1
                </button>
                <button
                  onClick={() => onEdit(vehicle)}
                  className="px-3 py-2 rounded-lg text-sm font-semibold bg-yellow-100 text-yellow-700 hover:bg-yellow-200 transition-colors"
                  title="Edit"
                >
                  Edit
                </button>
                <button
                  onClick={() => onDelete(vehicle.id)}
                  className="px-3 py-2 rounded-lg text-sm font-semibold bg-red-100 text-red-700 hover:bg-red-200 transition-colors"
                  title="Delete"
                >
                  Del
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
