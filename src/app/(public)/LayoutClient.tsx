"use client";
import Footer from "@/components/landing/Footer";
import Logo from "@/components/Logo";
import {
  Anchor,
  AppShell,
  Box,
  Burger,
  Button,
  Container,
  Group
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

const links = [
  { label: "Features", href: "/dashboard" },
  { label: "News & Insights", href: "/team" },
  { label: "Contact", href: "/admin/dashboard" },
  { label: "Admin settings", href: "/admin" },
];

export default function LayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  const [opened, { toggle, close }] = useDisclosure();
  const pathname = usePathname();
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
        <Container h="100%" className="flex items-center" size="xl">
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
              <Link href="/">
                <Logo />
              </Link>
              <Box visibleFrom="sm">
                <Button
                  variant="subtle"
                  size="sm"
                  c="inherit"
                  component={Link}
                  href="/dashboard"
                >
                  Features
                </Button>
                <Button
                  variant="subtle"
                  size="sm"
                  c="inherit"
                  component={Link}
                  href="/blog"
                >
                  News & Insights
                </Button>
                <Button
                  variant="subtle"
                  size="sm"
                  c="inherit"
                  component={Link}
                  href="/contact"
                >
                  Contact
                </Button>
                {/* <Menu trigger="hover" position="bottom-start">
                  <Menu.Target>
                    <Button
                      variant="subtle"
                      size="sm"
                      c="inherit"
                      component={Link}
                      href="/admin/dashboard"
                    >
                      Contact
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
                </Menu> */}
              </Box>
            </Group>
            <Button component={Link} href="/login">
              Login
            </Button>
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
      </AppShell.Navbar>
      <AppShell.Main p="0px" pt="60px">
        {children}
      </AppShell.Main>
      <Footer />
    </AppShell>
  );
}
