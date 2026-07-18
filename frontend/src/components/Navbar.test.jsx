import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import Navbar from './Navbar';
import { AuthContext } from '../context/AuthContext';

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return { ...actual, useNavigate: () => mockNavigate };
});

const renderNavbar = (authProps = {}) => {
  const defaults = {
    isAuthenticated: false,
    isStaff: false,
    username: '',
    logout: vi.fn(),
    ...authProps,
  };
  return render(
    <BrowserRouter>
      <AuthContext.Provider value={defaults}>
        <Navbar />
      </AuthContext.Provider>
    </BrowserRouter>
  );
};

describe('Navbar Component', () => {
  it('shows login and register links when not authenticated', () => {
    renderNavbar();
    expect(screen.getByText(/login/i).closest('a')).toHaveAttribute('href', '/login');
    expect(screen.getByText(/register/i).closest('a')).toHaveAttribute('href', '/register');
  });

  it('shows nav links, username, and logout when authenticated', () => {
    renderNavbar({ isAuthenticated: true, username: 'john' });
    expect(screen.getByText('Browse Cars')).toBeInTheDocument();
    expect(screen.getByText(/john/)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /logout/i })).toBeInTheDocument();
  });

  it('shows admin badge for staff users', () => {
    renderNavbar({ isAuthenticated: true, isStaff: true, username: 'admin' });
    expect(screen.getByText('Admin')).toBeInTheDocument();
  });

  it('does not show admin badge for regular users', () => {
    renderNavbar({ isAuthenticated: true, isStaff: false, username: 'buyer' });
    expect(screen.queryByText('Admin')).not.toBeInTheDocument();
  });

  it('calls logout when logout button is clicked', () => {
    const logout = vi.fn();
    renderNavbar({ isAuthenticated: true, username: 'test', logout });
    fireEvent.click(screen.getByRole('button', { name: /logout/i }));
    expect(logout).toHaveBeenCalledTimes(1);
  });
});
