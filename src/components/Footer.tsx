function Footer() {
 return (
  <footer className="bg-amber-700 text-white">
   <div className="mx-auto grid max-w-7xl gap-10 px-6 py-12 md:grid-cols-3">
    <div className="flex items-center gap-4">
     <div className="h-12 w-12 rounded-full bg-gray-200" />

     <span className="text-lg font-bold">
      SD NEGERI
      <br />
      BAROS 3
     </span>
    </div>

    <div>
     <h3 className="mb-5 font-semibold">Kontak Kami</h3>

     <div className="space-y-3 text-sm">
      <p>Alamat belum tersedia</p>
      <p>Nomor telepon belum tersedia</p>
      <p>Email belum tersedia</p>
     </div>
    </div>

    <div>
     <h3 className="mb-5 font-semibold">Ikuti Kami</h3>

     <div className="flex gap-3">
      <a href="#" aria-label="Instagram">
       Instagram
      </a>

      <a href="#" aria-label="Facebook">
       Facebook
      </a>

      <a href="#" aria-label="YouTube">
       YouTube
      </a>

      <a href="#" aria-label="WhatsApp">
       WhatsApp
      </a>
     </div>
    </div>
   </div>

   <div className="border-t border-white/20 py-3 text-center text-xs">
    © 2026 SD Negeri Baros 3
   </div>
  </footer>
 );
}

export default Footer;
