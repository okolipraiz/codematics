import { ThemeProvider } from "@/context/ThemeProvider";
import { Toaster } from "@/components/ui/sonner";
import "@/styles/globals.css";
import { ReactElement, ReactNode } from "react";
import type { NextPage } from "next";
import NextNProgress from "nextjs-progressbar";
import type { AppProps } from "next/app";
import { Poppins } from "next/font/google";
import { StoreProvider } from "@/providers/StoreProvider";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});


export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppPropsWithLayout) {
  const getLayout = Component.getLayout ?? ((page) => page);
  return (
    <StoreProvider>
      {/* Declared on :root rather than on a wrapper element so that Radix
          dialogs and dropdowns, which portal into <body>, inherit the font
          too. next/font is not allowed in _document, so this is the way to
          reach <html> from here. */}
      <style jsx global>{`
        :root {
          --font-poppins: ${poppins.style.fontFamily};
        }
      `}</style>
      <ThemeProvider
        attribute="class"
        defaultTheme="dark"
        enableSystem
        disableTransitionOnChange
      >
        <NextNProgress />
        <Toaster />
        {getLayout(<Component {...pageProps} />)}
      </ThemeProvider>
    </StoreProvider>
  );
}
