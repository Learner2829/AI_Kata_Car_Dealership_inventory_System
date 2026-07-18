import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import VehicleCard from './VehicleCard';
import { AuthContext } from '../context/AuthContext';
import { BrowserRouter } from 'react-router-dom';

const mockVehicle = {
  id: 1,
  make: 'Toyota',
  model: 'Camry',
  category: 'Sedan',
  price: '25000.00',
  quantity: 5,
  fuel_type: 'Gasoline',
  transmission: 'Automatic',
  color: 'White',
  year: 2024,
  image_url: 'https://example.com/car.jpg',
};

const renderCard = (vehicle = mockVehicle, authProps = {}) => {
  const defaults = { isStaff: false, ...authProps };
  return render(
    <BrowserRouter>
      <AuthContext.Provider value={defaults}>
        <VehicleCard
          vehicle={vehicle}
          onPurchase={vi.fn()}
          onEdit={vi.fn()}
          onDelete={vi.fn()}
          onRestock={vi.fn()}
        />
      </AuthContext.Provider>
    </BrowserRouter>
  );
};

describe('VehicleCard Component', () => {
  it('renders vehicle make and model', () => {
    renderCard();
    expect(screen.getByText('Toyota')).toBeInTheDocument();
    expect(screen.getByText('Camry')).toBeInTheDocument();
    expect(screen.getByText('Sedan')).toBeInTheDocument();
    expect(screen.getByText('₹25,000')).toBeInTheDocument();
  });

  it('renders fuel type and transmission specs', () => {
    renderCard();
    expect(screen.getByText('Gasoline')).toBeInTheDocument();
    expect(screen.getByText('Automatic')).toBeInTheDocument();
  });

  it('shows Buy Now button for regular users', () => {
    renderCard();
    expect(screen.getByRole('button', { name: /buy now/i })).toBeInTheDocument();
  });

  it('shows Unavailable button when quantity is zero', () => {
    renderCard({ ...mockVehicle, quantity: 0 });
    expect(screen.getByRole('button', { name: /unavailable/i })).toBeDisabled();
  });

  it('shows Sold Out badge when quantity is zero', () => {
    renderCard({ ...mockVehicle, quantity: 0 });
    expect(screen.getByText('Sold Out')).toBeInTheDocument();
  });

  it('shows low stock badge when quantity is 3 or less', () => {
    renderCard({ ...mockVehicle, quantity: 2 });
    expect(screen.getByText('Only 2 left')).toBeInTheDocument();
  });

  it('shows admin controls for staff users', () => {
    renderCard(mockVehicle, { isStaff: true });
    expect(screen.getByRole('button', { name: /\+1/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /edit/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /del/i })).toBeInTheDocument();
  });

  it('hides Buy Now button for admin users', () => {
    renderCard(mockVehicle, { isStaff: true });
    expect(screen.queryByRole('button', { name: /buy now/i })).not.toBeInTheDocument();
  });

  it('hides admin controls for regular users', () => {
    renderCard(mockVehicle, { isStaff: false });
    expect(screen.queryByRole('button', { name: /\+1/i })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /edit/i })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /del/i })).not.toBeInTheDocument();
  });
});
