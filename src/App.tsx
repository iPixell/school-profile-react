import { BrowserRouter, Route, Routes } from 'react-router-dom';
import PublicLayout from "./layouts/PublicLayout";
import Home from "./pages/Home";
import Achievements from "./pages/Achievements";
import SchoolProfile from "./pages/SchoolProfile";
import Extracurricular from "./pages/Extracurricular";
import ExtracurricularDetail from "./pages/ExtracurricularDetail";
import Facilities from "./pages/Facilities";
import SPMB from "./pages/SPMB";
import Contact from "./pages/Contact";

function App() {
 return (
  <BrowserRouter>
   <Routes>
    <Route element={<PublicLayout />}>
     <Route path="/" element={<Home />} />
     <Route path="/prestasi" element={<Achievements />} />
     <Route path="/profil-sekolah" element={<SchoolProfile />} />
     <Route path="/ekstrakurikuler" element={<Extracurricular />} />
     <Route path="/ekstrakurikuler/:id" element={<ExtracurricularDetail />} />
     <Route path="/sarana-prasarana" element={<Facilities />} />
     <Route path="/spmb" element={<SPMB />} />
     <Route path="/kontak" element={<Contact />} />
    </Route>
   </Routes>
  </BrowserRouter>
 );
}

export default App;
