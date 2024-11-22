/**
 * @jest-environment jsdom
 */
import React from "react";
import { render, fireEvent, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import Login from "./Login"; // Import the Login component
import { auth } from "./firebaseConfig";

// Mock Firebase auth methods
jest.mock("firebase/auth", () => ({
  signInWithEmailAndPassword: jest.fn(),
  getAuth: jest.fn(),
  GoogleAuthProvider: jest.fn(),
}));

// Mock useNavigate from react-router-dom
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: jest.fn(),
}));

describe("Login Component", () => {
  const mockNavigate = jest.fn();

  beforeEach(() => {
    require("react-router-dom").useNavigate.mockReturnValue(mockNavigate);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("should log in successfully and redirect to dashboard", async () => {
    // Mock successful login
    signInWithEmailAndPassword.mockResolvedValueOnce({
      user: { uid: "test-uid" },
    });

    // Mock Firestore user document
    jest.mock("firebase/firestore", () => ({
      doc: jest.fn(),
      getDoc: jest.fn().mockResolvedValueOnce({
        exists: () => true,
        data: () => ({ profileCompleted: true }),
      }),
      setDoc: jest.fn(),
    }));

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

    // Wait for the asynchronous operation
    await waitFor(() => expect(signInWithEmailAndPassword).toHaveBeenCalled());

    // Verify navigation to dashboard
    await waitFor(() =>
      expect(mockNavigate).toHaveBeenCalledWith("/dashboard")
    );
  });
});
