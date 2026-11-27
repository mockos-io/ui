"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useCallback, useMemo } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useGetAuthGlogin, usePostAuthLogin } from "@/api/auth";
import type { LoginRequest } from "@/api/model";
import Button from "@/components/Button";
import Divider from "@/components/Divider";
import TextInput from "@/components/TextInput";
import { ToastType, useToast } from "@/components/Toast";
import { AUTH_TOKEN_COOKIE_KEY, setCookie } from "@/lib/cookies";

export default function Login() {
  const t = useTranslations();
  const router = useRouter();
  const { showToast } = useToast();

  const loginSchema = z.object({
    email: z
      .email(t("LOGIN.EMAIL_INVALID"))
      .trim()
      .min(1, t("COMMON.REQUIRED")),
    password: z.string().trim().min(1, t("COMMON.REQUIRED")),
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<LoginRequest>({
    resolver: zodResolver(loginSchema),
    mode: "onTouched",
  });

  const { mutate, isPending } = usePostAuthLogin({
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

  const { refetch: startGoogleLogin, isFetching: isPendingGLogin } =
    useGetAuthGlogin({
      query: {
        enabled: false,
      },
    });

  const isLoading = useMemo(
    () => isPending || isPendingGLogin,
    [isPending, isPendingGLogin],
  );

  const onError = useCallback(
    (message: string = t("COMMON.ERROR")) => {
      showToast(message, 5000, "/error.svg", ToastType.ERROR);
    },
    [t, showToast],
  );

  function login(values: LoginRequest) {
    mutate({ data: values });
  }

  async function loginOAuth() {
    const authTab = window.open("about:blank", "_blank");

    try {
      const { data: response } = await startGoogleLogin();

      if (response && authTab) {
        authTab.location.href = response.data.url;
      } else {
        authTab?.close();
      }
    } catch {
      authTab?.close();
    }
  }

  return (
    <div className="flex w-full flex-col">
      <div className="w-full flex flex-col pb-10">
        <h1 className="text-[2rem] text-(--primary-color)">
          {t("LOGIN.TITLE")}
        </h1>
        <p className="text-[1rem] text-(--primary-color)">
          {t("LOGIN.SUBTITLE")}
        </p>
      </div>

      <form
        className="flex w-full flex-col gap-4"
        onSubmit={handleSubmit(login)}
        noValidate
      >
        <TextInput
          title={t("LOGIN.EMAIL")}
          placeholder={t("LOGIN.EMAIL_PLACEHOLDER")}
          name="email"
          type="email"
          inputProps={register("email")}
          error={errors.email?.message}
          disabled={isLoading}
          link={t("LOGIN.FORGOT_PASSWORD")}
          onLinkClick={() => router.push("/auth/recover")}
        />

        <TextInput
          title={t("LOGIN.PASSWORD")}
          placeholder={t("LOGIN.PASSWORD_PLACEHOLDER")}
          name="password"
          type="password"
          disabled={isLoading}
          inputProps={register("password")}
          error={errors.password?.message}
        />

        <Button type="submit" disabled={!isValid || isLoading}>
          {t("LOGIN.SIGN_IN")}
          <Image
            className="h-3 w-3"
            src="/arrow-right.svg"
            alt="arrow right"
            width={12}
            height={12}
          />
        </Button>
      </form>

      <div className="w-full flex gap-2 items-center pt-10 pb-10">
        <Divider />
        <span className="text-[0.875rem] text-(--primary-color) whitespace-nowrap">
          {t("LOGIN.CONTINUE_WITH")}
        </span>
        <Divider />
      </div>

      <Button variant="secondary" onClick={loginOAuth} disabled={isLoading}>
        <Image
          className="h-5 w-5"
          src="/google.svg"
          alt="arrow right"
          width={20}
          height={20}
        />
        {t("LOGIN.SIGN_IN_OAUTH")}
      </Button>

      <div className="w-full flex gap-2 text-[0.875rem] text-(--primary-color) pt-10 justify-center items-center">
        <span>{t("LOGIN.ACCOUNT_QUESTION")}</span>
        <Link
          className="text-(--link-color) hover:underline"
          href="/auth/register"
        >
          {t("LOGIN.SIGN_UP")}
        </Link>
      </div>
    </div>
  );
}
