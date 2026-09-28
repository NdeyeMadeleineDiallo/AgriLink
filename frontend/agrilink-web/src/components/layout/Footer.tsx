import Link from "next/link";
import {
  ArrowUpRight,
  BookOpen,
  Mail,
  MapPin,
  Phone,
  ShoppingBasket,
  Users,
} from "lucide-react";

export default function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-white/70 bg-gradient-to-br from-[#f7fbf8] via-white to-[#fff8f1]">
      
      {/* EFFETS DE FOND */}
      <div className="pointer-events-none absolute -left-24 top-10 h-72 w-72 rounded-full bg-emerald-200/30 blur-[90px]" />
      <div className="pointer-events-none absolute -right-24 bottom-0 h-72 w-72 rounded-full bg-orange-200/30 blur-[90px]" />

      <div className="container-page relative py-12">
        
        {/* GRANDE CARTE GLASS */}
        <div className="overflow-hidden rounded-[30px] border border-white/80 bg-white/65 shadow-[0_20px_70px_rgba(15,23,42,0.08)] backdrop-blur-2xl">
          
          <div className="grid gap-10 px-6 py-9 md:px-9 lg:grid-cols-[1.35fr_0.9fr_1fr] lg:gap-14 lg:px-10">
            
            {/* =========================
                MARQUE
            ========================== */}
            <div>
  {/* LOGO */}
  <div className="flex h-[72px] items-center">
    <Link
      href="/"
      className="inline-flex items-center"
    >
      <img
        src="/images/agrilink-logo.png"
        alt="AgriLink"
        className="h-[100px] w-auto max-w-[230px] object-contain"
      />
    </Link>
  </div>

  {/* DESCRIPTION */}
  <p className="mt-3 max-w-[410px] text-[14px] leading-6 text-slate-600">
    Une plateforme numérique pensée pour connecter la formation,
    le marché et l’expertise au service des acteurs agricoles
    d’Afrique de l’Ouest.
  </p>

  <div className="mt-5 flex flex-wrap gap-2">
                
                <span className="rounded-full border border-emerald-200/70 bg-emerald-50/80 px-3 py-1.5 text-[11px] font-bold text-emerald-700 backdrop-blur">
                  Formation
                </span>

                <span className="rounded-full border border-orange-200/70 bg-orange-50/80 px-3 py-1.5 text-[11px] font-bold text-orange-600 backdrop-blur">
                  Marketplace
                </span>

                <span className="rounded-full border border-emerald-200/70 bg-emerald-50/80 px-3 py-1.5 text-[11px] font-bold text-emerald-700 backdrop-blur">
                  Expertise
                </span>
              </div>
            </div>

            {/* =========================
                MODULES
            ========================== */}
            <div>
              <p className="text-[11px] font-black uppercase tracking-[0.18em] text-slate-400">
                Écosystème
              </p>

              <div className="mt-5 space-y-3">
                
                <ModuleLink
                  href="/#academy"
                  label="AgriAcademy"
                  description="Se former"
                  icon={<BookOpen size={17} />}
                  color="green"
                />

                <ModuleLink
                  href="/#market"
                  label="AgriMarket"
                  description="Acheter & vendre"
                  icon={<ShoppingBasket size={17} />}
                  color="orange"
                />

                <ModuleLink
                  href="/#expert"
                  label="AgriExpert"
                  description="Être accompagné"
                  icon={<Users size={17} />}
                  color="green"
                />
              </div>
            </div>

            {/* =========================
                CONTACT
            ========================== */}
            <div>
              <p className="text-[11px] font-black uppercase tracking-[0.18em] text-slate-400">
                Nous contacter
              </p>

              <div className="mt-5 space-y-3">

                <ContactItem
                  icon={<MapPin size={17} />}
                  title="Localisation"
                  value="Dakar, Sénégal"
                  color="green"
                />

                <ContactItem
                  icon={<Mail size={17} />}
                  title="Email"
                  value="contact@agrilink.sn"
                  href="mailto:contact@agrilink.sn"
                  color="orange"
                />

                <ContactItem
                  icon={<Phone size={17} />}
                  title="Téléphone"
                  value="+221 77 111 11 11"
                  href="tel:+221771111111"
                  color="green"
                />

              </div>
            </div>
          </div>

          {/* =========================
              BOTTOM FOOTER
          ========================== */}
          <div className="mx-6 border-t border-slate-200/70 md:mx-9 lg:mx-10">
            <div className="flex flex-col gap-4 py-5 sm:flex-row sm:items-center sm:justify-between">
              
              <p className="text-xs font-medium text-slate-400">
                © 2026 AgriLink. Tous droits réservés.
              </p>

              <div className="flex items-center gap-5">
                
                <Link
                  href="/login"
                  className="text-xs font-semibold text-slate-500 transition hover:text-emerald-700"
                >
                  Connexion
                </Link>

                <Link
                  href="/register"
                  className="group inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 transition hover:text-emerald-800"
                >
                  Créer un compte

                  <ArrowUpRight
                    size={14}
                    className="transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                  />
                </Link>

              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

/* =========================================================
   MODULE LINK
========================================================= */

function ModuleLink({
  href,
  label,
  description,
  icon,
  color,
}: {
  href: string;
  label: string;
  description: string;
  icon: React.ReactNode;
  color: "green" | "orange";
}) {
  const iconStyle =
    color === "orange"
      ? "border-orange-200/70 bg-orange-50/90 text-orange-600 shadow-orange-100"
      : "border-emerald-200/70 bg-emerald-50/90 text-emerald-700 shadow-emerald-100";

  return (
    <a
      href={href}
      className="group flex items-center gap-3 rounded-[16px] border border-white/80 bg-white/60 p-2.5 transition duration-300 hover:-translate-y-0.5 hover:bg-white/90 hover:shadow-[0_10px_30px_rgba(15,23,42,0.07)]"
    >
      <div
        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-[13px] border shadow-sm ${iconStyle}`}
      >
        {icon}
      </div>

      <div className="min-w-0 flex-1">
        <p className="text-[13px] font-black text-slate-800">
          {label}
        </p>

        <p className="mt-0.5 text-[11px] text-slate-400">
          {description}
        </p>
      </div>

      <ArrowUpRight
        size={14}
        className="mr-1 text-slate-300 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-emerald-600"
      />
    </a>
  );
}

/* =========================================================
   CONTACT ITEM
========================================================= */

function ContactItem({
  icon,
  title,
  value,
  href,
  color,
}: {
  icon: React.ReactNode;
  title: string;
  value: string;
  href?: string;
  color: "green" | "orange";
}) {
  const iconStyle =
    color === "orange"
      ? "border-orange-200/70 bg-orange-50/90 text-orange-600 shadow-orange-100"
      : "border-emerald-200/70 bg-emerald-50/90 text-emerald-700 shadow-emerald-100";

  const content = (
    <div className="group flex items-center gap-3 rounded-[16px] border border-white/80 bg-white/60 p-2.5 transition duration-300 hover:-translate-y-0.5 hover:bg-white/90 hover:shadow-[0_10px_30px_rgba(15,23,42,0.07)]">
      
      <div
        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-[13px] border shadow-sm ${iconStyle}`}
      >
        {icon}
      </div>

      <div className="min-w-0">
        <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-slate-400">
          {title}
        </p>

        <p className="mt-0.5 truncate text-[13px] font-bold text-slate-700">
          {value}
        </p>
      </div>
    </div>
  );

  if (href) {
    return (
      <a href={href} className="block">
        {content}
      </a>
    );
  }

  return content;
}