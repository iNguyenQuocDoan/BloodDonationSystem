import { Outlet } from "react-router-dom";
import Header from "../components/layout/header";
import Footer from "../components/layout/Footer";

const LayoutDeFault = () => {
  return (
    <>
      <Header />
      <Outlet />
      <Footer />
    </>
  );
};

export default LayoutDeFault;
