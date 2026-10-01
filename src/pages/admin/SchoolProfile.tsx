import { useEffect, useRef, useState } from "react";
import { Image as ImageIcon, Upload } from "lucide-react";

import {
    getSchoolProfile,
    updateSchoolProfile,
    type SchoolProfile as SchoolProfileData,
} from "../../services/schoolProfile.service";

export default function SchoolProfile() {
    const bannerInputRef = useRef<HTMLInputElement | null>(null);
    const logoInputRef = useRef<HTMLInputElement | null>(null);

    type SchoolProfileForm = {
        schoolName: string;
        shortInfo: string;
        about: string;
        history: string;
        vision: string;
        mission: string;
        bannerUrl: string;
        logoUrl: string;
    };

    const [form, setForm] = useState<SchoolProfileForm>({
        schoolName: "",
        shortInfo: "",
        about: "",
        history: "",
        vision: "",
        mission: "",    
        bannerUrl: "",
        logoUrl: "",
    });

    const [bannerPreview, setBannerPreview] = useState("");
    const [logoPreview, setLogoPreview] = useState("");

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    async function loadData() {
        try {
            setLoading(true);
            setError("");

            const response = await getSchoolProfile();

            const data = response.data;

            setForm({
                schoolName: data.schoolName ?? "",
                shortInfo: data.shortInfo ?? "",
                about: data.about ?? "",
                history: data.history ?? "",
                vision: data.vision ?? "",
                mission: data.mission ?? "",
                bannerUrl: data.bannerUrl ?? "",
                logoUrl: data.logoUrl ?? "",
            });

            setBannerPreview(data.bannerUrl ?? "");
            setLogoPreview(data.logoUrl ?? "");
        } catch (err) {
            console.error(err);
            setError("Gagal memuat profil sekolah.");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadData();
    }, []);

    function updateField(
        field: keyof typeof form,
        value: string,
    ) {
        setForm((prev) => ({
            ...prev,
            [field]: value,
        }));
    }

    function handleBannerFile(
        e: React.ChangeEvent<HTMLInputElement>,
    ) {
        const file = e.target.files?.[0];

        if (!file) return;

        if (!["image/jpeg", "image/png"].includes(file.type)) {
            setError("Banner harus berformat JPG atau PNG.");
            return;
        }

        const url = URL.createObjectURL(file);

        setBannerPreview(url);

        setError("");
    }

    function handleLogoFile(
        e: React.ChangeEvent<HTMLInputElement>,
    ) {
        const file = e.target.files?.[0];

        if (!file) return;

        if (!["image/jpeg", "image/png"].includes(file.type)) {
            setError("Logo harus berformat JPG atau PNG.");
            return;
        }

        const url = URL.createObjectURL(file);

        setLogoPreview(url);

        setError("");
    }

    async function handleSubmit(
        e: React.FormEvent<HTMLFormElement>,
    ) {
        e.preventDefault();

        if (!form.schoolName.trim()) {
            setError("Nama sekolah wajib diisi.");
            return;
        }

        try {
            setSaving(true);
            setError("");
            setSuccess("");

            await updateSchoolProfile({
                ...form,
                schoolName: form.schoolName.trim(),
            });

            setSuccess("Profil sekolah berhasil disimpan.");

            await loadData();
        } catch (err) {
            console.error(err);
            setError("Gagal menyimpan profil sekolah.");
        } finally {
            setSaving(false);
        }
    }

    function handleCancel() {
        loadData();
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">
                <div className="mx-auto max-w-7xl rounded-2xl bg-white p-10 text-center shadow-sm">
                    <p className="text-sm text-slate-500">
                        Memuat profil sekolah...
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">
            <div className="mx-auto max-w-7xl">
                {/* HEADER */}
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-slate-800 sm:text-3xl">
                        Profil Sekolah
                    </h1>

                    <p className="mt-1 text-sm text-slate-500">
                        Kelola Informasi Profil Sekolah
                    </p>
                </div>

                {error && (
                    <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                        {error}
                    </div>
                )}

                {success && (
                    <div className="mb-4 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-600">
                        {success}
                    </div>
                )}

                <form
                    onSubmit={handleSubmit}
                    className="rounded-2xl bg-white p-5 shadow-sm sm:p-6 lg:p-8"
                >
                    {/* BASIC INFO */}
                    <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
                        {/* LEFT */}
                        <div className="space-y-5">
                            <div>
                                <label className="mb-2 block text-sm font-semibold text-slate-700">
                                    Nama Sekolah
                                    <span className="text-red-500">*</span>
                                </label>

                                <input
                                    type="text"
                                    value={form.schoolName}
                                    onChange={(e) =>
                                        updateField(
                                            "schoolName",
                                            e.target.value,
                                        )
                                    }
                                    className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
                                />
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-semibold text-slate-700">
                                    Informasi Singkat
                                </label>

                                <textarea
                                    value={form.shortInfo}
                                    onChange={(e) =>
                                        updateField(
                                            "shortInfo",
                                            e.target.value,
                                        )
                                    }
                                    rows={3}
                                    className="w-full resize-none rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
                                />
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-semibold text-slate-700">
                                    Tentang Sekolah
                                </label>

                                <textarea
                                    value={form.about}
                                    onChange={(e) =>
                                        updateField("about", e.target.value)
                                    }
                                    rows={5}
                                    className="w-full resize-none rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
                                />
                            </div>
                        </div>

                        {/* RIGHT */}
                        <div className="space-y-5">
                            <div>
                                <label className="mb-2 block text-sm font-semibold text-slate-700">
                                    Sejarah
                                </label>

                                <textarea
                                    value={form.history}
                                    onChange={(e) =>
                                        updateField(
                                            "history",
                                            e.target.value,
                                        )
                                    }
                                    rows={5}
                                    className="w-full resize-none rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
                                />
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-semibold text-slate-700">
                                    Visi
                                </label>

                                <textarea
                                    value={form.vision}
                                    onChange={(e) =>
                                        updateField(
                                            "vision",
                                            e.target.value,
                                        )
                                    }
                                    rows={3}
                                    className="w-full resize-none rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
                                />
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-semibold text-slate-700">
                                    Misi
                                </label>

                                <textarea
                                    value={form.mission}
                                    onChange={(e) =>
                                        updateField(
                                            "mission",
                                            e.target.value,
                                        )
                                    }
                                    rows={3}
                                    className="w-full resize-none rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
                                />
                            </div>
                        </div>
                    </div>

                    {/* BANNER + LOGO */}
                    <div className="mt-8 border-t border-slate-100 pt-7">
                        <h2 className="mb-5 text-lg font-bold text-slate-800">
                            Banner & Logo
                        </h2>

                        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                            {/* BANNER */}
                            <div>
                                <label className="mb-2 block text-sm font-semibold text-slate-700">
                                    Banner
                                </label>

                                <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                                    <div className="flex h-36 w-full items-center justify-center overflow-hidden rounded-xl bg-slate-100 sm:w-64">
                                        {bannerPreview ? (
                                            <img
                                                src={bannerPreview}
                                                alt="Banner"
                                                className="h-full w-full object-cover"
                                            />
                                        ) : (
                                            <ImageIcon
                                                size={50}
                                                className="text-slate-300"
                                            />
                                        )}
                                    </div>

                                    <div>
                                        <input
                                            ref={bannerInputRef}
                                            type="file"
                                            accept=".jpg,.jpeg,.png,image/jpeg,image/png"
                                            onChange={handleBannerFile}
                                            className="hidden"
                                        />

                                        <button
                                            type="button"
                                            onClick={() =>
                                                bannerInputRef.current?.click()
                                            }
                                            className="flex items-center gap-2 rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50"
                                        >
                                            <Upload size={16} />
                                            Ubah Gambar
                                        </button>
                                    </div>
                                </div>

                                <input
                                    type="url"
                                    value={form.bannerUrl}
                                    onChange={(e) => {
                                        updateField(
                                            "bannerUrl",
                                            e.target.value,
                                        );
                                        setBannerPreview(e.target.value);
                                    }}
                                    placeholder="URL banner Supabase"
                                    className="mt-3 w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
                                />
                            </div>

                            {/* LOGO */}
                            <div>
                                <label className="mb-2 block text-sm font-semibold text-slate-700">
                                    Logo
                                </label>

                                <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                                    <div className="flex h-36 w-full items-center justify-center overflow-hidden rounded-xl bg-slate-100 sm:w-36">
                                        {logoPreview ? (
                                            <img
                                                src={logoPreview}
                                                alt="Logo"
                                                className="h-full w-full object-contain"
                                            />
                                        ) : (
                                            <ImageIcon
                                                size={50}
                                                className="text-slate-300"
                                            />
                                        )}
                                    </div>

                                    <div>
                                        <input
                                            ref={logoInputRef}
                                            type="file"
                                            accept=".jpg,.jpeg,.png,image/jpeg,image/png"
                                            onChange={handleLogoFile}
                                            className="hidden"
                                        />

                                        <button
                                            type="button"
                                            onClick={() =>
                                                logoInputRef.current?.click()
                                            }
                                            className="flex items-center gap-2 rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50"
                                        >
                                            <Upload size={16} />
                                            Ubah Gambar
                                        </button>
                                    </div>
                                </div>

                                <input
                                    type="url"
                                    value={form.logoUrl}
                                    onChange={(e) => {
                                        updateField(
                                            "logoUrl",
                                            e.target.value,
                                        );
                                        setLogoPreview(e.target.value);
                                    }}
                                    placeholder="URL logo Supabase"
                                    className="mt-3 w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
                                />
                            </div>
                        </div>
                    </div>

                    {/* BUTTON */}
                    <div className="mt-8 flex flex-col-reverse gap-3 border-t border-slate-100 pt-6 sm:flex-row sm:justify-end">
                        <button
                            type="button"
                            onClick={handleCancel}
                            className="rounded-lg border border-slate-400 px-7 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
                        >
                            Batal
                        </button>

                        <button
                            type="submit"
                            disabled={saving}
                            className="rounded-lg bg-orange-500 px-8 py-2.5 text-sm font-semibold text-white hover:bg-orange-600 disabled:opacity-60"
                        >
                            {saving ? "Menyimpan..." : "Simpan"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}