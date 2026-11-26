"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import { usePostAuthVerify } from "@/api/auth";
import { AUTH_TOKEN_COOKIE_KEY, setCookie } from "@/lib/cookies";

export default function VerifyWithValue() {
  const router = useRouter();
  const { value } = useParams<{ value: string }>();

  const { mutate } = usePostAuthVerify({
    mutation: {
      onSuccess: (response) => {
        if (response.status !== 200) {
          router.replace("/auth/register/verify/failed");
          return;
        }

        setCookie(AUTH_TOKEN_COOKIE_KEY, response.data.token);
        router.replace("/auth/register/verify/success");
      },
      onError: () => router.replace("/auth/register/verify/failed"),
    },
  });

  useEffect(() => {
    mutate({ data: { token: value } });
  }, [value, mutate]);

  return null;
}
