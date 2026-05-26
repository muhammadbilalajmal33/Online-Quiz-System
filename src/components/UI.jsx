// ─── Shared UI Components ─────────────────────────────────────────────────────

// Toast notification
export function Toast({ toast }) {
  return (
    <div className={`toast ${toast.show ? "show" : ""} ${toast.type}`}>
      {toast.msg}
    </div>
  );
}

// Loading indicator
export function LoadingState() {
  return (
    <div
      style={{
        textAlign: "center",
        padding: "40px",
        color: "var(--muted)",
        fontFamily: "'Space Mono', monospace",
      }}
    >
      Loading...
    </div>
  );
}

// Empty state placeholder
export function EmptyState({ icon, title, subtitle }) {
  return (
    <div className="empty-state">
      <div className="empty-icon">{icon}</div>
      <div className="empty-text">{title}</div>
      {subtitle && <div className="empty-sub">{subtitle}</div>}
    </div>
  );
}

// Stat summary card
export function StatCard({ value, label, color }) {
  return (
    <div className="stat-card">
      <div className="stat-val" style={color ? { color } : {}}>
        {value}
      </div>
      <div className="stat-lbl">{label}</div>
    </div>
  );
}

// Status badge
export function Badge({ status, label }) {
  return <span className={`badge badge-${status}`}>{label ?? status}</span>;
}

// Sidebar shared by Teacher and Student dashboards
export function Sidebar({ session, role, navItems, activeSection, onNav, onLogout }) {
  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <div className="logo-icon">⚡</div>
        QuizCloud
      </div>
      <div className="sidebar-user">
        <div className="avatar">{session.name[0].toUpperCase()}</div>
        <div>
          <div className="avatar-name">{session.name}</div>
          <div className="avatar-role">{role}</div>
        </div>
      </div>
      <nav className="nav-links">
        {navItems.map(({ key, icon, label }) => (
          <button
            key={key}
            className={`nav-link ${activeSection === key ? "active" : ""}`}
            onClick={() => onNav(key)}
          >
            <span className="nav-icon">{icon}</span>
            {label}
          </button>
        ))}
      </nav>
      <button className="logout-btn" onClick={onLogout}>
        <span className="nav-icon">🚪</span>
        Logout
      </button>
    </aside>
  );
}