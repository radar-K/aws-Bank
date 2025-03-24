import React from "react";
import { Dashboard } from "app/dashboard/components-dashboard/Dashboard";
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";

const Page = () => {
  return (
    <div>
      <Dashboard />
    </div>
  );
};

export default Page;
