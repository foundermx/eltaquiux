// Misma forma que tendrá la consulta a Supabase. Mientras tanto, el menú real del mockup.
export type OptionValue = {
  id: string;
  name: string;
  price_delta_cents: number;
  is_default: boolean;
};

export type ItemOption = {
  id: string;
  name: string;
  min: number; // 1 = obligatoria
  max: number; // 1 = elige una; más de 1 = varias
  values: OptionValue[];
};

export type Item = {
  id: string;
  name: string;
  description: string | null;
  price_cents: number;
  image_path: string | null;
  is_available: boolean;
  options: ItemOption[];
};

export type Section = {
  id: string;
  name: string;
  subtitle: string | null;
  note: string | null;
  options: ItemOption[]; // aplican a todos los platillos de la sección
  items: Item[];
};

export type Tab = { id: string; slug: string; name: string; sections: Section[] };

const whole = new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN", minimumFractionDigits: 0 });
const withCents = new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN" });

/** 7500 → "$75", 3750 → "$37.50" */
export const mxn = (cents: number) => (cents % 100 ? withCents : whole).format(cents / 100);

const item = (
  id: string,
  name: string,
  price: number,
  description: string | null = null,
  options: ItemOption[] = [],
): Item => ({ id, name, description, price_cents: price * 100, image_path: null, is_available: true, options });

const section = (
  id: string,
  name: string,
  items: Item[],
  extra: Partial<Pick<Section, "subtitle" | "note" | "options">> = {},
): Section => ({ id, name, subtitle: null, note: null, options: [], items, ...extra });

const tortilla: ItemOption = {
  id: "tortilla",
  name: "Tortilla",
  min: 1,
  max: 1,
  values: [
    { id: "harina", name: "Harina artesanal", price_delta_cents: 0, is_default: true },
    { id: "maiz", name: "Maíz", price_delta_cents: 0, is_default: false },
  ],
};

