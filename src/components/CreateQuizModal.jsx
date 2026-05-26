// ─── CreateQuizModal Component ────────────────────────────────────────────────
import { useState } from "react";
import {
  collection,
  addDoc,
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { db } from "../firebase.js";

export default function CreateQuizModal({ session, onClose, onSaved, showToast }) {
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [timeLimit, setTimeLimit] = useState("30");
  const [passmark, setPassmark] = useState("60");
  const [questions, setQuestions] = useState([
    { text: "", options: ["", "", "", ""], correct: 0 },
  ]);
  const [saving, setSaving] = useState(false);

  const addQuestion = () =>
    setQuestions((prev) => [
      ...prev,
      { text: "", options: ["", "", "", ""], correct: 0 },
    ]);

  const updateQuestion = (qi, field, value) => {
    setQuestions((prev) => {
      const copy = prev.map((q) => ({ ...q, options: [...q.options] }));
      if (field === "text") copy[qi].text = value;
      else if (field === "correct") copy[qi].correct = value;
      return copy;
    });
  };

  const updateOption = (qi, oi, value) => {
    setQuestions((prev) => {
      const copy = prev.map((q) => ({ ...q, options: [...q.options] }));
      copy[qi].options[oi] = value;
      return copy;
    });
  };

  const removeQuestion = (qi) =>
    setQuestions((prev) => prev.filter((_, i) => i !== qi));

  const handleSave = async (status) => {
    if (!title.trim()) return showToast("Quiz title is required.", "error");
    const validQs = questions.filter((q) => q.text.trim());
    if (!validQs.length) return showToast("Add at least one question.", "error");

    setSaving(true);
    try {
      await addDoc(collection(db, "quizzes"), {
        title: title.trim(),
        desc: desc.trim(),
        timeLimit: parseInt(timeLimit) || 30,
        passmark: parseInt(passmark) || 60,
        questions: validQs,
        status,
        createdBy: session.email,
        teacherName: session.name,
        createdAt: new Date().toISOString(),
      });
      showToast(status === "active" ? "Quiz published!" : "Saved as draft!", "success");
      onSaved();
    } catch (err) {
      showToast("Error: " + err.message, "error");
    }
    setSaving(false);
  };

  return (
    <div
      className="modal-overlay"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="modal">
        <div className="modal-title">Create New Quiz</div>

        <label>Quiz Title</label>
        <input
          type="text"
          placeholder="e.g. Cloud Computing Fundamentals"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <label>Description (optional)</label>
        <textarea
          placeholder="Brief description of the quiz..."
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
        />

        <div style={{ display: "flex", gap: 16 }}>
          <div style={{ flex: 1 }}>
            <label>Time Limit (minutes)</label>
            <input
              type="number"
              min="1"
              value={timeLimit}
              onChange={(e) => setTimeLimit(e.target.value)}
            />
          </div>
          <div style={{ flex: 1 }}>
            <label>Pass Mark (%)</label>
            <input
              type="number"
              min="1"
              max="100"
              value={passmark}
              onChange={(e) => setPassmark(e.target.value)}
            />
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 14,
          }}
        >
          <label style={{ margin: 0 }}>Questions</label>
          <button className="btn btn-secondary btn-sm" onClick={addQuestion}>
            + Add Question
          </button>
        </div>

        {questions.map((q, qi) => (
          <QuestionBlock
            key={qi}
            index={qi}
            question={q}
            total={questions.length}
            onUpdateQuestion={updateQuestion}
            onUpdateOption={updateOption}
            onRemove={removeQuestion}
          />
        ))}

        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button
            className="btn btn-secondary"
            onClick={() => handleSave("draft")}
            disabled={saving}
          >
            {saving ? "Saving..." : "Save as Draft"}
          </button>
          <button
            className="btn btn-success"
            onClick={() => handleSave("active")}
            disabled={saving}
          >
            {saving ? "Saving..." : "Publish Quiz"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Question block sub-component ──────────────────────────────────────────────
function QuestionBlock({ index, question, total, onUpdateQuestion, onUpdateOption, onRemove }) {
  return (
    <div className="question-block">
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div className="q-number">Question {index + 1}</div>
        {total > 1 && (
          <button
            className="btn btn-danger btn-sm"
            onClick={() => onRemove(index)}
            style={{ padding: "4px 10px", fontSize: 11 }}
          >
            ✕
          </button>
        )}
      </div>
      <input
        type="text"
        placeholder="Enter question text..."
        value={question.text}
        onChange={(e) => onUpdateQuestion(index, "text", e.target.value)}
        style={{ marginBottom: 10 }}
      />
      {question.options.map((opt, oi) => (
        <div className="option-row" key={oi}>
          <input
            type="radio"
            name={`correct-${index}`}
            checked={question.correct === oi}
            onChange={() => onUpdateQuestion(index, "correct", oi)}
          />
          <input
            type="text"
            placeholder={`Option ${oi + 1}`}
            value={opt}
            onChange={(e) => onUpdateOption(index, oi, e.target.value)}
            style={{ marginBottom: 0 }}
          />
        </div>
      ))}
      <div
        style={{
          marginTop: 8,
          fontFamily: "'Space Mono', monospace",
          fontSize: 11,
          color: "var(--muted)",
        }}
      >
        ● = Correct answer
      </div>
    </div>
  );
}