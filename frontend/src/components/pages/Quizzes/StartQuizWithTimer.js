import { useEffect, useState, useContext, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  MDBContainer,
  MDBCard,
  MDBCardBody,
  MDBBtn,
  MDBProgress,
  MDBProgressBar,
} from "mdb-react-ui-kit";
import { AuthContext } from "../../../context/AuthContext";
import Navbar from "../Navbar";
import Footer from "../Footer";
export default function StartQuizWithTimer() {
  const { id: quizId } = useParams();
  const { user } = useContext(AuthContext);
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timer, setTimer] = useState(30);
  const [finished, setFinished] = useState(false);
  const navigate = useNavigate();
  const API_URL = process.env.REACT_APP_API_URL;

  const intervalRef = useRef(null);
  const [startTime, setStartTime] = useState(null);

  useEffect(() => {
    setStartTime(Date.now());
  }, []);
  // Récupération des questions
  useEffect(() => {
    fetch(`${API_URL}/quizzes/${quizId}/questions`)
      .then((res) => res.json())
      .then(setQuestions)
      .catch(() => setQuestions([]));
  }, [quizId]);

  // Timer de chaque question
  useEffect(() => {
    if (!finished && questions.length) {
      intervalRef.current = setInterval(() => {
        setTimer((prev) => {
          if (prev <= 1) {
            clearInterval(intervalRef.current);
            handleNext(true);
            return 30;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => clearInterval(intervalRef.current);
  }, [currentIndex, finished, questions.length]);

  // Sélection réponse
  const handleSelect = (questionId, answerId) => {
    setAnswers((prev) => ({ ...prev, [questionId]: answerId }));
  };

  // Question suivante ou fin
  const handleNext = (auto = false) => {
    clearInterval(intervalRef.current);

    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setTimer(30);
    } else if (!finished) {
      setFinished(true);
      handleFinish();
    }
  };

  // Envoi des réponses au backend
  const handleFinish = async () => {
    const duration = Math.floor((Date.now() - startTime) / 1000); // en secondes

    const res = await fetch(`${API_URL}/quizzes/${quizId}/submit`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user_id: user?.id,
        answers,
        duration,
      }),
    });

    const data = await res.json();
    navigate(`/quizzes/${quizId}/result`, { state: data });
  };

  if (!questions.length) {
    return <p className="text-center mt-5">Chargement des questions...</p>;
  }

  const current = questions[currentIndex];

  return (
    <div
      className="min-h-screen flex flex-col "
      style={{ backgroundColor: "#eeeeee" }}
    >
      <Navbar />
      <MDBContainer className="py-5" style={{ height: "100vh" }}>
        <MDBCard className="mx-auto" style={{ maxWidth: "700px" }}>
          <MDBCardBody>
            <h4>
              Question {currentIndex + 1} / {questions.length}
            </h4>

            <MDBProgress className="my-2">
              <MDBProgressBar
                width={(timer / 30) * 100}
                striped
                animated
                valuemin={0}
                valuemax={30}
              />
            </MDBProgress>

            <p className="fw-bold">{current.question_text}</p>

            <ul className="list-group mb-4">
              {current.answers.map((a) => (
                <li
                  key={a.id}
                  className={`list-group-item ${
                    answers[current.id] === a.id ? "active" : ""
                  }`}
                  onClick={() => handleSelect(current.id, a.id)}
                  style={{ cursor: "pointer" }}
                >
                  {a.answer_text}
                </li>
              ))}
            </ul>

            <MDBBtn
              onClick={() => handleNext(false)}
              disabled={!answers[current.id]}
            >
              {currentIndex < questions.length - 1
                ? "Suivant"
                : "Voir le résultat"}
            </MDBBtn>
          </MDBCardBody>
        </MDBCard>
      </MDBContainer>
      <Footer />
    </div>
  );
}
