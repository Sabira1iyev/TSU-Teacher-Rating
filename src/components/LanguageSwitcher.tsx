"use client";

import { usePathname, useRouter } from "next/navigation";
import { useLocale } from "next-intl";

export default function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathName = usePathname();

  const changeLanguage = (newLocale: string) => {
    const segments = pathName.split("/");
    segments[1] = newLocale;
    router.push(segments.join("/"));
  };

  return (
    <div className="flex items-center gap-1 bg-bg2 border-border rounded-xl p-1 shadow-sm">
      {["en", "az", "ka"].map((lang) => (
        <button
          className={`px-2.5 py-1 text-xs font-semibold rounded-lg uppercase transition-all cursor-pointer
                ${
                  locale === lang
                    ? "bg-primary text-white shadow-md"
                    : "text-text2 hover:bg-bg3 hover:text-text"
                }
                `}
          key={lang}
          onClick={() => changeLanguage(lang)}
        >
          {lang}
        </button>
      ))}
    </div>
  );
}
