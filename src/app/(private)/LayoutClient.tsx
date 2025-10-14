"use client";
import {
  Anchor,
  AppShell,
  Avatar,
  Box,
  Burger,
  Button,
  Container,
  Divider,
  Group,
  Menu,
  Text,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { User } from "../../../prisma/generated/client";
import { logout } from "@/actions/auth";
import { IconLogout, IconUser } from "@tabler/icons-react";
import Link from "next/link";
import Logo from "@/components/Logo";

const links = [
  { label: "Dashboard", href: "/dashboard" },
  { label: "Team", href: "/team" },
  { label: "Admin dashboard", href: "/admin/dashboard" },
  { label: "Admin settings", href: "/admin" },
];

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
      navbar={{
        width: 300,
        breakpoint: "sm",
        collapsed: { desktop: true, mobile: !opened },
      }}
      padding="md"
    >
      <AppShell.Header>
        <Container
          p={{ base: "md", md: 0 }}
          h="100%"
          className="flex items-center"
        >
          <Group
            h="100%"
            gap="md"
            wrap="nowrap"
            justify="space-between"
            w="100%"
          >
            <Group align="center" gap="md">
              <Burger
                opened={opened}
                onClick={toggle}
                hiddenFrom="sm"
                size="sm"
              />
              <Logo />
              <Box visibleFrom="sm">
                <Button
                  variant="subtle"
                  size="sm"
                  c="inherit"
                  component={Link}
                  href="/dashboard"
                >
                  Dashboard
                </Button>
                <Button
                  variant="subtle"
                  size="sm"
                  c="inherit"
                  component={Link}
                  href="/team"
                >
                  Team
                </Button>
                <Menu trigger="hover" position="bottom-start">
                  <Menu.Target>
                    <Button
                      variant="subtle"
                      size="sm"
                      c="inherit"
                      component={Link}
                      href="/admin/dashboard"
                    >
                      Admin
                    </Button>
                  </Menu.Target>
                  <Menu.Dropdown>
                    <Menu.Item component={Link} href="/admin">
                      Admin Settings
                    </Menu.Item>
                    <Menu.Item component={Link} href="/admin/dashboard">
                      Admin Dashboard
                    </Menu.Item>
                  </Menu.Dropdown>
                </Menu>
              </Box>
            </Group>
            <Menu position="bottom-end">
              <Menu.Target>
                <Avatar style={{ cursor: "pointer" }} visibleFrom="sm" src={currentUser.avatarUrl}>
                  {currentUser.name?.charAt(0) || "U"}
                </Avatar>
              </Menu.Target>
              <Menu.Dropdown miw={200}>
                <Menu.Item
                  leftSection={<IconUser size={14} />}
                  component={Link}
                  href="/profile"
                >
                  Profile
                </Menu.Item>
                <Menu.Item
                  color="red"
                  leftSection={<IconLogout size={14} />}
                  onClick={async () => {
                    await logout();
                    router.push("/");
                  }}
                >
                  Logout
                </Menu.Item>
              </Menu.Dropdown>
            </Menu>
          </Group>
        </Container>
      </AppShell.Header>
      <AppShell.Navbar p="md">
        <div className="grow flex flex-col gap-2">
          {links.map((link) => (
            <Anchor
              key={link.href}
              href={link.href}
              underline="never"
              c="inherit"
            >
              {link.label}
            </Anchor>
          ))}
        </div>
        <Box px="md" pt={0} mx="-md">
          <Divider mx="-md" mb="md" />
          <Menu>
            <Menu.Target>
              <Group style={{ cursor: "pointer" }}>
                <Avatar color="indigo" src={currentUser.avatarUrl}>
                  {currentUser.name?.charAt(0) || "U"}
                </Avatar>
                <Text>{currentUser.name}</Text>
              </Group>
            </Menu.Target>
            <Menu.Dropdown miw={200}>
              <Menu.Item
                color="red"
                onClick={async () => {
                  await logout();
                  router.push("/");
                }}
              >
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
