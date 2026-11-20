import { useEffect, useState } from "react";
import { collection, deleteDoc, doc, onSnapshot, updateDoc } from "firebase/firestore";
import { db } from "./firebase";
import { useAuth } from "./AuthContext";

const STATUSES = ["Want to Read", "Reading", "Finished"];

export default function MyBooks() {
  const { user } = useAuth();
  const [books, setBooks] = useState(null);
  const [error, setError] = useState("");
  const ref = (id) => doc(db, "users", user.uid, "books", id);

  useEffect(
    () =>
      onSnapshot(
        collection(db, "users", user.uid, "books"),
        (s) => setBooks(s.docs.map((d) => ({ id: d.id, ...d.data() }))),
        (e) => setError(e.message)
      ),
    [user.uid]
  );

  if (error) return <p role="alert" className="p-4 text-red-600">{error}</p>;
  if (!books) return <p className="p-4">Loading...</p>;
  if (!books.length) return <p className="p-4">No books yet. Search and save some!</p>;

  return (
    <ul className="max-w-2xl mx-auto p-4 space-y-3">
      {books.map((b) => (
        <li key={b.id} className="border rounded p-3 flex flex-wrap gap-2 items-center">
          <span className="font-semibold flex-1">{b.title} <span className="font-normal text-gray-600">— {b.author}</span></span>
          <select aria-label={`Status of ${b.title}`} value={b.status} className="input"
            onChange={(e) => updateDoc(ref(b.id), { status: e.target.value })}>
            {STATUSES.map((s) => <option key={s}>{s}</option>)}
          </select>
          <input aria-label={`Notes for ${b.title}`} placeholder="Notes" defaultValue={b.notes} className="input"
            onBlur={(e) => updateDoc(ref(b.id), { notes: e.target.value })} />
          <button onClick={() => deleteDoc(ref(b.id))} className="btn-accent">Delete</button>
        </li>
      ))}
    </ul>
  );
}