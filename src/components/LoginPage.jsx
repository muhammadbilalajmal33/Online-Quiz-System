// ─── LoginPage Component ──────────────────────────────────────────────────────
import { useState } from "react";
import {
  doc,
  getDoc,
  setDoc,
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { db } from "../firebase.js";

export default function LoginPage({ onLogin }) {
  const [tab, setTab] = useState("login"); // "login" | "register"
  const [roleLogin, setRoleLogin] = useState("teacher");
  const [roleReg, setRoleReg] = useState("teacher");
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPw, setLoginPw] = useState("");
  const [regName, setRegName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPw, setRegPw] = useState("");
  const [msg, setMsg] = useState({ text: "", type: "" });
  const [loading, setLoading] = useState(false);

  const showMsg = (text, type) => setMsg({ text, type });

  const handleRegister = async () => {
    if (!regName) return showMsg("Please enter your full name.", "error");
    if (!regEmail || !regEmail.includes("@"))
      return showMsg("Please enter a valid email address.", "error");
    if (regPw.length < 6)
      return showMsg("Password must be at least 6 characters.", "error");

    setLoading(true);
    try {
      const snap = await getDoc(doc(db, "users", regEmail.toLowerCase()));
      if (snap.exists()) {
        showMsg("This email is already registered. Please sign in.", "error");
        setLoading(false);
        return;
      }
      const userData = {
        name: regName,
        email: regEmail.toLowerCase(),
        password: regPw,
        role: roleReg,
        createdAt: new Date().toISOString(),
      };
      await setDoc(doc(db, "users", regEmail.toLowerCase()), userData);
      showMsg("Account created! Redirecting...", "success");
      setTimeout(
        () => onLogin({ email: regEmail.toLowerCase(), name: regName, role: roleReg }),
        800
      );
    } catch (err) {
      showMsg("Error: " + err.message, "error");
    }
    setLoading(false);
  };

  const handleLogin = async () => {
    if (!loginEmail || !loginPw)
      return showMsg("Please fill in all fields.", "error");

    setLoading(true);
    try {
      const snap = await getDoc(doc(db, "users", loginEmail.toLowerCase()));
      if (!snap.exists()) {
        showMsg("No account found. Please register first.", "error");
        setLoading(false);
        return;
      }
      const user = snap.data();
      if (user.password !== loginPw) {
        showMsg("Incorrect password. Try again.", "error");
        setLoading(false);
        return;
      }
      showMsg("Welcome back! Redirecting...", "success");
      setTimeout(
        () => onLogin({ email: user.email, name: user.name, role: user.role }),
        800
      );
    } catch (err) {
      showMsg("Error: " + err.message, "error");
    }
    setLoading(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") tab === "login" ? handleLogin() : handleRegister();
  };

  const switchTab = (newTab) => {
    setTab(newTab);
    setMsg({ text: "", type: "" });
  };

  return (
    <div className="login-wrap" onKeyDown={handleKeyDown}>
      <div className="login-container">
        {/* Logo */}
        <div className="logo">
          <div className="logo-mark">
            <div className="logo-icon">⚡</div>
            QuizCloud
          </div>
          <div className="logo-sub">Cloud-Based Quiz Platform</div>
        </div>

        <div className="card">
          {/* Tab bar */}
          <div className="tab-bar">
            <button
              className={`tab ${tab === "login" ? "active" : ""}`}
              onClick={() => switchTab("login")}
            >
              Sign In
            </button>
            <button
              className={`tab ${tab === "register" ? "active" : ""}`}
              onClick={() => switchTab("register")}
            >
              Register
            </button>
          </div>

          {/* Role selector (shared layout) */}
          <RoleSelector
            selected={tab === "login" ? roleLogin : roleReg}
            onChange={tab === "login" ? setRoleLogin : setRoleReg}
          />

          {tab === "login" ? (
            <>
              <label>Email Address</label>
              <input
                type="email"
                placeholder="you@university.edu"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                autoComplete="email"
              />
              <label>Password</label>
              <input
                type="password"
                placeholder="••••••••"
                value={loginPw}
                onChange={(e) => setLoginPw(e.target.value)}
                autoComplete="current-password"
              />
              <button
                className="btn btn-primary"
                onClick={handleLogin}
                disabled={loading}
              >
                {loading ? "Signing in..." : "Sign In →"}
              </button>
            </>
          ) : (
            <>
              <label>Full Name</label>
              <input
                type="text"
                placeholder="Your full name"
                value={regName}
                onChange={(e) => setRegName(e.target.value)}
                autoComplete="name"
              />
              <label>Email Address</label>
              <input
                type="email"
                placeholder="you@university.edu"
                value={regEmail}
                onChange={(e) => setRegEmail(e.target.value)}
                autoComplete="email"
              />
              <label>Password</label>
              <input
                type="password"
                placeholder="Min. 6 characters"
                value={regPw}
                onChange={(e) => setRegPw(e.target.value)}
                autoComplete="new-password"
              />
              <button
                className="btn btn-primary"
                onClick={handleRegister}
                disabled={loading}
              >
                {loading ? "Creating account..." : "Create Account →"}
              </button>
            </>
          )}

          {msg.text && <div className={`msg ${msg.type}`}>{msg.text}</div>}
        </div>
      </div>
    </div>
  );
}

// ── Internal sub-component ────────────────────────────────────────────────────
function RoleSelector({ selected, onChange }) {
  return (
    <div className="role-select">
      {["teacher", "student"].map((r) => (
        <button
          key={r}
          className={`role-btn ${selected === r ? "active" : ""}`}
          onClick={() => onChange(r)}
        >
          <span className="role-icon">{r === "teacher" ? "👩‍🏫" : "🎓"}</span>
          {r.charAt(0).toUpperCase() + r.slice(1)}
        </button>
      ))}
    </div>
  );
}