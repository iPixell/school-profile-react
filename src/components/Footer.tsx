export default function Footer() {
  return (
    <footer className="bg-slate-950 text-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-14 sm:px-8 lg:grid-cols-3 lg:px-10">
        {/* School */}
        <div>
          <div className="mb-5 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-xs font-bold text-slate-950">
              LOGO
            </div>

            <div>
              <h3 className="font-bold">NAMA SEKOLAH</h3>
              <p className="text-sm text-slate-400">
                School Profile
              </p>
            </div>
          </div>

          <p className="max-w-sm text-sm leading-6 text-slate-400">
            Informasi resmi sekolah mengenai profil, kegiatan,
            prestasi, fasilitas, dan layanan pendidikan.
          </p>
        </div>

        {/* Contact */}
        <div>
          <h3 className="mb-5 text-lg font-semibold">Kontak</h3>

          <div className="space-y-3 text-sm text-slate-400">
            <p>Alamat sekolah</p>
            <p>Telepon: -</p>
            <p>Email: -</p>
            <p>WhatsApp: -</p>
          </div>
        </div>

        {/* Social Media */}
        <div>
          <h3 className="mb-5 text-lg font-semibold">Media Sosial</h3>

          <div className="space-y-3 text-sm text-slate-400">
            <a
              href="#"
              className="block transition hover:text-white"
            >
              Instagram
            </a>

            <a
              href="#"
              className="block transition hover:text-white"
            >
              Facebook
            </a>

            <a
              href="#"
              className="block transition hover:text-white"
            >
              YouTube
            </a>

            <a
              href="#"
              className="block transition hover:text-white"
            >
              WhatsApp
            </a>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto max-w-7xl px-5 py-5 text-center text-sm text-slate-500 sm:px-8 lg:px-10">
          © {new Date().getFullYear()} Nama Sekolah. All rights reserved.
        </div>
      </div>
    </footer>
  );
}