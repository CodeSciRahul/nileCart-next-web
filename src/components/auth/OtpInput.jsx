"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

const OTP_LENGTH = 6;

export default function OtpInput({
  value,
  onChange,
  disabled = false,
  autoFocus = false,
  hasError = false,
  className,
}) {
  const inputRefs = useRef([]);

  const digits = Array.from({ length: OTP_LENGTH }, (_, index) => value[index] || "");

  useEffect(() => {
    if (autoFocus && inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, [autoFocus]);

  const focusInput = (index) => {
    const input = inputRefs.current[index];
    if (input) input.focus();
  };

  const updateValue = (nextDigits) => {
    onChange(nextDigits.join("").slice(0, OTP_LENGTH));
  };

  const handleChange = (index, nextChar) => {
    const sanitized = nextChar.replace(/\D/g, "");
    if (!sanitized) return;

    const nextDigits = [...digits];
    nextDigits[index] = sanitized.slice(-1);
    updateValue(nextDigits);

    if (index < OTP_LENGTH - 1) {
      focusInput(index + 1);
    }
  };

  const handleKeyDown = (index, event) => {
    if (event.key === "Backspace") {
      event.preventDefault();
      const nextDigits = [...digits];

      if (digits[index]) {
        nextDigits[index] = "";
        updateValue(nextDigits);
        return;
      }

      if (index > 0) {
        nextDigits[index - 1] = "";
        updateValue(nextDigits);
        focusInput(index - 1);
      }
    }

    if (event.key === "ArrowLeft" && index > 0) {
      event.preventDefault();
      focusInput(index - 1);
    }

    if (event.key === "ArrowRight" && index < OTP_LENGTH - 1) {
      event.preventDefault();
      focusInput(index + 1);
    }
  };

  const handlePaste = (event) => {
    event.preventDefault();
    const pasted = event.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, OTP_LENGTH);

    if (!pasted) return;

    onChange(pasted);
    focusInput(Math.min(pasted.length, OTP_LENGTH - 1));
  };

  return (
    <div
      role="group"
      aria-label="One-time verification code"
      className={cn("flex justify-center gap-2 sm:gap-2.5", className)}
    >
      {digits.map((digit, index) => (
        <input
          key={index}
          ref={(element) => {
            inputRefs.current[index] = element;
          }}
          type="text"
          inputMode="numeric"
          autoComplete={index === 0 ? "one-time-code" : "off"}
          maxLength={1}
          value={digit}
          disabled={disabled}
          onChange={(event) => handleChange(index, event.target.value)}
          onKeyDown={(event) => handleKeyDown(index, event)}
          onPaste={handlePaste}
          onFocus={(event) => event.target.select()}
          aria-label={`Digit ${index + 1} of ${OTP_LENGTH}`}
          aria-invalid={hasError || undefined}
          className={cn(
            "h-12 w-10 sm:h-14 sm:w-12 rounded-xl border bg-brand-cream/40 text-center text-lg sm:text-xl font-bold text-foreground outline-none transition-all duration-200",
            "placeholder:text-transparent",
            "hover:border-brand-amber/50 hover:bg-white",
            "focus:border-brand-amber focus:bg-white focus:ring-4 focus:ring-brand-amber/20 focus:scale-[1.03]",
            "disabled:cursor-not-allowed disabled:opacity-60",
            hasError
              ? "border-red-300 bg-red-50/60 focus:border-red-400 focus:ring-red-100"
              : digit
                ? "border-brand-amber bg-white shadow-sm shadow-brand-amber/15"
                : "border-black/10"
          )}
        />
      ))}
    </div>
  );
}
