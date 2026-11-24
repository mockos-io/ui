"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { type InputHTMLAttributes, type Ref, useMemo, useState } from "react";

type TextInputProps = {
  title: string;
  value?: string;
  onChange?: (value: string) => void;
  name?: string;
  type?: "text" | "email" | "password";
  inputProps?: InputHTMLAttributes<HTMLInputElement> & {
    ref?: Ref<HTMLInputElement>;
  };
  placeholder?: string;
  helperText?: string;
  error?: string;
  link?: string;
  onLinkClick?: () => void;
};

export default function TextInput({
  title,
  value,
  onChange,
  name,
  type = "text",
  inputProps,
  placeholder,
  helperText,
  error,
  link,
  onLinkClick,
}: TextInputProps) {
  const t = useTranslations();

  const inputId = name ?? title;

  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const inputType = type === "password" && isPasswordVisible ? "text" : type;

  const passwordButtonLabel = useMemo(
    () => (isPasswordVisible ? "TEXT_INPUT.HIDE" : "TEXT_INPUT.SHOW"),
    [isPasswordVisible],
  );

  return (
    <label className="flex w-full flex-col gap-2" htmlFor={inputId}>
      <div className="flex justify-between">
        <span className="text-(--primary-color) text-[0.875rem]">{title}</span>
        {link && (
          <button
            type="button"
            className="cursor-pointer border-0 bg-transparent p-0 text-[0.875rem] text-(--text-input-link) hover:underline"
            onClick={onLinkClick}
          >
            {link}
          </button>
        )}
      </div>
      <div className="relative w-full">
        <input
          id={inputId}
          name={name}
          type={inputType}
          value={value}
          placeholder={placeholder}
          onChange={(event) => onChange?.(event.target.value)}
          className={`w-full rounded-sm border ${error ? "border-(--error-color)" : "border-(--text-input-border)"} bg-(--text-input-background) px-4 py-2 text-(--primary-color) outline-none focus:ring-2 focus:ring-(--text-input-focus) ${type === "password" ? "pr-11" : ""}`}
          {...inputProps}
        />
        {type === "password" && (
          <button
            type="button"
            aria-label={t(passwordButtonLabel)}
            aria-pressed={isPasswordVisible}
            onMouseDown={(event) => event.preventDefault()}
            onClick={() => setIsPasswordVisible((visible) => !visible)}
            className="absolute inset-y-0 right-3 flex cursor-pointer items-center border-0 bg-transparent p-0"
          >
            <Image
              src={
                isPasswordVisible ? "/visibility_off.svg" : "/visibility.svg"
              }
              alt=""
              aria-hidden="true"
              width={20}
              height={20}
              className="h-5 w-5"
            />
          </button>
        )}
      </div>
      {helperText && (
        <span className="text-sm text-(--text-input-helper)">{helperText}</span>
      )}
      {error && <span className="text-sm text-(--error-color)">{error}</span>}
    </label>
  );
}
