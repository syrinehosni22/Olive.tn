import AboutSection from "../component/about/AboutSection";
import BannerSection from "../component/banner/BannerSection";
import CTASection from "../component/CTASection/CTASection";
import FAQSection from "../component/FAQSection/FAQSection";
import HowItWorksSection from "../component/HowItWorksSection/HowItWorksSection";
import VideoModal from "../component/modal/VideoModal";
import OliveOilLotsSection from "../component/oliveOilLots/OliveOilLotsSection";
import PackagedOliveOIlsLotsSection from "../component/packagedOliveOilLots/PackagedOliveOIlsLots";
import ServiceSection from "../component/service/ServiceSection";


const Home1 = () => {
  return (
    <main>
      <BannerSection />
      <AboutSection />
      <ServiceSection />
      <OliveOilLotsSection />
      <PackagedOliveOIlsLotsSection />
      <HowItWorksSection />
      <FAQSection/>
      <CTASection/>
      {/* <PricingSection /> */}
      {/* <ContactSection /> */}
      
      <VideoModal videoUrl="https://www.youtube.com/embed/b-5E5suKIAY?si=KAbRHsNOuo4JeZiV" />
    </main>
  );
};

export default Home1;
