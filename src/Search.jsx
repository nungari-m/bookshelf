import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { addDoc, collection } from "firebase/firestore";
import { db } from "./firebase";
import { useAuth } from "./AuthContext";

export default function Search() {
  const { user } = useAuth();
  const [q, setQ] = useState("");
  const [books, setBooks] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [msg, setMsg] = useState(useLocation().state?.msg ?? "");
  const input = useRef();

  useEffect(() => input.current.focus(), []);

  const search = async (e) => {
    e.preventDefault();
    if (!q.trim()) return setError("Type a title or author.");
    setLoading(true); setError(""); setMsg("");
    try {
      const res = await fetch(
        `https://openlibrary.org/search.json?limit=12&fields=key,title,author_name&q=${encodeURIComponent(q)}`
      );
      if (!res.ok) throw new Error("Search failed. Try again.");
      setBooks((await res.json()).docs);
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  const save = async (b) => {
    try {
      await addDoc(collection(db, "users", user.uid, "books"), {
        title: b.title,
        author: b.author_name?.[0] ?? "Unknown",
        status: "Want to Read",
        notes: "",
      });
      setMsg(`Saved "${b.title}"`);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <form onSubmit={search} className="flex gap-2">
        <input ref={input} aria-label="Search books" placeholder="Title or author" className="input flex-1"
          value={q} onChange={(e) => setQ(e.target.value)} />
        <button className="btn">Search</button>
      </form>
      {msg && <p role="status" className="text-green-700 mt-2">{msg}</p>}
      {error && <p role="alert" className="text-red-600 mt-2">{error}</p>}
      {loading && <p className="mt-2">Searching...</p>}
      {books?.length === 0 && <p className="mt-2">No books found.</p>}
      <ul className="mt-4 space-y-2">
        {books?.map((b) => (
          <li key={b.key} className="border rounded p-3 flex justify-between gap-2">
            <span>{b.title} <span className="text-gray-600">— {b.author_name?.[0] ?? "Unknown"}</span></span>
            <button onClick={() => save(b)} className="btn-accent">Save</button>
          </li>
        ))}
      </ul>
    </div>
  );
}