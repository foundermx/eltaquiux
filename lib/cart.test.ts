import assert from "node:assert/strict";
import { test } from "node:test";
import { cartCount, cartTotal, countByItem, makeLine, mergeLine } from "./cart.ts";
import type { Item, ItemOption } from "./menu.ts";

const extras: ItemOption = {
  id: "extras",
  name: "Extras",
  min: 0,
  max: 1,
  values: [{ id: "con-queso", name: "Con queso", price_delta_cents: 2000, is_default: false }],
};

const pambazo: Item = {
  id: "pambazo-pastor",
  name: "Pambazo de pastor",
  description: null,
  price_cents: 4500,
  image_path: null,
  is_available: true,
  options: [],
};

test("el precio suma lo que cuestan las opciones elegidas", () => {
  assert.equal(makeLine(pambazo, [extras], { extras: ["con-queso"] }, 1).unitCents, 6500);
  assert.equal(makeLine(pambazo, [extras], {}, 1).unitCents, 4500);
});

test("mismo platillo con mismas opciones se junta; con otras va en otra línea", () => {
  const conQueso = makeLine(pambazo, [extras], { extras: ["con-queso"] }, 1);
  const sinQueso = makeLine(pambazo, [extras], {}, 2);
  const lines = [conQueso, conQueso, sinQueso].reduce(mergeLine, []);

  assert.equal(lines.length, 2);
  assert.deepEqual(lines[0].choices, ["Con queso"]);
  assert.equal(cartCount(lines), 4);
  assert.equal(cartTotal(lines), 2 * 6500 + 2 * 4500);
  assert.deepEqual(countByItem(lines), { "pambazo-pastor": 4 });
});
