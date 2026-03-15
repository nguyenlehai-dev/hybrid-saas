"use client";
import { useEffect } from "react";
import { useLang } from "@/lib/i18n";
import SupportPageContent from "../ho-tro-khach-hang/page";

export default function SupportPageEN() {
  const { setLang } = useLang();

  useEffect(() => {
    setLang("en");
  }, [setLang]);

  return <SupportPageContent />;
}
