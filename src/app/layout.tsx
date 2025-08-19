import { ColorSchemeScript, MantineProvider, createTheme } from "@mantine/core";
import "@mantine/core/styles.css";
import "@mantine/dates/styles.css";
import "@mantine/dropzone/styles.css";
import '@mantine/nprogress/styles.css';
import { ModalsProvider } from "@mantine/modals";
import { Notifications } from "@mantine/notifications";
import "@mantine/notifications/styles.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { UserProvider } from "@/context/user-context";
import { getCurrentUser } from "@/actions/auth";
import crypto from "crypto";
import { NavigationProgressWrapper } from "@/components/NavigationProgressWrapper";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

const theme = createTheme({
  primaryColor: "indigo",
  fontFamily: inter.style.fontFamily,
});

export const metadata: Metadata = {
  title: "Teamlypro",
  description: "Teamlypro is the best free team's scheduling solution",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await getCurrentUser();
  const nonce = crypto.randomBytes(16).toString("hex");

  return (
    <html lang="en">
      <body className={`antialiased ${inter.className}`}>
        <ColorSchemeScript defaultColorScheme="auto" nonce={nonce} />
        <MantineProvider theme={theme} defaultColorScheme="auto">
          <ModalsProvider>
            <UserProvider initialUser={user}>
              <NavigationProgressWrapper />
              <Notifications />
              {children}
            </UserProvider>
          </ModalsProvider>
        </MantineProvider>
      </body>
    </html>
  );
}
