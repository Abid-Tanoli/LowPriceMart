import { Outlet } from "react-router-dom"
import Header from "./Header";
import Footer from "./Footer";

export default function AppLayout() {
  return (
    <>
        <Header/>
        <div className="flex flex-col items-center justify-center min-h-screen mx-auto bg-gray-100">
      <Outlet />
      </div>
      <Footer/>
    </>
  );
}