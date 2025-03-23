import "./globals.css";

// Navigationbar
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";

// Finacial Dashboard
import { Dashboard } from "../components/components-dashboard/Dashboard";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <SidebarProvider>
          <AppSidebar />
          <main className="w-full m-5">
            <SidebarTrigger />
            {/* Använd Dashboard-komponenten som innehåller alla andra komponenter */}
            <Dashboard />
            {children}
          </main>
        </SidebarProvider>
      </body>
    </html>
  );
}
