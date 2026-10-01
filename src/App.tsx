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
import AdminSchoolProfile from "./pages/AdminSchoolProfile";
import Login from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword";
import ResetLinkSent from "./pages/ResetLinkSent";
import ResetPassword from "./pages/ResetPassword";
import ResetPasswordSuccess from "./pages/ResetPasswordSuccess";

function AdminComingSoon() {
 return (
  <div className="flex min-h-screen items-center justify-center p-8">
   <div className="text-center">
    <h1 className="text-2xl font-bold text-gray-900">Halaman Admin</h1>

    <p className="mt-2 text-gray-500">Halaman ini akan segera dibuat.</p>
   </div>
  </div>
 );
}

function App() {
 return (
  <BrowserRouter>
   <Routes>
    {/* =========================
            AUTH
        ========================== */}

    <Route path="/" element={<Navigate to="/login" replace />} />

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

    {/* ADMIN TEST */}
<Route
  path="/admin"
  element={
    <div className="min-h-screen bg-red-100 p-10">
      <h1 className="text-3xl font-bold">
        ADMIN TEST BERHASIL
      </h1>
    </div>
  }
/>
   </Routes>
  </BrowserRouter>
 );
}

export default App;
