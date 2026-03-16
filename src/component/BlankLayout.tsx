import { Outlet } from "react-router-dom";
import Header from "./header/HeaderSection";
import React from "react";
import FooterSection from "./footer/FooterSection";

const Layout: React.FC = () => {

  return (
    <>
      <main>
        <Outlet />
      </main>
     
    </>
  );
};

export default Layout;