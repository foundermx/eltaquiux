import Image from "next/image";
import mascot from "@/public/brand/mascota.png";
import { MenuIcon, SpeedLines, Starburst } from "./icons";

// Animado solo con CSS: arranca con el primer pintado, sin esperar a que cargue el JS.
// Secuencia: el título rebota, la mascota entra corriendo, salen las rayitas y la mascota se queda trotando.
export function Hero() {
  return (
    <header className="relative mx-auto w-full max-w-md overflow-x-clip px-4 pt-3 md:max-w-xl lg:max-w-none lg:pt-6 short:pt-3">
      <div className="text-center">
        <p className="font-display text-4xl leading-none text-red uppercase">El Taquiux</p>
        <p className="text-sm leading-tight font-bold text-green uppercase italic">Taquitos con amor</p>
      </div>
      <button
        type="button"
        aria-label="Abrir menú"
        className="absolute top-2 right-2 grid size-11 place-items-center text-ink lg:hidden"
      >
        <MenuIcon className="size-7" />
      </button>

      <div className="relative mt-3 flex items-center pb-3">
        <h1 className="origin-bottom-left pl-7 font-display text-hero text-red uppercase text-shadow-sticker motion-safe:animate-pop tablet:text-7xl tablet:leading-[0.85]">
          <span className="block">Nuestro</span>
          <span className="relative ml-3 block">
            <SpeedLines className="absolute top-1/2 right-full mr-1.5 h-9 origin-right -translate-y-1/2 text-yellow motion-safe:animate-shoot motion-safe:[animation-delay:var(--motion-slow)]" />
            Menú
          </span>
        </h1>
        <Starburst className="absolute top-[30%] left-[55%] size-9 text-yellow motion-safe:animate-twinkle" />
        <span className="ml-auto w-[42%] max-w-40 motion-safe:animate-run-in motion-safe:[animation-delay:var(--motion-fast)] tablet:max-w-52 lg:max-w-36">
          <Image
            src={mascot}
            alt=""
            loading="eager"
            fetchPriority="high"
            sizes="160px"
            className="h-auto w-full origin-bottom motion-safe:animate-jog motion-safe:[animation-delay:calc(var(--motion-fast)+var(--motion-slow))]"
          />
        </span>
        <Starburst className="absolute top-0 right-0 size-6 text-yellow motion-safe:animate-twinkle motion-safe:[animation-delay:calc(var(--motion-twinkle)*-0.33)]" />
        <Starburst className="absolute top-[55%] -right-1 size-8 text-yellow motion-safe:animate-twinkle motion-safe:[animation-delay:calc(var(--motion-twinkle)*-0.66)]" />
      </div>
    </header>
  );
}
