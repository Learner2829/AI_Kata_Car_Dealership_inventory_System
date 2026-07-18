import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import VehicleForm from './VehicleForm';

describe('VehicleForm Component', () => {
  it('renders add mode when no vehicle is provided', () => {
    render(<VehicleForm vehicle={null} onSubmit={vi.fn()} onClose={vi.fn()} />);
    expect(screen.getByText('Add New Vehicle')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /add vehicle/i })).toBeInTheDocument();
  });

  it('renders edit mode when vehicle is provided', () => {
    const vehicle = { id: 1, make: 'Toyota', model: 'Camry', category: 'Sedan', price: 25000, quantity: 5 };
    render(<VehicleForm vehicle={vehicle} onSubmit={vi.fn()} onClose={vi.fn()} />);
    expect(screen.getByText('Edit Vehicle')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /update/i })).toBeInTheDocument();
    expect(screen.getByDisplayValue('Toyota')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Camry')).toBeInTheDocument();
  });

  it('shows validation errors for empty required fields', async () => {
    render(<VehicleForm vehicle={null} onSubmit={vi.fn()} onClose={vi.fn()} />);
    fireEvent.click(screen.getByRole('button', { name: /add vehicle/i }));
    expect(await screen.findAllByText('Required')).toHaveLength(4);
  });

  it('calls onSubmit with form data when valid', () => {
    const onSubmit = vi.fn();
    render(<VehicleForm vehicle={null} onSubmit={onSubmit} onClose={vi.fn()} />);

    fireEvent.change(screen.getByPlaceholderText(/toyota/i), { target: { value: 'Honda' } });
    fireEvent.change(screen.getByPlaceholderText(/camry/i), { target: { value: 'Civic' } });
    fireEvent.change(screen.getByDisplayValue('Select'), { target: { value: 'Sedan' } });
    fireEvent.change(screen.getByPlaceholderText(/25000/i), { target: { value: '22000' } });

    fireEvent.click(screen.getByRole('button', { name: /add vehicle/i }));

    expect(onSubmit).toHaveBeenCalledWith(
      expect.objectContaining({
        make: 'Honda',
        model: 'Civic',
        category: 'Sedan',
        price: 22000,
      })
    );
  });

  it('calls onClose when cancel is clicked', () => {
    const onClose = vi.fn();
    render(<VehicleForm vehicle={null} onSubmit={vi.fn()} onClose={onClose} />);
    fireEvent.click(screen.getByRole('button', { name: /cancel/i }));
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
