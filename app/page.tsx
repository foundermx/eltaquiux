import { ActionBar } from "@/components/action-bar";
import { CategoryTabs } from "@/components/category-tabs";
import { Hero } from "@/components/hero";
import { Menu } from "@/components/menu";
import { menu } from "@/lib/menu";

export default function MenuPage() {
  return (
    <div className="mx-auto lg:grid lg:max-w-7xl lg:grid-cols-[24rem_1fr]">
      {/* Celular: `contents` = como si este div no existiera (tabs pegados arriba, acciones fijas abajo).
          PC: barra lateral fija con la marca, las categorías y los botones de pedido. */}
      <div className="contents lg:sticky lg:top-0 lg:flex lg:h-dvh lg:flex-col lg:overflow-y-auto lg:border-x lg:border-line lg:bg-paper lg:pb-5">
        <Hero />
        <CategoryTabs tabs={menu} />
        <ActionBar />
      </div>
      <Menu tabs={menu} />
    </div>
  );
}
