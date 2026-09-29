function Contact() {
 return (
  <main>
   <section className="bg-amber-700 py-10 text-center text-white md:py-12">
    <h1 className="text-2xl font-bold md:text-3xl">Kontak Kami</h1>
   </section>

   <section className="mx-auto max-w-7xl px-6 py-12 md:py-16">
    <div className="grid items-start gap-8 md:grid-cols-2">
     <div>
      <h2 className="mb-6 inline-block border-b-4 border-amber-500 pb-1 text-2xl font-bold">
       Hubungi Kami
      </h2>

      <div className="space-y-5 text-sm sm:text-base">
       <div>
        <p className="font-bold">Alamat</p>
        <p className="mt-1 text-gray-500">Alamat belum tersedia.</p>
       </div>

       <div>
        <p className="font-bold">Nomor Telepon</p>
        <p className="mt-1 text-gray-500">Nomor telepon belum tersedia.</p>
       </div>

       <div>
        <p className="font-bold">Email</p>
        <p className="mt-1 text-gray-500">Email belum tersedia.</p>
       </div>

       <div>
        <p className="font-bold">WhatsApp</p>
        <p className="mt-1 text-gray-500">WhatsApp belum tersedia.</p>
       </div>
      </div>
     </div>

     <div className="flex h-64 items-center justify-center rounded-xl bg-gray-300">
      <span className="text-sm text-gray-600">
       Lokasi / Google Maps belum tersedia
      </span>
     </div>
    </div>
   </section>
  </main>
 );
}

export default Contact;
