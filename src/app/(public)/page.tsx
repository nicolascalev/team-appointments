import SectionComparison from "@/components/landing/SectionComparison";
import SectionFeatures from "@/components/landing/SectionFeatures";
import SectionHero from "@/components/landing/SectionHero";
import SectionMovingBanner from "@/components/landing/SectionMovingBanner";
import SectionSteps from "@/components/landing/SectionSteps";
import UtilForceLight from "@/components/landing/UtilForceLight";
import { Button } from "@mantine/core";
import Link from "next/link";

export default function Home() {
  return (
    <div>
      {/* <UtilForceLight /> */}
      <Button component={Link} href="/login">
        Login
      </Button>
      <SectionHero />
      <SectionMovingBanner />
      <SectionFeatures />
      <SectionComparison />
      <SectionSteps />
    </div>
  );
}
