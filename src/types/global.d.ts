/// <reference types="@testing-library/jest-dom" />

// Add type declarations for Jest matchers
declare global {
  namespace jest {
    interface Matchers<R> {
      toBeInTheDocument(): R;
      toHaveAttribute(attr: string, value?: string): R;
    }
  }
}

export {};
