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
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
export default function AddQuestions() {
  const { id: quizId } = useParams();
  const navigate = useNavigate();
  const API_URL = process.env.REACT_APP_API_URL;

  const [questionText, setQuestionText] = useState("");
  const [answers, setAnswers] = useState([
    { text: "", is_correct: false },
    { text: "", is_correct: false },
  ]);
  const [message, setMessage] = useState("");
  const [step, setStep] = useState(1);
  // eslint-disable-next-line 
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [loading, setLoading] = useState(false);

  const handleAnswerChange = (index, key, value) => {
    const updated = [...answers];
    updated[index][key] = value;
    setAnswers(updated);
  };

  const handleAddAnswer = () => {
    setAnswers([...answers, { text: "", is_correct: false }]);
  };

  const handleRemoveAnswer = (index) => {
    if (answers.length <= 2) {
      setMessage("❌ Il faut au moins deux réponses.");
      return;
    }
    const updated = answers.filter((_, i) => i !== index);
    setAnswers(updated);
  };

  const resetForm = () => {
    setQuestionText("");
    setAnswers([
      { text: "", is_correct: false },
      { text: "", is_correct: false },
    ]);
    setStep((prev) => prev + 1);
    setTotalQuestions((prev) => prev + 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    if (!questionText.trim()) {
      setMessage("❌ Le texte de la question est requis.");
      return;
    }

    if (answers.length < 2) {
      setMessage("❌ Il faut au moins deux réponses.");
      return;
    }

    const hasCorrect = answers.some((a) => a.is_correct);
    if (!hasCorrect) {
      setMessage("❌ Une réponse correcte est requise.");
      return;
    }

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

      toast.success("✅ Question ajoutée !");
      resetForm();
    } catch (err) {
      setLoading(false);
      toast.error("❌ Erreur serveur.");
    }
  };

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ backgroundColor: "#eeeeee" }}
    >
      <Navbar />
      <MDBContainer className="py-5 flex-grow-1">
        <MDBCard className="mx-auto" style={{ maxWidth: "800px" }}>
          <MDBCardBody>
            <h3 className="text-center fw-bold mb-3">
              Étape {step} — Nouvelle Question
            </h3>

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
                <div key={index} className="mb-3 border p-3 rounded bg-white">
                  <MDBInput
                    label={`Réponse ${index + 1}`}
                    value={a.text}
                    onChange={(e) =>
                      handleAnswerChange(index, "text", e.target.value)
                    }
                    className="mb-2"
                  />
                  <div className="d-flex justify-content-between align-items-center">
                    <MDBCheckbox
                      label="Correcte"
                      checked={a.is_correct}
                      onChange={(e) =>
                        handleAnswerChange(
                          index,
                          "is_correct",
                          e.target.checked
                        )
                      }
                    />
                    <MDBBtn
                      color="danger"
                      size="sm"
                      onClick={() => handleRemoveAnswer(index)}
                    >
                      Supprimer
                    </MDBBtn>
                  </div>
                </div>
              ))}

              <MDBBtn
                type="button"
                outline
                color="info"
                onClick={handleAddAnswer}
                className="w-100 mb-3"
              >
                ➕ Ajouter une réponse
              </MDBBtn>

              <MDBBtn
                type="submit"
                className="w-100"
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
      <ToastContainer position="top-right" autoClose={1500} />

      <Footer />
    </div>
  );
}
