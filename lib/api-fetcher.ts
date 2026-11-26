import { AUTH_TOKEN_COOKIE_KEY, getCookie } from "@/lib/cookies";

export const fetcher = async <T>(
  url: string,
  options?: RequestInit,
): Promise<T> => {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;

  if (!baseUrl) {
    throw new Error("NEXT_PUBLIC_API_URL is not configured");
  }

  const headers = new Headers(options?.headers);
  const token = getCookie(AUTH_TOKEN_COOKIE_KEY);

  if (token) headers.set("Authorization", `Bearer ${token}`);

  const response = await fetch(new URL(url, baseUrl), {
    ...options,
    headers,
  });

  if (!response.ok) {
    throw new Error(
      `API request failed: ${response.status} ${response.statusText}`,
    );
  }

  if ([204, 205, 304].includes(response.status)) {
    return {
      data: undefined,
      status: response.status,
      headers: response.headers,
    } as T;
  }

  return {
    data: await response.json(),
    status: response.status,
    headers: response.headers,
  } as T;
};
