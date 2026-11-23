"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { z } from "zod";
import Button from "@/components/Button";
import TextInput from "@/components/TextInput";

type RegisterFormValues = {
  name: string;
  email: string;
  password: string;
};

export default function Register() {
  const t = useTranslations();

  const loginSchema = z.object({
    name: z.string().trim().min(1, t("COMMON.REQUIRED")),
    email: z
      .email(t("REGISTER.EMAIL_INVALID"))
      .trim()
      .min(1, t("COMMON.REQUIRED")),
    password: z
      .string()
      .min(8)
      .regex(/[A-Z]/)
      .regex(/(?:\d|[^A-Za-z0-9])/),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(loginSchema),
    mode: "onBlur",
  });

  function signUp() {
    //TODO: add logic
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
          inputProps={register("name")}
          error={errors.name?.message}
        />

        <TextInput
          title={t("REGISTER.EMAIL")}
          placeholder={t("REGISTER.EMAIL_PLACEHOLDER")}
          name="email"
          type="email"
          inputProps={register("email")}
          error={errors.email?.message}
        />

        <TextInput
          title={t("REGISTER.PASSWORD")}
          placeholder={t("REGISTER.PASSWORD_PLACEHOLDER")}
          name="password"
          type="password"
          inputProps={register("password")}
          error={errors.password?.message}
        />

        <Button type="submit">
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
    </div>
  );
}
