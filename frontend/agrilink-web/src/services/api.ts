import {
  clearAuthSession,
  getStoredToken,
} from "@/src/lib/auth";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "http://127.0.0.1:8000/api";

async function parseResponse(response: Response) {
  const contentType = response.headers.get("content-type");

  if (contentType?.includes("application/json")) {
    return response.json();
  }

  const text = await response.text();

  return {
    message:
      text || "Une erreur inattendue est survenue.",
  };
}

function handleUnauthenticated(response: Response) {
  if (
    response.status === 401 &&
    typeof window !== "undefined"
  ) {
    clearAuthSession();
    window.location.href = "/login";
  }
}

export async function apiRequest(
  endpoint: string,
  options: RequestInit = {}
) {
  const token = getStoredToken();

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      ...(token
        ? {
            Authorization: `Bearer ${token}`,
          }
        : {}),
      ...options.headers,
    },
  });

  const data = await parseResponse(response);

  if (!response.ok) {
    handleUnauthenticated(response);
    throw data;
  }

  return data;
}

export async function apiUpload(
  endpoint: string,
  formData: FormData
) {
  const token = getStoredToken();

  const response = await fetch(`${API_URL}${endpoint}`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      ...(token
        ? {
            Authorization: `Bearer ${token}`,
          }
        : {}),
    },
    body: formData,
  });

  const data = await parseResponse(response);

  if (!response.ok) {
    handleUnauthenticated(response);
    throw data;
  }

  return data;
}