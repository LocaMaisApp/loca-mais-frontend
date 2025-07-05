import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const Home: React.FC = () => {
  const { user } = useAuth();
  return (
    <div style={{ padding: "2rem", textAlign: "center" }}>
      <h1>Página Inicial</h1>
      <p>Esta é a página inicial do Loca Mais.</p>
      <Link
        to="/landing-page"
        style={{
          display: "inline-block",
          padding: "10px 20px",
          backgroundColor: "#667eea",
          color: "white",
          textDecoration: "none",
          borderRadius: "5px",
          marginTop: "1rem",
        }}
      >
        Ver Landing Page
      </Link>
      <div style={{ marginTop: "2rem" }}>
        {user ? (
          <div>
            <h2>Bem-vindo, {user.name}!</h2>
            <p>
              Você está logado como{" "}
              {user.type === "landlord" ? "Proprietário" : "Inquilino"}.
            </p>
          </div>
        ) : (
          <p>Você não está logado. Por favor, faça o login ou cadastre-se.</p>
        )}
      </div>
    </div>
  );
};

export default Home;
