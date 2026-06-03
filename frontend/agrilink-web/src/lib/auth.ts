export function getStoredUser() {
  if (typeof window === "undefined") return null;

  const storedUser = localStorage.getItem("agrilink_user");

  if (!storedUser) return null;

  return JSON.parse(storedUser);
}

export function getStoredToken() {
  if (typeof window === "undefined") return null;

  return localStorage.getItem("agrilink_token");
}

export function logout() {
  localStorage.removeItem("agrilink_user");
  localStorage.removeItem("agrilink_token");
  window.location.href = "/login";
}

export function redirectByRole(user: any) {
  const role = user?.roles?.[0];

  if (role === "super_admin" || role === "admin") {
    window.location.href = "/admin";
    return;
  }

  if (role === "expert") {
    window.location.href = "/expert";
    return;
  }

  if (role === "vendeur") {
    window.location.href = "/seller";
    return;
  }

  window.location.href = "/student";
}