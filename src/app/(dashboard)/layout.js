import Sidebar from "@/components/dashboard/Sidebar";
export default function DashboardLayout({ children }) {
  return (
    <div className="flex min-h-screen">
        {/* sidebar */}
       <Sidebar></Sidebar>

        {/* main */}
      <main className="flex-1 bg-white">{children}</main>
    </div>
  );
}
