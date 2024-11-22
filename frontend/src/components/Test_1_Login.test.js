/**
 * @jest-environment jsdom
 */
import React from "react";
import { render, fireEvent, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Login from "./Login";
import '@testing-library/jest-dom';
import { auth } from "./firebaseConfig"; // Ensure this matches your actual config path
import { signInWithEmailAndPassword } from "firebase/auth";

// Import mocks globally
jest.mock("firebase/auth");
jest.mock("firebase/firestore");

// Mock react-router-dom's useNavigate
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: jest.fn(),
}));

describe("Login Component", () => {
  const mockNavigate = jest.fn();

  beforeEach(() => {
    // Reset mockNavigate before each test
    require("react-router-dom").useNavigate.mockReturnValue(mockNavigate);
    jest.clearAllMocks(); // Reset all mock calls
  });

  test("should log in successfully and redirect to dashboard", async () => {
    // Set up global mock response for signInWithEmailAndPassword
    signInWithEmailAndPassword.mockResolvedValueOnce({
      user: { uid: "test-uid" },
    });

    // Mock Firestore document to indicate the user profile is completed
    const { getDoc } = require("firebase/firestore");
    getDoc.mockResolvedValueOnce({
      exists: () => true,
      data: () => ({ profileCompleted: true }),
    });

    // Render the Login component
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    // Simulate user input
    fireEvent.change(screen.getByPlaceholderText("Email"), {
      target: { value: "r1test1@sprint5.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("Password"), {
      target: { value: "Password123!" },
    });

    // Simulate form submission
    fireEvent.click(screen.getByRole("button", { name: /log in/i }));

    // Wait for the login function to be called
    await waitFor(() => {
      expect(signInWithEmailAndPassword).toHaveBeenCalledWith(
        auth,
        "r1test1@sprint5.com",
        "Password123!"
      );
    });

    // Verify navigation to dashboard
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith("/dashboard");
    });
  });

  test("should display an error message for invalid credentials", async () => {
    // Set up global mock response for failed login
    signInWithEmailAndPassword.mockRejectedValueOnce({
      message: "Invalid email or password",
    });

    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    // Simulate user input
    fireEvent.change(screen.getByPlaceholderText("Email"), {
      target: { value: "r1test1@sprint5.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("Password"), {
      target: { value: "wrongpassword" },
    });

    // Simulate form submission
    fireEvent.click(screen.getByRole("button", { name: /log in/i }));

    // Wait for the error message to appear
    await waitFor(() =>
      expect(screen.getByText("Invalid email or password")).toBeInTheDocument()
    );

    // Ensure navigation does not occur
    expect(mockNavigate).not.toHaveBeenCalled();
  });
});
