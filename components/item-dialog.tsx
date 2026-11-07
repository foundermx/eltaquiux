"use client";

import { AnimatePresence } from "motion/react";
import * as m from "motion/react-m";
import { useState, type RefObject } from "react";
import { addToCart, makeLine, unitPrice, type Picked } from "@/lib/cart";
import { mxn, type ItemOption } from "@/lib/menu";
import { duration, spring } from "@/lib/motion";
import { Close, Minus, Plus } from "./icons";
import type { Selection } from "./menu";

type Props = {
  dialogRef: RefObject<HTMLDialogElement | null>;
  selection: Selection | null;
  onClose: () => void;
};

const MAX_QTY = 20;

// <dialog> nativo: atrapa el foco, inerta el resto de la página y responde a Esc y al "atrás" de Android.
export function ItemDialog({ dialogRef, selection, onClose }: Props) {
  return (
    <dialog
      ref={dialogRef}
      aria-labelledby="detalle-titulo"
      onCancel={(event) => {
        event.preventDefault(); // primero la animación de salida; el <dialog> se cierra al terminar
        onClose();
      }}
      onClose={onClose} // si el navegador lo cierra por su cuenta, el estado se pone al día
      className="m-0 h-dvh max-h-none w-full max-w-none overflow-hidden bg-transparent p-0 text-ink backdrop:bg-transparent"
    >
      <AnimatePresence onExitComplete={() => dialogRef.current?.close()}>
        {selection && <Sheet key={selection.item.id} selection={selection} onClose={onClose} />}
      </AnimatePresence>
    </dialog>
  );
}

