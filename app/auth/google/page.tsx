"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect } from "react";
import { usePostAuthGlogin } from "@/api/auth";
import { AUTH_TOKEN_COOKIE_KEY, setCookie } from "@/lib/cookies";

export default function Google() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const code = searchParams.get("code");

  const onError = useCallback(
    (message?: string) => {
      //TODO: do something with message

      router.push("/auth/login");
    },
    [router],
  );

  const { mutate } = usePostAuthGlogin({
    mutation: {
      onSuccess: (response) => {
        if (response.status !== 200) {
          onError();

          return;
        }

        setCookie(AUTH_TOKEN_COOKIE_KEY, response.data.token);
        router.replace("/dashboard");
      },
      onError: onError,
    },
  });

  useEffect(() => {
    if (!code) {
      onError();

      return;
    }

    mutate({ data: { code } });
  }, [code, mutate, onError]);

  return null;
}
