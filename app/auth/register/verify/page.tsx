"use client";

import Image from "next/image";
import Link from "next/link";
import { useTranslations } from "next-intl";

export default function Verify() {
  const t = useTranslations();

  function resendVerifyEmail() {
    //TODO: add logic
  }

  return (
    <div className="flex w-full flex-col">
      <div className="w-full flex pb-6">
        <div className="w-16 h-16 flex justify-center items-center bg-(--background-color-light) rounded-xl">
          <Image src="/letter.svg" alt="letter" width={32} height={27} />
        </div>
      </div>

      <div className="w-full flex flex-col pb-10">
        <h1 className="text-[2rem] text-(--primary-color)">
          {t("VERIFY.TITLE")}
        </h1>
        <p className="text-[1rem] text-(--primary-color)">
          {t("VERIFY.SUBTITLE")}
        </p>
      </div>

      <div className="w-full flex gap-2 text-[0.875rem] text-(--primary-color)  justify-center items-center">
        <span>{t("VERIFY.ACCOUNT_QUESTION")}</span>
        <Link
          className="text-(--link-color) hover:underline"
          href="/auth/login"
          onClick={resendVerifyEmail}
        >
          {t("VERIFY.RESEND")}
        </Link>
      </div>
    </div>
  );
}
