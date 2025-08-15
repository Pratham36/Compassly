"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

export function BodyScrollFix() {
  const pathname = usePathname();

  useEffect(() => {
    if (document.body.hasAttribute("data-scroll-locked")) {
      document.body.style.overflow = "";
      document.body.removeAttribute("data-scroll-locked");
    }
  }, [pathname]);

  return null; 
}
