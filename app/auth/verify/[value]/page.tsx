"use client";

import { useParams, useRouter } from "next/navigation";
import { useCallback, useEffect } from "react";
import { usePostAuthVerify } from "@/api/auth";
import { AUTH_TOKEN_COOKIE_KEY, setCookie } from "@/lib/cookies";

export default function VerifyWithValue() {
  const router = useRouter();
  const { value } = useParams<{ value: string }>();

  const onError = useCallback(
    (message?: string) => {
      //TODO: do something with message

      router.replace("/auth/register/verify/failed");
    },
    [router],
  );

  const { mutate } = usePostAuthVerify({
    mutation: {
      onSuccess: (response) => {
        if (response.status !== 200) {
          onError();

          return;
        }

        setCookie(AUTH_TOKEN_COOKIE_KEY, response.data.token);
        router.replace("/auth/register/verify/success");
      },
      onError: onError,
    },
  });

  useEffect(() => {
    if (!value) {
      onError();

      return;
    }

    mutate({ data: { token: value } });
  }, [value, mutate, onError]);

  return null;
}
