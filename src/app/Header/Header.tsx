"use client";
import { useEffect } from "react";
import { Logo } from "../Logo";
import styles from "./Header.module.css";

export default function Header() {
  let scrollPercent: number = 0;

  useEffect(() => {
    document.addEventListener("scroll-percent", (e: any) => {
      scrollPercent = e.detail;
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
