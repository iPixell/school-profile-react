import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import PublicLayout from "./layouts/PublicLayout";

import Home from "./pages/Home";
import Achievements from "./pages/Achievements";
import SchoolProfile from "./pages/SchoolProfile";
import Extracurricular from "./pages/Extracurricular";
import ExtracurricularDetail from "./pages/ExtracurricularDetail";
import Facilities from "./pages/Facilities";
import SPMB from "./pages/SPMB";
import Contact from "./pages/Contact";

import Login from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword";
import ResetLinkSent from "./pages/ResetLinkSent";
import ResetPassword from "./pages/ResetPassword";
import ResetPasswordSuccess from "./pages/ResetPasswordSuccess";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Halaman utama website = Login */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* Website setelah login */}
        <Route element={<PublicLayout />}>
          <Route path="/home" element={<Home />} />
          <Route path="/prestasi" element={<Achievements />} />
          <Route path="/profil-sekolah" element={<SchoolProfile />} />

          <Route
            path="/ekstrakurikuler"
            element={<Extracurricular />}
          />

          <Route
            path="/ekstrakurikuler/:id"
            element={<ExtracurricularDetail />}
          />

          <Route
            path="/sarana-prasarana"
            element={<Facilities />}
          />

          <Route path="/spmb" element={<SPMB />} />
          <Route path="/kontak" element={<Contact />} />
        </Route>

        {/* Auth */}
        <Route path="/login" element={<Login />} />
        <Route
          path="/forgot-password"
          element={<ForgotPassword />}
        />
        <Route
          path="/reset-link-sent"
          element={<ResetLinkSent />}
        />
        <Route
          path="/reset-password"
          element={<ResetPassword />}
        />
        <Route
          path="/reset-password/success"
          element={<ResetPasswordSuccess />}
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;