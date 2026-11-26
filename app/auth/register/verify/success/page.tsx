"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import Button from "@/components/Button";

export default function VerifySuccess() {
  const t = useTranslations();
  const router = useRouter();

  return (
    <div className="flex w-full flex-col">
      <div className="w-full flex pb-6">
        <div className="w-16 h-16 flex justify-center items-center bg-(--background-color-light) rounded-xl">
          <Image src="/success.svg" alt="letter" width={32} height={27} />
        </div>
      </div>

      <div className="w-full flex flex-col pb-10">
        <h1 className="text-[2rem] text-(--primary-color)">
          {t("VERIFY_SUCCESS.TITLE")}
        </h1>
        <p className="text-[1rem] text-(--primary-color)">
          {t("VERIFY_SUCCESS.SUBTITLE")}
        </p>
      </div>

      <Button
        type="submit"
        color="secondary"
        onClick={() => router.push("/auth/login")}
      >
        {t("VERIFY_SUCCESS.CONTINUE")}
        <Image
          className="h-3 w-3"
          src="/arrow-right.svg"
          alt="arrow right"
          width={12}
          height={12}
        />
      </Button>
    </div>
  );
}
