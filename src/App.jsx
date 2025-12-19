// App.jsx - router, layout, and top-level providers
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import SignInPage from "./features/Sign-in-page/SignInPage.jsx";
// import Home from "./pages/Home/Home"; // optional placeholder

export default function App() {
  return (
    <BrowserRouter>
      {/* Optional global layout or providers can wrap Routes here */}
      <Routes>
        <Route path="/" element={<Navigate to="/sign-in" replace />} />
        <Route path="/sign-in" element={<SignInPage />} />
        {/* <Route path="/home" element={<Home />} /> */}
      </Routes>
    </BrowserRouter>
  );
}
