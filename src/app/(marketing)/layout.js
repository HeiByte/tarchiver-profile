import Navbar from "@/components/layout/Navbar";

export default function MarketingLayout({ children }) {
  return (
    <>
      <Navbar />
      {children}
    </>
  );
}
