"use client";
import { Tabs } from "@mantine/core";
import { useRouter } from "next/navigation";
import React from "react";

function AdminTabs({ activeTab }: { activeTab: string }) {
  const router = useRouter();
  return (
    <Tabs
      value={activeTab}
      onChange={(value) => router.push(`?tab=${value}`)}
      variant="outline"
    >
      <Tabs.List
        style={{
          overflowX: "auto",
          flexWrap: "nowrap",
          whiteSpace: "nowrap",
          scrollbarWidth: "none",
          msOverflowStyle: "none",
          "&::-webkit-scrollbar": {
            display: "none",
          },
        }}
      >
        <Tabs.Tab value="General">General</Tabs.Tab>
        <Tabs.Tab value="Members">Members</Tabs.Tab>
        <Tabs.Tab value="Services">Services</Tabs.Tab>
        <Tabs.Tab value="Settings">Settings</Tabs.Tab>
      </Tabs.List>
    </Tabs>
  );
}

export default AdminTabs;
