import NavBar from "../Components/Navbar/Navbar";
import { Outlet } from 'react-router-dom';

export default function AppLayout() {
  return (
    <>
      <NavBar />
      <main>
        <Outlet />
      </main>
    </>
  );
}
