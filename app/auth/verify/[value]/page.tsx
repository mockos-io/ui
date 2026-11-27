"use client";

import { useParams, useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useCallback, useEffect } from "react";
import { usePostAuthVerify } from "@/api/auth";
import { ToastType, useToast } from "@/components/Toast";
import { AUTH_TOKEN_COOKIE_KEY, setCookie } from "@/lib/cookies";

export default function VerifyWithValue() {
  const t = useTranslations();
  const router = useRouter();

  const { showToast } = useToast();
  const { value } = useParams<{ value: string }>();

  const onError = useCallback(
    (message: string = t("COMMON.ERROR")) => {
      showToast(message, 5000, "/error.svg", ToastType.ERROR);

      router.replace("/auth/register/verify/failed");
    },
    [t, showToast, router],
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
      onError: (error) => onError(error.message),
    },
  });

  useEffect(() => {
    if (!value) {
      router.replace("/auth/login");

      return;
    }

    mutate({ data: { token: value } });
  }, [value, mutate, router]);

  return null;
}
