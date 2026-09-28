function SchoolProfile() {
 return (
  <main>
   {/* Header halaman */}
   <section className="bg-amber-700 py-10 text-center text-white md:py-12">
    <h1 className="text-2xl font-bold md:text-3xl">Profil Sekolah</h1>
   </section>

   {/* Tentang Sekolah */}
   <section
    id="tentang-sekolah"
    className="mx-auto max-w-7xl px-6 py-12 md:py-16"
   >
    <div className="grid items-start gap-8 md:grid-cols-2">
     <div>
      <h2 className="mb-5 inline-block border-b-4 border-amber-500 pb-1 text-2xl font-bold">
       Tentang Sekolah
      </h2>

      <p className="text-sm leading-6 text-gray-700 sm:text-base">
       Informasi tentang sekolah belum ditambahkan.
      </p>
     </div>

     <div className="flex h-52 items-center justify-center rounded-xl bg-gray-300 sm:h-64">
      <span className="text-sm text-gray-600">Gambar belum tersedia</span>
     </div>
    </div>
   </section>

   {/* Sejarah */}
   <section id="sejarah" className="mx-auto max-w-7xl px-6 pb-12 md:pb-16">
    <div className="grid items-start gap-8 md:grid-cols-2">
     <div>
      <h2 className="mb-5 inline-block border-b-4 border-amber-500 pb-1 text-2xl font-bold">
       Sejarah Sekolah
      </h2>

      <p className="text-sm leading-6 text-gray-700 sm:text-base">
       Sejarah sekolah belum ditambahkan.
      </p>
     </div>

     <div className="flex h-52 items-center justify-center rounded-xl bg-gray-300 sm:h-64">
      <span className="text-sm text-gray-600">Gambar belum tersedia</span>
     </div>
    </div>
   </section>

   {/* Visi & Misi */}
   <section id="visi-misi" className="mx-auto max-w-7xl px-6 pb-12 md:pb-16">
    <h2 className="mb-5 inline-block border-b-4 border-amber-500 pb-1 text-2xl font-bold">
     Visi & Misi
    </h2>

    <div className="space-y-5 text-sm leading-6 text-gray-700 sm:text-base">
     <p>Visi sekolah belum ditambahkan.</p>

     <p>Misi sekolah belum ditambahkan.</p>
    </div>
   </section>

   {/* Riwayat Kepala Sekolah */}
   <section
    id="kepala-sekolah"
    className="mx-auto max-w-7xl px-6 pb-12 text-center md:pb-16"
   >
    <h2 className="mb-2 inline-block border-b-4 border-amber-500 pb-1 text-2xl font-bold">
     Pejabat Kepala Sekolah
    </h2>

    <p className="mb-6 text-sm text-gray-500">
     Belum ada data yang ditambahkan.
    </p>
   </section>

   {/* Guru & Tenaga Administrasi */}
   <section
    id="guru-staff"
    className="mx-auto max-w-7xl px-6 pb-16 text-center"
   >
    <h2 className="mb-2 inline-block border-b-4 border-amber-500 pb-1 text-2xl font-bold">
     Guru & Tenaga Administrasi
    </h2>

    <p className="mb-8 text-sm text-gray-500">
     Belum ada data yang ditambahkan.
    </p>

    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
     {[1, 2, 3].map((item) => (
      <div key={item} className="overflow-hidden rounded-xl shadow-md">
       <div className="flex h-56 items-center justify-center bg-gray-300">
        <span className="text-sm text-gray-600">Gambar belum tersedia</span>
       </div>

       <div className="bg-white p-4">
        <p className="font-semibold">Data belum tersedia</p>

        <p className="mt-1 text-sm text-gray-500">Jabatan belum tersedia</p>
       </div>
      </div>
     ))}
    </div>
   </section>
  </main>
 );
}

export default SchoolProfile;
