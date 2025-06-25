import React from 'react';
import { Link } from 'react-router-dom';

const Home: React.FC = () => {
  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <h1>Página Inicial</h1>
      <p>Esta é a página inicial do Loca Mais.</p>
      <Link to="/landing-page" style={{ 
        display: 'inline-block', 
        padding: '10px 20px', 
        backgroundColor: '#667eea', 
        color: 'white', 
        textDecoration: 'none', 
        borderRadius: '5px',
        marginTop: '1rem'
      }}>
        Ver Landing Page
      </Link>
    </div>
  );
};

export default Home;
