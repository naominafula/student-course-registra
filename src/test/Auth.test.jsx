import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import Login from "../Pages/Login";

// Mock the Auth Context
vi.mock("../context/AuthContext", () => ({
  useAuth: () => ({
    loginWithGoogle: vi.fn()
  })
}));

// Mock React Router Navigation
vi.mock("react-router-dom", () => ({
  useNavigate: () => vi.fn()
}));

describe("Authentication Screen Verification", () => {
  it("renders login interactive prompts cleanly", () => {
    render(<Login />);
    expect(screen.getByText("EduReg Portal")).toBeInTheDocument();
    expect(screen.getByText("Continue with Google")).toBeInTheDocument();
  });
});