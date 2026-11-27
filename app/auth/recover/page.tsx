"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { usePostAuthSendReset } from "@/api/auth";
import type { EmailRequest } from "@/api/model";
import Button from "@/components/Button";
import TextInput from "@/components/TextInput";

export default function Recover() {
  const t = useTranslations();

  const recoverSchema = z.object({
    email: z.string().trim().min(1, t("COMMON.REQUIRED")),
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<EmailRequest>({
    resolver: zodResolver(recoverSchema),
    mode: "onChange",
  });

  const { mutate, isPending } = usePostAuthSendReset({
    mutation: {
      onSuccess: () => {
        //TODO: hacer algo
      },
    },
  });

  function sendResetLink(values: EmailRequest) {
    mutate({ data: values });
  }

  return (
    <div className="flex w-full flex-col">
      <div className="w-full flex flex-col pb-10">
        <h1 className="text-[2rem] text-(--primary-color)">
          {t("RECOVER.TITLE")}
        </h1>
        <p className="text-[1rem] text-(--primary-color)">
          {t("RECOVER.SUBTITLE")}
        </p>
      </div>

      <form
        className="flex w-full flex-col gap-4"
        onSubmit={handleSubmit(sendResetLink)}
        noValidate
      >
        <TextInput
          title={t("RECOVER.EMAIL")}
          placeholder={t("RECOVER.EMAIL_PLACEHOLDER")}
          name="email"
          type="text"
          disabled={isPending}
          inputProps={register("email")}
          error={errors.email?.message}
        />

        <Button type="submit" disabled={!isValid || isPending}>
          {t("RECOVER.SEND_LINK")}
          <Image
            className="h-3 w-3"
            src="/arrow-right.svg"
            alt="arrow right"
            width={12}
            height={12}
          />
        </Button>

        <div className="w-full flex gap-2 text-[0.875rem] text-(--primary-color) pt-8 justify-center items-center">
          <span>{t("RECOVER.ACCOUNT_QUESTION")}</span>
          <Link
            className="text-(--link-color) hover:underline"
            href="/auth/login"
          >
            {t("RECOVER.SIGN_IN")}
          </Link>
        </div>
      </form>
    </div>
  );
}
