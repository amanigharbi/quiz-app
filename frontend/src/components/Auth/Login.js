import React from "react";
import {
  MDBBtn,
  MDBContainer,
  MDBCard,
  MDBCardBody,
  MDBCardImage,
  MDBRow,
  MDBCol,
  MDBIcon,
  MDBInput,
} from "mdb-react-ui-kit";
import { Link } from "react-router-dom";

import "../../styles/Pages.css";

function Login() {
  return (
    <MDBContainer
      fluid
      className="login-container d-flex justify-content-center"
    >
      <MDBCard
        className="login-card rounded-5 shadow"
        style={{ maxWidth: "900px" }}
      >
        <MDBRow className="g-0">
          <MDBCol md="6">
            <MDBCardImage
              src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/img1.webp"
              alt="Visuel de connexion"
              className="w-100 h-100 rounded-start"
              style={{ objectFit: "cover" }}
            />
          </MDBCol>

          <MDBCol md="6">
            <MDBCardBody className="d-flex flex-column justify-content-center px-5">
              <div className="d-flex justify-content-center align-items-center">
                <img src="/logo.png" alt="Logo" style={{ height: "120px" }} />
              </div>

              <h5
                className="fw-normal mb-4 pb-3"
                style={{ letterSpacing: "1px" }}
              >
                Connectez-vous à votre compte
              </h5>

              <MDBInput
                wrapperClass="mb-4"
                label="Adresse email"
                id="email"
                type="email"
                size="lg"
              />
              <MDBInput
                wrapperClass="mb-4"
                label="Mot de passe"
                id="password"
                type="password"
                size="lg"
              />

              <MDBBtn className="mb-4 px-5" color="dark" size="lg">
                Se connecter
              </MDBBtn>

              <a className="small text-muted" href="#!">
                Mot de passe oublié ?
              </a>

              <p className="mb-5 pb-lg-2" style={{ color: "#393f81" }}>
                Vous n'avez pas de compte ?{" "}
                <Link to="/register" style={{ color: "#393f81" }}>
                  Inscrivez-vous ici
                </Link>
              </p>

              <div className="d-flex flex-row justify-content-start">
                <a href="#!" className="small text-muted me-1">
                  Conditions d'utilisation
                </a>
                <a href="#!" className="small text-muted">
                  Politique de confidentialité
                </a>
              </div>
            </MDBCardBody>
          </MDBCol>
        </MDBRow>
      </MDBCard>
    </MDBContainer>
  );
}

export default Login;
