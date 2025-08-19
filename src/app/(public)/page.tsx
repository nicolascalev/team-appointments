import Footer from "@/components/landing/Footer";
import SectionBlog from "@/components/landing/SectionBlog";
import SectionComparison from "@/components/landing/SectionComparison";
import SectionFAQ from "@/components/landing/SectionFAQ";
import SectionFeatures from "@/components/landing/SectionFeatures";
import SectionHero from "@/components/landing/SectionHero";
import SectionMovingBanner from "@/components/landing/SectionMovingBanner";
import SectionSteps from "@/components/landing/SectionSteps";
import UtilForceLight from "@/components/landing/UtilForceLight";

export default function Home() {
  return (
    <div>
      <UtilForceLight />
      <SectionHero />
      <SectionMovingBanner />
      <SectionFeatures />
      <SectionComparison />
      <SectionSteps />
      <SectionBlog />
      <SectionMovingBanner />
      <SectionFAQ />
      <Footer />
    </div>
  );
}
