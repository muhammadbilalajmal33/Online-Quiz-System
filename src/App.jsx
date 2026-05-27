// ─── App Root ─────────────────────────────────────────────────────────────────
import { useState } from "react";
import CSS from "./styles.js";
import LoginPage from "./components/LoginPage.jsx";
import TeacherDashboard from "./pages/TeacherDashboard.jsx";
import StudentDashboard from "./pages/StudentDashboard.jsx";

export default function App() {
  const [session, setSession] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("qc_session") || "null");
    } catch {
      return null;
    }
  });

  const handleLogin = (sessionData) => {
    localStorage.setItem("qc_session", JSON.stringify(sessionData));
    setSession(sessionData);
  };

  const handleLogout = () => {
    localStorage.removeItem("qc_session");
    setSession(null);
  };

  return (
    <>
      <style>{CSS}</style>
      {!session && <LoginPage onLogin={handleLogin} />}
      {session?.role === "teacher" && (
        <TeacherDashboard session={session} onLogout={handleLogout} />
      )}
      {session?.role === "student" && (
        <StudentDashboard session={session} onLogout={handleLogout} />
      )}
    </>
  );
}
