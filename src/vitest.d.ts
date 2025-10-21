import "@testing-library/react";
import React from "react";

declare global {
  var renderWithClient: (ui: React.ReactElement) => ReturnType<typeof import("@testing-library/react").render>;
}

export {};
