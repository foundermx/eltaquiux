"use client";

import * as m from "motion/react-m";
import { useEffect, useRef, useState } from "react";
import type { Tab } from "@/lib/menu";
import { spring } from "@/lib/motion";
import { BrushLine } from "./icons";

const STICKY_OFFSET = 64; // alto de la barra de tabs + un margen

export function CategoryTabs({ tabs }: { tabs: Tab[] }) {
  const [active, setActive] = useState(tabs[0].slug);
  const listRef = useRef<HTMLUListElement>(null);
  // Tras tocar un tab, ese queda activo aunque la página no alcance a subirlo hasta arriba (las últimas
  // categorías, sobre todo en PC). El scroll-spy vuelve en cuanto el usuario desplaza por su cuenta.
  const pinned = useRef(false);

  // Scroll-spy: activa la última sección que ya pasó por debajo de la barra (una lectura por frame)
  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const atBottom = innerHeight + scrollY >= document.documentElement.scrollHeight - 2;
      let current = tabs[0].slug;
      for (const { slug } of tabs) {
        const top = document.getElementById(slug)?.getBoundingClientRect().top ?? Infinity;
        if (top <= STICKY_OFFSET) current = slug;
      }
      setActive(atBottom ? tabs[tabs.length - 1].slug : current);
    };
    const onScroll = () => {
      if (!pinned.current) frame ||= requestAnimationFrame(update);
    };
    const unpin = () => {
      pinned.current = false;
    };
    const userInput = ["wheel", "touchstart", "keydown"] as const;
    addEventListener("scroll", onScroll, { passive: true });
    for (const type of userInput) addEventListener(type, unpin, { passive: true });
    return () => {
      removeEventListener("scroll", onScroll);
      for (const type of userInput) removeEventListener(type, unpin);
      cancelAnimationFrame(frame);
    };
  }, [tabs]);

  // En pantallas angostas la fila de tabs se desliza para dejar la activa a la vista
  useEffect(() => {
    const list = listRef.current;
    const tab = list?.querySelector<HTMLElement>(`[href="#${active}"]`);
    if (list && tab) list.scrollTo({ left: tab.offsetLeft - (list.clientWidth - tab.offsetWidth) / 2 });
  }, [active]);

  return (
    <nav
      aria-label="Categorías del menú"
      className="sticky top-0 z-20 border-b border-line bg-paper lg:static lg:mt-2 lg:border-0 lg:bg-transparent"
    >
      {/* Celular: fila horizontal pegada arriba. PC: lista vertical en la barra lateral. */}
      <ul
        ref={listRef}
        className="mx-auto flex max-w-md justify-between gap-4 overflow-x-auto px-4 [scrollbar-width:none] motion-safe:scroll-smooth md:max-w-xl lg:max-w-none lg:flex-col lg:gap-0 lg:overflow-visible lg:px-6"
      >
        {tabs.map((tab) => {
          const isActive = tab.slug === active;
          return (
            <li key={tab.id} className="shrink-0">
              <a
                href={`#${tab.slug}`}
                aria-current={isActive ? "true" : undefined}
                onClick={(event) => {
                  // Sin cambiar la URL: así el botón "atrás" sale del menú en vez de saltar entre secciones
                  event.preventDefault();
                  pinned.current = true;
                  setActive(tab.slug);
                  document.getElementById(tab.slug)?.scrollIntoView();
                }}
                className={`relative block py-3 font-display text-xl leading-none uppercase hover:text-red lg:inline-block lg:py-2 lg:text-3xl short:py-1 short:text-2xl ${isActive ? "text-red" : "text-ink"}`}
              >
                {tab.name}
                {isActive && (
                  <m.span
                    layoutId="tab-indicator"
                    transition={spring.snappy}
                    className="absolute inset-x-0 bottom-1 h-2"
                  >
                    <BrushLine className="size-full text-red" />
                  </m.span>
                )}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
