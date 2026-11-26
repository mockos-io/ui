"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { usePostAuthReset } from "@/api/auth";
import Button from "@/components/Button";
import TextInput from "@/components/TextInput";

type RecoverPasswordFormValues = {
  newPassword: string;
  confirmPassword: string;
};

export default function RecoverPassword() {
  const t = useTranslations();
  const router = useRouter();

  const { value: token } = useParams<{ value: string }>();

  const recoverSchema = z
    .object({
      newPassword: z
        .string()
        .trim()
        .min(8, t("REGISTER.PASSWORD_MIN_LENGTH"))
        .regex(/[A-Z]/, t("REGISTER.PASSWORD_UPPERCASE"))
        .regex(/(?:\d|[^A-Za-z0-9])/, t("REGISTER.PASSWORD_NUMBER_OR_SPECIAL")),
      confirmPassword: z.string(),
    })
    .refine((values) => values.newPassword === values.confirmPassword, {
      message: t("RECOVER_PASSWORD.PASSWORDS_MUST_MATCH"),
      path: ["confirmPassword"],
    });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid },
  } = useForm<RecoverPasswordFormValues>({
    resolver: zodResolver(recoverSchema),
    mode: "onBlur",
  });

  const { mutate, isPending } = usePostAuthReset({
    mutation: {
      onSuccess: () => {
        reset();

        router.push("/auth/login");
      },
    },
  });

  function recoverPassword(values: RecoverPasswordFormValues) {
    mutate({ data: { token, password: values.newPassword } });
  }

  return (
    <div className="flex w-full flex-col">
      <div className="w-full flex flex-col pb-10">
        <h1 className="text-[2rem] text-(--primary-color)">
          {t("RECOVER_PASSWORD.TITLE")}
        </h1>
        <p className="text-[1rem] text-(--primary-color)">
          {t("RECOVER_PASSWORD.SUBTITLE")}
        </p>
      </div>

      <form
        className="flex w-full flex-col gap-4"
        onSubmit={handleSubmit(recoverPassword)}
        noValidate
      >
        <TextInput
          title={t("RECOVER_PASSWORD.NEW_PASSWORD")}
          placeholder={t("RECOVER_PASSWORD.NEW_PASSWORD_PLACEHOLDER")}
          name="newPassword"
          type="password"
          disabled={isPending}
          inputProps={register("newPassword")}
          error={errors.newPassword?.message}
        />

        <TextInput
          title={t("RECOVER_PASSWORD.CONFIRM_NEW_PASSWORD")}
          placeholder={t("RECOVER_PASSWORD.CONFIRM_NEW_PASSWORD_PLACEHOLDER")}
          name="confirmPassword"
          type="password"
          disabled={isPending}
          inputProps={register("confirmPassword")}
          error={errors.confirmPassword?.message}
        />

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

        <Button type="submit" disabled={!isValid || isPending}>
          {t("RECOVER_PASSWORD.RESET_PASSWORD")}
          <Image
            className="h-3 w-3"
            src="/arrow-right.svg"
            alt="arrow right"
            width={12}
            height={12}
          />
        </Button>

        <div className="w-full flex gap-2 text-[0.875rem] text-(--primary-color) pt-10 justify-center items-center">
          <span>{t("RECOVER_PASSWORD.ACCOUNT_QUESTION")}</span>
          <Link
            className="text-(--link-color) hover:underline"
            href="/auth/login"
          >
            {t("RECOVER_PASSWORD.SIGN_IN")}
          </Link>
        </div>
      </form>
    </div>
  );
}
