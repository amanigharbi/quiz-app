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
  }, [user, API_URL]);
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
      <MDBContainer className="py-3 flex-grow-1" style={{ height: "80vh" }}>
        <h3 className="text-center fw-bold mb-4">📝 Mes Quizzes</h3>

        {quizzes.length === 0 ? (
          <MDBCol md="6" className="mx-auto mt-2">
            <MDBCard
              className="text-center p-4"
              style={{ backgroundColor: "#fff" }}
            >
              <MDBCardImage
                src="https://thumbs.dreamstime.com/b/no-questions-3d-sign-11942994.jpg"
                position="top"
                alt="Pas de quiz disponible"
                style={{ maxWidth: "200px", margin: "0 auto" }}
              />
              <MDBCardBody>
                <MDBCardTitle>Aucun quiz disponible</MDBCardTitle>
                <MDBCardText>
                  Vous n'avez pas encore créé de quiz. Créez-en un pour
                  commencer !
                </MDBCardText>
                <MDBBtn
                  color="primary"
                  onClick={() => navigate("/create-quiz")}
                >
                  Créer un quiz
                </MDBBtn>
              </MDBCardBody>
            </MDBCard>
          </MDBCol>
        ) : (
          <>
            <div className="d-flex justify-content-end mt-4">
              <nav aria-label="Page navigation example">
                <ul className="pagination">
                  {/* Bouton Précédent */}
                  <li
                    className={`page-item ${
                      currentPage === 1 ? "disabled" : ""
                    }`}
                  >
                    <button
                      className="page-link"
                      onClick={(e) => {
                        e.preventDefault();
                        if (currentPage > 1) setCurrentPage(currentPage - 1);
                      }}
                      aria-label="Previous"
                      style={{
                        background: "none",
                        border: "none",
                        padding: 0,
                        color: "inherit",
                        textDecoration: "underline",
                        cursor: "pointer",
                      }}
                    >
                      <span aria-hidden="true">&laquo;</span>
                    </button>
                  </li>

                  {/* N° de pages */}
                  {Array.from({ length: totalPages }, (_, i) => (
                    <li
                      key={i}
                      className={`page-item ${
                        currentPage === i + 1 ? "active" : ""
                      }`}
                    >
                      <button
                        className="page-link"
                        onClick={(e) => {
                          e.preventDefault();
                          setCurrentPage(i + 1);
                        }}
                      >
                        {i + 1}
                      </button>
                    </li>
                  ))}

                  {/* Bouton Suivant */}
                  <li
                    className={`page-item ${
                      currentPage === totalPages ? "disabled" : ""
                    }`}
                  >
                    <button
                      className="page-link"
                      onClick={(e) => {
                        e.preventDefault();
                        if (currentPage < totalPages)
                          setCurrentPage(currentPage + 1);
                      }}
                      aria-label="Next"
                    >
                      <span aria-hidden="true">&raquo;</span>
                    </button>
                  </li>
                </ul>
              </nav>
            </div>

            <MDBRow>
              {currentQuizzes.map((quiz) => (
                <MDBCol md="4" className="mb-4" key={quiz.id}>
                  <MDBCard>
                    <MDBCardImage
                      src={
                        quiz.image ||
                        "https://static.vecteezy.com/ti/vecteur-libre/t2/18765759-quiz-devinez-l-icone-des-medias-sociaux-dans-un-style-plat-illustrationle-faq-sur-fond-isole-concept-d-entreprise-de-signe-de-bouton-d-aide-vectoriel.jpg"
                      }
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
          </>
        )}
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
