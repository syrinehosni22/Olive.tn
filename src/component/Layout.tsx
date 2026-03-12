import { Outlet } from "react-router-dom";
import Header from "./header/HeaderSection";
import React from "react";
import FooterSection from "./footer/FooterSection";

const Layout: React.FC = () => {
  return (
    <>
      <Header />

      <main>
        <Outlet />
      </main>

     <FooterSection
        style="rv-20-footer"
        logo="assets/img/logo-blanc.png"
      />
    </>
  );
};

export default Layout;