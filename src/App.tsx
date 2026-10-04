import { BrowserRouter, Route, Routes } from 'react-router-dom';
import PublicLayout from "./layouts/PublicLayout";
import AdminLayout from "./layouts/AdminLayout";
import AdminRoute from "./routes/AdminRoute";
import GuestRoute from "./routes/GuestRoute";
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
import AdminSPMB from "./pages/admin/SPMB";
import AdminFacilities from "./pages/admin/Facilities";
import AdminContact from "./pages/admin/Contact";
import Staff from "./pages/admin/Staff";
import Achievement from "./pages/admin/Achievement";
import Eskul from "./pages/admin/Extracurricular";
import ExtracurricularMedia from "./pages/admin/ExtracurricularMedia";

function App() {
 return (
  <BrowserRouter>
   <Routes>
    {/* =========================
            PUBLIC WEBSITE
        ========================== */}
    <Route element={<PublicLayout />}>
     <Route path="/" element={<Home />} />
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
            AUTH
        ========================== */}
    <Route
     path="/login"
     element={
      <GuestRoute>
       <Login />
      </GuestRoute>
     }
    />

    <Route path="/forgot-password" element={<ForgotPassword />} />

    <Route path="/reset-link-sent" element={<ResetLinkSent />} />

    <Route path="/reset-password" element={<ResetPassword />} />

    <Route path="/reset-password/success" element={<ResetPasswordSuccess />} />

    {/* =========================
            PROTECTED ADMIN PANEL
        ========================== */}
    <Route
     path="/admin"
     element={
      <AdminRoute>
       <AdminLayout />
      </AdminRoute>
     }
    >
     {/* Profil Sekolah */}
     <Route index element={<AdminSchoolProfile />} />

     <Route path="profil-sekolah" element={<AdminSchoolProfile />} />

     {/* Riwayat Kepala Sekolah */}
     <Route path="principal-history" element={<PrincipalHistory />} />

     {/* Guru & Tenaga Administrasi */}
     <Route path="staff" element={<Staff />} />

     {/* Prestasi */}
     <Route path="prestasi" element={<Achievement />} />

     {/* Ekstrakurikuler */}
     <Route path="ekstrakurikuler" element={<Eskul />} />

     <Route
      path="ekstrakurikuler/:id/media"
      element={<ExtracurricularMedia />}
     />

     {/* Fasilitas */}
     <Route path="facilities" element={<AdminFacilities />} />

     {/* SPMB */}
     <Route path="spmb" element={<AdminSPMB />} />

     {/* Kontak */}
     <Route path="contact" element={<AdminContact />} />
    </Route>
   </Routes>
  </BrowserRouter>
 );
}

export default App;
