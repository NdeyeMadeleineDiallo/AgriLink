import Link from "next/link";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 px-3 pt-3">
      <div className="container-page">
        <div className="flex h-[76px] items-center justify-between rounded-[22px] border border-white/80 bg-white/78 px-4 shadow-[0_12px_40px_rgba(15,23,42,0.08)] backdrop-blur-xl md:px-6">
          
          {/* LOGO */}
          <Link
            href="/"
            className="flex shrink-0 items-center"
          >
            <img
              src="/images/agrilink-logo.png"
              alt="AgriLink"
              className="h-[54px] w-auto object-contain md:h-[140px]"
            />
          </Link>

          {/* NAVIGATION */}
          <nav className="hidden items-center gap-1 lg:flex">
            <NavItem
              href="#academy"
              label="AgriAcademy"
            />

            <NavItem
              href="#market"
              label="AgriMarket"
            />

            <NavItem
              href="#expert"
              label="AgriExpert"
            />
          </nav>

          {/* ACTIONS */}
          <div className="flex items-center gap-2">
            <Link
              href="/login"
              className="hidden rounded-xl px-4 py-2.5 text-sm font-bold text-slate-700 transition hover:bg-slate-50 hover:text-emerald-700 sm:inline-flex"
            >
              Connexion
            </Link>

            <Link
              href="/register"
              className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-emerald-700 to-green-600 px-4 py-2.5 text-sm font-bold text-white shadow-[0_10px_24px_rgba(21,128,61,0.22)] transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_14px_30px_rgba(21,128,61,0.28)]"
            >
              S’inscrire
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}

function NavItem({
  href,
  label,
}: {
  href: string;
  label: string;
}) {
  return (
    <a
      href={href}
      className="relative rounded-xl px-4 py-2.5 text-[13px] font-semibold text-slate-600 transition hover:bg-emerald-50 hover:text-emerald-700"
    >
      {label}
    </a>
  );
}