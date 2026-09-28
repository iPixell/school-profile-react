import { BrowserRouter, Route, Routes } from 'react-router-dom';
import PublicLayout from "./layouts/PublicLayout";
import Home from "./pages/Home";
import SchoolProfile from "./pages/SchoolProfile";
import Extracurricular from "./pages/Extracurricular";
import ExtracurricularDetail from "./pages/ExtracurricularDetail";

function App() {
 return (
  <BrowserRouter>
   <Routes>
    <Route element={<PublicLayout />}>
     <Route path="/" element={<Home />} />
     <Route path="/profil-sekolah" element={<SchoolProfile />} />
     <Route path="/ekstrakurikuler" element={<Extracurricular />} />
     <Route path="/ekstrakurikuler/:id" element={<ExtracurricularDetail />} />
    </Route>
   </Routes>
  </BrowserRouter>
 );
}

export default App;
