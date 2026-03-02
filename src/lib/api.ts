// lib/api.ts
const TOKEN_KEY = "bole_access_token";

export function setAccessToken(token: string) {
  localStorage.setItem(TOKEN_KEY, token);
}
export function getAccessToken() {
  return localStorage.getItem(TOKEN_KEY);
}
export function clearAccessToken() {
  localStorage.removeItem(TOKEN_KEY);
}

function authHeaders(): Record<string, string> {
  const token = getAccessToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function buildApiError(res: Response): Promise<Error> {
  const fallback = `HTTP ${res.status}`;
  try {
    const data = await res.json();

    if (Array.isArray(data?.detail)) {
      const msg = data.detail
        .map((d: any) => d?.msg || JSON.stringify(d))
        .join(", ");
      return new Error(msg || fallback);
    }
    if (typeof data?.detail === "string") return new Error(data.detail);
    if (typeof data?.message === "string") return new Error(data.message);

    return new Error(fallback);
  } catch {
    const text = await res.text().catch(() => "");
    return new Error(text || fallback);
  }
}

export async function apiGet<T>(path: string): Promise<T> {
  const res = await fetch(path, {
    method: "GET",
    headers: { ...authHeaders() },
  });

  if (!res.ok) throw await buildApiError(res);
  return res.json();
}

export async function apiPost<T = any>(
  path: string,
  body: unknown,
): Promise<T> {
  const res = await fetch(path, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...authHeaders(),
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) throw await buildApiError(res);

  const text = await res.text();
  return text ? (JSON.parse(text) as T) : (undefined as T);
}

export async function apiLogin(email: string, password: string) {
  const form = new URLSearchParams();
  form.set("username", email);
  form.set("password", password);

  const res = await fetch("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: form.toString(),
  });

  if (!res.ok) throw await buildApiError(res);

  const data = (await res.json()) as {
    access_token: string;
    token_type: string;
  };
  if (!data?.access_token)
    throw new Error("Login response did not include access_token");

  setAccessToken(data.access_token);
  return data;
}
