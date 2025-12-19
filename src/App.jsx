// src/App.jsx
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import SignInPage from "./features/Sign-in-page/SignInPage";
import { AuthProvider } from "./auth/AuthProvider";
import PrivateRoute from "./auth/PrivateRoute";


export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Navigate to="/sign-in" replace />} />
          <Route path="/sign-in" element={<SignInPage />} />
          <Route
            path="/home"
            element={
              <PrivateRoute>
                
              </PrivateRoute>
            }
          />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
