export const fetcher = async <T>(
  url: string,
  options?: RequestInit,
): Promise<T> => {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;

  if (!baseUrl) {
    throw new Error("NEXT_PUBLIC_API_URL is not configured");
  }

  const response = await fetch(new URL(url, baseUrl), options);

  if (!response.ok) {
    throw new Error(
      `API request failed: ${response.status} ${response.statusText}`,
    );
  }

  if ([204, 205, 304].includes(response.status)) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
};
