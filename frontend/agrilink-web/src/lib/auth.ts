const USER_KEY = "agrilink_user";
const TOKEN_KEY = "agrilink_token";

export function saveAuthSession(user: any, token: string) {
  if (typeof window === "undefined") return;

  clearAuthSession();

  sessionStorage.setItem(USER_KEY, JSON.stringify(user));
  sessionStorage.setItem(TOKEN_KEY, token);
}

export function getStoredUser() {
  if (typeof window === "undefined") return null;

  const storedUser = sessionStorage.getItem(USER_KEY);

  if (!storedUser) return null;

  try {
    return JSON.parse(storedUser);
  } catch (error) {
    console.error("Utilisateur stocké invalide :", error);
    clearAuthSession();
    return null;
  }
}

export function getStoredToken() {
  if (typeof window === "undefined") return null;

  return sessionStorage.getItem(TOKEN_KEY);
}

export function clearAuthSession() {
  if (typeof window === "undefined") return;

  sessionStorage.removeItem(USER_KEY);
  sessionStorage.removeItem(TOKEN_KEY);

  /*
   * Nettoyage des anciennes données enregistrées
   * avec l’ancienne version de l’application.
   */
  localStorage.removeItem(USER_KEY);
  localStorage.removeItem(TOKEN_KEY);

  localStorage.removeItem("user");
  localStorage.removeItem("token");
  localStorage.removeItem("auth_token");
  localStorage.removeItem("access_token");
}

export function logout() {
  clearAuthSession();
  window.location.href = "/login";
}

export function redirectByRole(user: any) {
  const firstRole = user?.roles?.[0];

  const role =
    typeof firstRole === "string"
      ? firstRole
      : firstRole?.name;

  if (role === "super_admin" || role === "admin") {
    window.location.href = "/admin";
    return;
  }

  window.location.href = "/profile";
}