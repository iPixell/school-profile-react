import { useParams } from 'react-router-dom';

function ExtracurricularDetail() {
 const { id } = useParams();

 return (
  <main>
   <section className="bg-amber-700 py-10 text-center text-white md:py-12">
    <h1 className="text-2xl font-bold md:text-3xl">Detail Ekstrakurikuler</h1>
   </section>

   <section className="mx-auto max-w-7xl px-6 py-12 md:py-16">
    <div className="mb-8">
     <h2 className="mb-2 text-2xl font-bold">Ekstrakurikuler</h2>

     <p className="text-sm text-gray-500">ID Ekstrakurikuler: {id}</p>
    </div>

    <div>
     <h2 className="mb-5 inline-block border-b-4 border-amber-500 pb-1 text-xl font-bold">
      Dokumentasi
     </h2>

     <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      <div className="flex h-52 items-center justify-center rounded-xl bg-gray-300">
       <span className="text-sm text-gray-600">Gambar belum tersedia</span>
      </div>

      <div className="flex h-52 items-center justify-center rounded-xl bg-gray-300">
       <span className="text-sm text-gray-600">Video belum tersedia</span>
      </div>
     </div>

     <p className="mt-6 text-sm text-gray-500">
      Belum ada dokumentasi yang ditambahkan.
     </p>
    </div>
   </section>
  </main>
 );
}

export default ExtracurricularDetail;
