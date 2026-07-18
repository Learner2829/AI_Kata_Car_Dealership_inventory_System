// frontend/src/components/Login.test.jsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import Login from './Login';
import { AuthProvider } from '../context/AuthContext';
import api from '../services/api';

// Mock the API service
vi.mock('../services/api');

describe('Login Component', () => {
  it('renders login form and submits credentials', async () => {
    // Mock a successful API response with JWT tokens
    api.post.mockResolvedValueOnce({ 
      data: { access: 'mock_access_token', refresh: 'mock_refresh_token' } 
    });
    
    render(
      <BrowserRouter>
        <AuthProvider>
          <Login />
        </AuthProvider>
      </BrowserRouter>
    );
    
    // Find inputs and button
    const usernameInput = screen.getByLabelText(/username/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole('button', { name: /login/i });
    
    // Simulate user typing
    fireEvent.change(usernameInput, { target: { value: 'testbuyer' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    
    // Submit form
    fireEvent.click(submitButton);
    
    // Verify API was called with correct data
    await waitFor(() => {
      expect(api.post).toHaveBeenCalledWith('auth/login/', {
        username: 'testbuyer',
        password: 'password123',
      });
    });
  });
});