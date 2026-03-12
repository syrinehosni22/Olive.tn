import React from 'react';

const SignIn = () => {
  return (
    <main className="bg-white min-vh-100 d-flex align-items-center py-5 overflow-hidden">
      <div className="container">
        <div className="row align-items-center">
          
          {/* --- PARTIE GAUCHE : COMPOSITION ARTISTIQUE --- */}
          <div className="col-lg-6 position-relative d-flex justify-content-center justify-content-lg-start mb-5 mb-lg-0">
            {/* Cadre noir en arrière-plan */}
            <div 
              className="position-absolute d-none d-sm-block"
              style={{
                width: '320px',
                height: '450px',
                border: '6px solid black',
                top: '-20px',
                left: '20px',
                zIndex: 1
              }}
            ></div>
            
            {/* Image avec bordure fine (comme le contour violet de votre capture) */}
            <div 
              className="position-relative bg-white"
              style={{
                width: '320px',
                height: '520px',
                zIndex: 2,
                marginLeft: '40px',
                border: '1px solid #8A5CF5', // Couleur violette fine de votre capture
                overflow: 'hidden'
              }}
            >
              <img 
                src="/assets/img/login/olive-oil-bowl.png" 
                alt="Tunisian Olive Oil" 
                className="w-100 h-100 object-fit-cover"
              />
            </div>
          </div>

          {/* --- PARTIE DROITE : TEXTE & ACTIONS --- */}
          <div className="col-lg-6 text-center text-lg-end pe-lg-5">
            <div className="d-flex flex-column align-items-center align-items-lg-end">
              
              {/* Slogan minimaliste */}
              <p 
                className="text-uppercase mb-4 text-dark fw-medium" 
                style={{ 
                  letterSpacing: '2px', 
                  fontSize: '0.75rem', 
                  maxWidth: '300px',
                  lineHeight: '1.6'
                }}
              >
                The marketplacer that reunite best of tunisian olive oil
              </p>

              {/* Bouton Se connecter avec le style pilule */}
              <button 
                className="btn btn-outline-dark rounded-pill px-5 py-2 shadow-sm"
                style={{
                  fontSize: '1.6rem',
                  fontFamily: 'serif', // Pour le look "Se connecter" de l'image
                  borderWidth: '1.5px',
                  minWidth: '280px',
                  backgroundColor: 'transparent'
                }}
              >
                Se connecter
              </button>
              
            </div>
          </div>

        </div>
      </div>
    </main>
  );
};

export default SignIn;