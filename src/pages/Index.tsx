import { Helmet } from "react-helmet-async";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Destinations from "@/components/Destinations";
import Properties from "@/components/Properties";
import FloatingContact from "@/components/FloatingContact";
import Footer from "@/components/Footer";
import { useEffect } from "react";

const Index = () => {
  useEffect(() => {
    // We use a small delay to ensure all property cards have rendered
    // and the page height is correct before restoring scroll
    const savedPosition = sessionStorage.getItem("homeScrollPosition");
    if (savedPosition) {
      const restoreScroll = () => {
        window.scrollTo({
          top: parseInt(savedPosition),
          behavior: "instant"
        });
        // Clear it once restored so regular refreshes start at top
        sessionStorage.removeItem("homeScrollPosition");
      };
      
      // Delay slightly to allow content/images to render
      const timeoutId = setTimeout(restoreScroll, 100);
      return () => clearTimeout(timeoutId);
    }
  }, []);

  return (
    <>
      <Helmet>
        <title>LoonCamp - #1 Luxury Pawna Lake Camping & Lonavala Villa Booking</title>
        <meta
          name="description"
          content="LoonCamp offers the best luxury glamping domes at Pawna Lake and premium villas in Lonavala. Book lakeside camping with pool, AC, and meals. Top-rated stays near Mumbai & Pune."
        />
        <meta
          name="keywords"
          content="Pawna camping, Pawna Lake resorts, Lonavala villa booking, glamping near Mumbai, luxury dome resort, lakeside stay Lonavala"
        />
        <link rel="canonical" href="https://looncamp.com" />
      </Helmet>

      <div className="min-h-screen">
        <Header />
        <main>
          <Hero />
          <Destinations />
          <Properties />
        </main>
        <Footer />
        <FloatingContact />
      </div>
    </>
  );
};

export default Index;
