// __mocks__/firebase/firestore.js

export const doc = jest.fn();
export const getDoc = jest.fn();
export const setDoc = jest.fn();
export const getFirestore = jest.fn(() => "mockedFirestoreInstance");
export const collection = jest.fn();
export const query = jest.fn();
export const where = jest.fn();
export const getDocs = jest.fn();
export const addDoc = jest.fn();
export const onSnapshot = jest.fn();

// Example mock behavior for `getDoc`
getDoc.mockImplementation((docRef) => {
  // Mocking a Firestore document with specific data
  return Promise.resolve({
    exists: () => true,
    data: () => ({ profileCompleted: true }), // Modify this as needed
  });
});
