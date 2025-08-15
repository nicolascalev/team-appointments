"use client";

import { useMantineColorScheme } from "@mantine/core";
import { usePathname } from "next/navigation";
import { useEffect, useMemo } from "react";

function UtilForceLight() {
  const { setColorScheme } = useMantineColorScheme();

  const pathname = usePathname();

  const lightPaths = useMemo(() => ["/"], []);
  useEffect(() => {
    if (lightPaths.includes(pathname)) {
      setColorScheme("light");
    } else {
      setColorScheme("auto");
    }
    return () => {
      setColorScheme("auto");
    };
  }, [pathname, setColorScheme, lightPaths]);

  return null;
}

export default UtilForceLight;
