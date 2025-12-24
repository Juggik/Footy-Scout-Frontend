import NavBar from "../Components/NavBar/NavBar";
import { Outlet } from 'react-router-dom';
import Footer from "../Components/Footer/Footer";

export default function AppLayout() {
  return (
    <div style={{ 
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
      backgroundColor: "rgba(31, 60, 125, 0.541)"
    }}>
      <NavBar />

      <main style={{ flex: 1 }}>
        <Outlet />
      </main>

      <Footer />
    </div>
  );
}
