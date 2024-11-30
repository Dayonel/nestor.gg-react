"use client";
import { useEffect, useState } from "react";
import styles from "./Header.module.css";
import { Logo } from "@/app/Logo";

export default function Header() {
  const [scrollPercent, setScrollPercent] = useState(0);

  useEffect(() => {
    document.addEventListener("scroll-percent", (e: any) => {
      setScrollPercent(e.detail);
    });
  });

  return (
    <div className={styles.header}>
      <header>
        <a className={styles.logo} href="/" aria-label="Go to homepage.">
          <Logo />
        </a>
        <span className={styles.scroll}>
          Scroll progress: {scrollPercent?.toFixed(2)}%
        </span>
      </header>
    </div>
  );
}
