export const AUTH_TOKEN_COOKIE_KEY = "token";

type CookieOptions = {
  secure?: boolean;
  sameSite?: "lax" | "strict" | "none";
  path?: string;
  maxAge?: number;
};

export function setCookie(
  name: string,
  value: string,
  options: CookieOptions = {},
) {
  if (typeof document === "undefined") return;

  const attributes = [
    `path=${options.path ?? "/"}`,
    `SameSite=${options.sameSite ?? "Lax"}`,
  ];

  const secure = options.secure ?? window.location.protocol === "https:";

  if (secure) attributes.push("Secure");

  if (options.maxAge !== undefined)
    attributes.push(`Max-Age=${options.maxAge}`);

  // biome-ignore lint/suspicious/noDocumentCookie: This utility intentionally writes a browser-readable cookie.
  document.cookie = `${encodeURIComponent(name)}=${encodeURIComponent(value)}; ${attributes.join("; ")}`;
}

export function getCookie(name: string): string | undefined {
  if (typeof document === "undefined") return undefined;

  const encodedName = `${encodeURIComponent(name)}=`;
  const cookie = document.cookie
    .split(";")
    .map((part) => part.trim())
    .find((part) => part.startsWith(encodedName));

  return cookie
    ? decodeURIComponent(cookie.slice(encodedName.length))
    : undefined;
}
