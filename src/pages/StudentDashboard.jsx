// ─── StudentDashboard Page ────────────────────────────────────────────────────
import { useState, useEffect, useCallback } from "react";
import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { db } from "../firebase.js";
import { useToast } from "../hooks/useToast.js";
import {
  Sidebar,
  Toast,
  LoadingState,
  EmptyState,
  StatCard,
  Badge,
} from "../components/UI.jsx";
import QuizAttempt from "../components/QuizAttempt.jsx";
import ResultScreen from "../components/ResultScreen.jsx";

const STUDENT_NAV = [
  { key: "available", icon: "📋", label: "Quizzes" },
  { key: "history", icon: "📊", label: "My Results" },
];

export default function StudentDashboard({ session, onLogout }) {
  const [section, setSection] = useState("available");
  const [quizzes, setQuizzes] = useState([]);
  const [myResults, setMyResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeQuiz, setActiveQuiz] = useState(null);
  const [quizResult, setQuizResult] = useState(null);
  const { toast, showToast } = useToast();

  const fetchQuizzes = useCallback(async () => {
    const q = query(collection(db, "quizzes"), where("status", "==", "active"));
    const snap = await getDocs(q);
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  }, []);

  const fetchMyResults = useCallback(async () => {
    const q = query(
      collection(db, "results"),
      where("studentEmail", "==", session.email)
    );
    const snap = await getDocs(q);
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  }, [session.email]);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const [qs, rs] = await Promise.all([fetchQuizzes(), fetchMyResults()]);
      setQuizzes(qs);
      setMyResults(rs);
      setLoading(false);
    })();
  }, [fetchQuizzes, fetchMyResults]);

  const handleStartQuiz = (quiz) => {
    setActiveQuiz(quiz);
    setQuizResult(null);
    setSection("attempt");
  };

  const handleQuizSubmitted = async (resultData) => {
    try {
      await addDoc(collection(db, "results"), resultData);
    } catch (err) {
      console.error("Could not save result:", err);
    }
    const rs = await fetchMyResults();
    setMyResults(rs);
    setQuizResult(resultData);
  };

  const handleGoBack = async () => {
    setActiveQuiz(null);
    setQuizResult(null);
    setSection("available");
    const [qs, rs] = await Promise.all([fetchQuizzes(), fetchMyResults()]);
    setQuizzes(qs);
    setMyResults(rs);
  };

  const handleNav = async (key) => {
    setActiveQuiz(null);
    setQuizResult(null);
    setSection(key);
    if (key === "history") {
      setLoading(true);
      setMyResults(await fetchMyResults());
      setLoading(false);
    }
  };

  const attemptedIds = new Set(myResults.map((r) => r.quizId));
  const bestScore = myResults.length
    ? Math.max(...myResults.map((r) => r.percentage))
    : null;

  return (
    <div className="dashboard">
      <Sidebar
        session={session}
        role="Student"
        navItems={STUDENT_NAV}
        activeSection={!activeQuiz ? section : ""}
        onNav={handleNav}
        onLogout={onLogout}
      />

      <main className="main">
        {/* ── Quiz attempt screen ── */}
        {activeQuiz && !quizResult && (
          <QuizAttempt
            quiz={activeQuiz}
            session={session}
            onSubmit={handleQuizSubmitted}
            onCancel={handleGoBack}
          />
        )}

        {/* ── Result screen ── */}
        {quizResult && (
          <ResultScreen
            result={quizResult}
            quiz={activeQuiz}
            onBack={handleGoBack}
          />
        )}

        {/* ── Available quizzes ── */}
        {!activeQuiz && !quizResult && section === "available" && (
          <>
            <div className="section-header">
              <div className="section-title">Available Quizzes</div>
              <div className="section-sub">Active quizzes you can attempt</div>
            </div>

            <div className="stats-grid">
              <StatCard value={quizzes.length} label="Available" color="var(--accent)" />
              <StatCard
                value={myResults.length}
                label="Attempted"
                color="var(--success)"
              />
              <StatCard
                value={bestScore !== null ? bestScore + "%" : "—"}
                label="Best Score"
              />
            </div>

            {loading ? (
              <LoadingState />
            ) : quizzes.length === 0 ? (
              <EmptyState
                icon="📋"
                title="No quizzes available"
                subtitle="Check back later when your teacher publishes a quiz"
              />
            ) : (
              quizzes.map((q) => {
                const attempted = attemptedIds.has(q.id);
                const myResult = myResults.find((r) => r.quizId === q.id);
                return (
                  <div className="quiz-card" key={q.id}>
                    <div className="quiz-meta">
                      <div className="quiz-name">{q.title}</div>
                      <div className="quiz-info">
                        <span>⏱ {q.timeLimit} mins</span>
                        <span>❓ {q.questions.length} questions</span>
                        <span>🎯 Pass: {q.passmark}%</span>
                        {attempted && myResult && (
                          <Badge
                            status={myResult.passed ? "active" : "closed"}
                            label={
                              myResult.passed
                                ? `Passed · ${myResult.percentage}%`
                                : `Failed · ${myResult.percentage}%`
                            }
                          />
                        )}
                      </div>
                    </div>
                    <button
                      className={`btn btn-sm ${
                        attempted ? "btn-secondary" : "btn-success"
                      }`}
                      onClick={() => handleStartQuiz(q)}
                    >
                      {attempted ? "Retry" : "Start →"}
                    </button>
                  </div>
                );
              })
            )}
          </>
        )}

        {/* ── History section ── */}
        {!activeQuiz && !quizResult && section === "history" && (
          <>
            <div className="section-header">
              <div className="section-title">My Results</div>
              <div className="section-sub">Your quiz history</div>
            </div>
            {loading ? (
              <LoadingState />
            ) : myResults.length === 0 ? (
              <EmptyState
                icon="📊"
                title="No results yet"
                subtitle="Complete a quiz to see your results here"
              />
            ) : (
              myResults.map((r) => (
                <div className="quiz-card" key={r.id}>
                  <div className="quiz-meta">
                    <div className="quiz-name">{r.quizTitle}</div>
                    <div className="quiz-info">
                      <span>
                        Score: {r.score}/{r.total}
                      </span>
                      <span>{r.percentage}%</span>
                      <Badge
                        status={r.passed ? "active" : "closed"}
                        label={r.passed ? "PASSED" : "FAILED"}
                      />
                      <span>{new Date(r.submittedAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div
                    style={{
                        fontWeight: 800,
                      fontSize: 28,
                      
                      color: r.passed ? "var(--success)" : "var(--accent2)",
                    }}
                  >
                    {r.passed ? "✓" : "✕"}
                  </div>
                </div>
              ))
            )}
          </>
        )}
      </main>

      <Toast toast={toast} />
    </div>
  );
}