export const menu: Tab[] = [
  {
    id: "tacos",
    slug: "tacos",
    name: "Tacos",
    sections: [
      section("tacos-arabes", "Tacos árabes", [
        item("taco-arabe", "Taco árabe natural", 75),
        item("tacoman", "Tacoman", 75, "Campechano de carne árabe y pastor"),
        item("taco-arabe-queso", "Taco árabe con queso", 85),
        item("gringa-arabe", "Gringa árabe (doble pan)", 135, "Abundante queso derretido con carne"),
        item("percheron", "Percherón (doble pan)", 150, "Doble carne árabe y pastor, costra de queso y jocoque"),
      ]),
      section(
        "tacos-orientales",
        "Tacos orientales",
        [
          item("taco-oriental", "Taco oriental (1)", 20),
          item("orden-orientales", "Orden tacos orientales (5)", 90),
          item("costra-oriental", "Costra oriental", 30, "Costra de queso y carne"),
          item("taco-oriental-queso", "Taco oriental con queso", 30),
        ],
        { subtitle: "En tortilla de maíz hecha a mano" },
      ),
      section("tacos-al-pastor", "Tacos al pastor", [
        item("taco-pastor", "Taco (1)", 20),
        item("orden-pastor", "Orden tacos al pastor (5)", 90),
        item("costra-maiz-pastor", "Costra de maíz", 30, "Costra de queso y carne"),
        item("taco-pastor-queso", "Taco con queso", 30),
        item("quesadilla-harina", "Quesadilla harina con carne", 50),
        item("taco-harina-artesanal", "Taco de harina artesanal", 30),
        item("costra-harina-artesanal", "Costra de harina artesanal", 60, "Costra de queso y carne"),
        item("gringa-artesanal", "Gringa artesanal", 90, "2 tortillas artesanales con abundante queso y carne"),
      ]),
      section(
        "tacos-de-res",
        "Tacos de res",
        [
          item("cachetada-picana", "Cachetada de picaña", 70, null, [tortilla]),
          item("costra-picana", "Costra de picaña", 85, null, [tortilla]),
          item("cachetada-ribeye", "Cachetada de ribeye", 70, null, [tortilla]),
          item("costra-ribeye", "Costra de ribeye", 85, null, [tortilla]),
          item("taco-barbacoa-picana", "Taco de barbacoa de picaña", 70, null, [tortilla]),
          item("costra-barbacoa-picana", "Costra de barbacoa de picaña", 90, null, [tortilla]),
          item(
            "gringa-barbacoa",
            "Gringa árabe de barbacoa",
            150,
            "Pan árabe relleno de abundante queso y barbacoa de picaña",
          ),
        ],
        { subtitle: "En tortilla de harina artesanal", note: "Pídelos también en maíz" },
      ),
    ],
  },
  {
    id: "carne",
    slug: "carne",
    name: "Carne",
    sections: [
      section(
        "carne-por-kilo",
        "Carne por kilo",
        [
          item(
            "mata-hambre",
            "Mata hambre de medio kilo (500 grs)",
            380,
            "Carne árabe y pastor, con abundante queso y cebolla asada",
          ),
          item(
            "mata-hambre-prime",
            "Mata hambre prime (250 grs)",
            480,
            "Ribeye y picaña, con abundante queso y cebolla asada",
          ),
          item("barbacoa-medio-kilo", "Barbacoa de picaña medio kilo (1 lt)", 650),
          item("trompo-kilo", "Trompo por kilo", 400),
          item("trompo-medio-kilo", "Medio kilo de trompo", 250),
        ],
        { note: "Incluye salsas, limones, pan árabe (5), tortillas maíz (10)" },
      ),
    ],
  },
  {
    id: "rollos",
    slug: "rollos",
    name: "Rollos",
    sections: [
      section(
        "rollos-de-queso",
        "Rollos de queso",
        [
          item("rollo-pastor", "Rollo pastor", 90),
          item("rollo-arabe", "Rollo árabe", 90),
          item("rollo-barbacoa", "Rollo de barbacoa de picaña", 130),
          item("rollo-ribeye", "Rollo de ribeye", 140),
        ],
        {
          subtitle: "Costra de queso enrollada rellena de la carne de tu elección",
          note: "Acompañado de tortillas de maíz",
        },
      ),
    ],
  },
  {
    id: "pambazos",
    slug: "pambazos",
    name: "Pambazos",
    sections: [
      section(
        "pambazos-todos",
        "Pambazos",
        [
          item("pambazo-pastor", "Pambazo de pastor", 45),
          item("pambazo-arabe", "Pambazo árabe", 45),
          item("pambazo-barbacoa", "Pambazo de barbacoa de picaña", 60),
          item("pambazo-picana", "Pambazo de picaña", 60),
        ],
        {
          subtitle: "Con queso + $20",
          options: [
            {
              id: "extras",
              name: "Extras",
              min: 0,
              max: 1,
              values: [{ id: "con-queso", name: "Con queso", price_delta_cents: 2000, is_default: false }],
            },
          ],
        },
      ),
    ],
  },
  {
    id: "postres",
    slug: "postres",
    name: "Postres",
    sections: [
      section("postres-todos", "Postres", [
        item("pastelito", "Pingüinos, Chocorroles o Gansito", 40, null, [
          {
            id: "elige",
            name: "Elige",
            min: 1,
            max: 1,
            values: [
              { id: "pinguinos", name: "Pingüinos", price_delta_cents: 0, is_default: false },
              { id: "chocorroles", name: "Chocorroles", price_delta_cents: 0, is_default: false },
              { id: "gansito", name: "Gansito", price_delta_cents: 0, is_default: false },
            ],
          },
        ]),
        item("quesadilla-gloria", "Quesadilla de gloria bañada con cajeta", 40),
      ]),
    ],
  },
];
