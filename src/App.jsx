// src/App.jsx
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import SignInPage from "./features/Sign-in-page/SignInPage";
import { AuthProvider } from "./auth/AuthProvider";
import PrivateRoute from "./auth/PrivateRoute";
import HomePage from "./features/Home-page/HomePage";
import AppLayout from "./layouts/AppLayout";

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Navigate to="/sign-in" replace />} />
          <Route path="/sign-in" element={<SignInPage />} />
          <Route element={<AppLayout />}>
            <Route element={<PrivateRoute />}>
              <Route path="/home" element={<HomePage />} />
              {/* <Route path="/profile" element={<ProfilePage />} /> */}
              {/* other protected routes */}
            </Route>
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
