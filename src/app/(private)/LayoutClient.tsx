"use client";
import { Anchor, AppShell, Avatar, Box, Burger, Divider, Group, Menu, Text } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { User } from "../../../prisma/generated/client";
import { logout } from "@/actions/auth";
import { IconLogout } from "@tabler/icons-react";

export default function LayoutClient({
  children,
  currentUser,
}: {
  children: React.ReactNode;
  currentUser: User;
}) {
  const [opened, { toggle, close }] = useDisclosure();
  const pathname = usePathname();
  const router = useRouter();
  useEffect(() => {
    close();
  }, [pathname, close]);

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{ width: 300, breakpoint: "sm", collapsed: { mobile: !opened } }}
      padding="md"
    >
      <AppShell.Header>
        <Group h="100%" px="md">
          <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
          <Avatar color="teal">TA</Avatar>
        </Group>
      </AppShell.Header>
      <AppShell.Navbar p="md">
        <div className="grow flex flex-col gap-2">
          <Anchor href="/dashboard" underline="never" c="inherit">
            Dashboard
          </Anchor>
          <Anchor href="/team" underline="never" c="inherit">
            Team
          </Anchor>
          <Anchor href="/admin" underline="never" c="inherit">
            Admin
          </Anchor>
        </div>
        <Box px="md" pt={0} mx="-md">
          <Divider mx="-md" mb="md" />
          <Menu>
            <Menu.Target>
              <Group style={{ cursor: 'pointer' }}>
                <Avatar color="teal">{currentUser.name?.charAt(0) || "U"}</Avatar>
                <Text>{currentUser.name}</Text>
              </Group>
            </Menu.Target>
            <Menu.Dropdown miw={200}>
              <Menu.Item color="red" onClick={async () => {
                await logout();
                router.push('/');
              }}>
                <Group>
                  <IconLogout size={14} />
                  <span>Logout</span>
                </Group>
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        </Box>
      </AppShell.Navbar>
      <AppShell.Main>{children}</AppShell.Main>
    </AppShell>
  );
}
