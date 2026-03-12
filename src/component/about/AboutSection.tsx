import DivAnimateYAxis from "../utils/DivAnimateYAxis";

const AboutSection = () => {
  return (
    <>
      <section className="rv-20-about_section">
        <div className="container">
          {/* Titre principal inspiré de la capture Canva */}
          <div className="row mb-50">
            <div className="col-12 text-center">
              <h2
                className="rv-20-about_title section-space"
                style={{ fontWeight: "bold" }}
              >
                Vendez-vous ou achetez-vous de l'huile d'olive ?
              </h2>
            </div>
          </div>

          <DivAnimateYAxis className="row align-items-center mt-20">
            {/* Section Images (Gauche) */}
            <div className="col-md-12  col-lg-6 col-xl-5">
              <div className="rv-20-about_image">
                <img src="assets/img/olive-branch.png" alt="image" />

                <img src="assets/img/about/olive-1.2.png" alt="image" />
              </div>
            </div>

            {/* Section Contenu (Droite) */}
            <div className="col-md-12 col-lg-6 col-xl-6">
              <div className="rv-20-about_section_content text-center">
                {/* Logo Olive au lieu du texte H1 */}
                <div className="rv-20-about_logo mb-20">
                  <img
                    src="assets/img/logo.png"
                    alt="Olive TN Logo"
                    style={{ maxWidth: "200px" }}
                  />
                </div>

                <p className="rv-20-about_description">
                  Relie les vendeurs tunisiens et les acheteurs du monde entier
                  pour leur permettre de négocier directement <br />
                  <strong>
                    Sans commissions et sans frais supplémentaires.
                  </strong>
                </p>
              </div>
            </div>
          </DivAnimateYAxis>
        </div>
      </section>
      {/* Deuxième Section : Écosystème */}
      <section className="rv-20-about_section rv-20-about_section_second">
        <div className="container">
          <DivAnimateYAxis className="row align-items-center">
            {/* Colonne Gauche : Logo et Texte */}
            <div className="col-md-12 col-lg-6 col-xl-6 order-2 order-lg-1">
              <div className="rv-20-about_section_content text-center">
                <div className="rv-20-about_logo mb-25">
                  <img
                    src="assets/img/logo.png"
                    alt="Olive TN Logo"
                    style={{ maxWidth: "180px" }}
                  />
                </div>
                <h3 className="texte">
                  Pour un écosystème Tunisien plus fort et plus Performant{" "}
                  <br />
                  Tous unis face à une concurrence internationale
                </h3>
              </div>
            </div>

            {/* Colonne Droite : Titre et Image Récolte */}
            <div className="col-md-12 col-lg-6 col-xl-6 order-1 order-lg-2">
              <div className="rv-20-about_image_wrapper text-center">
                <h2
                  className="rv-20-about_question mb-20"
                  style={{ fontWeight: "600", fontSize: "24px" }}
                >
                  Vous travaillez dans l'huile d'olive ?
                </h2>
                <div className="rv-20-about_image_main">
                  <img
                    src="assets/img/olive-harvest.png"
                    alt="Récolte d'olives"
                    style={{
                      borderRadius: "0px",
                      width: "100%",
                      boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                    }}
                  />
                </div>
              </div>
            </div>
          </DivAnimateYAxis>
        </div>
      </section>
    </>
  );
};

export default AboutSection;
