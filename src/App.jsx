import { BrowserRouter, Link, Route, Routes, useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "./firebase";
import { AuthProvider, useAuth } from "./AuthContext";
import ProtectedRoute from "./ProtectedRoute";
import AuthForm from "./AuthForm";

function Nav() {
  const { user } = useAuth();
  const nav = useNavigate();
  if (!user) return null;
  const logout = () => {
    nav("/login", { state: { msg: "You have been logged out." } });
    signOut(auth);
  };
  return (
    <nav className="bg-blue-600 text-white p-3 flex gap-4 items-center">
      <b className="flex-1">📚 BookShelf</b>
      <Link to="/">Search</Link>
      <button onClick={logout}>Logout</button>
    </nav>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Nav />
        <Routes>
          <Route path="/login" element={<AuthForm />} />
          <Route path="/register" element={<AuthForm register />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<p className="p-4">Search coming soon</p>} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}