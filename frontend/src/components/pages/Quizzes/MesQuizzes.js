import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import {
  MDBContainer,
  MDBCard,
  MDBCardBody,
  MDBCardImage,
  MDBCardTitle,
  MDBCardText,
  MDBBtn,
  MDBIcon,
  MDBRow,
  MDBCol,
  MDBModal,
  MDBModalDialog,
  MDBModalContent,
  MDBModalHeader,
  MDBModalTitle,
  MDBModalBody,
  MDBModalFooter,
  MDBInput,
} from "mdb-react-ui-kit";
import { AuthContext } from "../../../context/AuthContext";
import Navbar from "../Navbar";
import Footer from "../Footer";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
export default function MesQuizzes() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [quizzes, setQuizzes] = useState([]);
  const API_URL = process.env.REACT_APP_API_URL;
  const [editingQuiz, setEditingQuiz] = useState(null); // Quiz en cours de modification
  const [modalOpen, setModalOpen] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [quizToDelete, setQuizToDelete] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const quizzesPerPage = 6;

  useEffect(() => {
    fetch(`${API_URL}/quizzes/users/${user?.id}/quizzes`)
      .then((res) => res.json())
      .then((data) => setQuizzes(data))
      .catch(() => toast.error("Erreur lors du chargement des quizzes"));
  }, [user]);
  const confirmDelete = (quiz) => {
    setQuizToDelete(quiz);
    setShowConfirmModal(true);
  };

  const handleDelete = async () => {
    try {
      const res = await fetch(`${API_URL}/quizzes/${quizToDelete}/quiz`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const data = await res.json();
        toast.error(data.error || "Suppression échouée");
        return;
      }

      setQuizzes((prev) => prev.filter((q) => q.id !== quizToDelete));
      setShowConfirmModal(false);

      toast.success("Quiz supprimé !");
    } catch (err) {
      toast.error("Erreur serveur.");
    }
  };
  // Ouvrir la modale avec le quiz à modifier
  const openEditModal = (quiz) => {
    setEditingQuiz(quiz);
    setModalOpen(true);
  };

  // Fermer la modale
  const closeEditModal = () => {
    setEditingQuiz(null);
    setModalOpen(false);
  };

  // Gestion du formulaire de modification
  const handleChange = (e) => {
    setEditingQuiz({
      ...editingQuiz,
      [e.target.name]: e.target.value,
    });
  };

  // Soumettre la modification
  const handleSave = async () => {
    try {
      const res = await fetch(`${API_URL}/quizzes/${editingQuiz.id}/quiz`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingQuiz),
      });

      if (!res.ok) {
        const data = await res.json();
        toast.error(data.error || "Erreur lors de la modification");
        return;
      }

      // Met à jour la liste localement
      setQuizzes((prev) =>
        prev.map((q) => (q.id === editingQuiz.id ? editingQuiz : q))
      );
      toast.success("Quiz modifié !");
      closeEditModal();
    } catch (err) {
      toast.error("Erreur serveur.");
    }
  };
  const indexOfLastQuiz = currentPage * quizzesPerPage;
  const indexOfFirstQuiz = indexOfLastQuiz - quizzesPerPage;
  const currentQuizzes = quizzes.slice(indexOfFirstQuiz, indexOfLastQuiz);
  const totalPages = Math.ceil(quizzes.length / quizzesPerPage);

  return (
    <div
      className="min-h-screen d-flex flex-column"
      style={{ backgroundColor: "#eeeeee" }}
    >
      <Navbar />
      <MDBContainer className="py-2 flex-grow-1">
        <h3 className="text-center fw-bold mb-4">📝 Mes Quizzes</h3>
        <div className="d-flex justify-content-end mt-4">
          <nav aria-label="Page navigation example">
            <ul className="pagination">
              {/* Bouton Précédent */}
              <li
                className={`page-item ${currentPage === 1 ? "disabled" : ""}`}
              >
                <a
                  className="page-link"
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    if (currentPage > 1) setCurrentPage(currentPage - 1);
                  }}
                  aria-label="Previous"
                >
                  <span aria-hidden="true">&laquo;</span>
                </a>
              </li>

              {/* N° de pages */}
              {Array.from({ length: totalPages }, (_, i) => (
                <li
                  key={i}
                  className={`page-item ${
                    currentPage === i + 1 ? "active" : ""
                  }`}
                >
                  <a
                    className="page-link"
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      setCurrentPage(i + 1);
                    }}
                  >
                    {i + 1}
                  </a>
                </li>
              ))}

              {/* Bouton Suivant */}
              <li
                className={`page-item ${
                  currentPage === totalPages ? "disabled" : ""
                }`}
              >
                <a
                  className="page-link"
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    if (currentPage < totalPages)
                      setCurrentPage(currentPage + 1);
                  }}
                  aria-label="Next"
                >
                  <span aria-hidden="true">&raquo;</span>
                </a>
              </li>
            </ul>
          </nav>
        </div>

        <MDBRow>
          {currentQuizzes.map((quiz) => (
            <MDBCol md="4" className="mb-4" key={quiz.id}>
              <MDBCard>
                <MDBCardImage
                  src="data:image/jpeg;base64,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"
                  position="top"
                  alt="Quiz"
                />
                <MDBCardBody>
                  <div className="d-flex justify-content-between align-items-start">
                    <div>
                      <MDBCardTitle>{quiz.title}</MDBCardTitle>
                      <MDBCardText>{quiz.description || "—"}</MDBCardText>
                    </div>
                    <div className="d-flex gap-2">
                      <MDBBtn
                        color="warning"
                        size="sm"
                        onClick={() => openEditModal(quiz)}
                      >
                        <MDBIcon fas icon="pen" />
                      </MDBBtn>
                      <MDBBtn
                        color="danger"
                        size="sm"
                        onClick={() => confirmDelete(quiz.id)}
                      >
                        <MDBIcon fas icon="trash" />
                      </MDBBtn>
                    </div>
                  </div>

                  <MDBBtn
                    color="success"
                    block
                    className="mt-3"
                    onClick={() => navigate(`/quizzes/${quiz.id}/start`)}
                  >
                    ▶️ Lancer le Quiz
                  </MDBBtn>
                </MDBCardBody>
              </MDBCard>
            </MDBCol>
          ))}
        </MDBRow>
      </MDBContainer>
      <ToastContainer position="top-right" autoClose={1500} />

      <MDBModal
        open={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
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
              Cette action supprimera définitivement le quiz. Continuer ?
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
      {/* Modale de modification */}
      <MDBModal open={modalOpen} onClose={setModalOpen} tabIndex="-1">
        <MDBModalDialog>
          <MDBModalContent>
            <MDBModalHeader>
              <MDBModalTitle>Modifier Quiz</MDBModalTitle>
              <MDBBtn
                className="btn-close"
                color="none"
                onClick={closeEditModal}
              ></MDBBtn>
            </MDBModalHeader>
            <MDBModalBody>
              <MDBInput
                label="Titre"
                name="title"
                value={editingQuiz?.title || ""}
                onChange={handleChange}
                className="mb-3"
              />
              <MDBInput
                label="Description"
                name="description"
                value={editingQuiz?.description || ""}
                onChange={handleChange}
                textarea
                rows={3}
              />
              {/* Ajoute ici d'autres champs si besoin */}
            </MDBModalBody>
            <MDBModalFooter>
              <MDBBtn color="secondary" onClick={closeEditModal}>
                Annuler
              </MDBBtn>
              <MDBBtn color="primary" onClick={handleSave}>
                Enregistrer
              </MDBBtn>
            </MDBModalFooter>
          </MDBModalContent>
        </MDBModalDialog>
      </MDBModal>
      <Footer />
    </div>
  );
}
