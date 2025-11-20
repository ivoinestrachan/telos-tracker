import type { Metadata } from "next";
import { Geist, Geist_Mono, Bebas_Neue, Inter } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const bebasNeue = Bebas_Neue({
  weight: "400",
  variable: "--font-bebas-neue",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const cocogoose = localFont({
  src: "../../public/fonts/Cocogoose.ttf",
  variable: "--font-cocogoose",
});

const nevantaBold = localFont({
  src: "../../public/fonts/Nevanta-Bold.otf",
  variable: "--font-nevanta-bold",
});

const hemingVariable = localFont({
  src: "../../public/fonts/Heming Variable.ttf",
  variable: "--font-heming-variable",
});

export const metadata: Metadata = {
  title: "Answer the Call",
  description: "Welcome to the Telos House switchboard. Begin your journey and make the right choices.",
  metadataBase: new URL('https://slush.teloshouse.com'),
  openGraph: {
    title: "Answer the Call",
    description: "Welcome to the Telos House switchboard. Begin your journey and make the right choices.",
    images: [
      {
        url: '/public/images/phone-removebg-preview.png',
        width: 800,
        height: 800,
        alt: 'Telos House Phone',
      }
    ],
    type: 'website',
    siteName: 'Telos House',
  },
  twitter: {
    card: 'summary_large_image',
    title: "Answer the Call",
    description: "Welcome to the Telos House switchboard. Begin your journey and make the right choices.",
    images: ['/public/images/phone-removebg-preview.png'],
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${cocogoose.variable} ${nevantaBold.variable} ${bebasNeue.variable} ${inter.variable} ${hemingVariable.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
