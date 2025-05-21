import { useState } from "react";
import { useParams } from "react-router-dom";

export default function AddQuestions() {
  const { id: quizId } = useParams();
  const API_URL = process.env.REACT_APP_API_URL;

  const [questionText, setQuestionText] = useState("");
  const [answers, setAnswers] = useState([
    { text: "", is_correct: false },
    { text: "", is_correct: false },
    { text: "", is_correct: false },
    { text: "", is_correct: false },
  ]);
  const [message, setMessage] = useState("");

  const handleAnswerChange = (index, key, value) => {
    const updated = [...answers];
    updated[index][key] = value;
    setAnswers(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const res = await fetch(`${API_URL}/questions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          quiz_id: quizId,
          question_text: questionText,
          answers,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage("Erreur : " + (data.error || "Ajout impossible"));
        return;
      }

      setMessage("Question ajoutée !");
      setQuestionText("");
      setAnswers([
        { text: "", is_correct: false },
        { text: "", is_correct: false },
        { text: "", is_correct: false },
        { text: "", is_correct: false },
      ]);
    } catch (err) {
      setMessage("Erreur serveur.");
    }
  };

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Ajouter une question</h2>
      {message && <p className="mb-4 text-sm text-blue-500">{message}</p>}
      <form onSubmit={handleSubmit}>
        <textarea
          value={questionText}
          onChange={(e) => setQuestionText(e.target.value)}
          placeholder="Texte de la question"
          className="w-full border p-2 mb-4"
        />
        {answers.map((a, index) => (
          <div key={index} className="flex items-center gap-2 mb-2">
            <input
              type="text"
              value={a.text}
              placeholder={`Réponse ${index + 1}`}
              className="flex-1 border p-2"
              onChange={(e) =>
                handleAnswerChange(index, "text", e.target.value)
              }
            />
            <input
              type="checkbox"
              checked={a.is_correct}
              onChange={(e) =>
                handleAnswerChange(index, "is_correct", e.target.checked)
              }
            />
            <label>Correcte</label>
          </div>
        ))}
        <button type="submit" className="btn btn-primary mt-2">
          Ajouter
        </button>
      </form>
    </div>
  );
}
