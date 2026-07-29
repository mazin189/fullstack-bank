import { Routes, Route, Navigate } from "react-router-dom";
import { useContext } from "react";
import { AdminAuthContext } from "./context/AdminAuthContext.jsx";
import Header from "./components/Header.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Users from "./pages/Users.jsx";
import Cards from "./pages/Cards.jsx";
import Transactions from "./pages/Transactions.jsx";

export default function App() {
  const { admin, logout } = useContext(AdminAuthContext);
  return (
    <>
      {!admin ? (
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      ) : (
        <div>
          <Header onLogOut={logout} />
          <main className="w-full">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/users" element={<Users />} />
              <Route path="/cards" element={<Cards />} />
              <Route path="/transactions" element={<Transactions />} />
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </main>
        </div>
      )}
    </>
  );
}
