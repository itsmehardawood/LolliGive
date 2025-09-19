import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "LolliGive ",
  description: "LolliGive helps NGOs register, create dynamic donation pages, and connect with supporters through videos, logos, mission details, and a secure donate functionality.",
  // icons: {
  //   icon: "/favicon.ico", // replace with your favicon in public/
  // },
};


export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning={true}>
      <head >
        <link rel="icon" href="/images/lolligive.png" type="image/png" />
        {/* Or use: <link rel="icon" href="/favicon.ico" /> */}
      </head>
      <body 
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}

