export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export function assertApiBaseUrl() {
  if (!API_BASE_URL) {
    throw new Error("VITE_API_BASE_URL is not set. Add it to your .env file.");
  }
}

export async function apiRequest(path, options = {}) {
  assertApiBaseUrl();

  const { method = "GET", body, headers, ...rest } = options;
  const init = {
    method,
    headers: {
      "Content-Type": "application/json",
      ...headers
    },
    ...rest
  };

  if (body !== undefined) {
    init.body = JSON.stringify(body);
  }

  const response = await fetch(`${API_BASE_URL}${path}`, init);
  const contentType = response.headers.get("content-type") || "";
  const isJson = contentType.includes("application/json");
  const data = isJson ? await response.json() : null;

  if (!response.ok) {
    const message = data?.error || data?.message || "Request failed";
    throw new Error(message);
  }

  return data;
}
