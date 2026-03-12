import { Link } from "react-router-dom";

type Props = {
  style?: string;
  logo: string;
};

const FooterSection = ({ style, logo }: Props) => {
  return (
    <footer className={`rv-9-footer ${style ? style : ""}`} style={{ backgroundColor: "#000", color: "#fff", padding: "60px 0 20px" }}>
      <div className="container">
        <div className="row gy-4 text-center text-md-start">
          {/* Column 1: Logo and Motto */}
          <div className="col-lg-4 col-md-6">
            <div className="rv-9-footer-logo mb-3">
              <Link to="/">
                <img src={logo} alt="Olive logo" style={{ maxWidth: "150px" }} />
              </Link>
            </div>
            <p className="small">Le portail de transaction d'huile d'olive 100% Tunisienne</p>
          </div>

          {/* Column 2: Services */}
          <div className="col-lg-2 col-md-6">
            <h6 className="mb-3">Services</h6>
            <ul className="list-unstyled small">
              <li className="mb-2"><Link to="/acheter" className="text-white text-decoration-none">Acheter de l'huile d'olive</Link></li>
              <li className="mb-2"><Link to="/vendre" className="text-white text-decoration-none">Vendre de l'huile d'olive</Link></li>
              <li className="mb-2"><Link to="/accompagnement" className="text-white text-decoration-none">Accompagnement</Link></li>
            </ul>
          </div>

          {/* Column 3: Legal */}
          <div className="col-lg-3 col-md-6">
            <h6 className="mb-3">Légal</h6>
            <ul className="list-unstyled small">
              <li className="mb-2"><Link to="/terms" className="text-white text-decoration-none">Conditions de service</Link></li>
              <li className="mb-2"><Link to="/cookies" className="text-white text-decoration-none">Cookies</Link></li>
              <li className="mb-2"><Link to="/privacy" className="text-white text-decoration-none">Protection des données</Link></li>
              <li className="mb-2"><Link to="/cookie-settings" className="text-white text-decoration-none">Manage cookie settings</Link></li>
            </ul>
          </div>

          {/* Column 4: Contact and Socials */}
          <div className="col-lg-3 col-md-6">
            <h6 className="mb-3">Contact et Info</h6>
            <ul className="list-unstyled small mb-3">
              <li className="mb-2"><Link to="/faq" className="text-white text-decoration-none">Questions Fréquentes</Link></li>
              <li className="mb-2"><Link to="/about" className="text-white text-decoration-none">À propos de nous</Link></li>
            </ul>
            <div className="rv-socials fs-4">
              <a href="#" className="text-white me-3"><i className="fa-brands fa-facebook"></i></a>
              <a href="#" className="text-white"><i className="fa-brands fa-instagram"></i></a>
            </div>
          </div>
        </div>

        <hr style={{ borderColor: "#333", marginTop: "40px" }} />

        {/* Bottom Bar: Copyright */}
        <div className="row">
          <div className="col-12 text-center">
            <p className="small mb-0" style={{ color: "#aaa" }}>
              © {new Date().getFullYear()} Oleista S.L. Interdiction de reproduction totale ou partielle sans autorisation expresse
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default FooterSection;