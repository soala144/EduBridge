import { AppSidebar } from "@/components/AppSidebar";
import { Header } from "@/components/Header";
import { SidebarInset } from "@/components/ui/sidebar";

export default function AlertsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <AppSidebar />
      <SidebarInset>
        <Header />
        <main className="flex-1 p-6">{children}</main>
      </SidebarInset>
    </>
  );
}
