"use client";

import { NavigationProgress, nprogress } from "@mantine/nprogress";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useRef } from "react";

export function NavigationProgressWrapper() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const isInitialLoad = useRef(true);
  const progressInterval = useRef<NodeJS.Timeout | null>(null);
  const completeTimer = useRef<NodeJS.Timeout | null>(null);

  const startProgress = () => {
    // Clear any existing timers
    if (progressInterval.current) {
      clearInterval(progressInterval.current);
    }
    if (completeTimer.current) {
      clearTimeout(completeTimer.current);
    }

    // Start the progress bar
    nprogress.start();

    // Create a progressive loading effect
    let progress = 0;
    progressInterval.current = setInterval(() => {
      progress += Math.random() * 10 + 5; // Random increment between 5-15%
      
      // Slow down as we get closer to completion
      if (progress > 70) {
        progress += Math.random() * 3 + 2; // Smaller increments near the end
      }
      
      // Cap at 85% to leave room for completion
      if (progress > 85) {
        progress = 85;
      }
      
      nprogress.set(progress);
    }, 150);

    // Complete the progress after a delay
    completeTimer.current = setTimeout(() => {
      if (progressInterval.current) {
        clearInterval(progressInterval.current);
        progressInterval.current = null;
      }
      nprogress.complete();
    }, 800);
  };

  // Handle route changes
  useEffect(() => {
    if (!isInitialLoad.current) {
      startProgress();
    }
  }, [pathname, searchParams]);

  // Handle initial page load
  useEffect(() => {
    if (isInitialLoad.current) {
      isInitialLoad.current = false;
      startProgress();
    }
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (progressInterval.current) {
        clearInterval(progressInterval.current);
      }
      if (completeTimer.current) {
        clearTimeout(completeTimer.current);
      }
      nprogress.complete();
    };
  }, []);

  return <NavigationProgress />;
} 