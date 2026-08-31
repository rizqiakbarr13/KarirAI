import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-dark/10 bg-sand">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-6 py-10 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-lg font-extrabold text-indigo">KarirAI</p>
          <p className="mt-1 text-sm text-dark/60">
            AI-Powered Resume & Career Platform untuk pasar Indonesia.
          </p>
        </div>
        <div className="flex gap-6 text-sm text-dark/60">
          <Link href="/login" className="hover:text-dark">
            Masuk
          </Link>
          <Link href="/register" className="hover:text-dark">
            Daftar
          </Link>
        </div>
      </div>
      <div className="border-t border-dark/10 px-6 py-4 text-center text-xs text-dark/40">
        &copy; {new Date().getFullYear()} KarirAI. Semua hak dilindungi.
      </div>
    </footer>
  );
}
