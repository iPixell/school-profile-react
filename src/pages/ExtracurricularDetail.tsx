import { useParams } from 'react-router-dom';

function ExtracurricularDetail() {
 const { id } = useParams();

 // Sementara untuk testing.
 // Nanti nama akan diambil dari API berdasarkan id.
 const extracurricularName = `Ekstrakurikuler ${id}`;

 return (
  <main>
   <section className="bg-amber-700 py-10 text-center text-white md:py-12">
    <h1 className="text-2xl font-bold md:text-3xl">
     Dokumentasi {extracurricularName}
    </h1>
   </section>

   <section className="mx-auto max-w-7xl px-6 py-16">
    <div className="flex min-h-60 items-center justify-center text-center">
     <p className="text-sm text-gray-500">
      Belum ada dokumentasi yang tersedia.
     </p>
    </div>
   </section>
  </main>
 );
}

export default ExtracurricularDetail;
