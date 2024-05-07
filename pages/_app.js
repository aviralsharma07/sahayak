import "@/styles/globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/toaster";

export default function App({ Component, pageProps }) {
  // return <Component {...pageProps} />;
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
      <Component {...pageProps} />
      <Toaster />
    </ThemeProvider>
  );
}