function Sheet({ selection: { item, section }, onClose }: { selection: Selection; onClose: () => void }) {
  const options = [...section.options, ...item.options];
  const [picked, setPicked] = useState<Picked>(() =>
    Object.fromEntries(options.map((o) => [o.id, o.values.filter((v) => v.is_default).map((v) => v.id)])),
  );
  const [qty, setQty] = useState(1);
  const [missing, setMissing] = useState<string | null>(null);
  // PC (lg): modal centrado con las 4 esquinas redondas. Celular: hoja desde abajo.
  const [centered] = useState(() => matchMedia("(min-width: 64rem)").matches);
  const total = unitPrice(item, options, picked) * qty;

  const pick = (option: ItemOption, valueId: string, checked: boolean) => {
    setMissing(null);
    setPicked((prev) => {
      const current = prev[option.id] ?? [];
      const next = !checked
        ? current.filter((id) => id !== valueId)
        : option.max === 1
          ? [valueId]
          : [...current, valueId].slice(-option.max);
      return { ...prev, [option.id]: next };
    });
  };

  const add = () => {
    const lacking = options.find((o) => (picked[o.id]?.length ?? 0) < o.min);
    if (lacking) {
      setMissing(lacking.id);
      nudge(document.getElementById(`opcion-${lacking.id}`));
      return;
    }
    addToCart(makeLine(item, options, picked, qty));
    onClose();
  };

  return (
    <>
      <m.div
        aria-hidden
        onClick={onClose}
        className="fixed inset-0 bg-ink/50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: duration.base }}
      />
      <m.section
        layoutId={`item-${item.id}`}
        transition={spring.sheet}
        // radio en style (= --radius-card) para que Motion lo corrija mientras la hoja escala
        style={centered ? { borderRadius: 20 } : { borderTopLeftRadius: 20, borderTopRightRadius: 20 }}
        className="fixed inset-x-0 bottom-0 mx-auto flex max-h-[88dvh] max-w-md flex-col overflow-hidden bg-white shadow-bar md:max-w-lg lg:inset-0 lg:m-auto lg:h-fit lg:max-h-[85dvh]"
      >
        {/* layout: el contenido no se deforma mientras la hoja crece desde la fila.
            exit: al cerrar se desvanece rápido y solo regresa la tarjeta (sin texto fantasma sobre otras filas) */}
        <m.div layout exit={{ opacity: 0, transition: { duration: duration.fast } }} className="flex min-h-0 flex-col">
          <div className="min-h-0 overflow-y-auto overscroll-contain px-5 pt-4 pb-5">
            <div className="flex items-start gap-2">
              <h2 id="detalle-titulo" className="flex-1 pt-1">
                <m.span
                  layoutId={`name-${item.id}`}
                  transition={spring.sheet}
                  className="inline-block text-2xl leading-tight font-bold uppercase italic"
                >
                  {item.name}
                </m.span>
              </h2>
              <button
                type="button"
                autoFocus
                aria-label="Cerrar"
                onClick={onClose}
                className="-mr-2 grid size-11 shrink-0 place-items-center rounded-full"
              >
                <Close className="size-6" />
              </button>
            </div>
            <m.span
              layoutId={`price-${item.id}`}
              transition={spring.sheet}
              className="mt-1 inline-block text-2xl font-bold italic tabular-nums"
            >
              {mxn(item.price_cents)}
            </m.span>
            {item.description && <p className="mt-2 font-medium text-ink-soft italic">{item.description}</p>}

            {options.map((option) => (
              <fieldset key={option.id} id={`opcion-${option.id}`} className="mt-5">
                <legend className="flex items-baseline gap-2">
                  <span className="font-display text-xl text-red uppercase">{option.name}</span>
                  {option.min > 0 && <span className="text-xs font-bold text-ink-soft uppercase italic">Obligatorio</span>}
                </legend>
                <div className="mt-2 flex flex-wrap gap-2">
                  {option.values.map((value) => (
                    <m.label
                      key={value.id}
                      whileTap={{ scale: 0.94 }}
                      transition={spring.snappy}
                      className="flex min-h-11 items-center gap-1.5 rounded-full border-2 border-ink px-4 font-bold uppercase italic hover:border-red has-checked:border-red has-checked:bg-red has-checked:text-white has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-ink"
                    >
                      <input
                        type={option.min === 1 && option.max === 1 ? "radio" : "checkbox"}
                        name={option.id}
                        className="sr-only"
                        checked={picked[option.id]?.includes(value.id) ?? false}
                        onChange={(event) => pick(option, value.id, event.target.checked)}
                      />
                      {value.name}
                      {value.price_delta_cents > 0 && (
                        <span className="font-medium">+{mxn(value.price_delta_cents)}</span>
                      )}
                    </m.label>
                  ))}
                </div>
                {missing === option.id && (
                  <p role="alert" className="mt-2 text-sm font-bold text-red italic">
                    Elige una opción para continuar
                  </p>
                )}
              </fieldset>
            ))}
          </div>

          <div className="flex items-center gap-3 border-t border-line px-5 pt-3 pb-[max(1rem,env(safe-area-inset-bottom))]">
            <div role="group" aria-label="Cantidad" className="flex items-center gap-1">
              <button
                type="button"
                aria-label="Uno menos"
                disabled={qty === 1}
                onClick={() => setQty((q) => q - 1)}
                className="grid size-11 place-items-center rounded-full border-2 border-ink disabled:opacity-30"
              >
                <Minus className="size-5" />
              </button>
              <span aria-live="polite" className="w-8 text-center font-display text-3xl leading-none">
                <m.span
                  key={qty}
                  className="inline-block"
                  initial={{ scale: 1.5 }}
                  animate={{ scale: 1 }}
                  transition={spring.bouncy}
                >
                  {qty}
                </m.span>
              </span>
              <button
                type="button"
                aria-label="Uno más"
                disabled={qty === MAX_QTY}
                onClick={() => setQty((q) => q + 1)}
                className="grid size-11 place-items-center rounded-full border-2 border-ink disabled:opacity-30"
              >
                <Plus className="size-5" />
              </button>
            </div>
            <m.button
              type="button"
              onClick={add}
              whileTap={{ scale: 0.95 }}
              transition={spring.snappy}
              className="flex h-14 flex-1 items-center justify-center gap-2 rounded-btn bg-red font-display text-2xl text-white uppercase shadow-sticker"
            >
              Agregar <span className="tabular-nums">{mxn(total)}</span>
            </m.button>
          </div>
        </m.div>
      </m.section>
    </>
  );
}

/** Sacude el grupo al que le falta elegir algo (sin sacudida si el usuario pidió menos movimiento). */
function nudge(el: HTMLElement | null) {
  if (!el) return;
  el.scrollIntoView({ block: "nearest" });
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  el.animate(
    [
      { transform: "none" },
      { transform: "translateX(-8px)" },
      { transform: "translateX(8px)" },
      { transform: "translateX(-4px)" },
      { transform: "none" },
    ],
    { duration: duration.slow * 1000 },
  );
}
