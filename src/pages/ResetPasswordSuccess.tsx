import { CheckCircle } from "lucide-react";
import { Link } from 'react-router-dom';

function ResetPasswordSuccess() {
 return (
  <main className="flex min-h-screen items-center justify-center bg-white px-5 py-8">
   <section className="w-full max-w-md rounded-2xl bg-white px-6 py-10 text-center shadow-[0_8px_30px_rgba(0,0,0,0.08)] sm:px-10 sm:py-12">
    <div className="mb-6 flex justify-center">
     <CheckCircle size={64} className="text-[#B46000]" />
    </div>

    <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
     Password Berhasil Diubah
    </h1>

    <p className="mt-4 text-sm leading-6 text-gray-500">
     Password Anda berhasil diubah. Silakan login menggunakan password baru
     Anda.
    </p>

    <Link
     to="/login"
     className="mt-8 block w-full rounded-lg bg-[#B46000] px-4 py-3.5 text-sm font-semibold text-white transition hover:bg-[#944F00]"
    >
     Login
    </Link>
   </section>
  </main>
 );
}

export default ResetPasswordSuccess;
