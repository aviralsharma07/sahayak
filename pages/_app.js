import "@/styles/globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { NextThemesProvider } from "next-themes";

export default function App({ Component, pageProps }) {
  // return <Component {...pageProps} />;
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
      <Component {...pageProps} />
    </ThemeProvider>
  );
}
