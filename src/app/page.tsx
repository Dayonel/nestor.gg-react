"use client";
import { useEffect, useRef, useState } from "react";
import "./page.css";
import Loader from "./components/Loader/Loader";

export default function Home() {
  const [loading, setLoading] = useState(true);
  const [scrollY, setScrollY] = useState(0);
  const scrolling = useRef<HTMLDivElement | null>(null);
  const sections = useRef<NodeListOf<HTMLElement>>();
  const [scene, setScene] = useState(1);

  useEffect(() => {
    if (!loading) {
      sections.current = document.querySelectorAll("section");
    }
  }, [loading]);

  const inViewport = (element: HTMLElement): boolean => {
    var rect = element.getBoundingClientRect();

    var verticalInView = rect.top <= 0 && rect.bottom >= 0;
    var horizontalInView = rect.left <= 0 && rect.right >= 0;

    return verticalInView && horizontalInView;
  };

  const onScroll = () => {
    if (sections.current) {
      sections.current.forEach((f, i) => {
        if (inViewport(f)) {
          setScene(i + 1);
        }
      });
    }

    const scrollPercent =
      (scrolling.current!.scrollTop /
        (scrolling.current!.scrollHeight - scrolling.current!.clientHeight)) *
      100;

    setScrollY(scrolling.current!.scrollTop);

    // dispatch
    var event = new CustomEvent("scroll-percent", {
      detail: scrollPercent,
    });

    document.dispatchEvent(event);
  };

  return (
    <div ref={scrolling} id="scrolling" onScroll={() => onScroll()}>
      <Loader
        onLoad={() => setLoading(false)}
        scrollY={scrollY}
        scene={scene}
      />

      {!loading && (
        <div
          id="three"
          className="font-bold text-4xl lg:text-6xl relative w-full"
        >
          <section className="gsap-scene1">
            <h1>Hi, I'm Nestor</h1>
            <h2>I live in Amsterdam</h2>
            {/* <ScrollDots {scene}></ScrollDots> */}
          </section>

          <section className="gsap-scene2">
            <p>I love</p>
            <p>web development</p>
          </section>

          <section className="gsap-scene3">
            <p>I'm obsessed</p>
            <p>with canvas</p>
          </section>

          <section className="gsap-scene4">
            <p>I love</p>
            <p>videogames</p>
          </section>

          <section className="gsap-scene5">
            {/* <Scene5 enabled={scene == 5}></Scene5> */}
          </section>

          <section className="gsap-scene6">
            {/* <Socials {scene}></Socials> */}
          </section>
        </div>
      )}
    </div>
  );
}
