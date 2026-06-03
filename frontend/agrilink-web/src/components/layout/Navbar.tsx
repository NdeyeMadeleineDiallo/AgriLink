import Link from "next/link";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="container-page flex h-20 items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#16A34A] text-lg font-bold text-white shadow-lg shadow-green-200">
            AL
          </div>
          <div>
            <h1 className="text-xl font-extrabold tracking-tight text-slate-900">
              AgriLink
            </h1>
            <p className="text-xs font-medium text-slate-500">
              Former. Connecter. Accompagner.
            </p>
          </div>
        </Link>

        <nav className="hidden items-center gap-8 text-sm font-medium text-slate-600 lg:flex">
          <a href="#academy" className="hover:text-green-700">AgriAcademy</a>
          <a href="#market" className="hover:text-green-700">AgriMarket</a>
          <a href="#expert" className="hover:text-green-700">AgriExpert</a>
          <a href="#faq" className="hover:text-green-700">FAQ</a>
        </nav>

        <div className="flex items-center gap-3">
          <Link href="/login" className="hidden text-sm font-semibold text-slate-700 sm:block">
            Connexion
          </Link>
          <Link href="/register" className="btn-primary">
            S’inscrire
          </Link>
        </div>
      </div>
    </header>
  );
}