"use client";

import { Languages } from "lucide-react";
import type { Locale } from "@/lib/i18n";

export function LanguageToggle({ locale }: { locale: Locale }) {
  function toggleLanguage() {
    const next = locale === "zh" ? "en" : "zh";
    document.cookie = `cockpitlm_locale=${next}; path=/; max-age=31536000; SameSite=Lax`;
    window.location.reload();
  }

  return (
    <button
      type="button"
      className="language-toggle"
      onClick={toggleLanguage}
      aria-label={locale === "zh" ? "Switch to English" : "切换到中文"}
      title={locale === "zh" ? "Switch to English" : "切换到中文"}
    >
      <Languages size={15} />
      <span>{locale === "zh" ? "EN" : "中文"}</span>
    </button>
  );
}
