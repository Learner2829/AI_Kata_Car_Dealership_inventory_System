import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

export default function VehicleCard({ vehicle, onPurchase, onEdit, onDelete, onRestock }) {
  const { isStaff } = useContext(AuthContext);
  const outOfStock = vehicle.quantity === 0;

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 px-6 py-4">
        <h3 className="text-xl font-bold text-white">
          {vehicle.make} {vehicle.model}
        </h3>
        <span className="inline-block mt-1 px-2 py-0.5 text-xs font-semibold bg-blue-500 text-white rounded-full">
          {vehicle.category}
        </span>
      </div>

      {/* Body */}
      <div className="px-6 py-4">
        <div className="flex justify-between items-center mb-3">
          <span className="text-2xl font-bold text-green-700">
            ${Number(vehicle.price).toLocaleString()}
          </span>
          <span className={`text-sm font-medium px-2 py-1 rounded ${
            outOfStock
              ? 'bg-red-100 text-red-700'
              : vehicle.quantity <= 3
                ? 'bg-yellow-100 text-yellow-700'
                : 'bg-green-100 text-green-700'
          }`}>
            {outOfStock ? 'Out of Stock' : `${vehicle.quantity} in stock`}
          </span>
        </div>

        <p className="text-sm text-gray-500 mb-1">Stock ID: #{vehicle.id}</p>
      </div>

      {/* Actions */}
      <div className="px-6 pb-4 flex flex-wrap gap-2">
        {/* Purchase button - visible to all authenticated users */}
        {!isStaff && (
          <button
            onClick={() => onPurchase(vehicle.id)}
            disabled={outOfStock}
            className={`flex-1 px-4 py-2 rounded-md text-sm font-semibold transition-colors ${
              outOfStock
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-green-600 text-white hover:bg-green-700'
            }`}
          >
            {outOfStock ? 'Unavailable' : 'Purchase'}
          </button>
        )}

        {/* Admin controls */}
        {isStaff && (
          <>
            <button
              onClick={() => onRestock(vehicle.id)}
              className="flex-1 px-4 py-2 rounded-md text-sm font-semibold bg-blue-600 text-white hover:bg-blue-700 transition-colors"
            >
              Restock
            </button>
            <button
              onClick={() => onEdit(vehicle)}
              className="flex-1 px-4 py-2 rounded-md text-sm font-semibold bg-yellow-500 text-white hover:bg-yellow-600 transition-colors"
            >
              Edit
            </button>
            <button
              onClick={() => onDelete(vehicle.id)}
              className="px-4 py-2 rounded-md text-sm font-semibold bg-red-600 text-white hover:bg-red-700 transition-colors"
            >
              Delete
            </button>
          </>
        )}
      </div>
    </div>
  );
}
