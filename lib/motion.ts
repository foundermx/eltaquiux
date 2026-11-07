import type { CSSProperties } from "react";
import type { Transition } from "motion/react";

// Única fuente de tiempos, curvas y resortes. Las transiciones duran entre 150 y 400 ms.

/** Segundos. */
export const duration = { fast: 0.15, base: 0.25, slow: 0.4 } as const;

/** cubic-bezier: `out` frena al llegar; `pop` se pasa un poco y regresa. */
export const ease = {
  out: [0.22, 1, 0.36, 1],
  pop: [0.34, 1.56, 0.64, 1],
} as const;

export const spring = {
  /** tabs, chips, botones */
  snappy: { type: "spring", visualDuration: 0.25, bounce: 0.15 },
  /** platillo ↔ detalle */
  sheet: { type: "spring", visualDuration: 0.35, bounce: 0.1 },
  /** contadores que rebotan */
  bouncy: { type: "spring", visualDuration: 0.3, bounce: 0.55 },
} satisfies Record<string, Transition>;

/** Retraso entre elementos de una misma entrada escalonada (segundos). */
export const stagger = 0.04;

/** Loops decorativos del hero (segundos): son ambiente, no transiciones, por eso más largos. */
export const loop = { jog: 0.9, twinkle: 1.8 } as const;

export const cssEase = (curve: readonly number[]) => `cubic-bezier(${curve.join(", ")})`;

/** Las mismas constantes como variables CSS, para lo que se anima en CSS (hero, entrada inicial). */
export const motionCssVars = {
  "--motion-fast": `${duration.fast * 1000}ms`,
  "--motion-base": `${duration.base * 1000}ms`,
  "--motion-slow": `${duration.slow * 1000}ms`,
  "--motion-stagger": `${stagger * 1000}ms`,
  "--motion-ease-out": cssEase(ease.out),
  "--motion-ease-pop": cssEase(ease.pop),
  "--motion-jog": `${loop.jog}s`,
  "--motion-twinkle": `${loop.twinkle}s`,
} as CSSProperties;
