import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  MDBContainer,
  MDBCard,
  MDBCardBody,
  MDBTextArea,
  MDBInput,
  MDBCheckbox,
  MDBBtn,
  MDBProgress,
} from "mdb-react-ui-kit";
import Navbar from "../Navbar";
import Footer from "../Footer";

export default function AddQuestions() {
  const { id: quizId } = useParams();
  const navigate = useNavigate();
  const API_URL = process.env.REACT_APP_API_URL;

  const [questionText, setQuestionText] = useState("");
  const [answers, setAnswers] = useState([
    { text: "", is_correct: false },
    { text: "", is_correct: false },
    { text: "", is_correct: false },
    { text: "", is_correct: false },
  ]);
  const [message, setMessage] = useState("");
  const [step, setStep] = useState(1);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [loading, setLoading] = useState(false);

  const handleAnswerChange = (index, key, value) => {
    const updated = [...answers];
    updated[index][key] = value;
    setAnswers(updated);
  };

  const resetForm = () => {
    setQuestionText("");
    setAnswers([
      { text: "", is_correct: false },
      { text: "", is_correct: false },
      { text: "", is_correct: false },
      { text: "", is_correct: false },
    ]);
    setStep((prev) => prev + 1);
    setTotalQuestions((prev) => prev + 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/questions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          quiz_id: quizId,
          question_text: questionText,
          answers,
        }),
      });

      const data = await res.json();
      setLoading(false);

      if (!res.ok) {
        setMessage("❌ " + (data.error || "Erreur lors de l'ajout"));
        return;
      }

      setMessage("✅ Question ajoutée !");
      resetForm();
    } catch (err) {
      setLoading(false);
      setMessage("❌ Erreur serveur.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-light">
      <Navbar />
      <MDBContainer className="py-5 flex-grow-1">
        <MDBCard className="mx-auto" style={{ maxWidth: "800px" }}>
          <MDBCardBody>
            <h3 className="text-center fw-bold mb-3">Étape {step} — Nouvelle Question</h3>

            <MDBProgress height="8" className="mb-4">
              <div
                className="progress-bar"
                style={{ width: `${Math.min(step * 20, 100)}%` }}
              />
            </MDBProgress>

            {message && (
              <div
                className={`alert text-center ${
                  message.startsWith("✅") ? "alert-success" : "alert-danger"
                }`}
              >
                {message}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <MDBTextArea
                label="Texte de la question"
                value={questionText}
                rows={3}
                onChange={(e) => setQuestionText(e.target.value)}
                className="mb-4"
              />

              {answers.map((a, index) => (
                <div key={index} className="mb-3">
                  <MDBInput
                    label={`Réponse ${index + 1}`}
                    value={a.text}
                    onChange={(e) =>
                      handleAnswerChange(index, "text", e.target.value)
                    }
                    className="mb-2"
                  />
                  <MDBCheckbox
                    label="Marquer comme correcte"
                    checked={a.is_correct}
                    onChange={(e) =>
                      handleAnswerChange(index, "is_correct", e.target.checked)
                    }
                  />
                </div>
              ))}

              <MDBBtn
                type="submit"
                className="w-100 mt-3"
                disabled={loading || !questionText.trim()}
              >
                {loading ? "Ajout en cours..." : "Ajouter la question"}
              </MDBBtn>
            </form>

            <MDBBtn
              outline
              color="primary"
              className="w-100 mt-3"
              onClick={() => navigate(`/quizzes/${quizId}/summary`)}
            >
              Terminer & Voir le Résumé
            </MDBBtn>
          </MDBCardBody>
        </MDBCard>
      </MDBContainer>
      <Footer />
    </div>
  );
}
