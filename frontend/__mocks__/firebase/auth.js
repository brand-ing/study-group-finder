// __mocks__/firebase/auth.js

export const getAuth = jest.fn(() => "mockedAuthInstance");
export const signInWithEmailAndPassword = jest.fn();
export const GoogleAuthProvider = jest.fn();
export const signInWithPopup = jest.fn();
export const onAuthStateChanged = jest.fn();
export const signOut = jest.fn();

// Example mock implementation for `signInWithEmailAndPassword`
signInWithEmailAndPassword.mockImplementation((auth, email, password) => {
  if (email === "test@example.com" && password === "password123") {
    return Promise.resolve({
      user: {
        uid: "mockUserId",
        email: "test@example.com",
      },
    });
  } else {
    return Promise.reject(new Error("Invalid email or password"));
  }
});

// Example mock implementation for `signInWithPopup`
signInWithPopup.mockImplementation((auth, provider) => {
  if (provider instanceof GoogleAuthProvider) {
    return Promise.resolve({
      user: {
        uid: "mockGoogleUserId",
        email: "googleuser@example.com",
      },
    });
  } else {
    return Promise.reject(new Error("Invalid provider"));
  }
});
