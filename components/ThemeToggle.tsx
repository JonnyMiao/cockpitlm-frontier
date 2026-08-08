"use client";

import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";
import type { Locale } from "@/lib/i18n";

export function ThemeToggle({ locale }: { locale: Locale }) {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  useEffect(() => {
    const saved = document.documentElement.dataset.theme;
    const next = saved === "dark" || (!saved && matchMedia("(prefers-color-scheme: dark)").matches) ? "dark" : "light";
    document.documentElement.dataset.theme = next;
    const frame = requestAnimationFrame(() => setTheme(next));
    return () => cancelAnimationFrame(frame);
  }, []);
  function toggle() {
    const next = theme === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = next;
    localStorage.setItem("cockpitlm-theme", next);
    setTheme(next);
  }
  const label = locale === "zh" ? `切换到${theme === "dark" ? "浅色" : "深色"}模式` : `Switch to ${theme === "dark" ? "light" : "dark"} mode`;
  return <button type="button" className="icon-button" onClick={toggle} aria-label={label} title={label}>{theme === "dark" ? <Sun size={17} /> : <Moon size={17} />}</button>;
}
