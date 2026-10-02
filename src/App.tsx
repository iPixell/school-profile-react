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
import AdminRoute from "./routes/AdminRoute";

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
            ADMIN AUTH
        ========================== */}

    <Route path="/login" element={<Login />} />

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
     <Route index element={<AdminSchoolProfile />} />

     <Route path="profil-sekolah" element={<AdminSchoolProfile />} />

     <Route path="principal-history" element={<PrincipalHistory />} />
    </Route>
   </Routes>
  </BrowserRouter>
 );
}

export default App;
