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


import AdminLayout from "./layouts/AdminLayout";
import Staff from "./pages/admin/Staff";
import PrincipalHistory from "./pages/admin/PrincipalHistory";
import AdminExtracurricular from "./pages/admin/Extracurricular";
import AdminSchoolProfile from "./pages/admin/SchoolProfile";

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

        <Route element={<AdminLayout />}>
          <Route
            path="/admin/staff"
            element={<Staff />}
          />

          <Route
            path="/admin/principal-history"
            element={<PrincipalHistory />}
          />
        </Route>

        <Route
          path="/admin/ekstrakurikuler"
          element={<AdminExtracurricular />}
        />

        <Route
          path="/admin/profil-sekolah"
          element={<AdminSchoolProfile />}
        />


      </Routes>
    </BrowserRouter>
  );
}

export default App;