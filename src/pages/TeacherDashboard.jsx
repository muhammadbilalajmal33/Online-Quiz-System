// ─── TeacherDashboard Page ────────────────────────────────────────────────────
import { useState, useEffect, useCallback } from "react";
import {
  collection,
  doc,
  getDocs,
  updateDoc,
  deleteDoc,
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
import CreateQuizModal from "../components/CreateQuizModal.jsx";
import ViewQuizModal from "../components/ViewQuizModal.jsx";

const TEACHER_NAV = [
  { key: "quizzes", icon: "📋", label: "My Quizzes" },
  { key: "results", icon: "📊", label: "Results" },
  { key: "students", icon: "🎓", label: "Students" },
];

export default function TeacherDashboard({ session, onLogout }) {
  const [section, setSection] = useState("quizzes");
  const [quizzes, setQuizzes] = useState([]);
  const [results, setResults] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [viewQuiz, setViewQuiz] = useState(null);
  const { toast, showToast } = useToast();

  // ── Firebase helpers ──────────────────────────────────────────────────────
  const fetchQuizzes = useCallback(async () => {
    const q = query(
      collection(db, "quizzes"),
      where("createdBy", "==", session.email)
    );
    const snap = await getDocs(q);
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  }, [session.email]);

  const fetchResults = useCallback(async () => {
    const q = query(
      collection(db, "results"),
      where("teacherEmail", "==", session.email)
    );
    const snap = await getDocs(q);
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  }, [session.email]);

  const fetchStudents = useCallback(async () => {
    const q = query(collection(db, "users"), where("role", "==", "student"));
    const snap = await getDocs(q);
    return snap.docs.map((d) => d.data());
  }, []);

  // Load on section change
  useEffect(() => {
    (async () => {
      setLoading(true);
      if (section === "quizzes") {
        const [q, r] = await Promise.all([fetchQuizzes(), fetchResults()]);
        setQuizzes(q);
        setResults(r);
      } else if (section === "results") {
        setResults(await fetchResults());
      } else if (section === "students") {
        setStudents(await fetchStudents());
      }
      setLoading(false);
    })();
  }, [section, fetchQuizzes, fetchResults, fetchStudents]);

  const handleToggleStatus = async (id, current) => {
    const newStatus = current === "active" ? "closed" : "active";
    try {
      await updateDoc(doc(db, "quizzes", id), { status: newStatus });
      showToast(`Quiz is now ${newStatus}.`, "success");
      setViewQuiz(null);
      setQuizzes(await fetchQuizzes());
    } catch (err) {
      showToast("Error: " + err.message, "error");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this quiz? This cannot be undone.")) return;
    try {
      await deleteDoc(doc(db, "quizzes", id));
      showToast("Quiz deleted.", "success");
      setQuizzes(await fetchQuizzes());
    } catch (err) {
      showToast("Error: " + err.message, "error");
    }
  };

  const totalSubs = results.length;
  const avgScore = results.length
    ? Math.round(results.reduce((s, r) => s + r.percentage, 0) / results.length)
    : 0;

  return (
    <div className="dashboard">
      <Sidebar
        session={session}
        role="Teacher"
        navItems={TEACHER_NAV}
        activeSection={section}
        onNav={setSection}
        onLogout={onLogout}
      />

      <main className="main">
        {/* ── Quizzes section ── */}
        {section === "quizzes" && (
          <>
            <div
              className="section-header"
              style={{
                display: "flex",
                alignItems: "flex-start",
                justifyContent: "space-between",
                flexWrap: "wrap",
                gap: 12,
              }}
            >
              <div>
                <div className="section-title">My Quizzes</div>
                <div className="section-sub">Create and manage your quizzes</div>
              </div>
              <button
                className="btn btn-secondary btn-sm"
                style={{ marginTop: 4 }}
                onClick={() => setShowCreateModal(true)}
              >
                + Create Quiz
              </button>
            </div>

            <div className="stats-grid">
              <StatCard value={quizzes.length} label="Total Quizzes" />
              <StatCard
                value={quizzes.filter((q) => q.status === "active").length}
                label="Active"
                color="var(--success)"
              />
              <StatCard
                value={totalSubs}
                label="Submissions"
                color="var(--accent)"
              />
              <StatCard
                value={results.length ? avgScore + "%" : "—"}
                label="Avg Score"
              />
            </div>

            {loading ? (
              <LoadingState />
            ) : quizzes.length === 0 ? (
              <EmptyState
                icon="📋"
                title="No quizzes yet"
                subtitle="Create your first quiz to get started"
              />
            ) : (
              quizzes.map((q) => (
                <div className="quiz-card" key={q.id}>
                  <div className="quiz-meta">
                    <div className="quiz-name">{q.title}</div>
                    <div className="quiz-info">
                      <span>⏱ {q.timeLimit} mins</span>
                      <span>❓ {q.questions.length} questions</span>
                      <span>🎯 Pass: {q.passmark}%</span>
                      <Badge status={q.status} />
                    </div>
                  </div>
                  <div className="quiz-actions">
                    <button
                      className="btn btn-secondary btn-sm"
                      onClick={() => setViewQuiz(q)}
                    >
                      View
                    </button>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleDelete(q.id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))
            )}
          </>
        )}

        {/* ── Results section ── */}
        {section === "results" && (
          <>
            <div className="section-header">
              <div className="section-title">Student Results</div>
              <div className="section-sub">All quiz submissions</div>
            </div>
            {loading ? (
              <LoadingState />
            ) : results.length === 0 ? (
              <EmptyState
                icon="📊"
                title="No submissions yet"
                subtitle="Students haven't attempted any quizzes"
              />
            ) : (
              results.map((r) => (
                <div className="quiz-card" key={r.id}>
                  <div className="quiz-meta">
                    <div className="quiz-name">
                      {r.studentName} — {r.quizTitle}
                    </div>
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
                      fontSize: 28,
                      fontWeight: 800,
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

        {/* ── Students section ── */}
        {section === "students" && (
          <>
            <div className="section-header">
              <div className="section-title">Students</div>
              <div className="section-sub">All registered students</div>
            </div>
            {loading ? (
              <LoadingState />
            ) : students.length === 0 ? (
              <EmptyState icon="🎓" title="No students registered yet" />
            ) : (
              students.map((s) => (
                <div className="quiz-card" key={s.email}>
                  <div className="quiz-meta">
                    <div className="quiz-name">{s.name}</div>
                    <div className="quiz-info">
                      <span>{s.email}</span>
                      <span>Joined: {s.createdAt?.split("T")[0]}</span>
                    </div>
                  </div>
                  <div className="avatar">{s.name[0].toUpperCase()}</div>
                </div>
              ))
            )}
          </>
        )}
      </main>

      {/* Modals */}
      {showCreateModal && (
        <CreateQuizModal
          session={session}
          onClose={() => setShowCreateModal(false)}
          onSaved={async () => {
            setShowCreateModal(false);
            setQuizzes(await fetchQuizzes());
          }}
          showToast={showToast}
        />
      )}

      {viewQuiz && (
        <ViewQuizModal
          quiz={viewQuiz}
          onClose={() => setViewQuiz(null)}
          onToggleStatus={handleToggleStatus}
        />
      )}

      <Toast toast={toast} />
    </div>
  );
}
