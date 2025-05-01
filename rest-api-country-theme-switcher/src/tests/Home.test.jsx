import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { vi, describe, it, beforeEach, afterEach, expect } from "vitest";
import Home from "../pages/Home";
import { useTheme } from "../context/ThemeContext";
import { MemoryRouter } from "react-router-dom";

// ✅ Mock ThemeContext
vi.mock("../context/ThemeContext", () => ({
  useTheme: vi.fn(),
}));

// ✅ Mock CountryCard to avoid complex rendering issues
vi.mock("../components/CountryCard", () => ({
  default: ({ title }) => <div>{title}</div>,
}));

// ✅ Mock Country data
const mockCountries = [
  {
    name: { common: "Botswana" },
    region: "Africa",
    population: 2351625,
    capital: ["Gaborone"],
    flags: { png: "botswana.png" },
  },
  {
    name: { common: "Brazil" },
    region: "Americas",
    population: 212559409,
    capital: ["Brasília"],
    flags: { png: "brazil.png" },
  },
];

describe("Home component", () => {
  beforeEach(() => {
    // Mock useTheme return value
    useTheme.mockReturnValue({
      theme: "light",
      toggleTheme: vi.fn(),
    });

    // Mock fetch globally
    global.fetch = vi.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve(mockCountries),
      })
    );
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("renders header and theme toggle button", () => {
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );

    expect(screen.getByText("Where in the world?")).toBeInTheDocument();
    expect(screen.getByLabelText("Switch to dark mode")).toBeInTheDocument();
  });

  it("calls toggleTheme on button click", () => {
    const mockToggle = vi.fn();
    useTheme.mockReturnValueOnce({
      theme: "light",
      toggleTheme: mockToggle,
    });

    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByLabelText("Switch to dark mode"));
    expect(mockToggle).toHaveBeenCalled();
  });

  it("fetches and displays countries", async () => {
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText("Botswana")).toBeInTheDocument();
      expect(screen.getByText("Brazil")).toBeInTheDocument();
    });
  });

  it("filters countries by search query", async () => {
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );

    await screen.findByText("Botswana");

    fireEvent.change(screen.getByLabelText(/Search for a country/i), {
      target: { value: "Brazil" },
    });

    expect(screen.queryByText("Botswana")).not.toBeInTheDocument();
    expect(screen.getByText("Brazil")).toBeInTheDocument();
  });

  it("handles fetch failure gracefully", async () => {
    global.fetch = vi.fn(() => Promise.reject(new Error("Fetch failed")));

    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );

    // Confirm UI still loads even if fetch fails
    await waitFor(() => {
      expect(screen.getByText("Where in the world?")).toBeInTheDocument();
    });
  });
});
