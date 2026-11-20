import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import { useAuth } from "./AuthContext";

vi.mock("./AuthContext", () => ({ useAuth: vi.fn() }));

const setup = () =>
  render(
    <MemoryRouter initialEntries={["/"]}>
      <Routes>
        <Route path="/login" element={<p>Login page</p>} />
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<p>Private page</p>} />
        </Route>
      </Routes>
    </MemoryRouter>
  );

test("redirects to login when signed out", () => {
  useAuth.mockReturnValue({ user: null, loading: false });
  setup();
  expect(screen.getByText("Login page")).toBeInTheDocument();
});

test("shows the private page when signed in", () => {
  useAuth.mockReturnValue({ user: { uid: "u1" }, loading: false });
  setup();
  expect(screen.getByText("Private page")).toBeInTheDocument();
});

test("shows loading while auth is checked", () => {
  useAuth.mockReturnValue({ user: null, loading: true });
  setup();
  expect(screen.getByText("Loading...")).toBeInTheDocument();
});