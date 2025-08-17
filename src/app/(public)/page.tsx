import SectionBlog from "@/components/landing/SectionBlog";
import SectionComparison from "@/components/landing/SectionComparison";
import SectionFAQ from "@/components/landing/SectionFAQ";
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
      <SectionBlog />
      <SectionMovingBanner />
      <SectionFAQ />
    </div>
  );
}
