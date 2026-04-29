import NavDash from "@/components/dashboard/NavDash";
import Header from "@/components/dashboard/Header";
import MainContent from "@/components/dashboard/MainContent";

export default function Dashboard() {
  return (
    <div className="flex flex-col bg-white">
      <NavDash />
      <Header />
      <MainContent />
    </div>
  );
}
