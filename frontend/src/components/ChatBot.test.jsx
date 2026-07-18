import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import ChatBot from './ChatBot';

const mockFetch = vi.fn();
global.fetch = mockFetch;

beforeEach(() => {
  mockFetch.mockReset();
});

const renderChat = () => render(<ChatBot />);

describe('ChatBot Component', () => {
  it('renders the floating chat button', () => {
    renderChat();
    expect(screen.getByLabelText('Open car consultant chat')).toBeInTheDocument();
  });

  it('opens chat window when floating button is clicked', () => {
    renderChat();
    fireEvent.click(screen.getByLabelText('Open car consultant chat'));
    expect(screen.getByText('Rahul — Car Consultant')).toBeInTheDocument();
    expect(screen.getByText('Kata Car Dealership')).toBeInTheDocument();
  });

  it('displays welcome message on open', () => {
    renderChat();
    fireEvent.click(screen.getByLabelText('Open car consultant chat'));
    expect(screen.getByText(/Hi! I'm Rahul/)).toBeInTheDocument();
  });

  it('can close the chat window', () => {
    renderChat();
    fireEvent.click(screen.getByLabelText('Open car consultant chat'));
    expect(screen.getByText('Rahul — Car Consultant')).toBeInTheDocument();

    fireEvent.click(screen.getByLabelText('Close chat'));
    expect(screen.queryByText('Rahul — Car Consultant')).not.toBeInTheDocument();
  });

  it('sends a message and displays reply', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ reply: 'Great choice!' }),
    });

    renderChat();
    fireEvent.click(screen.getByLabelText('Open car consultant chat'));

    const input = screen.getByPlaceholderText('Type your message...');
    fireEvent.change(input, { target: { value: 'My budget is 20 lakhs' } });
    fireEvent.click(screen.getByLabelText('Send message'));

    expect(screen.getByText('My budget is 20 lakhs')).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText('Great choice!')).toBeInTheDocument();
    });
  });

  it('displays error message on fetch failure', async () => {
    mockFetch.mockRejectedValueOnce(new Error('Network error'));

    renderChat();
    fireEvent.click(screen.getByLabelText('Open car consultant chat'));

    const input = screen.getByPlaceholderText('Type your message...');
    fireEvent.change(input, { target: { value: 'Hello' } });
    fireEvent.click(screen.getByLabelText('Send message'));

    await waitFor(() => {
      expect(screen.getByText(/having trouble connecting/)).toBeInTheDocument();
    });
  });

  it('displays server error message', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({ error: 'Service unavailable' }),
    });

    renderChat();
    fireEvent.click(screen.getByLabelText('Open car consultant chat'));

    const input = screen.getByPlaceholderText('Type your message...');
    fireEvent.change(input, { target: { value: 'Hi' } });
    fireEvent.click(screen.getByLabelText('Send message'));

    await waitFor(() => {
      expect(screen.getByText('Service unavailable')).toBeInTheDocument();
    });
  });

  it('sends message on Enter key', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ reply: 'Sure!' }),
    });

    renderChat();
    fireEvent.click(screen.getByLabelText('Open car consultant chat'));

    const input = screen.getByPlaceholderText('Type your message...');
    fireEvent.change(input, { target: { value: 'SUVs' } });
    fireEvent.keyDown(input, { key: 'Enter' });

    await waitFor(() => {
      expect(screen.getByText('Sure!')).toBeInTheDocument();
    });
  });

  it('shows powered by AI footer', () => {
    renderChat();
    fireEvent.click(screen.getByLabelText('Open car consultant chat'));
    expect(screen.getByText(/Powered by AI/)).toBeInTheDocument();
    expect(screen.getByText(/\+91 98765 43210/)).toBeInTheDocument();
  });
});
