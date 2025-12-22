import NavBar from "../Components/NavBar/NavBar";
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
