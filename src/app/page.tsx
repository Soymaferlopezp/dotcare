import Link from "next/link";
import Header from "../components/Header";
import Hero from "../components/Hero";
import Sponsors from "../components/Sponsors";
import ProblemSection from "../components/ProblemSection";
import OpportunitySection from "../components/OpportunitySection";
import BenefitsSection from "../components/BenefitsSection";
import Testimonials from "../components/Testimonials";
import Pricing from "../components/Pricing";
import Team from "../components/Team";
import Footer from "../components/Footer";

export default function Page() {
  return (
    <>
      <Header />
      <main id="content" role="main">
        <Hero />
        <Sponsors />
        <ProblemSection />
        <OpportunitySection />
        <BenefitsSection />
        <Testimonials />
        <Pricing />
        <Team />
      </main>
      <Footer />
    </>
  );
}
