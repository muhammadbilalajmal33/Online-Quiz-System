// ─── QuizAttempt Component ────────────────────────────────────────────────────
import { useState, useEffect, useRef } from "react";

export default function QuizAttempt({ quiz, session, onSubmit, onCancel }) {
  const [answers, setAnswers] = useState(
    new Array(quiz.questions.length).fill(null)
  );
  const [timeLeft, setTimeLeft] = useState(quiz.timeLimit * 60);
  const [submitting, setSubmitting] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(timerRef.current);
          handleSubmit(true);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmit = async (auto = false) => {
    if (submitting) return;
    clearInterval(timerRef.current);

    if (!auto) {
      const unanswered = answers.filter((a) => a === null).length;
      if (unanswered > 0) {
        const ok = window.confirm(
          `${unanswered} question(s) unanswered. Submit anyway?`
        );
        if (!ok) {
          // Restart timer from current timeLeft
          timerRef.current = setInterval(() => {
            setTimeLeft((t) => {
              if (t <= 1) {
                clearInterval(timerRef.current);
                handleSubmit(true);
                return 0;
              }
              return t - 1;
            });
          }, 1000);
          return;
        }
      }
    }

    setSubmitting(true);
    let score = 0;
    answers.forEach((ans, i) => {
      if (ans === quiz.questions[i].correct) score++;
    });
    const total = quiz.questions.length;
    const percentage = Math.round((score / total) * 100);
    const passed = percentage >= quiz.passmark;

    await onSubmit({
      studentEmail: session.email,
      studentName: session.name,
      quizId: quiz.id,
      quizTitle: quiz.title,
      teacherEmail: quiz.createdBy,
      score,
      total,
      percentage,
      passed,
      answers,
      submittedAt: new Date().toISOString(),
    });
    setSubmitting(false);
  };

  const selectAns = (qi, oi) =>
    setAnswers((prev) => {
      const a = [...prev];
      a[qi] = oi;
      return a;
    });

  const m = String(Math.floor(timeLeft / 60)).padStart(2, "0");
  const s = String(timeLeft % 60).padStart(2, "0");
  const timerClass = `timer-display${
    timeLeft < 60 ? " danger" : timeLeft < 180 ? " warn" : ""
  }`;
  const answered = answers.filter((a) => a !== null).length;
  const progress = (answered / quiz.questions.length) * 100;

  return (
    <>
      {/* Timer bar */}
      <div className="timer-bar">
        <div>
          <div style={{ fontSize: 15, fontWeight: 800 }}>{quiz.title}</div>
          <div
            style={{
              fontFamily: "'Space Mono', monospace",
              fontSize: 11,
              color: "var(--muted)",
            }}
          >
            {quiz.questions.length} questions · Pass: {quiz.passmark}%
          </div>
        </div>
        <div className={timerClass}>
          {m}:{s}
        </div>
      </div>

      {/* Progress bar */}
      <div className="progress-track">
        <div className="progress-fill" style={{ width: progress + "%" }} />
      </div>

      {/* Questions */}
      {quiz.questions.map((q, qi) => (
        <div className="attempt-q" key={qi}>
          <div className="q-num">
            Question {qi + 1} of {quiz.questions.length}
          </div>
          <div className="q-text">{q.text}</div>
          {q.options.map((opt, oi) => (
            <button
              key={oi}
              className={`opt-btn${answers[qi] === oi ? " selected" : ""}`}
              onClick={() => selectAns(qi, oi)}
            >
              {opt || "(empty option)"}
            </button>
          ))}
        </div>
      ))}

      {/* Actions */}
      <div style={{ display: "flex", gap: 12, marginTop: 20 }}>
        <button className="btn btn-secondary" onClick={onCancel}>
          ← Cancel
        </button>
        <button
          className="btn btn-primary"
          style={{ flex: 1 }}
          onClick={() => handleSubmit(false)}
          disabled={submitting}
        >
          {submitting ? "Submitting..." : "Submit Quiz"}
        </button>
      </div>
    </>
  );
}
