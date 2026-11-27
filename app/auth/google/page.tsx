"use client";

import { error } from "next/dist/build/output/log";
import { useRouter, useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { useCallback, useEffect } from "react";
import { usePostAuthGlogin } from "@/api/auth";
import { ToastType, useToast } from "@/components/Toast";
import { AUTH_TOKEN_COOKIE_KEY, setCookie } from "@/lib/cookies";

export default function Google() {
  const t = useTranslations();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { showToast } = useToast();

  const code = searchParams.get("code");

  const onError = useCallback(
    (message: string = t("COMMON.ERROR")) => {
      showToast(message, 5000, "/error.svg", ToastType.ERROR);

      router.push("/auth/login");
    },
    [t, router, showToast],
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
      onError: (error) => onError(error.message),
    },
  });

  useEffect(() => {
    if (!code) {
      router.push("/auth/login");

      return;
    }

    mutate({ data: { code } });
  }, [code, mutate, router]);

  return null;
}
