import { BrowserRouter, Route, Routes } from 'react-router-dom';
import PublicLayout from "./layouts/PublicLayout";
import AdminLayout from "./layouts/AdminLayout";
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
import AdminSchoolProfile from "./pages/admin/SchoolProfile";
import PrincipalHistory from "./pages/admin/PrincipalHistory";
import Achievement from "./pages/admin/Achievement";
import Eskul from "./pages/admin/Extracurricular";
import ExtracurricularMedia from "./pages/admin/ExtracurricularMedia";



import Staff from "./pages/admin/Staff";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* =========================
            AUTH
        ========================== */}

        <Route path="/" element={<Login />} />

        <Route path="/login" element={<Login />} />

        <Route path="/forgot-password" element={<ForgotPassword />} />

        <Route path="/reset-link-sent" element={<ResetLinkSent />} />

        <Route path="/reset-password" element={<ResetPassword />} />

        <Route path="/reset-password/success" element={<ResetPasswordSuccess />} />

        {/* =========================
            PUBLIC WEBSITE
        ========================== */}

        <Route element={<PublicLayout />}>
          <Route path="/home" element={<Home />} />

          <Route path="/prestasi" element={<Achievements />} />

          <Route path="/profil-sekolah" element={<SchoolProfile />} />

          <Route path="/ekstrakurikuler" element={<Extracurricular />} />

          <Route path="/ekstrakurikuler/:id" element={<ExtracurricularDetail />} />

          <Route path="/sarana-prasarana" element={<Facilities />} />

          <Route path="/spmb" element={<SPMB />} />

          <Route path="/kontak" element={<Contact />} />
        </Route>

        {/* =========================
            ADMIN PANEL
        ========================== */}

        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminSchoolProfile />} />

          <Route path="profil-sekolah" element={<AdminSchoolProfile />} />

          <Route path="principal-history" element={<PrincipalHistory />} />

          <Route
            path="staff"
            element={<Staff />}
          />
          <Route
            path="achievement"
            element={<Achievement />}
          />
          <Route
            path="extracurriculars"
            element={<Eskul />}
          />
          <Route
            path="extracurriculars/:id/media"
            element={<ExtracurricularMedia />}
          />

        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
