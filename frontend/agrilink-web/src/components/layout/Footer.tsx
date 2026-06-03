export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="container-page grid gap-8 py-12 md:grid-cols-4">
        <div className="md:col-span-2">
          <h3 className="text-2xl font-extrabold text-slate-900">AgriLink</h3>
          <p className="mt-3 max-w-md text-sm leading-7 text-slate-500">
            Plateforme numérique intégrée pour former, connecter et accompagner
            les acteurs agricoles en Afrique de l’Ouest.
          </p>
        </div>

        <div>
          <h4 className="font-bold text-slate-900">Modules</h4>
          <ul className="mt-4 space-y-3 text-sm text-slate-500">
            <li>AgriAcademy</li>
            <li>AgriMarket</li>
            <li>AgriExpert</li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold text-slate-900">Contact</h4>
          <ul className="mt-4 space-y-3 text-sm text-slate-500">
            <li>Dakar, Sénégal</li>
            <li>contact@agrilink.sn</li>
            <li>+221 77 111 11 11</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-slate-100 py-5 text-center text-sm text-slate-500">
        © 2026 AgriLink. Tous droits réservés.
      </div>
    </footer>
  );
}