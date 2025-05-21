import { useState } from "react";
import { useParams } from "react-router-dom";
import {
  MDBContainer,
  MDBCard,
  MDBCardBody,
  MDBInput,
  MDBCheckbox,
  MDBBtn,
  MDBTextArea,
} from "mdb-react-ui-kit";
import Navbar from "../Navbar";
import Footer from "../Footer";

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
  const [loading, setLoading] = useState(false);

  const handleAnswerChange = (index, key, value) => {
    const updated = [...answers];
    updated[index][key] = value;
    setAnswers(updated);
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
        setMessage("❌ " + (data.error || "Erreur lors de l'envoi."));
        return;
      }

      setMessage("✅ Question ajoutée avec succès !");
      setQuestionText("");
      setAnswers([
        { text: "", is_correct: false },
        { text: "", is_correct: false },
        { text: "", is_correct: false },
        { text: "", is_correct: false },
      ]);
    } catch (err) {
      setLoading(false);
      setMessage("❌ Erreur serveur.");
    }
  };

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ backgroundColor: "#eeeeee" }}
    >
      <Navbar />
      <MDBContainer className="d-flex flex-column align-items-center justify-content-center py-5 flex-grow-1">
        <MDBCard className="w-100" style={{ maxWidth: "800px" }}>
          <MDBCardBody>
            <h3 className="text-center mb-4 fw-bold">Ajouter une Question</h3>

            {message && (
              <div
                className={`alert text-center mb-4 ${
                  message.startsWith("✅") ? "alert-success" : "alert-danger"
                }`}
              >
                {message}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <MDBTextArea
                label="Texte de la question"
                rows={3}
                value={questionText}
                onChange={(e) => setQuestionText(e.target.value)}
                className="mb-4"
              />

              <div className="mb-4">
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
                        handleAnswerChange(
                          index,
                          "is_correct",
                          e.target.checked
                        )
                      }
                    />
                  </div>
                ))}
              </div>

              <MDBBtn
                type="submit"
                color="success"
                className="w-100"
                disabled={loading || !questionText.trim()}
              >
                {loading ? "Ajout en cours..." : "Ajouter la question"}
              </MDBBtn>
            </form>
          </MDBCardBody>
        </MDBCard>
      </MDBContainer>
      <Footer />
    </div>
  );
}
