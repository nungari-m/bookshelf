import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Search from "./Search";
import { addDoc } from "firebase/firestore";

vi.mock("./firebase", () => ({ db: {} }));
vi.mock("./AuthContext", () => ({ useAuth: () => ({ user: { uid: "u1" } }) }));
vi.mock("firebase/firestore", () => ({
  addDoc: vi.fn(() => Promise.resolve()),
  collection: vi.fn(),
}));

const setup = () => render(<MemoryRouter><Search /></MemoryRouter>);
const search = (text) => {
  fireEvent.change(screen.getByLabelText("Search books"), { target: { value: text } });
  fireEvent.click(screen.getByRole("button", { name: "Search" }));
};

test("asks for a query when empty", () => {
  setup();
  fireEvent.click(screen.getByRole("button", { name: "Search" }));
  expect(screen.getByRole("alert")).toHaveTextContent(/title or author/i);
});

test("shows results and saves a book", async () => {
  global.fetch = vi.fn(() =>
    Promise.resolve({
      ok: true,
      json: () => Promise.resolve({ docs: [{ key: "1", title: "Dune", author_name: ["Frank Herbert"] }] }),
    })
  );
  setup();
  search("dune");
  fireEvent.click(await screen.findByRole("button", { name: "Save" }));
  expect(await screen.findByRole("status")).toHaveTextContent("Saved");
  expect(addDoc).toHaveBeenCalled();
});

test("shows empty state", async () => {
  global.fetch = vi.fn(() => Promise.resolve({ ok: true, json: () => Promise.resolve({ docs: [] }) }));
  setup();
  search("zzzz");
  expect(await screen.findByText("No books found.")).toBeInTheDocument();
});

test("shows an error when the API fails", async () => {
  global.fetch = vi.fn(() => Promise.resolve({ ok: false }));
  setup();
  search("dune");
  expect(await screen.findByRole("alert")).toHaveTextContent(/failed/i);
});