const API_URL = "http://127.0.0.1:8000/api";

export async function apiRequest(
  endpoint: string,
  options: RequestInit = {}
) {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("agrilink_token") : null;

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw data;
  }

  return data;

  
}