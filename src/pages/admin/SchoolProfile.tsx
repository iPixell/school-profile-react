import {
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
} from "react";

import {
  Image as ImageIcon,
  Upload,
} from "lucide-react";

import {
  getSchoolProfile,
  updateSchoolProfile,
  type SchoolProfile as SchoolProfileData,
} from "../../services/schoolProfile.service";

interface TouchedFields {
  schoolName: boolean;
  shortInfo: boolean;
  about: boolean;
  history: boolean;
  vision: boolean;
  mission: boolean;
}

const initialTouched: TouchedFields = {
  schoolName: false,
  shortInfo: false,
  about: false,
  history: false,
  vision: false,
  mission: false,
};

function AdminSchoolProfile() {
  const [schoolProfile, setSchoolProfile] =
    useState<SchoolProfileData | null>(null);

  const [schoolName, setSchoolName] =
    useState("");

  const [shortInfo, setShortInfo] =
    useState("");

  const [about, setAbout] =
    useState("");

  const [history, setHistory] =
    useState("");

  const [vision, setVision] =
    useState("");

  const [mission, setMission] =
    useState("");

  const [touched, setTouched] =
    useState<TouchedFields>(
      initialTouched,
    );

  const [logoFile, setLogoFile] =
    useState<File | null>(null);

  const [bannerFile, setBannerFile] =
    useState<File | null>(null);

  const [logoPreview, setLogoPreview] =
    useState("");

  const [bannerPreview, setBannerPreview] =
    useState("");

  const [isLoading, setIsLoading] =
    useState(true);

  const [isSaving, setIsSaving] =
    useState(false);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");

  const [schoolNameError, setSchoolNameError] =
    useState("");

  const logoInputRef =
    useRef<HTMLInputElement>(null);

  const bannerInputRef =
    useRef<HTMLInputElement>(null);

  useEffect(() => {
    async function loadSchoolProfile() {
      try {
        setIsLoading(true);
        setError("");

        const response =
          await getSchoolProfile();

        const data = response.data;

        setSchoolProfile(data);

        /**
         * Field sengaja tidak diisi
         * dengan value dari backend.
         *
         * Data backend akan menjadi placeholder.
         */
        setSchoolName("");
        setShortInfo("");
        setAbout("");
        setHistory("");
        setVision("");
        setMission("");

        setTouched(initialTouched);

        setLogoPreview(
          data.logoUrl ?? "",
        );

        setBannerPreview(
          data.bannerUrl ?? "",
        );
      } catch (error) {
        console.error(
          "Gagal mengambil profil sekolah:",
          error,
        );

        setError(
          error instanceof Error
            ? error.message
            : "Gagal mengambil data profil sekolah.",
        );
      } finally {
        setIsLoading(false);
      }
    }

    loadSchoolProfile();
  }, []);

  function markTouched(
    field: keyof TouchedFields,
  ) {
    setTouched((prev) => ({
      ...prev,
      [field]: true,
    }));
  }

  function handleLogoChange(
    event: ChangeEvent<HTMLInputElement>,
  ) {
    const file =
      event.target.files?.[0];

    if (!file) {
      return;
    }

    if (
      ![
        "image/jpeg",
        "image/png",
      ].includes(file.type)
    ) {
      setError(
        "Logo harus berupa JPG atau PNG.",
      );

      event.target.value = "";
      return;
    }

    setLogoFile(file);
    setLogoPreview(
      URL.createObjectURL(file),
    );

    setError("");
    setSuccess("");
  }

  function handleBannerChange(
    event: ChangeEvent<HTMLInputElement>,
  ) {
    const file =
      event.target.files?.[0];

    if (!file) {
      return;
    }

    if (
      ![
        "image/jpeg",
        "image/png",
      ].includes(file.type)
    ) {
      setError(
        "Banner harus berupa JPG atau PNG.",
      );

      event.target.value = "";
      return;
    }

    setBannerFile(file);
    setBannerPreview(
      URL.createObjectURL(file),
    );

    setError("");
    setSuccess("");
  }

  function validateForm() {
    setSchoolNameError("");

    const finalSchoolName = touched.schoolName
      ? schoolName.trim()
      : schoolProfile?.schoolName?.trim() ||
        "";

    if (!finalSchoolName) {
      setSchoolNameError(
        "Nama sekolah wajib diisi.",
      );

      return false;
    }

    return true;
  }

  async function handleSave() {
    setError("");
    setSuccess("");

    if (!validateForm()) {
      return;
    }

    try {
      setIsSaving(true);

      const formData = new FormData();

      /**
       * Required field.
       *
       * Kalau user tidak menyentuh field,
       * gunakan data lama.
       *
       * Kalau user menyentuh lalu mengosongkan,
       * validasi akan menangkapnya.
       */
      const finalSchoolName =
        touched.schoolName
          ? schoolName.trim()
          : schoolProfile?.schoolName?.trim() ||
            "";

      formData.append(
        "schoolName",
        finalSchoolName,
      );

      /**
       * Optional fields.
       *
       * Tidak disentuh:
       *    gunakan data lama.
       *
       * Disentuh:
       *    gunakan isi input.
       *
       * Jadi admin juga bisa sengaja
       * mengosongkan field optional.
       */
      const finalShortInfo =
        touched.shortInfo
          ? shortInfo.trim()
          : schoolProfile?.shortInfo ?? "";

      const finalAbout =
        touched.about
          ? about.trim()
          : schoolProfile?.about ?? "";

      const finalHistory =
        touched.history
          ? history.trim()
          : schoolProfile?.history ?? "";

      const finalVision =
        touched.vision
          ? vision.trim()
          : schoolProfile?.vision ?? "";

      const finalMission =
        touched.mission
          ? mission.trim()
          : schoolProfile?.mission ?? "";

      formData.append(
        "shortInfo",
        finalShortInfo,
      );

      formData.append(
        "about",
        finalAbout,
      );

      formData.append(
        "history",
        finalHistory,
      );

      formData.append(
        "vision",
        finalVision,
      );

      formData.append(
        "mission",
        finalMission,
      );

      if (logoFile) {
        formData.append(
          "logo",
          logoFile,
        );
      }

      if (bannerFile) {
        formData.append(
          "banner",
          bannerFile,
        );
      }

      const response =
        await updateSchoolProfile(
          formData,
        );

      const updatedProfile =
        response.data;

      setSchoolProfile(
        updatedProfile,
      );

      /**
       * Setelah berhasil save,
       * kembali ke mode placeholder.
       */
      setSchoolName("");
      setShortInfo("");
      setAbout("");
      setHistory("");
      setVision("");
      setMission("");

      setTouched(initialTouched);

      setLogoFile(null);
      setBannerFile(null);

      setLogoPreview(
        updatedProfile.logoUrl ?? "",
      );

      setBannerPreview(
        updatedProfile.bannerUrl ?? "",
      );

      if (logoInputRef.current) {
        logoInputRef.current.value = "";
      }

      if (bannerInputRef.current) {
        bannerInputRef.current.value = "";
      }

      setSuccess(
        "Profil sekolah berhasil diperbarui.",
      );
    } catch (error) {
      console.error(
        "Gagal menyimpan profil sekolah:",
        error,
      );

      setError(
        error instanceof Error
          ? error.message
          : "Gagal menyimpan profil sekolah.",
      );
    } finally {
      setIsSaving(false);
    }
  }

  function handleCancel() {
    setSchoolName("");
    setShortInfo("");
    setAbout("");
    setHistory("");
    setVision("");
    setMission("");

    setTouched(initialTouched);

    setLogoFile(null);
    setBannerFile(null);

    setSchoolNameError("");
    setError("");
    setSuccess("");

    setLogoPreview(
      schoolProfile?.logoUrl ?? "",
    );

    setBannerPreview(
      schoolProfile?.bannerUrl ?? "",
    );

    if (logoInputRef.current) {
      logoInputRef.current.value = "";
    }

    if (bannerInputRef.current) {
      bannerInputRef.current.value = "";
    }
  }

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <p className="text-sm text-gray-500">
          Memuat profil sekolah...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white px-1 py-2 sm:px-2 sm:py-4">
      {/* HEADER */}
      <div className="mb-7">
        <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
          Profil Sekolah
        </h1>

        <p className="mt-2 text-sm text-gray-500 sm:text-base">
          Kelola Informasi Profil Sekolah
        </p>
      </div>

      {/* ERROR GLOBAL */}
      {error && (
        <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}

      {/* SUCCESS */}
      {success && (
        <div className="mb-5 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-600">
          {success}
        </div>
      )}

      {/* FORM */}
      <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6 lg:p-7">
        <div className="grid gap-7 lg:grid-cols-2 lg:gap-8">
          {/* ================= LEFT ================= */}
          <div className="space-y-5">
            {/* NAMA SEKOLAH */}
            <div>
              <label
                htmlFor="schoolName"
                className="mb-2 block text-sm font-semibold text-gray-700"
              >
                Nama Sekolah
                <span className="text-red-500">
                  {" "}
                  *
                </span>
              </label>

              <input
                id="schoolName"
                type="text"
                value={schoolName}
                onChange={(e) => {
                  setSchoolName(
                    e.target.value,
                  );

                  markTouched(
                    "schoolName",
                  );

                  setSchoolNameError("");
                  setError("");
                  setSuccess("");
                }}
                placeholder={
                  schoolProfile?.schoolName ||
                  "Masukkan nama sekolah"
                }
                className={`w-full rounded-lg border px-4 py-3 text-sm outline-none transition focus:ring-2 ${
                  schoolNameError
                    ? "border-red-500 focus:border-red-500 focus:ring-red-500/15"
                    : "border-gray-300 focus:border-[#B46000] focus:ring-[#B46000]/15"
                }`}
              />

              {schoolNameError && (
                <p className="mt-1.5 text-sm text-red-500">
                  {schoolNameError}
                </p>
              )}
            </div>

            {/* SHORT INFO */}
            <div>
              <label
                htmlFor="shortInfo"
                className="mb-2 block text-sm font-semibold text-gray-700"
              >
                Informasi Singkat
              </label>

              <textarea
                id="shortInfo"
                rows={4}
                value={shortInfo}
                onChange={(e) => {
                  setShortInfo(
                    e.target.value,
                  );

                  markTouched(
                    "shortInfo",
                  );

                  setError("");
                  setSuccess("");
                }}
                placeholder={
                  schoolProfile?.shortInfo ||
                  "Masukkan informasi singkat sekolah"
                }
                className="w-full resize-none rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-[#B46000] focus:ring-2 focus:ring-[#B46000]/15"
              />
            </div>

            {/* TENTANG */}
            <div>
              <label
                htmlFor="about"
                className="mb-2 block text-sm font-semibold text-gray-700"
              >
                Tentang Sekolah
              </label>

              <textarea
                id="about"
                rows={5}
                value={about}
                onChange={(e) => {
                  setAbout(
                    e.target.value,
                  );

                  markTouched("about");

                  setError("");
                  setSuccess("");
                }}
                placeholder={
                  schoolProfile?.about ||
                  "Masukkan informasi tentang sekolah"
                }
                className="w-full resize-none rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-[#B46000] focus:ring-2 focus:ring-[#B46000]/15"
              />
            </div>
          </div>

          {/* ================= RIGHT ================= */}
          <div className="space-y-5">
            {/* SEJARAH */}
            <div>
              <label
                htmlFor="history"
                className="mb-2 block text-sm font-semibold text-gray-700"
              >
                Sejarah Sekolah
              </label>

              <textarea
                id="history"
                rows={5}
                value={history}
                onChange={(e) => {
                  setHistory(
                    e.target.value,
                  );

                  markTouched("history");

                  setError("");
                  setSuccess("");
                }}
                placeholder={
                  schoolProfile?.history ||
                  "Masukkan sejarah sekolah"
                }
                className="w-full resize-none rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-[#B46000] focus:ring-2 focus:ring-[#B46000]/15"
              />
            </div>

            {/* VISI */}
            <div>
              <label
                htmlFor="vision"
                className="mb-2 block text-sm font-semibold text-gray-700"
              >
                Visi
              </label>

              <textarea
                id="vision"
                rows={4}
                value={vision}
                onChange={(e) => {
                  setVision(
                    e.target.value,
                  );

                  markTouched("vision");

                  setError("");
                  setSuccess("");
                }}
                placeholder={
                  schoolProfile?.vision ||
                  "Masukkan visi sekolah"
                }
                className="w-full resize-none rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-[#B46000] focus:ring-2 focus:ring-[#B46000]/15"
              />
            </div>

            {/* MISI */}
            <div>
              <label
                htmlFor="mission"
                className="mb-2 block text-sm font-semibold text-gray-700"
              >
                Misi
              </label>

              <textarea
                id="mission"
                rows={5}
                value={mission}
                onChange={(e) => {
                  setMission(
                    e.target.value,
                  );

                  markTouched("mission");

                  setError("");
                  setSuccess("");
                }}
                placeholder={
                  schoolProfile?.mission ||
                  "Masukkan misi sekolah"
                }
                className="w-full resize-none rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-[#B46000] focus:ring-2 focus:ring-[#B46000]/15"
              />
            </div>
          </div>
        </div>

        {/* ================= LOGO & BANNER ================= */}
        <div className="mt-8 border-t border-gray-200 pt-7">
          <h2 className="text-lg font-bold text-gray-900">
            Logo & Banner
          </h2>

          <div className="mt-5 grid gap-6 lg:grid-cols-2">
            {/* LOGO */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Logo
              </label>

              <div className="rounded-xl border border-dashed border-gray-300 p-4">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                  <div className="flex h-40 w-full items-center justify-center overflow-hidden rounded-lg bg-gray-50 sm:h-32 sm:w-40">
                    {logoPreview ? (
                      <img
                        src={logoPreview}
                        alt="Preview logo"
                        className="h-full w-full object-contain"
                      />
                    ) : (
                      <div className="flex flex-col items-center gap-2 text-gray-400">
                        <ImageIcon size={28} />
                        <span className="text-xs">
                          Belum ada logo
                        </span>
                      </div>
                    )}
                  </div>

                  <div>
                    <input
                      ref={logoInputRef}
                      type="file"
                      accept="image/jpeg,image/png"
                      onChange={
                        handleLogoChange
                      }
                      className="hidden"
                      id="logo-upload"
                    />

                    <label
                      htmlFor="logo-upload"
                      className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
                    >
                      <Upload size={17} />

                      Pilih Logo
                    </label>

                    <p className="mt-2 text-xs text-gray-500">
                      JPG atau PNG
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* BANNER */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Banner
              </label>

              <div className="rounded-xl border border-dashed border-gray-300 p-4">
                <div className="flex flex-col gap-4">
                  <div className="flex h-40 w-full items-center justify-center overflow-hidden rounded-lg bg-gray-50">
                    {bannerPreview ? (
                      <img
                        src={bannerPreview}
                        alt="Preview banner"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex flex-col items-center gap-2 text-gray-400">
                        <ImageIcon size={28} />

                        <span className="text-xs">
                          Belum ada banner
                        </span>
                      </div>
                    )}
                  </div>

                  <div>
                    <input
                      ref={bannerInputRef}
                      type="file"
                      accept="image/jpeg,image/png"
                      onChange={
                        handleBannerChange
                      }
                      className="hidden"
                      id="banner-upload"
                    />

                    <label
                      htmlFor="banner-upload"
                      className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
                    >
                      <Upload size={17} />

                      Pilih Banner
                    </label>

                    <p className="mt-2 text-xs text-gray-500">
                      JPG atau PNG
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ================= ACTION ================= */}
        <div className="mt-8 flex flex-col-reverse gap-3 border-t border-gray-200 pt-6 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={handleCancel}
            disabled={isSaving}
            className="w-full rounded-lg border border-gray-300 px-5 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
          >
            Batal
          </button>

          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            className="w-full rounded-lg bg-[#B46000] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#944F00] disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
          >
            {isSaving
              ? "Menyimpan..."
              : "Simpan"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default AdminSchoolProfile;