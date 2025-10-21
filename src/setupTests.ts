import "@testing-library/jest-dom";
import { vi } from "vitest";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render } from "@testing-library/react";
import React from "react";

// 🧹 Silence Firebase warnings in test logs
vi.stubGlobal("console", {
  ...console,
  warn: vi.fn(),
  error: vi.fn(),
});

// 🧑‍💻 Default mock user
const mockUser = {
  uid: "test-user-id",
  email: "test@example.com",
  displayName: "Test User",
};

// ✅ Mock Firebase Auth
vi.mock("firebase/auth", () => {
  return {
    getAuth: () => ({ currentUser: mockUser }),
    signInWithEmailAndPassword: vi.fn(),
    signOut: vi.fn(),
    onAuthStateChanged: vi.fn((auth, callback) => {
      // Simulate authenticated user
      callback(mockUser);
      return () => {};
    }),
    GoogleAuthProvider: vi.fn(),
    createUserWithEmailAndPassword: vi.fn(),
  };
});

// ✅ Global render helper with React Query Provider
const queryClient = new QueryClient();

global.renderWithClient = (ui: React.ReactElement) => {
  return render(
    React.createElement(
      QueryClientProvider,
      { client: queryClient },
      ui
    )
  );
};

