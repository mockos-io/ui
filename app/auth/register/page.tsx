"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useCallback, useMemo } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useGetAuthGlogin, usePostAuthRegister } from "@/api/auth";
import type { RegisterRequest } from "@/api/model";
import Button from "@/components/Button";
import Divider from "@/components/Divider";
import TextInput from "@/components/TextInput";
import { ToastType, useToast } from "@/components/Toast";
import { useRegister } from "./context/RegisterContext";

export default function Register() {
  const t = useTranslations();
  const router = useRouter();
  const { showToast } = useToast();

  const { setEmail } = useRegister();

  const signUpSchema = z.object({
    name: z.string().trim().min(1, t("COMMON.REQUIRED")),
    email: z
      .email(t("REGISTER.EMAIL_INVALID"))
      .trim()
      .min(1, t("COMMON.REQUIRED")),
    password: z
      .string()
      .min(8, t("REGISTER.PASSWORD_MIN_LENGTH"))
      .regex(/[A-Z]/, t("REGISTER.PASSWORD_UPPERCASE"))
      .regex(/(?:\d|[^A-Za-z0-9])/, t("REGISTER.PASSWORD_NUMBER_OR_SPECIAL")),
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<RegisterRequest>({
    resolver: zodResolver(signUpSchema),
    mode: "onTouched",
  });

  const onError = useCallback(
    (message: string = t("COMMON.ERROR")) => {
      showToast(message, 5000, "/error.svg", ToastType.ERROR);
    },
    [t, showToast],
  );

  const { mutate, isPending } = usePostAuthRegister({
    mutation: {
      onSuccess: (_response, variables) => {
        setEmail(variables.data.email);

        router.push("/auth/register/verify");
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

  function signUp(values: RegisterRequest) {
    mutate({ data: values });
  }

  async function singUpOAuth() {
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
          {t("REGISTER.TITLE")}
        </h1>
        <p className="text-[1rem] text-(--primary-color)">
          {t("REGISTER.SUBTITLE")}
        </p>
      </div>

      <form
        className="flex w-full flex-col gap-4"
        onSubmit={handleSubmit(signUp)}
        noValidate
      >
        <TextInput
          title={t("REGISTER.NAME")}
          placeholder={t("REGISTER.NAME_PLACEHOLDER")}
          name="name"
          type="text"
          disabled={isLoading}
          inputProps={register("name")}
          error={errors.name?.message}
        />

        <TextInput
          title={t("REGISTER.EMAIL")}
          placeholder={t("REGISTER.EMAIL_PLACEHOLDER")}
          name="email"
          type="email"
          disabled={isLoading}
          inputProps={register("email")}
          error={errors.email?.message}
        />

        <TextInput
          title={t("REGISTER.PASSWORD")}
          placeholder={t("REGISTER.PASSWORD_PLACEHOLDER")}
          name="password"
          type="password"
          disabled={isLoading}
          inputProps={register("password")}
          error={errors.password?.message}
        />

        {errors.password && (
          <div className="w-full flex flex-col p-4 rounded-sm border border-(--text-input-border) bg-(--text-input-background)">
            <span className="text-[1rem] pb-1 text-(--primary-color)">
              {t("REGISTER.PASSWORD_ERROR_TITLE")}
            </span>
            <div className="w-full flex flex-col gap-1 pl-5 text-(--primary-color-low)">
              <span>{t("REGISTER.PASSWORD_MIN_LENGTH")}</span>
              <span>{t("REGISTER.PASSWORD_UPPERCASE")}</span>
              <span>{t("REGISTER.PASSWORD_NUMBER_OR_SPECIAL")}</span>
            </div>
          </div>
        )}

        <Button type="submit" disabled={!isValid || isLoading}>
          {t("REGISTER.SIGN_UP")}
          <Image
            className="h-3 w-3"
            src="/arrow-right.svg"
            alt="arrow right"
            width={12}
            height={12}
          />
        </Button>

        <div className="w-full flex gap-2 items-center pt-10 pb-10">
          <Divider />
          <span className="text-[0.875rem] text-(--primary-color) whitespace-nowrap">
            {t("REGISTER.CONTINUE_WITH")}
          </span>
          <Divider />
        </div>

        <Button variant="secondary" onClick={singUpOAuth} disabled={isLoading}>
          <Image
            className="h-5 w-5"
            src="/google.svg"
            alt="arrow right"
            width={20}
            height={20}
          />
          {t("REGISTER.SIGN_UP_OAUTH")}
        </Button>

        <div className="w-full flex gap-2 text-[0.875rem] text-(--primary-color) pt-10 justify-center items-center">
          <span>{t("REGISTER.ACCOUNT_QUESTION")}</span>
          <Link
            className="text-(--link-color) hover:underline"
            href="/auth/login"
          >
            {t("REGISTER.SIGN_IN")}
          </Link>
        </div>
      </form>
    </div>
  );
}
