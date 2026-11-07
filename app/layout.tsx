import type { Metadata, Viewport } from "next";
import { Bangers, Barlow_Semi_Condensed } from "next/font/google";
import { MotionProvider } from "@/components/motion-provider";
import { motionCssVars } from "@/lib/motion";
import "./globals.css";

const bangers = Bangers({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-bangers",
});

// Solo itálica, como el mockup: 2 archivos precargados en vez de 4
const barlow = Barlow_Semi_Condensed({
  weight: ["500", "700"],
  style: "italic",
  subsets: ["latin"],
  variable: "--font-barlow",
});

export const metadata: Metadata = {
  title: "Menú | El Taquiux",
  description: "Tacos árabes, orientales, al pastor y de res. Taquitos con amor.",
};

export const viewport: Viewport = {
  themeColor: "#fdfdfd", // --color-paper
  colorScheme: "only light", // el menú no tiene modo oscuro: que Chrome no lo oscurezca a la fuerza
  viewportFit: "cover", // habilita env(safe-area-inset-bottom) para la barra fija
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="es-MX"
      data-scroll-behavior="smooth"
      className={`${bangers.variable} ${barlow.variable} motion-safe:scroll-smooth`}
      style={motionCssVars}
    >
      <body>
        <MotionProvider>{children}</MotionProvider>
      </body>
    </html>
  );
}
