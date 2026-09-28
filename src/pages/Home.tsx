import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const mockSchool = {
  name: "Nama Sekolah",
  description:
    "Membangun generasi unggul, berkarakter, dan berprestasi melalui pendidikan berkualitas.",
  vision:
    "Menjadi sekolah unggul yang menghasilkan peserta didik berkarakter, berprestasi, dan siap menghadapi masa depan.",
  mission:
    "Menyelenggarakan pendidikan berkualitas, mengembangkan potensi peserta didik, serta membangun karakter dan prestasi.",
};

const mockAchievements = [
  {
    id: "1",
    name: "Kompetisi Sains Nasional",
    studentName: "Nama Siswa 1",
    rank: "Juara 1",
    level: "Nasional",
    year: 2026,
  },
  {
    id: "2",
    name: "Olimpiade Matematika",
    studentName: "Nama Siswa 2",
    rank: "Juara 2",
    level: "Provinsi",
    year: 2026,
  },
  {
    id: "3",
    name: "Lomba Kreativitas Siswa",
    studentName: "Nama Siswa 3",
    rank: "Juara 1",
    level: "Kota",
    year: 2026,
  },
];

export default function Home() {
  return (
    <div>
      {/* HERO */}
      <section className="relative min-h-[650px] overflow-hidden bg-slate-900">
        <div className="absolute inset-0 bg-black/40" />

        <div className="relative mx-auto flex min-h-[650px] max-w-7xl items-center px-5 sm:px-8 lg:px-10">
          <div className="max-w-3xl text-white">
            <p className="mb-4 text-sm font-semibold uppercase tracking-[0.2em]">
              Selamat Datang
            </p>

            <h1 className="text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">
              {mockSchool.name}
            </h1>

            <p className="mt-6 max-w-2xl text-base leading-7 text-white/80 sm:text-lg">
              {mockSchool.description}
            </p>

            <Link
              to="/profil-sekolah"
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-100"
            >
              Profil Sekolah
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* TENTANG */}
      <section className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
          <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
            <div>
              <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
                Tentang Sekolah
              </p>

              <h2 className="text-3xl font-bold text-slate-900 sm:text-4xl">
                {mockSchool.name}
              </h2>
            </div>

            <p className="leading-7 text-slate-600">
              {mockSchool.description}
            </p>
          </div>
        </div>
      </section>

      {/* VISI MISI */}
      <section className="bg-slate-50 py-20">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
          <div className="mb-12 text-center">
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
              Visi & Misi
            </p>

            <h2 className="text-3xl font-bold text-slate-900 sm:text-4xl">
              Arah dan Tujuan Sekolah
            </h2>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="rounded-2xl bg-white p-8 shadow-sm">
              <h3 className="mb-4 text-xl font-bold text-slate-900">
                Visi
              </h3>

              <p className="leading-7 text-slate-600">
                {mockSchool.vision}
              </p>
            </div>

            <div className="rounded-2xl bg-white p-8 shadow-sm">
              <h3 className="mb-4 text-xl font-bold text-slate-900">
                Misi
              </h3>

              <p className="leading-7 text-slate-600">
                {mockSchool.mission}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* PRESTASI */}
      <section className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
          <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
                Prestasi
              </p>

              <h2 className="text-3xl font-bold text-slate-900 sm:text-4xl">
                Prestasi Terbaru
              </h2>
            </div>

            <Link
              to="/prestasi"
              className="inline-flex items-center gap-2 text-sm font-semibold text-slate-900"
            >
              Lihat Lebih Banyak
              <ArrowRight size={18} />
            </Link>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {mockAchievements.map((achievement) => (
              <article
                key={achievement.id}
                className="overflow-hidden rounded-2xl border border-slate-200 bg-white"
              >
                <div className="flex h-56 items-center justify-center bg-slate-200 text-sm text-slate-500">
                  Foto Prestasi
                </div>

                <div className="p-6">
                  <p className="text-sm text-slate-500">
                    {achievement.name}
                  </p>

                  <h3 className="mt-2 text-lg font-bold text-slate-900">
                    {achievement.studentName}
                  </h3>

                  <p className="mt-2 text-sm text-slate-600">
                    {achievement.rank} • {achievement.level} •{" "}
                    {achievement.year}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}