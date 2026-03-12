import React from 'react';

export const ContactPage: React.FC = () => {
  return (
    <section className="py-5 bg-white">
      <div className="container py-5">
        <div className="row align-items-center g-0">
          
          {/* PARTIE GAUCHE : Image avec effet de cadre décalé */}
          <div className="col-md-5 position-relative mb-5 mb-md-0">
            {/* Le cadre noir en arrière-plan */}
            <div 
              className="position-absolute" 
              style={{
                width: '80%',
                height: '90%',
                border: '8px solid black',
                top: '-20px',
                left: '20px',
                zIndex: 1
              }}
            ></div>
            
            {/* L'image principale décalée */}
            <div className="position-relative" style={{ zIndex: 2, marginLeft: '60px' }}>
              <img 
                src="/assets/img/contact/Oil pouring.jpg" 
                alt="Olive Oil Pouring" 
                className="img-fluid"
                style={{ width: '90%', display: 'block' }}
              />
            </div>
          </div>

          {/* PARTIE DROITE : Bloc de contact encadré */}
          <div className="col-md-7">
            <div 
              className="d-flex flex-column align-items-center justify-content-center text-center p-5 mx-md-4"
              style={{
                border: '3px solid black',
                minHeight: '400px',
              }}
            >
              <div style={{ fontFamily: 'serif' }}>
                <h3 className="fw-bold mb-2" style={{ fontSize: '1.8rem' }}>
                  Contact@olivetn.com
                </h3>
                <h3 className="fw-bold" style={{ fontSize: '1.8rem' }}>
                  +216 50 777 000
                </h3>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};