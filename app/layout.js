import { Newsreader, Space_Grotesk, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/lib/auth-context";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const newsreader = Newsreader({
  variable: "--font-newsreader",
  subsets: ["latin"],
  style: ["normal", "italic"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
});

const plexMono = IBM_Plex_Mono({
  variable: "--font-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata = {
  title: "Civic Bridge Africa",
  description:
    "Governance literacy, parliamentary updates, civic rights, and regional integration awareness for African youth.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${newsreader.variable} ${spaceGrotesk.variable} ${plexMono.variable} antialiased`}>
        <AuthProvider>
          <Navbar />
          <main className="min-h-[calc(100vh-64px)]">{children}</main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
