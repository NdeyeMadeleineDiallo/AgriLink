"use client";

import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  BriefcaseBusiness,
  CircleAlert,
  Clock3,
  GraduationCap,
  MapPin,
  MessageCircle,
  Search,
  ShieldCheck,
  SlidersHorizontal,
  Star,
  User,
  UserPlus,
} from "lucide-react";
import Link from "next/link";
import { getStoredUser } from "@/src/lib/auth";
import { apiRequest } from "@/src/services/api";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/api\/?$/, "") ||
  "http://127.0.0.1:8000";

type ExpertFilter =
  | "all"
  | "agronomie"
  | "veterinaire"
  | "irrigation"
  | "marketing"
  | "finance";

const filters: {
  id: ExpertFilter;
  label: string;
}[] = [
  { id: "all", label: "Tous" },
  { id: "agronomie", label: "Agronomie" },
  { id: "veterinaire", label: "Vétérinaire" },
  { id: "irrigation", label: "Irrigation" },
  { id: "marketing", label: "Marketing agricole" },
  { id: "finance", label: "Finance agricole" },
];

export default function ExpertMarketplacePage() {
  const [user, setUser] = useState<any>(null);
  const [experts, setExperts] = useState<any[]>([]);
  const [myExpertProfile, setMyExpertProfile] = useState<any>(null);

  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] =
    useState<ExpertFilter>("all");

  const [loading, setLoading] = useState(true);
  const [profileLoading, setProfileLoading] = useState(true);

  useEffect(() => {
    const storedUser = getStoredUser();

    if (!storedUser) {
      window.location.href = "/login";
      return;
    }

    setUser(storedUser);

    Promise.allSettled([
      loadExperts(),
      loadMyExpertProfile(),
    ]).finally(() => {
      setLoading(false);
      setProfileLoading(false);
    });
  }, []);

  async function loadExperts() {
    try {
      const data = await apiRequest("/experts");

      const expertList =
        data.data?.data ||
        data.data ||
        data.experts ||
        [];

      setExperts(Array.isArray(expertList) ? expertList : []);
    } catch (error) {
      console.error(
        "Erreur lors du chargement des experts :",
        error
      );

      setExperts([]);
    }
  }

  async function loadMyExpertProfile() {
    try {
      const data = await apiRequest("/my-expert-profile");

      const profile =
        data.expert_profile ||
        data.data ||
        data.expert ||
        null;

      setMyExpertProfile(profile);
    } catch (error: any) {
      /*
       * Une réponse 404 ou 422 peut simplement signifier que
       * l'utilisateur n'a pas encore créé de profil expert.
       */
      console.log(
        "Aucun profil expert trouvé pour l’utilisateur connecté.",
        error?.message || ""
      );

      setMyExpertProfile(null);
    }
  }
  

  const approvedExperts = useMemo(() => {
    return experts.filter((expert) => {
      const status = String(expert.status || "").toLowerCase();

      return (
        status === "approved" ||
        status === "active" ||
        expert.is_verified === true ||
        Number(expert.is_verified) === 1
      );
    });
  }, [experts]);

  const filteredExperts = useMemo(() => {
    const normalizedSearch = normalizeText(search);

    return approvedExperts.filter((expert) => {
      const specialityText = getExpertSpecialities(expert)
        .map((speciality) => normalizeText(speciality))
        .join(" ");

      const name = normalizeText(
        expert.user?.name ||
          expert.name ||
          expert.full_name ||
          ""
      );

      const location = normalizeText(
        expert.intervention_zone ||
          expert.region ||
          expert.city ||
          ""
      );

      const bio = normalizeText(
        expert.bio ||
          expert.biography ||
          ""
      );

      const matchesSearch =
        normalizedSearch.length === 0 ||
        name.includes(normalizedSearch) ||
        specialityText.includes(normalizedSearch) ||
        location.includes(normalizedSearch) ||
        bio.includes(normalizedSearch);

      const matchesFilter =
        activeFilter === "all" ||
        getExpertCategory(expert) === activeFilter;

      return matchesSearch && matchesFilter;
    });
  }, [approvedExperts, search, activeFilter]);

  if (!user) return null;

  return (
    <main className="min-h-screen bg-[#F6F9F7]">
      <header className="border-b border-slate-100 bg-white">
        <div className="container-page flex min-h-24 flex-col gap-4 py-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.2em] text-green-700">
              AgriExpert
            </p>

            <h1 className="mt-1 text-3xl font-black text-slate-950">
              Trouver un expert agricole
            </h1>

            <p className="mt-1 text-sm font-medium text-slate-500">
              Échangez avec des professionnels qualifiés pour
              développer votre activité agricole.
            </p>
          </div>

          <Link
            href="/profile"
            className="inline-flex items-center gap-2 self-start rounded-2xl border border-green-200 bg-white px-5 py-3 font-semibold text-green-700 transition hover:bg-green-50 md:self-auto"
          >
            <ArrowLeft size={18} />
            Retour
          </Link>
        </div>
      </header>

      <section className="container-page py-8">
        <div
          className="relative min-h-[330px] overflow-hidden rounded-[30px] bg-cover bg-center shadow-xl shadow-slate-300/40"
          style={{
            backgroundImage:
              "url('/images/agriexpert-banner.png')",
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-green-950/75 to-black/35" />

          <div className="relative z-10 flex min-h-[330px] flex-col justify-between p-7 md:p-10">
            <div className="max-w-3xl">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-green-200">
                Le réseau d’experts AgriLink
              </p>

              <h2 className="mt-4 max-w-2xl text-2xl font-black leading-tight text-white md:text-3xl">
                Trouvez l’expertise adaptée à votre projet agricole.
              </h2>

              <p className="mt-5 max-w-xl text-base leading-7 text-white/90 md:text-lg">
                Consultez les profils validés, découvrez leurs
                compétences et contactez directement l’expert
                capable de vous accompagner.
              </p>
            </div>

            <div className="mt-6 flex flex-col items-end gap-3">
              {profileLoading ? (
                <div className="rounded-xl bg-white/90 px-4 py-2.5 text-sm font-semibold text-slate-600">
                  Vérification de votre profil...
                </div>
              ) : myExpertProfile ? (
                <>
                  <Link
                    href="/expert/profile"
                    className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-green-700 shadow-lg transition hover:-translate-y-0.5 hover:bg-green-50"
                  >
                    <User size={17} />
                    Voir mon profil expert
                  </Link>

                  <ExpertProfileStatus
                    status={myExpertProfile.status}
                    isVerified={myExpertProfile.is_verified}
                  />
                </>
              ) : (
                <Link
                  href="/expert/create"
                  className="inline-flex items-center gap-2 rounded-xl bg-orange-500 px-4 py-2.5 text-sm font-semibold text-white shadow-lg transition hover:-translate-y-0.5 hover:bg-orange-600"
                >
                  <UserPlus size={17} />
                  Devenir expert
                </Link>
              )}
            </div>
          </div>
        </div>

        {myExpertProfile &&
          String(myExpertProfile.status).toLowerCase() ===
            "pending" && (
            <div className="mt-5 flex items-start gap-3 rounded-2xl border border-orange-200 bg-orange-50 p-4">
              <Clock3
                size={20}
                className="mt-0.5 shrink-0 text-orange-600"
              />

              <div>
                <p className="font-semibold text-orange-800">
                  Votre candidature est en cours de vérification.
                </p>

                <p className="mt-1 text-sm leading-6 text-orange-700">
                  Votre profil ne sera affiché dans l’annuaire
                  qu’après son approbation par l’administration
                  AgriLink.
                </p>
              </div>
            </div>
          )}

        {myExpertProfile &&
          String(myExpertProfile.status).toLowerCase() ===
            "rejected" && (
            <div className="mt-5 flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-4">
              <CircleAlert
                size={20}
                className="mt-0.5 shrink-0 text-red-600"
              />

              <div>
                <p className="font-semibold text-red-800">
                  Votre candidature n’a pas été approuvée.
                </p>

                <p className="mt-1 text-sm leading-6 text-red-700">
                  Consultez ou modifiez votre profil avant de
                  contacter l’administration pour une nouvelle
                  vérification.
                </p>
              </div>
            </div>
          )}

        {myExpertProfile &&
          String(myExpertProfile.status).toLowerCase() ===
            "suspended" && (
            <div className="mt-5 flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-4">
              <CircleAlert
                size={20}
                className="mt-0.5 shrink-0 text-red-600"
              />

              <div>
                <p className="font-semibold text-red-800">
                  Votre profil expert est suspendu.
                </p>

                <p className="mt-1 text-sm leading-6 text-red-700">
                  Il n’est temporairement plus visible dans
                  l’annuaire AgriExpert.
                </p>
              </div>
            </div>
          )}

        <div className="mt-8 rounded-[28px] border border-white/70 bg-white/90 p-5 shadow-xl shadow-slate-200/60 backdrop-blur-xl">
          <div className="flex flex-col gap-3 lg:flex-row">
            <div className="flex flex-1 items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4">
              <Search
                size={21}
                className="shrink-0 text-slate-400"
              />

              <input
                type="text"
                value={search}
                onChange={(event) =>
                  setSearch(event.target.value)
                }
                placeholder="Rechercher un expert, une spécialité ou une région..."
                className="h-14 w-full bg-transparent text-sm font-medium text-slate-800 outline-none placeholder:text-slate-400"
              />
            </div>

            <button
              type="button"
              className="inline-flex h-14 items-center justify-center gap-2 rounded-2xl bg-green-700 px-7 font-semibold text-white transition hover:bg-green-800"
            >
              <Search size={18} />
              Rechercher
            </button>

            <button
              type="button"
              aria-label="Afficher les filtres"
              className="inline-flex h-14 w-14 items-center justify-center rounded-2xl border border-green-200 bg-green-50 text-green-700"
            >
              <SlidersHorizontal size={21} />
            </button>
          </div>

          <div className="mt-5 flex flex-wrap gap-3">
            {filters.map((filter) => {
              const isActive =
                activeFilter === filter.id;

              return (
                <button
                  key={filter.id}
                  type="button"
                  onClick={() =>
                    setActiveFilter(filter.id)
                  }
                  className={`rounded-full border px-5 py-2.5 text-sm font-semibold transition ${
                    isActive
                      ? "border-green-700 bg-green-700 text-white shadow-md shadow-green-200"
                      : "border-slate-200 bg-white text-slate-600 hover:border-green-300 hover:bg-green-50 hover:text-green-700"
                  }`}
                >
                  {filter.label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-green-700">
              Experts disponibles
            </p>

            <h3 className="mt-2 text-3xl font-black text-slate-950">
              Notre réseau d’experts
            </h3>
          </div>

          <p className="text-sm font-semibold text-slate-500">
            {filteredExperts.length} expert
            {filteredExperts.length > 1 ? "s" : ""} trouvé
            {filteredExperts.length > 1 ? "s" : ""}
          </p>
        </div>

        {loading ? (
          <div className="mt-7 rounded-[28px] border border-slate-100 bg-white p-10 text-center font-medium text-slate-500 shadow-lg">
            Chargement des experts...
          </div>
        ) : filteredExperts.length === 0 ? (
          <div className="mt-7 rounded-[28px] border border-slate-100 bg-white p-10 text-center shadow-lg shadow-slate-200/50">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-green-100 text-green-700">
              <BriefcaseBusiness size={38} />
            </div>

            <h4 className="mt-5 text-2xl font-black text-slate-950">
              Aucun expert trouvé
            </h4>

            <p className="mx-auto mt-2 max-w-md leading-7 text-slate-500">
              Modifiez votre recherche ou sélectionnez une autre
              spécialité.
            </p>
          </div>
        ) : (
          <div className="mt-7 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {filteredExperts.map((expert) => (
              <ExpertCard
                key={expert.id}
                expert={expert}
              />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

function ExpertProfileStatus({
  status,
  isVerified,
}: {
  status: string;
  isVerified: boolean | number;
}) {
  const normalizedStatus = String(
    status || ""
  ).toLowerCase();

  if (
    normalizedStatus === "approved" ||
    normalizedStatus === "active" ||
    isVerified === true ||
    Number(isVerified) === 1
  ) {
    return (
      <span className="inline-flex items-center gap-2 rounded-full bg-green-100 px-3 py-1.5 text-xs font-semibold text-green-700">
        <ShieldCheck size={14} />
        Profil approuvé
      </span>
    );
  }

  if (normalizedStatus === "pending") {
    return (
      <span className="inline-flex items-center gap-2 rounded-full bg-orange-100 px-3 py-1.5 text-xs font-semibold text-orange-700">
        <Clock3 size={14} />
        En attente d’approbation
      </span>
    );
  }

  if (normalizedStatus === "rejected") {
    return (
      <span className="inline-flex items-center gap-2 rounded-full bg-red-100 px-3 py-1.5 text-xs font-semibold text-red-700">
        <CircleAlert size={14} />
        Candidature rejetée
      </span>
    );
  }

  if (normalizedStatus === "suspended") {
    return (
      <span className="inline-flex items-center gap-2 rounded-full bg-red-100 px-3 py-1.5 text-xs font-semibold text-red-700">
        <CircleAlert size={14} />
        Profil suspendu
      </span>
    );
  }

  return (
    <span className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-600">
      Statut : {status || "non défini"}
    </span>
  );
}

function ExpertCard({ expert }: { expert: any }) {
  const [selectedRating, setSelectedRating] =
    useState<number>(
      Math.round(
        Number(
          expert.average_rating ||
            expert.rating ||
            expert.note ||
            0
        )
      )
    );

  const [hoveredRating, setHoveredRating] =
    useState<number>(0);

  const [ratingLoading, setRatingLoading] =
    useState(false);
  
  const [ratingMessage, setRatingMessage] = useState("");
  const [ratingError, setRatingError] = useState("");

  const [averageRating, setAverageRating] = useState<number>(
  Number(
    expert.average_rating ||
      expert.ratings_avg_rating ||
      expert.rating ||
      0
  )
);

const [reviewsCount, setReviewsCount] = useState<number>(
  Number(
    expert.reviews_count ||
      expert.ratings_count ||
      expert.total_reviews ||
      0
  )
);

  const name =
    expert.user?.name ||
    expert.name ||
    expert.full_name ||
    "Expert AgriLink";

  const photoUrl = getExpertPhotoUrl(expert);
  const specialities = getExpertSpecialities(expert);

  const experience =
    expert.experience_years ||
    expert.years_experience ||
    expert.experience ||
    0;

  const location =
    expert.intervention_zone ||
    [expert.city, expert.region]
      .filter(Boolean)
      .join(", ") ||
    "Zone non renseignée";


  const whatsappNumber =
    expert.whatsapp_number ||
    expert.phone ||
    expert.user?.phone ||
    "";

  const whatsappLink = buildWhatsappLink(
    whatsappNumber,
    name,
    specialities[0] || "agriculture"
  );

  async function rateExpert(rating: number) {
  if (ratingLoading) return;

  try {
    setRatingLoading(true);
    setRatingMessage("");
    setRatingError("");

    const data = await apiRequest(
      `/experts/${expert.id}/ratings`,
      {
        method: "POST",
        body: JSON.stringify({
          rating,
        }),
      }
    );

    setSelectedRating(rating);

    setAverageRating(
      Number(data.average_rating ?? rating)
    );

    setReviewsCount(
      Number(data.reviews_count ?? reviewsCount)
    );

    setRatingMessage("Votre note a bien été enregistrée.");

    window.setTimeout(() => {
      setRatingMessage("");
    }, 3000);
  } catch (error: any) {
    console.error("Erreur de notation :", error);

    setRatingError(
      error?.message ||
        "Impossible d’enregistrer votre note."
    );

    window.setTimeout(() => {
      setRatingError("");
    }, 4000);
  } finally {
    setRatingLoading(false);
  }
}

  return (
    <article className="group overflow-hidden rounded-[26px] border border-slate-100 bg-white p-6 shadow-lg shadow-slate-200/50 transition duration-300 hover:-translate-y-1 hover:shadow-xl">
      <div className="flex items-start gap-5">
        {photoUrl ? (
          <img
            src={photoUrl}
            alt={name}
            className="h-24 w-24 shrink-0 rounded-3xl object-cover"
          />
        ) : (
          <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-3xl bg-green-100 text-green-700">
            <User size={38} />
          </div>
        )}

        <div className="min-w-0 flex-1">
          <h4 className="text-xl font-bold leading-7 text-slate-950">
            {name}
          </h4>

          <div className="mt-3 flex flex-wrap gap-2">
            {specialities
              .slice(0, 3)
              .map((item) => (
                <span
                  key={item}
                  className="rounded-full bg-green-50 px-3 py-1.5 text-xs font-semibold text-green-700"
                >
                  {item}
                </span>
              ))}
          </div>
        </div>
      </div>

      <div className="mt-6 space-y-3">
        <div className="flex items-center gap-3 text-sm font-medium text-slate-600">
          <GraduationCap
            size={18}
            className="shrink-0 text-orange-500"
          />

          <span>
            {experience} année
            {Number(experience) > 1 ? "s" : ""} d’expérience
          </span>
        </div>

        <div className="flex items-start gap-3 text-sm font-medium text-slate-600">
          <MapPin
            size={18}
            className="mt-0.5 shrink-0 text-green-700"
          />

          <span className="line-clamp-2">
            {location}
          </span>
        </div>

        {expert.hourly_rate &&
          Number(expert.hourly_rate) > 0 && (
            <div className="rounded-2xl bg-orange-50 px-4 py-3">
              <p className="text-xs font-medium text-orange-600">
                Tarif indicatif
              </p>

              <p className="mt-1 text-base font-bold text-orange-800">
                {new Intl.NumberFormat(
                  "fr-FR"
                ).format(
                  Number(expert.hourly_rate)
                )}{" "}
                FCFA / heure
              </p>
            </div>
          )}
      </div>

      <div className="mt-5 border-t border-slate-100 pt-5">
        <p className="mb-2 text-xs font-medium text-slate-500">
          Noter cet expert
        </p>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((value) => {
              const activeValue =
                hoveredRating || selectedRating;

              const isActive =
                value <= activeValue;

              return (
                <button
                  key={value}
                  type="button"
                  disabled={ratingLoading}
                  onMouseEnter={() =>
                    setHoveredRating(value)
                  }
                  onMouseLeave={() =>
                    setHoveredRating(0)
                  }
                  onClick={() =>
                    rateExpert(value)
                  }
                  className="transition hover:scale-110 disabled:cursor-not-allowed"
                  aria-label={`Donner ${value} étoile${
                    value > 1 ? "s" : ""
                  }`}
                >
                  <Star
                    size={21}
                    className={
                      isActive
                        ? "fill-orange-400 text-orange-400"
                        : "text-slate-300"
                    }
                  />
                </button>
              );
            })}
          </div>

          <span className="text-xs font-medium text-slate-500">
  {averageRating > 0
    ? `${averageRating.toFixed(1)}/5`
    : "Pas encore noté"}{" "}
  · {reviewsCount} avis
</span>
{ratingMessage && (
  <div className="mt-3 rounded-xl bg-green-50 px-3 py-2 text-xs font-semibold text-green-700">
    ✓ {ratingMessage}
  </div>
)}

{ratingError && (
  <div className="mt-3 rounded-xl bg-red-50 px-3 py-2 text-xs font-semibold text-red-700">
    {ratingError}
  </div>
)}
        </div>
      </div>

      {whatsappNumber ? (
        <a
          href={whatsappLink}
          target="_blank"
          rel="noreferrer"
          className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#25D366] px-4 py-3 text-sm font-semibold text-white shadow-md shadow-green-100 transition hover:bg-[#1fbd59]"
        >
          <MessageCircle size={18} />
          Demander un service
        </a>
      ) : (
        <button
          type="button"
          disabled
          className="mt-5 inline-flex w-full cursor-not-allowed items-center justify-center gap-2 rounded-xl bg-slate-100 px-4 py-3 text-sm font-semibold text-slate-400"
        >
          <MessageCircle size={18} />
          Contact indisponible
        </button>
      )}
    </article>
  );
}

function getExpertPhotoUrl(expert: any): string | null {
  const path =
    expert.photo ||
    expert.photo_path ||
    expert.profile_photo ||
    expert.user?.photo ||
    null;

  if (!path) return null;

  if (
    path.startsWith("http://") ||
    path.startsWith("https://")
  ) {
    return path;
  }

  const cleanPath = path
    .replace(/^\/+/, "")
    .replace(/^storage\//, "");

  return `${API_BASE_URL}/storage/${cleanPath}`;
}

function getExpertSpecialities(
  expert: any
): string[] {
  if (Array.isArray(expert.specialities)) {
    return expert.specialities
      .map((item: any) =>
        typeof item === "string"
          ? item
          : item.name || item.label
      )
      .filter(Boolean);
  }

  if (Array.isArray(expert.specialties)) {
    return expert.specialties
      .map((item: any) =>
        typeof item === "string"
          ? item
          : item.name || item.label
      )
      .filter(Boolean);
  }

  const speciality =
    expert.speciality ||
    expert.specialty ||
    expert.specialization ||
    "";

  if (!speciality) {
    return ["Expert agricole"];
  }

  return String(speciality)
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function getExpertCategory(
  expert: any
): ExpertFilter | string {
  const specialities = normalizeText(
    getExpertSpecialities(expert).join(" ")
  );

  if (
    specialities.includes("agronomie") ||
    specialities.includes("agronome") ||
    specialities.includes("production")
  ) {
    return "agronomie";
  }

  if (
    specialities.includes("veterinaire") ||
    specialities.includes("elevage")
  ) {
    return "veterinaire";
  }

  if (
    specialities.includes("irrigation") ||
    specialities.includes("hydraulique")
  ) {
    return "irrigation";
  }

  if (
    specialities.includes("marketing") ||
    specialities.includes("commercialisation")
  ) {
    return "marketing";
  }

  if (
    specialities.includes("finance") ||
    specialities.includes("gestion")
  ) {
    return "finance";
  }

  return specialities;
}

function normalizeText(value: string): string {
  return String(value)
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();
}

function normalizeWhatsappNumber(
  phone: string
): string {
  let normalized = String(
    phone || ""
  ).replace(/\D/g, "");

  if (normalized.startsWith("00")) {
    normalized = normalized.substring(2);
  }

  if (normalized.length === 9) {
    normalized = `221${normalized}`;
  }

  return normalized;
}

function buildWhatsappLink(
  phone: string,
  expertName: string,
  speciality: string
): string {
  const normalizedPhone =
    normalizeWhatsappNumber(phone);

  const message = encodeURIComponent(
    `Bonjour ${expertName}, je vous contacte depuis AgriExpert concernant vos services en ${speciality}. Je souhaiterais échanger avec vous sur mon besoin.`
  );

  return `https://wa.me/${normalizedPhone}?text=${message}`;
}