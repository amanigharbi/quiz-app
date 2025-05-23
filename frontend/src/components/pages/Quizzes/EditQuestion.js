import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  MDBContainer,
  MDBCard,
  MDBCardBody,
  MDBInput,
  MDBCheckbox,
  MDBBtn,
  MDBSpinner,
} from "mdb-react-ui-kit";
import Navbar from "../Navbar";
import Footer from "../Footer";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
export default function EditQuestion() {
  const { id: quizId, questionId } = useParams();
  const API_URL = process.env.REACT_APP_API_URL;
  const navigate = useNavigate();

  const [questionText, setQuestionText] = useState("");
  const [answers, setAnswers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch(`${API_URL}/quizzes/${quizId}/questions`)
      .then((res) => res.json())
      .then((data) => {
        const question = data.find((q) => q.id === parseInt(questionId));
        if (question) {
          setQuestionText(question.question_text);
          setAnswers(
            question.answers.map((a) => ({
              id: a.id,
              text: a.answer_text,
              is_correct: a.is_correct,
            }))
          );
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [quizId, questionId, API_URL]);

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
      alert("Il faut au moins 2 réponses.");
      return;
    }
    const updated = answers.filter((_, i) => i !== index);
    setAnswers(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    const hasCorrect = answers.some((a) => a.is_correct);
    if (!hasCorrect) {
      setMessage("❌ Au moins une réponse correcte est requise.");
      return;
    }

    if (answers.length < 2) {
      setMessage("❌ Il faut au moins deux réponses.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/quizzes/${questionId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question_text: questionText,
          answers: answers.map((a) => ({
            text: a.text,
            is_correct: a.is_correct,
          })),
        }),
      });

      const data = await res.json();
      setLoading(false);

      if (!res.ok) {
        toast.error("❌ " + (data.error || "Erreur lors de la mise à jour."));
        return;
      }

      toast.success("✅ Question mise à jour !");
      setTimeout(() => navigate(`/quizzes/${quizId}/summary`), 1500);
    } catch (err) {
      setLoading(false);
      toast.error("❌ Erreur serveur.");
    }
  };

  if (loading) {
    return (
      <div className="text-center mt-5">
        <MDBSpinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-light">
      <Navbar />
      <MDBContainer className="py-5 flex-grow-1">
        <MDBCard className="mx-auto" style={{ maxWidth: "800px" }}>
          <MDBCardBody>
            <h3 className="text-center fw-bold mb-3">Modifier la Question</h3>

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
              <MDBInput
                label="Texte de la question"
                value={questionText}
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
                color="info"
                outline
                onClick={handleAddAnswer}
                className="w-100 mb-3"
              >
                ➕ Ajouter une réponse
              </MDBBtn>

              <MDBBtn type="submit" className="w-100" disabled={loading}>
                {loading ? "Mise à jour..." : "Mettre à jour la question"}
              </MDBBtn>

              <MDBBtn
                outline
                color="secondary"
                className="w-100 mt-3"
                onClick={() => navigate(`/quizzes/${quizId}/summary`)}
              >
                Annuler & Retour
              </MDBBtn>
            </form>
          </MDBCardBody>
        </MDBCard>
      </MDBContainer>
      <ToastContainer position="top-right" autoClose={1500} />

      <Footer />
    </div>
  );
}
