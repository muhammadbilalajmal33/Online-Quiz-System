// ─── ViewQuizModal Component ──────────────────────────────────────────────────
import { Badge } from "./UI.jsx";

export default function ViewQuizModal({ quiz, onClose, onToggleStatus }) {
  return (
    <div
      className="modal-overlay"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="modal">
        <div className="modal-title">{quiz.title}</div>

        <p
          style={{
            fontFamily: "'Space Mono', monospace",
            fontSize: 12,
            color: "var(--muted)",
            marginBottom: 18,
          }}
        >
          {quiz.desc || "No description"}
        </p>

        <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 20 }}>
          <Badge status={quiz.status} />
          <span
            style={{
              fontFamily: "'Space Mono', monospace",
              fontSize: 12,
              color: "var(--muted)",
            }}
          >
            ⏱ {quiz.timeLimit} mins &nbsp;🎯 Pass: {quiz.passmark}% &nbsp;❓{" "}
            {quiz.questions.length} Qs
          </span>
        </div>

        <h3 style={{ fontSize: 15, fontWeight: 800, marginBottom: 14 }}>Questions</h3>

        {quiz.questions.map((q, i) => (
          <div className="question-block" key={i} style={{ marginBottom: 10 }}>
            <div className="q-number">Q{i + 1}</div>
            <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 10 }}>{q.text}</div>
            {q.options.map((opt, j) => (
              <div
                key={j}
                className="view-opt"
                style={{
                  background:
                    j === q.correct ? "rgba(78,204,163,0.1)" : "var(--bg)",
                  borderColor:
                    j === q.correct ? "rgba(78,204,163,0.3)" : "var(--border)",
                  color: j === q.correct ? "var(--success)" : "var(--muted)",
                }}
              >
                {j === q.correct ? "✓ " : ""}
                {opt || "(empty)"}
              </div>
            ))}
          </div>
        ))}

        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose}>
            Close
          </button>
          <button
            className="btn btn-success"
            onClick={() => onToggleStatus(quiz.id, quiz.status)}
          >
            {quiz.status === "active" ? "Close Quiz" : "Activate Quiz"}
          </button>
        </div>
      </div>
    </div>
  );
}
