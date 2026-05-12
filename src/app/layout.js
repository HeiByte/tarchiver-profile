import "./globals.css";

export const metadata = {
  title: "Tarchiver-Lite",
  description: "Company Profile website team 3",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
