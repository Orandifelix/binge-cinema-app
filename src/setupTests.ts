import "@testing-library/jest-dom";
import { vi } from "vitest";

// Mock for firebase/auth so tests don’t use real Firebase
vi.mock("firebase/auth", () => {
  return {
    getAuth: () => ({ currentUser: null }),
    signInWithEmailAndPassword: vi.fn(),
    signOut: vi.fn(),
    onAuthStateChanged: vi.fn((auth, callback) => {
      // call callback with null user by default
      callback(null);
      return () => {}; // unsubscribe function
    }),
    GoogleAuthProvider: vi.fn(),
    createUserWithEmailAndPassword: vi.fn(),
  };
});

