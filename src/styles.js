// ─── Global CSS Styles ────────────────────────────────────────────────────────
const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&family=Syne:wght@400;700;800&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg: #0a0a0f;
    --surface: #13131c;
    --surface2: #1a1a27;
    --border: #2a2a3d;
    --accent: #7c5cfc;
    --accent2: #fc5c7d;
    --text: #e8e8f0;
    --muted: #6b6b85;
    --success: #4ecca3;
    --warn: #f5a623;
  }

  body {
    font-family: 'Syne', sans-serif;
    background: var(--bg);
    color: var(--text);
    min-height: 100vh;
  }

  /* ── Login ── */
  .login-wrap {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 16px;
  }
  .login-container { width: 100%; max-width: 440px; }
  .logo { text-align: center; margin-bottom: 36px; }
  .logo-mark {
    display: inline-flex; align-items: center; gap: 10px;
    font-weight: 800; font-size: 28px; letter-spacing: -0.5px;
  }
  .logo-icon {
    width: 44px; height: 44px;
    background: linear-gradient(135deg, var(--accent), var(--accent2));
    border-radius: 12px; display: flex; align-items: center;
    justify-content: center; font-size: 20px;
  }
  .logo-sub {
    font-family: 'Space Mono', monospace; font-size: 11px;
    color: var(--muted); margin-top: 6px; letter-spacing: 3px; text-transform: uppercase;
  }
  .card {
    background: var(--surface); border: 1px solid var(--border);
    border-radius: 20px; padding: 36px;
    box-shadow: 0 0 60px rgba(124,92,252,0.08);
  }
  .tab-bar {
    display: flex; background: var(--bg); border-radius: 12px;
    padding: 4px; margin-bottom: 28px; border: 1px solid var(--border);
  }
  .tab {
    flex: 1; padding: 10px; text-align: center;
    font-family: 'Space Mono', monospace; font-size: 13px;
    color: var(--muted); cursor: pointer; border-radius: 9px;
    transition: all 0.2s; border: none; background: transparent;
  }
  .tab.active { background: var(--accent); color: #fff; font-weight: 700; }
  .role-select { display: flex; gap: 12px; margin-bottom: 24px; }
  .role-btn {
    flex: 1; padding: 14px; border: 2px solid var(--border);
    border-radius: 12px; background: transparent; color: var(--muted);
    cursor: pointer; font-family: 'Syne', sans-serif; font-size: 14px;
    font-weight: 700; transition: all 0.2s; text-align: center;
  }
  .role-btn .role-icon { display: block; font-size: 24px; margin-bottom: 4px; }
  .role-btn:hover { border-color: var(--accent); color: var(--text); }
  .role-btn.active {
    border-color: var(--accent);
    background: rgba(124,92,252,0.12); color: var(--accent);
  }
  label {
    display: block; font-family: 'Space Mono', monospace; font-size: 11px;
    color: var(--muted); letter-spacing: 1.5px; text-transform: uppercase; margin-bottom: 6px;
  }
  input, textarea, select {
    width: 100%; padding: 14px 16px;
    background: var(--bg); border: 1px solid var(--border);
    border-radius: 10px; color: var(--text);
    font-family: 'Space Mono', monospace; font-size: 14px;
    outline: none; transition: border-color 0.2s, box-shadow 0.2s;
    margin-bottom: 18px;
  }
  input:focus, textarea:focus, select:focus {
    border-color: var(--accent); box-shadow: 0 0 0 3px rgba(124,92,252,0.15);
  }
  textarea { resize: vertical; min-height: 72px; }
  select { cursor: pointer; }
  .btn {
    padding: 13px 20px; border: none; border-radius: 12px;
    font-family: 'Syne', sans-serif; font-weight: 800; font-size: 14px;
    cursor: pointer; transition: all 0.2s; letter-spacing: 0.5px;
  }
  .btn:disabled { opacity: 0.5; cursor: not-allowed; transform: none !important; }
  .btn-primary {
    background: linear-gradient(135deg, var(--accent), #9b6dff); color: #fff; width: 100%;
    margin-top: 4px;
  }
  .btn-primary:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(124,92,252,0.35); }
  .btn-secondary {
    background: var(--surface2); color: var(--text); border: 1px solid var(--border);
  }
  .btn-secondary:hover:not(:disabled) { border-color: var(--accent); }
  .btn-danger { background: rgba(252,92,125,0.15); color: var(--accent2); border: 1px solid rgba(252,92,125,0.3); }
  .btn-danger:hover:not(:disabled) { background: rgba(252,92,125,0.25); }
  .btn-success { background: rgba(78,204,163,0.15); color: var(--success); border: 1px solid rgba(78,204,163,0.3); }
  .btn-success:hover:not(:disabled) { background: rgba(78,204,163,0.25); }
  .btn-sm { padding: 7px 14px; font-size: 12px; border-radius: 8px; width: auto; margin-top: 0; }
  .msg {
    margin-top: 12px; padding: 12px 16px; border-radius: 10px;
    font-family: 'Space Mono', monospace; font-size: 13px; line-height: 1.5;
  }
  .msg.error { background: rgba(252,92,125,0.12); border: 1px solid rgba(252,92,125,0.3); color: var(--accent2); }
  .msg.success { background: rgba(78,204,163,0.12); border: 1px solid rgba(78,204,163,0.3); color: var(--success); }

  /* ── Dashboard layout ── */
  .dashboard { display: flex; min-height: 100vh; }
  .sidebar {
    width: 240px; background: var(--surface); border-right: 1px solid var(--border);
    display: flex; flex-direction: column; padding: 24px 16px; flex-shrink: 0;
    position: sticky; top: 0; height: 100vh; overflow-y: auto;
  }
  .sidebar-logo {
    display: flex; align-items: center; gap: 10px;
    font-weight: 800; font-size: 18px; padding: 0 8px; margin-bottom: 32px;
  }
  .sidebar-logo .logo-icon { width: 34px; height: 34px; font-size: 16px; border-radius: 8px; }
  .sidebar-user {
    display: flex; align-items: center; gap: 10px; padding: 12px;
    background: var(--bg); border-radius: 12px; margin-bottom: 24px;
    border: 1px solid var(--border);
  }
  .avatar {
    width: 36px; height: 36px; border-radius: 50%;
    background: linear-gradient(135deg, var(--accent), var(--accent2));
    display: flex; align-items: center; justify-content: center;
    font-weight: 800; font-size: 14px; flex-shrink: 0;
  }
  .avatar-name { font-weight: 700; font-size: 13px; }
  .avatar-role { font-family: 'Space Mono', monospace; font-size: 10px; color: var(--muted); text-transform: uppercase; letter-spacing: 1px; }
  .nav-links { display: flex; flex-direction: column; gap: 4px; flex: 1; }
  .nav-link {
    display: flex; align-items: center; gap: 10px; padding: 11px 14px;
    border-radius: 10px; font-weight: 700; font-size: 14px;
    color: var(--muted); cursor: pointer; transition: all 0.2s;
    border: none; background: transparent; text-align: left; width: 100%;
  }
  .nav-link:hover { color: var(--text); background: var(--surface2); }
  .nav-link.active { color: var(--accent); background: rgba(124,92,252,0.1); }
  .nav-icon { font-size: 16px; width: 20px; text-align: center; }
  .logout-btn {
    display: flex; align-items: center; gap: 10px; padding: 11px 14px;
    border-radius: 10px; font-weight: 700; font-size: 14px;
    color: var(--muted); cursor: pointer; transition: all 0.2s;
    border: none; background: transparent; width: 100%; margin-top: 8px;
  }
  .logout-btn:hover { color: var(--accent2); background: rgba(252,92,125,0.08); }
  .main { flex: 1; padding: 32px; overflow-y: auto; min-height: 100vh; }
  .section-header { margin-bottom: 24px; }
  .section-title { font-size: 24px; font-weight: 800; }
  .section-sub { font-family: 'Space Mono', monospace; font-size: 12px; color: var(--muted); margin-top: 4px; }

  /* ── Stats ── */
  .stats-grid {
    display: grid; grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    gap: 16px; margin-bottom: 28px;
  }
  .stat-card {
    background: var(--surface); border: 1px solid var(--border);
    border-radius: 14px; padding: 18px;
  }
  .stat-val { font-size: 28px; font-weight: 800; margin-bottom: 4px; }
  .stat-lbl { font-family: 'Space Mono', monospace; font-size: 11px; color: var(--muted); text-transform: uppercase; letter-spacing: 1px; }

  /* ── Quiz cards ── */
  .quiz-card {
    background: var(--surface); border: 1px solid var(--border);
    border-radius: 14px; padding: 18px; display: flex;
    align-items: center; justify-content: space-between; gap: 16px;
    margin-bottom: 12px; transition: border-color 0.2s;
  }
  .quiz-card:hover { border-color: rgba(124,92,252,0.3); }
  .quiz-meta { flex: 1; min-width: 0; }
  .quiz-name { font-size: 15px; font-weight: 800; margin-bottom: 8px; }
  .quiz-info {
    display: flex; flex-wrap: wrap; gap: 8px;
    font-family: 'Space Mono', monospace; font-size: 11px; color: var(--muted);
  }
  .quiz-actions { display: flex; gap: 8px; flex-shrink: 0; }
  .badge {
    display: inline-block; padding: 2px 8px; border-radius: 6px;
    font-family: 'Space Mono', monospace; font-size: 10px; font-weight: 700;
    text-transform: uppercase; letter-spacing: 0.5px;
  }
  .badge-active { background: rgba(78,204,163,0.15); color: var(--success); border: 1px solid rgba(78,204,163,0.3); }
  .badge-draft { background: rgba(245,166,35,0.15); color: var(--warn); border: 1px solid rgba(245,166,35,0.3); }
  .badge-closed { background: rgba(252,92,125,0.12); color: var(--accent2); border: 1px solid rgba(252,92,125,0.2); }

  /* ── Modal ── */
  .modal-overlay {
    position: fixed; inset: 0; background: rgba(0,0,0,0.7);
    display: flex; align-items: center; justify-content: center;
    z-index: 1000; padding: 20px; backdrop-filter: blur(4px);
  }
  .modal {
    background: var(--surface); border: 1px solid var(--border);
    border-radius: 20px; padding: 32px; width: 100%; max-width: 600px;
    max-height: 85vh; overflow-y: auto;
    box-shadow: 0 20px 60px rgba(0,0,0,0.5);
  }
  .modal-title { font-size: 20px; font-weight: 800; margin-bottom: 24px; }
  .modal-footer { display: flex; gap: 12px; margin-top: 24px; flex-wrap: wrap; }

  /* ── Question builder ── */
  .question-block {
    background: var(--bg); border: 1px solid var(--border);
    border-radius: 12px; padding: 18px; margin-bottom: 14px;
  }
  .q-number {
    font-family: 'Space Mono', monospace; font-size: 11px;
    color: var(--accent); letter-spacing: 1px; text-transform: uppercase; margin-bottom: 12px;
  }
  .option-row { display: flex; align-items: center; gap: 10px; margin-bottom: 8px; }
  .option-row input[type="radio"] { width: auto; margin: 0; cursor: pointer; accent-color: var(--success); }
  .option-row input[type="text"] { margin: 0; flex: 1; }

  /* ── Quiz attempt ── */
  .timer-bar {
    display: flex; justify-content: space-between; align-items: center;
    background: var(--surface); border: 1px solid var(--border);
    border-radius: 14px; padding: 16px 20px; margin-bottom: 16px;
  }
  .timer-display {
    font-family: 'Space Mono', monospace; font-size: 22px; font-weight: 700;
    color: var(--success);
  }
  .timer-display.warn { color: var(--warn); }
  .timer-display.danger { color: var(--accent2); animation: blink 0.8s infinite; }
  @keyframes blink { 50% { opacity: 0.4; } }
  .progress-track {
    height: 4px; background: var(--border); border-radius: 2px; margin-bottom: 24px; overflow: hidden;
  }
  .progress-fill {
    height: 100%; background: linear-gradient(90deg, var(--accent), var(--accent2));
    border-radius: 2px; transition: width 0.4s ease;
  }
  .attempt-q {
    background: var(--surface); border: 1px solid var(--border);
    border-radius: 14px; padding: 20px; margin-bottom: 16px;
  }
  .q-num { font-family: 'Space Mono', monospace; font-size: 11px; color: var(--muted); margin-bottom: 10px; }
  .q-text { font-size: 16px; font-weight: 700; margin-bottom: 16px; line-height: 1.5; }
  .opt-btn {
    width: 100%; padding: 12px 16px; text-align: left;
    background: var(--bg); border: 1px solid var(--border);
    border-radius: 10px; color: var(--text);
    font-family: 'Space Mono', monospace; font-size: 13px;
    cursor: pointer; transition: all 0.15s; margin-bottom: 8px; display: block;
  }
  .opt-btn:hover { border-color: var(--accent); color: var(--accent); background: rgba(124,92,252,0.06); }
  .opt-btn.selected { border-color: var(--accent); background: rgba(124,92,252,0.12); color: var(--accent); }

  /* ── Result screen ── */
  .result-wrap { text-align: center; max-width: 500px; margin: 0 auto; padding-top: 20px; }
  .result-icon { font-size: 56px; margin-bottom: 16px; }
  .result-title { font-size: 28px; font-weight: 800; margin-bottom: 8px; }
  .result-sub { font-family: 'Space Mono', monospace; font-size: 13px; color: var(--muted); margin-bottom: 28px; }
  .score-ring {
    width: 130px; height: 130px; border-radius: 50%; margin: 0 auto 28px;
    display: flex; flex-direction: column; align-items: center; justify-content: center;
    border: 4px solid;
  }
  .score-ring.pass { border-color: var(--success); background: rgba(78,204,163,0.08); }
  .score-ring.fail { border-color: var(--accent2); background: rgba(252,92,125,0.08); }
  .score-pct { font-size: 30px; font-weight: 800; }
  .score-lbl { font-family: 'Space Mono', monospace; font-size: 10px; color: var(--muted); letter-spacing: 2px; }
  .result-stats { display: flex; gap: 16px; justify-content: center; margin-bottom: 32px; }
  .result-stat { text-align: center; }
  .result-stat-val { font-size: 24px; font-weight: 800; }
  .result-stat-lbl { font-family: 'Space Mono', monospace; font-size: 11px; color: var(--muted); }
  .review-item {
    text-align: left; padding: 12px 14px; border-radius: 10px;
    margin-bottom: 8px; border: 1px solid;
  }
  .review-q { font-weight: 700; font-size: 13px; margin-bottom: 6px; }
  .review-ans { font-family: 'Space Mono', monospace; font-size: 12px; }

  /* ── Toast ── */
  .toast {
    position: fixed; bottom: 24px; right: 24px; z-index: 2000;
    padding: 13px 20px; border-radius: 12px;
    font-family: 'Space Mono', monospace; font-size: 13px;
    transform: translateY(80px); opacity: 0;
    transition: all 0.3s ease; pointer-events: none;
  }
  .toast.show { transform: translateY(0); opacity: 1; }
  .toast.success { background: rgba(78,204,163,0.15); border: 1px solid rgba(78,204,163,0.3); color: var(--success); }
  .toast.error { background: rgba(252,92,125,0.12); border: 1px solid rgba(252,92,125,0.3); color: var(--accent2); }

  /* ── Empty state ── */
  .empty-state { text-align: center; padding: 60px 20px; color: var(--muted); }
  .empty-icon { font-size: 40px; margin-bottom: 12px; }
  .empty-text { font-size: 16px; font-weight: 700; margin-bottom: 6px; color: var(--text); }
  .empty-sub { font-family: 'Space Mono', monospace; font-size: 12px; }

  /* ── View quiz questions ── */
  .view-opt {
    padding: 7px 12px; border-radius: 8px;
    font-family: 'Space Mono', monospace; font-size: 12px; margin-bottom: 6px;
    border: 1px solid;
  }

  @media (max-width: 768px) {
    .sidebar { width: 200px; }
    .main { padding: 20px; }
    .stats-grid { grid-template-columns: repeat(2, 1fr); }
  }
  @media (max-width: 600px) {
    .dashboard { flex-direction: column; }
    .sidebar { width: 100%; height: auto; position: static; flex-direction: row; flex-wrap: wrap; padding: 12px; }
    .nav-links { flex-direction: row; flex-wrap: wrap; }
    .sidebar-user { display: none; }
    .main { padding: 16px; }
  }
`;

export default CSS;
