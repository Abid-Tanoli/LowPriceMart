import { useEffect } from "react"
import { Outlet, useLocation } from "react-router-dom"
import Header from "./Header";
import Footer from "./Footer";

export default function AppLayout() {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }, [pathname])

  return (
    <>
      <Header/>
      <div className="flex flex-col items-center justify-center min-h-screen mx-auto bg-background">
        <Outlet />
      </div>
      <Footer/>
    </>
  );
}