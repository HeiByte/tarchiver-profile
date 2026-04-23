import "./globals.css";
import Navbar from "@/components/layout/Navbar";

export const metadata = {
  title: "Company Profile",
  description: "Company Profile website team 3",
};


export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
         <Navbar></Navbar>
        {children}</body>
    </html>
  );
}
