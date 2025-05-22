// src/components/pages/Quizzes/QuizSummary.jsx
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
  MDBModal,
  MDBModalDialog,
  MDBModalContent,
  MDBModalHeader,
  MDBModalTitle,
  MDBModalBody,
  MDBModalFooter,
} from "mdb-react-ui-kit";
import Navbar from "../Navbar";
import Footer from "../Footer";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
export default function QuizSummary() {
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [questionToDelete, setQuestionToDelete] = useState(null);

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

  const handleExportPDF = async () => {
    const input = document.getElementById("quiz-summary");
    const canvas = await html2canvas(input);
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF();
    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save("quiz-summary.pdf");
  };
  const confirmDelete = (questionId) => {
    setQuestionToDelete(questionId);
    setShowConfirmModal(true);
  };

  const handleDelete = async () => {
    if (!questionToDelete) return;

    try {
      const res = await fetch(
        `${API_URL}/quizzes/questions/${questionToDelete}`,
        {
          method: "DELETE",
        }
      );

      const data = await res.json();

      if (!res.ok) {
        toast.error("Erreur : " + (data.error || "Impossible de supprimer"));
        return;
      }

      setQuestions((prev) => prev.filter((q) => q.id !== questionToDelete));
      toast.success("✅ Question supprimée !");
    } catch (err) {
      toast.error("Erreur serveur.");
    } finally {
      setShowConfirmModal(false);
      setQuestionToDelete(null);
    }
  };

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
    <div
      className="min-h-screen flex flex-col "
      style={{ backgroundColor: "#eeeeee" }}
    >
      <Navbar />
      <MDBContainer className="py-2 flex-grow-1">
        <MDBCard className="mx-auto" style={{ maxWidth: "900px" }}>
          <MDBCardBody>
            <h3 className="text-center fw-bold mb-4">Résumé du Quiz</h3>

            <div id="quiz-summary">
              <MDBListGroup flush={true}>
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
                                <span className="text-success fw-bold">
                                  (✔)
                                </span>
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
                      <MDBBtn
                        size="sm"
                        color="danger"
                        onClick={() => confirmDelete(q.id)}
                      >
                        Supprimer
                      </MDBBtn>
                    </div>
                  </MDBListGroupItem>
                ))}
              </MDBListGroup>
            </div>

            <div className="text-center mt-4 d-flex gap-3 flex-wrap justify-content-center">
              <MDBBtn onClick={() => navigate("/dashboard")} color="dark">
                Retour au Dashboard
              </MDBBtn>
              <MDBBtn
                onClick={() => navigate(`/quizzes/${quizId}/view`)}
                color="success"
              >
                Lancer le Quiz en mode Vue
              </MDBBtn>
              <MDBBtn
                color="info"
                onClick={() => navigate(`/quizzes/${quizId}/add-questions`)}
              >
                ➕ Ajouter une question
              </MDBBtn>

              <MDBBtn color="secondary" onClick={handleExportPDF}>
                🖨️ Exporter en PDF
              </MDBBtn>
            </div>
          </MDBCardBody>
        </MDBCard>
        <MDBModal
          open={showConfirmModal}
          onClose={setShowConfirmModal}
          tabIndex="-1"
        >
          <MDBModalDialog centered>
            <MDBModalContent>
              <MDBModalHeader>
                <MDBModalTitle>Confirmer la suppression</MDBModalTitle>
                <MDBBtn
                  className="btn-close"
                  color="none"
                  onClick={() => setShowConfirmModal(false)}
                ></MDBBtn>
              </MDBModalHeader>
              <MDBModalBody>
                Cette action supprimera définitivement la question. Continuer ?
              </MDBModalBody>
              <MDBModalFooter>
                <MDBBtn
                  color="secondary"
                  onClick={() => setShowConfirmModal(false)}
                >
                  Annuler
                </MDBBtn>
                <MDBBtn color="danger" onClick={handleDelete}>
                  Supprimer
                </MDBBtn>
              </MDBModalFooter>
            </MDBModalContent>
          </MDBModalDialog>
        </MDBModal>
      </MDBContainer>
      <ToastContainer position="top-right" autoClose={1500} />

      <Footer />
    </div>
  );
}
