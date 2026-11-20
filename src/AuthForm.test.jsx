import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import AuthForm from "./AuthForm";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";

vi.mock("./firebase", () => ({ auth: {}, google: {} }));
vi.mock("firebase/auth", () => ({
  signInWithEmailAndPassword: vi.fn(() => Promise.resolve()),
  createUserWithEmailAndPassword: vi.fn(() => Promise.resolve()),
  signInWithPopup: vi.fn(() => Promise.resolve()),
}));

const fill = (email, password) => {
  fireEvent.change(screen.getByLabelText("Email"), { target: { value: email } });
  fireEvent.change(screen.getByLabelText("Password"), { target: { value: password } });
};

test("validates input", () => {
  render(<MemoryRouter><AuthForm /></MemoryRouter>);
  fill("bad", "123");
  fireEvent.click(screen.getByRole("button", { name: "Login" }));
  expect(screen.getByRole("alert")).toHaveTextContent(/valid email/i);
});

test("logs in with valid input", async () => {
  render(<MemoryRouter><AuthForm /></MemoryRouter>);
  fill("a@b.com", "secret1");
  fireEvent.click(screen.getByRole("button", { name: "Login" }));
  await waitFor(() => expect(signInWithEmailAndPassword).toHaveBeenCalled());
});

test("registers with valid input", async () => {
  render(<MemoryRouter><AuthForm register /></MemoryRouter>);
  fill("a@b.com", "secret1");
  fireEvent.click(screen.getByRole("button", { name: "Register" }));
  await waitFor(() => expect(createUserWithEmailAndPassword).toHaveBeenCalled());
});