"use client";

import { LazyMotion, MotionConfig } from "motion/react";
import type { ReactNode } from "react";

const loadFeatures = () => import("@/lib/motion-features").then((mod) => mod.default);

// reducedMotion="user": con "reducir movimiento" activado, Motion quita desplazamientos y deja solo fundidos.
// strict: falla si alguien usa `motion.*` en vez de `m.*` y se trae todo Motion en el bundle inicial.
export function MotionProvider({ children }: { children: ReactNode }) {
  return (
    <MotionConfig reducedMotion="user">
      <LazyMotion features={loadFeatures} strict>
        {children}
      </LazyMotion>
    </MotionConfig>
  );
}
