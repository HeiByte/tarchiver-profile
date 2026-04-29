import Sidebar from "@/components/dashboard/Sidebar";
export default function DashboardLayout({ children }) {
  return (
    <div className="flex min-h-screen">
        {/* sidebar */}
       <Sidebar></Sidebar>

        {/* main */}
      <main className="flex-1 p-6 bg-gray-100">{children}</main>
    </div>
  );
}
