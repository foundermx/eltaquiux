"use client";

import { useEffect, useRef, useState, type RefObject } from "react";
import { countByItem, useCart } from "@/lib/cart";
import type { Item, Section, Tab } from "@/lib/menu";
import { cssEase, duration, ease, stagger } from "@/lib/motion";
import { ItemDialog } from "./item-dialog";
import { MenuSection } from "./menu-section";

export type Selection = { item: Item; section: Section };

export function Menu({ tabs }: { tabs: Tab[] }) {
  const [selection, setSelection] = useState<Selection | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const mainRef = useRef<HTMLElement>(null);
  const counts = countByItem(useCart());
  useScrollReveal(mainRef);

  const open = (next: Selection) => {
    dialogRef.current?.showModal(); // antes de renderizar: el detalle se mide ya dentro del <dialog> abierto
    setSelection(next);
  };

  const starts = startIndexes(tabs);
  return (
    <>
      {/* lg:mx-0: con márgenes automáticos un elemento del grid no se estira, se encoge a su contenido */}
      <main ref={mainRef} className="mx-auto max-w-md pb-40 md:max-w-xl lg:mx-0 lg:max-w-none lg:px-10 lg:pt-4 lg:pb-16">
        {tabs.map((tab) => (
          <div key={tab.id} id={tab.slug} className="scroll-mt-12 lg:scroll-mt-4">
            {tab.sections.map((section) => (
              <MenuSection
                key={section.id}
                section={section}
                startIndex={starts[section.id]}
                counts={counts}
                selectedId={selection?.item.id ?? null}
                onSelect={(item) => open({ item, section })}
              />
            ))}
          </div>
        ))}
      </main>
      <ItemDialog dialogRef={dialogRef} selection={selection} onClose={() => setSelection(null)} />
    </>
  );
}

/** Posición global del encabezado de cada sección (encabezado y platillos van en orden), para escalonar la entrada. */
function startIndexes(tabs: Tab[]) {
  const starts: Record<string, number> = {};
  let index = 0;
  for (const section of tabs.flatMap((tab) => tab.sections)) {
    starts[section.id] = index;
    index += section.items.length + 1;
  }
  return starts;
}

/**
 * Lo que está debajo de la pantalla al cargar se oculta y aparece escalonado al entrar.
 * Corre después de hidratar y solo oculta lo que no se ve: si el JS tarda o falla, el menú ya está visible.
 */
function useScrollReveal(rootRef: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const root = rootRef.current;
    if (!root || matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const below = [...root.querySelectorAll<HTMLElement>("[data-reveal]")].filter(
      (el) => el.getBoundingClientRect().top > innerHeight,
    );
    for (const el of below) el.style.opacity = "0";

    const observer = new IntersectionObserver(
      (entries) => {
        entries
          .filter((entry) => entry.isIntersecting)
          .forEach((entry, i) => {
            const el = entry.target as HTMLElement;
            observer.unobserve(el);
            el.style.opacity = "";
            el.animate(
              [
                { opacity: 0, transform: "translateY(16px)" },
                { opacity: 1, transform: "none" },
              ],
              {
                duration: duration.base * 1000,
                delay: i * stagger * 1000,
                easing: cssEase(ease.out),
                fill: "backwards",
              },
            );
          });
      },
      { rootMargin: "0px 0px -140px 0px" }, // aparecen al salir de detrás de la barra fija
    );
    for (const el of below) observer.observe(el);
    return () => observer.disconnect();
  }, [rootRef]);
}
