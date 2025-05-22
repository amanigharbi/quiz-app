import { useState, useContext } from "react";
import {
  MDBContainer,
  MDBCard,
  MDBCardBody,
  MDBInput,
  MDBTextArea,
  MDBBtn,
} from "mdb-react-ui-kit";
import { AuthContext } from "../../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import Navbar from "../Navbar";
import Footer from "../Footer";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
export default function CreateQuizStepper() {
  const { user } = useContext(AuthContext);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const API_URL = process.env.REACT_APP_API_URL;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!title.trim()) {
      setError("Le titre est requis.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/quizzes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          description,
          user_id: user?.id,
        }),
      });

      const data = await res.json();
      setLoading(false);

      if (!res.ok) {
        setError(data.error || "Erreur lors de la création.");
        return;
      }

      toast.success("Quiz créé avec succès !");
      setTimeout(() => navigate(`/quizzes/${data.id}/add-questions`), 1500);
    } catch (err) {
      setLoading(false);
      toast.error("Erreur de connexion.");
    }
  };

  return (
    <div
      className="min-h-screen flex flex-col "
      style={{ backgroundColor: "#eeeeee", height: "100vh" }}
    >
      <Navbar />
      <MDBContainer className="d-flex flex-column align-items-center justify-content-center py-5 flex-grow-1">
        <MDBCard className="w-100" style={{ maxWidth: "600px" }}>
          <MDBCardBody>
            <h3 className="text-center mb-4 fw-bold">Créer un Quiz</h3>

            {error && (
              <div className="alert alert-danger text-center">{error}</div>
            )}
            {success && (
              <div className="alert alert-success text-center">{success}</div>
            )}

            <form onSubmit={handleSubmit}>
              <MDBInput
                label="Titre du Quiz"
                id="title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="mb-4"
              />
              <MDBTextArea
                label="Description"
                id="description"
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="mb-4"
              />

              <MDBBtn
                type="submit"
                color="primary"
                className="w-100"
                disabled={!title.trim() || loading}
              >
                {loading ? "Création en cours..." : "Créer Quiz"}
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
