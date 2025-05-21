import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { MDBContainer, MDBCard, MDBCardBody, MDBBtn } from "mdb-react-ui-kit";
import { motion } from "framer-motion";
import Navbar from "../Navbar";
import Footer from "../Footer";

export default function QuizStepView() {
  const { id: quizId } = useParams();
  const API_URL = process.env.REACT_APP_API_URL;

  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    fetch(`${API_URL}/quizzes/${quizId}/questions`)
      .then((res) => res.json())
      .then((data) => setQuestions(data));
  }, [quizId]);

  const current = questions[currentIndex];

  const next = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const prev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  if (!current) return <p className="text-center mt-4">Chargement...</p>;

  return (
    <div className="min-h-screen flex flex-col bg-light">
      <Navbar />
      <MDBContainer className="py-5 flex-grow-1">
        <MDBCard className="mx-auto" style={{ maxWidth: "800px" }}>
          <MDBCardBody>
            <h4 className="text-center mb-3">
              Question {currentIndex + 1} / {questions.length}
            </h4>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
            >
              <p className="fw-bold">{current.question_text}</p>
              <ul className="mt-3">
                {current.answers.map((a) => (
                  <li key={a.id}>
                    {a.answer_text}{" "}
                    {a.is_correct ? (
                      <span className="text-success fw-bold">(✔ correcte)</span>
                    ) : null}
                  </li>
                ))}
              </ul>
            </motion.div>

            <div className="d-flex justify-content-between mt-4">
              <MDBBtn onClick={prev} disabled={currentIndex === 0}>
                Précédent
              </MDBBtn>
              <MDBBtn
                onClick={next}
                disabled={currentIndex === questions.length - 1}
              >
                Suivant
              </MDBBtn>
            </div>
          </MDBCardBody>
        </MDBCard>
      </MDBContainer>
      <Footer />
    </div>
  );
}
