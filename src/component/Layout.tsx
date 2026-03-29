import { Outlet } from "react-router-dom";
import Header from "./header/HeaderSection";
import React from "react";
import FooterSection from "./footer/FooterSection";

const Layout: React.FC = () => {
  // On vérifie l'état d'authentification

  return (
    <>
      {/* On affiche le Header seulement si l'utilisateur n'est pas connecté */}
      <Header />

      <main>
        <Outlet />
      </main>

      {/* On affiche le Footer seulement si l'utilisateur n'est pas connecté */}
      <FooterSection style="rv-20-footer" logo="assets/img/logo-blanc.png" />
    </>
  );
};

export default Layout;
