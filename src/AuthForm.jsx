import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";
import { auth, google } from "./firebase";

// One form for both Login and Register
export default function AuthForm({ register }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const nav = useNavigate();
  const msg = useLocation().state?.msg;

  const run = async (action) => {
    try {
      await action();
      nav("/", { state: { msg: register ? "Account created!" : "Welcome!" } });
    } catch (e) {
      setError(e.message);
    }
  };

  const submit = (e) => {
    e.preventDefault();
    if (!/\S+@\S+\.\S+/.test(email) || password.length < 6)
      return setError("Enter a valid email and a password of at least 6 characters.");
    run(() =>
      (register ? createUserWithEmailAndPassword : signInWithEmailAndPassword)(auth, email, password)
    );
  };

  return (
    <form noValidate onSubmit={submit} className="max-w-sm mx-auto p-4 space-y-3">
      <h1 className="text-2xl font-bold text-blue-700">{register ? "Register" : "Login"}</h1>
      {msg && <p role="status" className="text-green-700">{msg}</p>}
      {error && <p role="alert" className="text-red-600">{error}</p>}
      <label className="block">Email
        <input type="email" className="input w-full" value={email} onChange={(e) => setEmail(e.target.value)} />
      </label>
      <label className="block">Password
        <input type="password" className="input w-full" value={password} onChange={(e) => setPassword(e.target.value)} />
      </label>
      <button className="btn w-full">{register ? "Register" : "Login"}</button>
      <button type="button" className="btn-accent w-full" onClick={() => run(() => signInWithPopup(auth, google))}>
        Sign in with Google
      </button>
      <Link className="block text-blue-700 underline" to={register ? "/login" : "/register"}>
        {register ? "Have an account? Login" : "Need an account? Register"}
      </Link>
    </form>
  );
}