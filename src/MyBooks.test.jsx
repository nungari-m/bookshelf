import { fireEvent, render, screen } from "@testing-library/react";
import MyBooks from "./MyBooks";
import { deleteDoc, onSnapshot, updateDoc } from "firebase/firestore";

vi.mock("./firebase", () => ({ db: {} }));
vi.mock("./AuthContext", () => ({ useAuth: () => ({ user: { uid: "u1" } }) }));
vi.mock("firebase/firestore", () => ({
  collection: vi.fn(),
  doc: vi.fn(),
  updateDoc: vi.fn(),
  deleteDoc: vi.fn(),
  onSnapshot: vi.fn(),
}));

const book = { id: "1", data: () => ({ title: "Dune", author: "Herbert", status: "Reading", notes: "" }) };

test("shows empty state", () => {
  onSnapshot.mockImplementation((_, ok) => { ok({ docs: [] }); return () => {}; });
  render(<MyBooks />);
  expect(screen.getByText(/no books yet/i)).toBeInTheDocument();
});

test("shows an error", () => {
  onSnapshot.mockImplementation((_, __, fail) => { fail(new Error("boom")); return () => {}; });
  render(<MyBooks />);
  expect(screen.getByRole("alert")).toHaveTextContent("boom");
});

test("updates status, notes and deletes", () => {
  onSnapshot.mockImplementation((_, ok) => { ok({ docs: [book] }); return () => {}; });
  render(<MyBooks />);
  fireEvent.change(screen.getByLabelText(/status of dune/i), { target: { value: "Finished" } });
  fireEvent.blur(screen.getByLabelText(/notes for dune/i), { target: { value: "Great" } });
  fireEvent.click(screen.getByRole("button", { name: "Delete" }));
  expect(updateDoc).toHaveBeenCalledTimes(2);
  expect(deleteDoc).toHaveBeenCalled();
});