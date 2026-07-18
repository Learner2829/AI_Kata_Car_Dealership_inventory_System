import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import SearchBar from './SearchBar';

describe('SearchBar Component', () => {
  it('renders all filter inputs', () => {
    render(<SearchBar onSearch={vi.fn()} onClear={vi.fn()} />);
    expect(screen.getByPlaceholderText('Make')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Model')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Min Price')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Max Price')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /search/i })).toBeInTheDocument();
  });

  it('calls onSearch with filter params when submitted', () => {
    const onSearch = vi.fn();
    render(<SearchBar onSearch={onSearch} onClear={vi.fn()} />);

    fireEvent.change(screen.getByPlaceholderText('Make'), { target: { value: 'Toyota' } });
    fireEvent.change(screen.getByPlaceholderText('Min Price'), { target: { value: '20000' } });
    fireEvent.click(screen.getByRole('button', { name: /search/i }));

    expect(onSearch).toHaveBeenCalledWith({ make: 'Toyota', min_price: '20000' });
  });

  it('does not include empty params in search', () => {
    const onSearch = vi.fn();
    render(<SearchBar onSearch={onSearch} onClear={vi.fn()} />);

    fireEvent.click(screen.getByRole('button', { name: /search/i }));
    expect(onSearch).toHaveBeenCalledWith({});
  });

  it('shows clear button only when filters are active', () => {
    render(<SearchBar onSearch={vi.fn()} onClear={vi.fn()} />);
    expect(screen.queryByRole('button', { name: /clear/i })).not.toBeInTheDocument();

    fireEvent.change(screen.getByPlaceholderText('Make'), { target: { value: 'Ford' } });
    expect(screen.getByRole('button', { name: /clear/i })).toBeInTheDocument();
  });

  it('calls onClear and resets inputs when clear is clicked', () => {
    const onClear = vi.fn();
    render(<SearchBar onSearch={vi.fn()} onClear={onClear} />);

    fireEvent.change(screen.getByPlaceholderText('Make'), { target: { value: 'Ford' } });
    fireEvent.click(screen.getByRole('button', { name: /clear/i }));

    expect(onClear).toHaveBeenCalled();
    expect(screen.getByPlaceholderText('Make')).toHaveValue('');
  });
});
