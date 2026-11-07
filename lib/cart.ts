import { useSyncExternalStore } from "react";
import type { Item, ItemOption } from "./menu";

export type CartLine = {
  key: string; // platillo + opciones elegidas: lo idéntico se junta en una línea
  itemId: string;
  name: string;
  choices: string[]; // p. ej. ["Maíz"], ["Con queso"]
  unitCents: number;
  qty: number;
};

/** optionId → ids de los valores elegidos */
export type Picked = Record<string, string[]>;

const chosenValues = (options: ItemOption[], picked: Picked) =>
  options.flatMap((option) => option.values.filter((value) => picked[option.id]?.includes(value.id)));

export const unitPrice = (item: Item, options: ItemOption[], picked: Picked) =>
  chosenValues(options, picked).reduce((sum, value) => sum + value.price_delta_cents, item.price_cents);

export function makeLine(item: Item, options: ItemOption[], picked: Picked, qty: number): CartLine {
  const chosen = chosenValues(options, picked);
  return {
    key: [item.id, ...chosen.map((value) => value.id).sort()].join("|"),
    itemId: item.id,
    name: item.name,
    choices: chosen.map((value) => value.name),
    unitCents: unitPrice(item, options, picked),
    qty,
  };
}

export const mergeLine = (lines: CartLine[], line: CartLine) =>
  lines.some((l) => l.key === line.key)
    ? lines.map((l) => (l.key === line.key ? { ...l, qty: l.qty + line.qty } : l))
    : [...lines, line];

export const cartTotal = (lines: CartLine[]) => lines.reduce((sum, l) => sum + l.unitCents * l.qty, 0);
export const cartCount = (lines: CartLine[]) => lines.reduce((sum, l) => sum + l.qty, 0);

export function countByItem(lines: CartLine[]) {
  const counts: Record<string, number> = {};
  for (const l of lines) counts[l.itemId] = (counts[l.itemId] ?? 0) + l.qty;
  return counts;
}

// Store del carrito: vive en el navegador (localStorage), sin librería.
const STORAGE_KEY = "taquiux:carrito";
const EMPTY: CartLine[] = [];
let lines = EMPTY;
let loaded = false;
const listeners = new Set<() => void>();

const isLine = (x: unknown): x is CartLine => {
  const l = x as CartLine;
  return (
    typeof l?.key === "string" &&
    typeof l.itemId === "string" &&
    typeof l.name === "string" &&
    Array.isArray(l.choices) &&
    l.choices.every((c) => typeof c === "string") &&
    Number.isInteger(l.unitCents) &&
    l.unitCents >= 0 &&
    Number.isInteger(l.qty) &&
    l.qty > 0
  );
};

function load() {
  if (loaded || typeof window === "undefined") return;
  loaded = true;
  try {
    const saved: unknown = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]");
    if (Array.isArray(saved)) lines = saved.filter(isLine); // lo guardado lo pudo editar cualquiera: se valida
  } catch {
    // modo privado o datos corruptos: carrito vacío
  }
}

function save(next: CartLine[]) {
  lines = next;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    // sin almacenamiento: el carrito dura mientras la página esté abierta
  }
  listeners.forEach((listener) => listener());
}

export const addToCart = (line: CartLine) => save(mergeLine(lines, line));

const subscribe = (listener: () => void) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};

const getSnapshot = () => {
  load();
  return lines;
};

/** En el servidor (y al hidratar) el carrito está vacío; luego se lee de localStorage. */
export const useCart = () => useSyncExternalStore(subscribe, getSnapshot, () => EMPTY);
