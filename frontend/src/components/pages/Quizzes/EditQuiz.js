import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  MDBContainer,
  MDBCard,
  MDBCardBody,
  MDBInput,
  MDBTextArea,
  MDBBtn,
  MDBSpinner,
} from "mdb-react-ui-kit";
import Navbar from "../Navbar";
import Footer from "../Footer";
import { toast } from "react-toastify";

export default function EditQuiz() {
  const { id: quizId } = useParams();
  const navigate = useNavigate();
  const API_URL = process.env.REACT_APP_API_URL;

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_URL}/quizzes/${quizId}`)
      .then((res) => res.json())
      .then((data) => {
        setTitle(data.title || "");
        setDescription(data.description || "");
        setLoading(false);
      })
      .catch(() => {
        toast.error("Erreur lors du chargement du quiz.");
        setLoading(false);
      });
  }, [quizId]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      toast.error("Le titre est requis.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/quizzes/${quizId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, description }),
      });

      if (!res.ok) {
        const data = await res.json();
        toast.error(data.error || "Échec de la mise à jour.");
        setLoading(false);
        return;
      }

      toast.success("Quiz mis à jour !");
      navigate("/mes-quizzes");
    } catch (err) {
      toast.error("Erreur serveur.");
      setLoading(false);
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
    <div className="min-h-screen d-flex flex-column bg-light">
      <Navbar />
      <MDBContainer className="py-5 flex-grow-1">
        <MDBCard className="mx-auto" style={{ maxWidth: "600px" }}>
          <MDBCardBody>
            <h3 className="text-center fw-bold mb-4">Modifier le Quiz</h3>

            <form onSubmit={handleUpdate}>
              <MDBInput
                label="Titre"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="mb-4"
              />
              <MDBTextArea
                label="Description"
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="mb-4"
              />
              <MDBBtn type="submit" block disabled={loading}>
                Enregistrer les modifications
              </MDBBtn>
              <MDBBtn
                outline
                color="secondary"
                block
                className="mt-3"
                onClick={() => navigate("/mes-quizzes")}
              >
                Annuler
              </MDBBtn>
            </form>
          </MDBCardBody>
        </MDBCard>
      </MDBContainer>
      <Footer />
    </div>
  );
}
