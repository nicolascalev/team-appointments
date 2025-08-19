"use client";

import { useMantineColorScheme } from "@mantine/core";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

const lightPaths = ["/"];

function UtilForceLight() {
  const { setColorScheme } = useMantineColorScheme();

  const pathname = usePathname();

  useEffect(() => {
    if (lightPaths.includes(pathname)) {
      setColorScheme("light");
    } else {
      setColorScheme("auto");
    }
    return () => {
      setColorScheme("auto");
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname, lightPaths]);

  return null;
}

export default UtilForceLight;
