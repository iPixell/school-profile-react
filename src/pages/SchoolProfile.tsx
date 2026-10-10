import { useEffect, useState } from "react";

import {
  getSchoolProfile,
  type SchoolProfile as SchoolProfileData,
} from "../services/schoolProfile.service";

import {
  getPrincipalHistories,
  type PrincipalHistory,
} from "../services/principalHistory.service";

import { getStaff, type Staff } from "../services/staff.service";

function SchoolProfile() {
  const [profile, setProfile] = useState<SchoolProfileData | null>(null);

  const [principalHistories, setPrincipalHistories] = useState<
    PrincipalHistory[]
  >([]);

  const [staff, setStaff] = useState<Staff[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;

    async function loadData() {
      try {
        const [profileResponse, principalResponse, staffResponse] =
          await Promise.all([
            getSchoolProfile(),
            getPrincipalHistories(),
            getStaff(),
          ]);

        if (!mounted) return;

        setProfile(profileResponse.data);
        setPrincipalHistories(principalResponse.data);
        setStaff(staffResponse.data);
      } catch (error) {
        console.error("Gagal mengambil data profil sekolah:", error);

        if (mounted) {
          setError("Gagal mengambil data profil sekolah.");
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    void loadData();

    return () => {
      mounted = false;
    };
  }, []);

  if (loading) {
    return (
      <main className="flex min-h-96 items-center justify-center">
        <p className="text-sm text-gray-500">Memuat data...</p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="flex min-h-96 items-center justify-center">
        <p className="text-sm text-red-500">{error}</p>
      </main>
    );
  }

  if (!profile) {
    return (
      <main className="flex min-h-96 items-center justify-center">
        <p className="text-sm text-gray-500">
          Data profil sekolah belum tersedia.
        </p>
      </main>
    );
  }

  return (
    <main className="min-w-0 w-full">
      {/* Header */}
      <section className="bg-amber-700 px-4 py-10 text-center text-white md:py-12">
        <h1 className="text-2xl font-bold md:text-3xl">
          Profil Sekolah
        </h1>
      </section>

      {/* Tentang Sekolah */}
      <section
        id="tentang-sekolah"
        className="mx-auto max-w-7xl px-4 py-12 sm:px-6 md:py-16"
      >
        <div className="grid min-w-0 items-start gap-8 md:grid-cols-2">
          <div className="min-w-0">
            <h2 className="mb-5 inline-block border-b-4 border-amber-500 pb-1 text-2xl font-bold">
              Tentang Sekolah
            </h2>

            <p className="whitespace-pre-line break-words text-sm leading-6 text-gray-700 sm:text-base">
              {profile.about ||
                "Informasi tentang sekolah belum tersedia."}
            </p>
          </div>

          <div className="flex h-52 min-w-0 items-center justify-center overflow-hidden rounded-xl bg-gray-100 sm:h-64">
            {profile.logoUrl ? (
              <img
                src={profile.logoUrl}
                alt={profile.schoolName}
                className="h-full w-full object-cover"
              />
            ) : (
              <span className="text-sm text-gray-500">
                Gambar belum tersedia
              </span>
            )}
          </div>
        </div>
      </section>

      {/* Sejarah */}
      <section
        id="sejarah"
        className="mx-auto max-w-7xl px-4 pb-12 sm:px-6 md:pb-16"
      >
        <div className="grid min-w-0 items-start gap-8 md:grid-cols-2">
          <div className="min-w-0">
            <h2 className="mb-5 inline-block border-b-4 border-amber-500 pb-1 text-2xl font-bold">
              Sejarah Sekolah
            </h2>

            <p className="whitespace-pre-line break-words text-sm leading-6 text-gray-700 sm:text-base">
              {profile.history || "Sejarah sekolah belum tersedia."}
            </p>
          </div>

          <div className="flex h-52 min-w-0 items-center justify-center overflow-hidden rounded-xl bg-gray-100 sm:h-64">
            <span className="text-sm text-gray-500">
              Gambar belum tersedia
            </span>
          </div>
        </div>
      </section>

      {/* Visi & Misi */}
      <section
        id="visi-misi"
        className="mx-auto max-w-7xl px-4 pb-12 sm:px-6 md:pb-16"
      >
        <h2 className="mb-5 inline-block border-b-4 border-amber-500 pb-1 text-2xl font-bold">
          Visi & Misi
        </h2>

        <div className="space-y-6 text-sm leading-6 text-gray-700 sm:text-base">
          <div>
            <h3 className="mb-2 font-bold">Visi</h3>

            <p className="whitespace-pre-line break-words">
              {profile.vision || "Visi sekolah belum tersedia."}
            </p>
          </div>

          <div>
            <h3 className="mb-2 font-bold">Misi</h3>

            {profile.mission ? (
              <ul className="space-y-2">
                {profile.mission.split("\n").map((item, index) => (
                  <li key={index} className="break-words">
                    • {item}
                  </li>
                ))}
              </ul>
            ) : (
              <p>Misi sekolah belum tersedia.</p>
            )}
          </div>
        </div>
      </section>

      {/* Pejabat Kepala Sekolah */}
      <section
        id="kepala-sekolah"
        className="mx-auto max-w-4xl px-4 pb-12 sm:px-6 md:pb-16"
      >
        <div className="mb-8 text-center">
          <h2 className="inline-block border-b-4 border-amber-500 pb-1 text-2xl font-bold text-gray-800">
            Pejabat Kepala Sekolah
          </h2>
        </div>

        {principalHistories.length > 0 ? (
          <div className="mx-auto max-w-3xl">
            <ul className="space-y-3">
              {[...principalHistories]
                .sort((a, b) => {
                  const yearA = Number(
                    a.period.match(/\d{4}/)?.[0] || 0,
                  );
                  const yearB = Number(
                    b.period.match(/\d{4}/)?.[0] || 0,
                  );

                  return yearA - yearB;
                })
                .map((item) => (
                  <li
                    key={item.id}
                    className="flex items-start gap-3 text-sm leading-6 text-gray-700 sm:text-base"
                  >
                    <span className="mt-0.5 font-bold text-black">
                      •
                    </span>

                    <span className="min-w-0 break-words">
                      <span className="font-medium">
                        {String(item.period)
                          .trim()
                          .endsWith(String(new Date().getFullYear()))
                          ? `${String(item.period).trim().slice(0, -4)}sekarang`
                          : item.period}
                      </span>

                      {" — "}

                      <span className="font-semibold text-gray-800">
                        {item.name}
                      </span>
                    </span>
                  </li>
                ))}
            </ul>
          </div>
        ) : (
          <div className="flex min-h-32 items-center justify-center text-center">
            <p className="text-sm text-gray-500">
              Belum ada data pejabat kepala sekolah.
            </p>
          </div>
        )}
      </section>

      {/* Guru & Tenaga Administrasi */}
      <section
        id="guru-staff"
        className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 md:pb-20"
      >
        <div className="mb-8 text-center">
          <h2 className="inline-block border-b-4 border-amber-500 pb-1 text-2xl font-bold">
            Guru & Tenaga Administrasi
          </h2>

          <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-gray-500">
            Kenali guru dan tenaga administrasi yang mendukung kegiatan
            sekolah.
          </p>
        </div>

        {staff.length > 0 ? (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {staff.map((item) => (
              <article
                key={item.id}
                className="min-w-0 overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-md"
              >
                {/* Foto selalu mengikuti rasio 4:3 */}
                <div className="aspect-[4/3] w-full overflow-hidden bg-gray-100">
                  {item.photoUrl ? (
                    <img
                      src={item.photoUrl}
                      alt={`Foto ${item.name}`}
                      loading="lazy"
                      className="h-full w-full object-cover object-center"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center">
                      <span className="px-4 text-center text-sm text-gray-500">
                        Gambar belum tersedia
                      </span>
                    </div>
                  )}
                </div>

                {/* Informasi guru/staff */}
                <div className="flex h-full flex-col p-4 sm:p-5">
                  <h3 className="break-words text-base font-bold leading-6 text-gray-800">
                    {item.name}
                  </h3>

                  <p className="mt-1 break-words text-sm leading-5 text-gray-600">
                    {item.position}
                  </p>

                  {item.type === "TEACHER" && item.classTaught && (
                    <p className="mt-2 break-words text-sm text-gray-600">
                      Kelas: {item.classTaught}
                    </p>
                  )}

                  <div className="mt-4 border-t border-gray-100 pt-3">
                    <span className="inline-flex rounded-full bg-amber-50 px-3 py-1 text-xs font-medium text-amber-700">
                      {item.type === "TEACHER"
                        ? "Guru"
                        : "Tenaga Administrasi"}
                    </span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="flex min-h-32 items-center justify-center text-center">
            <p className="text-sm text-gray-500">
              Belum ada data guru dan tenaga administrasi yang ditambahkan.
            </p>
          </div>
        )}
      </section>
    </main>
  );
}

export default SchoolProfile;