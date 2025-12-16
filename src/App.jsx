// App.jsx - router, layout, and top-level providers
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import SignIn from "./pages/Sign-in-page/SignIn";
// import Home from "./pages/Home/Home"; // optional placeholder

export default function App() {
  return (
    <BrowserRouter>
      {/* Optional global layout or providers can wrap Routes here */}
      <Routes>
        <Route path="/" element={<Navigate to="/sign-in" replace />} />
        <Route path="/sign-in" element={<SignIn />} />
        {/* <Route path="/home" element={<Home />} /> */}
      </Routes>
    </BrowserRouter>
  );
}
