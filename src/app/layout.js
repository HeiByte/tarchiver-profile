import "./globals.css";
import { Inter } from "next/font/google";

const inter = Inter({
  subsets: ["latin"]
})
export const metadata = {
  title: "Tarchiver-Lite",
  description: "Company Profile website team 3",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={inter.className}>
      <body>{children}</body>
    </html>
  );
}
