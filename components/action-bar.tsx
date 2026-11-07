"use client";

import { AnimatePresence } from "motion/react";
import * as m from "motion/react-m";
import { cartCount, cartTotal, useCart } from "@/lib/cart";
import { mxn } from "@/lib/menu";
import { spring } from "@/lib/motion";
import { Bell, Receipt, SpeedLines, Star, WhatsApp, Wifi } from "./icons";

const actions: { label: string; Icon: typeof Star; iconColor: string; href?: string }[] = [
  { label: "Reseña", Icon: Star, iconColor: "text-yellow", href: "https://share.google/BQcesq33JuR1KJ8G1" },
  { label: "Pedir mesero", Icon: Bell, iconColor: "text-red" },
  { label: "Pedir cuenta", Icon: Receipt, iconColor: "text-red" },
  { label: "WiFi", Icon: Wifi, iconColor: "text-red" },
];

// Cada estado del botón entra desde abajo y sale hacia arriba
const swap = {
  initial: { y: 28, opacity: 0 },
  animate: { y: 0, opacity: 1 },
  exit: { y: -28, opacity: 0 },
  transition: spring.snappy,
};

export function ActionBar() {
  const lines = useCart();
  const count = cartCount(lines);
  const total = mxn(cartTotal(lines));

  return (
    // Celular: fija abajo sobre un degradado. PC: al pie de la barra lateral.
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-30 bg-linear-to-t from-paper from-60% to-transparent pt-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] lg:pointer-events-auto lg:static lg:mt-auto lg:bg-none lg:pt-6 lg:pb-0 short:pt-3">
      <div className="pointer-events-auto mx-auto max-w-md px-4 md:max-w-xl lg:max-w-none lg:px-5">
        <button
          type="button"
          aria-label={count ? `Ver pedido: ${count} ${count === 1 ? "platillo" : "platillos"}, ${total}` : undefined}
          className="relative h-14 w-full overflow-hidden rounded-btn bg-red font-display text-2xl text-white uppercase shadow-sticker transition-transform duration-(--motion-fast) hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 active:shadow-sticker-pressed"
        >
          <AnimatePresence initial={false}>
            {count === 0 ? (
              <m.span key="pedir" {...swap} className="absolute inset-0 flex items-center justify-center gap-2">
                {/* En celulares de 320px las rayitas se enciman con el texto: ahí se quitan */}
                <SpeedLines className="absolute left-4 h-8 text-yellow max-[22.5rem]:hidden" />
                <WhatsApp className="size-7" />
                Pedir por WhatsApp
                <SpeedLines className="absolute right-4 h-8 -scale-x-100 text-yellow max-[22.5rem]:hidden" />
              </m.span>
            ) : (
              <m.span key="ver" {...swap} className="absolute inset-0 flex items-center gap-3 px-4">
                <m.span
                  key={count}
                  initial={{ scale: 1.7 }}
                  animate={{ scale: 1 }}
                  transition={spring.bouncy}
                  className="grid size-9 place-items-center rounded-full bg-yellow text-ink"
                >
                  {count}
                </m.span>
                <span className="flex-1 text-left">Ver pedido</span>
                <span className="tabular-nums">{total}</span>
              </m.span>
            )}
          </AnimatePresence>
        </button>

        {/* En pantallas muy bajitas (celular acostado) se oculta para no tapar medio menú */}
        <nav
          aria-label="Servicio en la mesa"
          className="mt-2.5 grid grid-cols-4 divide-x divide-line rounded-card bg-white py-1.5 shadow-bar [@media(max-height:30rem)]:hidden"
        >
          {actions.map(({ label, Icon, iconColor, href }) => {
            const className =
              "group flex min-h-12 flex-col items-center justify-center gap-1 font-display text-sm leading-none text-red uppercase";
            const content = (
              <>
                <Icon
                  className={`size-7 transition-transform duration-(--motion-fast) group-hover:scale-115 ${iconColor}`}
                />
                {label}
              </>
            );
            return href ? (
              <a key={label} href={href} target="_blank" rel="noopener noreferrer" className={className}>
                {content}
              </a>
            ) : (
              <button key={label} type="button" className={className}>
                {content}
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
