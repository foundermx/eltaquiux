import * as m from "motion/react-m";
import type { CSSProperties } from "react";
import { mxn, type Item, type Section } from "@/lib/menu";
import { spring } from "@/lib/motion";
import { Starburst } from "./icons";

type Props = {
  section: Section;
  startIndex: number; // posición global del encabezado, para escalonar la entrada
  counts: Record<string, number>; // cuántos de cada platillo hay en el pedido
  selectedId: string | null; // platillo abierto en el detalle
  onSelect: (item: Item) => void;
};

// Los primeros elementos entran con CSS desde el primer pintado ([data-load]); 16 alcanzan para la
// primera pantalla de una PC. Lo que quede debajo de la pantalla lo revela useScrollReveal ([data-reveal]).
const LOAD_STAGGER = 16;
const entrance = (index: number) => ({
  "data-reveal": "",
  ...(index < LOAD_STAGGER && { "data-load": "", style: { "--i": index } as CSSProperties }),
});

export function MenuSection({ section, startIndex, counts, selectedId, onSelect }: Props) {
  const titleId = `${section.id}-titulo`;
  return (
    <section aria-labelledby={titleId} className="px-4 pt-7 lg:px-0 lg:pt-10">
      <div {...entrance(startIndex)}>
        <div className="flex items-center gap-3">
          <h2
            id={titleId}
            className="font-display text-3xl leading-none tracking-wide text-red uppercase text-shadow-hard lg:text-4xl"
          >
            {section.name}
          </h2>
          <Starburst
            className="size-8 shrink-0 text-yellow motion-safe:animate-twinkle"
            // mismo titileo que el hero; cada sección arranca en otra fase para que no parpadeen al unísono
            style={{ animationDelay: `${-startIndex * 137}ms` }}
          />
        </div>
        {section.subtitle && (
          <p className="mt-1.5 text-sm font-bold text-orange uppercase italic">{section.subtitle}</p>
        )}
      </div>

      {/* role="list": Safari quita la semántica de lista a las listas sin viñetas */}
      {/* En pantallas anchas, dos columnas como menú impreso: se lee de arriba abajo, columna por columna */}
      <ul role="list" className="mt-2 list-disc pl-5 marker:text-ink xl:columns-2 xl:gap-x-16">
        {section.items.map((item, i) => {
          const count = counts[item.id] ?? 0;
          // Sin viñeta si la ocupa el contador o si la fila está abierta en el detalle (no deja un "•" suelto)
          const bare = count > 0 || item.id === selectedId;
          return (
            <li
              key={item.id}
              className={`relative break-inside-avoid ${bare ? "list-none" : ""}`}
              {...entrance(startIndex + 1 + i)}
            >
              {count > 0 && (
                // El contador va fuera del botón: no se deforma cuando la fila viaja al detalle, y rebota al cambiar
                <m.span
                  key={count}
                  aria-hidden
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={spring.bouncy}
                  className="absolute top-2.5 -left-6 z-10 grid size-5 place-items-center rounded-full bg-yellow font-display text-sm leading-none text-ink"
                >
                  {count}
                </m.span>
              )}
              <m.button
                type="button"
                layoutId={`item-${item.id}`}
                aria-haspopup="dialog"
                onClick={() => onSelect(item)}
                whileTap={{ scale: 0.98 }}
                // Hover (solo con mouse): una tarjeta blanca detrás de la fila que aparece animando opacity
                className="relative isolate block min-h-11 w-full py-1.5 text-left before:absolute before:inset-y-0 before:-inset-x-3 before:-z-10 before:rounded-lg before:bg-white before:opacity-0 before:shadow-bar before:transition-opacity before:duration-(--motion-fast) hover:before:opacity-100"
              >
                <span className="flex items-baseline gap-3">
                  <span className="flex-1">
                    <m.span
                      layoutId={`name-${item.id}`}
                      className="inline-block text-lg leading-tight font-bold uppercase italic"
                    >
                      {item.name}
                    </m.span>
                  </span>
                  <m.span
                    layoutId={`price-${item.id}`}
                    className="inline-block text-lg leading-tight font-bold italic tabular-nums"
                  >
                    {mxn(item.price_cents)}
                  </m.span>
                </span>
                {item.description && (
                  <span className="mt-0.5 ml-1 block pl-4 -indent-4 text-sm font-medium text-ink-soft italic before:mr-2 before:content-['◦']">
                    {item.description}
                  </span>
                )}
                {count > 0 && <span className="sr-only">, {count} en tu pedido</span>}
              </m.button>
            </li>
          );
        })}
      </ul>

      {section.note && <p className="mt-1 text-sm font-bold text-orange uppercase italic">{section.note}</p>}
    </section>
  );
}
