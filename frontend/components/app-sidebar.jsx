"use client";

import * as React from "react";
import { Frame, PieChart, Settings2 } from "lucide-react";

import { LuMessageSquare } from "react-icons/lu";
import { TbPigMoney } from "react-icons/tb";
import { BsBank } from "react-icons/bs";
import { IoStatsChartSharp } from "react-icons/io5";
import { FaUserAlt } from "react-icons/fa";

import { NavMain } from "@/components/nav-main";
import { NavProjects } from "@/components/nav-projects";
import { NavUser } from "@/components/nav-user";
import { TeamSwitcher } from "@/components/team-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";

const data = {
  user: {
    name: "Bank Kund",
    email: "Kundmail@fiffel.com",
  },
  teams: [
    {
      name: "Fiffel Banken",
      logo: TbPigMoney,
      plan: "Enterprise",
    },
  ],
  navMain: [
    {
      title: "Login",
      url: "#",
      icon: FaUserAlt,
    },
    {
      title: "Accounts",
      url: "#",
      icon: BsBank,
      isActive: true,
      items: [
        {
          title: "My Wallet",
          url: "#",
        },
        {
          title: "Transfer",
          url: "#",
        },
        {
          title: "Credit",
          url: "#",
        },
      ],
    },
    {
      title: "Messages",
      url: "#",
      icon: LuMessageSquare,
      items: [
        {
          title: "Chat",
          url: "#",
        },
        {
          title: "History",
          url: "#",
        },
        {
          title: "Help & Support",
          url: "#",
        },
      ],
    },
    {
      title: "Transfers",
      url: "#",
      icon: TbPigMoney,
      items: [
        {
          title: "Direct transfer ",
          url: "#",
        },
        {
          title: "SWIFT transfer ",
          url: "#",
        },
        {
          title: "International ",
          url: "#",
        },
        {
          title: "Exchange",
          url: "#",
        },
      ],
    },
    {
      title: "Statistics",
      url: "#",
      icon: IoStatsChartSharp,
      items: [
        {
          title: "Portfolio ",
          url: "#",
        },
        {
          title: "Deposit Growth ",
          url: "#",
        },
        {
          title: "Credit Scoring",
          url: "#",
        },
        {
          title: "Limits",
          url: "#",
        },
      ],
    },
  ],
  projects: [
    {
      name: "Help & Support",
      url: "#",
      icon: Frame,
    },
    {
      name: "Contact",
      url: "#",
      icon: PieChart,
    },
    {
      name: "Settings",
      url: "#",
      icon: Settings2,
    },
  ],
};

export function AppSidebar({ ...props }) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavProjects projects={data.projects} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
