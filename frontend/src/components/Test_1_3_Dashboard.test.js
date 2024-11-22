/**
 * @jest-environment jsdom
 */
import React from 'react';
import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import Dashboard from './Dashboard';
import '@testing-library/jest-dom';
import { onAuthStateChanged, signOut } from 'firebase/auth';

// Mock firebase/auth
jest.mock('firebase/auth', () => ({
  ...jest.requireActual('firebase/auth'),
  onAuthStateChanged: jest.fn(),
  signOut: jest.fn(),
}));

// Mock firebase/firestore
jest.mock('firebase/firestore', () => ({
  ...jest.requireActual('firebase/firestore'),
  onSnapshot: jest.fn(),
}));

// Mock react-router-dom
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

describe('Dashboard Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    // Mock onAuthStateChanged
    onAuthStateChanged.mockImplementation((authInstance, callback) => {
      callback({ uid: 'test-uid', email: 'test@example.com' });
      return jest.fn(); // Return an unsubscribe function
    });

    // Mock signOut
    signOut.mockResolvedValue();

    // Mock onSnapshot
    require('firebase/firestore').onSnapshot.mockImplementation(() => {
      // Return an unsubscribe function
      return jest.fn();
    });
  });

  test('should log out successfully and redirect to login', async () => {
    // Render the Dashboard component
    render(<Dashboard />);

    // Wait for the profile box to appear
    await waitFor(() => {
      expect(screen.getByTestId('profile-box')).toBeInTheDocument();
    });

    // Simulate clicking on the profile box to show the dropdown
    fireEvent.click(screen.getByTestId('profile-box'));

    // Wait for the 'Sign Out' button to appear
    await waitFor(() => {
      expect(screen.getByTestId('sign-out-button')).toBeInTheDocument();
    });

    // Simulate clicking the 'Sign Out' button
    fireEvent.click(screen.getByTestId('sign-out-button'));

    // Wait for signOut to be called
    await waitFor(() => {
      expect(signOut).toHaveBeenCalled();
    });

    // Verify navigation to login page
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/login');
    });
  });
});
