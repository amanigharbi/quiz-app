import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  MDBContainer,
  MDBCard,
  MDBCardBody,
  MDBListGroup,
  MDBListGroupItem,
  MDBBtn,
  MDBSpinner,
} from "mdb-react-ui-kit";
import Navbar from "../Navbar";
import Footer from "../Footer";

export default function QuizSummary() {
  const { id: quizId } = useParams();
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const API_URL = process.env.REACT_APP_API_URL;
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${API_URL}/quizzes/${quizId}/questions`)
      .then((res) => res.json())
      .then((data) => {
        setQuestions(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [quizId]);

  if (loading) {
    return (
      <div className="text-center mt-5">
        <MDBSpinner role="status">
          <span className="visually-hidden">Chargement...</span>
        </MDBSpinner>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-light">
      <Navbar />
      <MDBContainer className="py-5 flex-grow-1">
        <MDBCard className="mx-auto" style={{ maxWidth: "900px" }}>
          <MDBCardBody>
            <h3 className="text-center fw-bold mb-4">Résumé du Quiz</h3>

            <MDBListGroup flush>
              {questions.length === 0 && (
                <MDBListGroupItem>Aucune question ajoutée.</MDBListGroupItem>
              )}

              {questions.map((q, index) => (
                <MDBListGroupItem key={q.id}>
                  <div className="d-flex justify-content-between">
                    <div style={{ width: "85%" }}>
                      <strong>Q{index + 1}:</strong> {q.question_text}
                      <ul className="mt-2">
                        {q.answers.map((a) => (
                          <li key={a.id}>
                            {a.answer_text}{" "}
                            {a.is_correct && (
                              <span className="text-success fw-bold">(✔)</span>
                            )}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <MDBBtn
                      size="sm"
                      color="secondary"
                      onClick={() =>
                        navigate(`/quizzes/${quizId}/questions/${q.id}/edit`)
                      }
                    >
                      Modifier
                    </MDBBtn>
                  </div>
                </MDBListGroupItem>
              ))}
            </MDBListGroup>

            <div className="text-center mt-4 d-flex gap-3 justify-content-center">
              <MDBBtn onClick={() => navigate("/dashboard")} color="dark">
                Retour au Dashboard
              </MDBBtn>
              <MDBBtn
                onClick={() => navigate(`/quizzes/${quizId}/view`)}
                color="success"
              >
                Lancer le Quiz en mode Vue
              </MDBBtn>
            </div>
          </MDBCardBody>
        </MDBCard>
      </MDBContainer>
      <Footer />
    </div>
  );
}
