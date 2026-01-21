import { Helmet } from "react-helmet-async";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Destinations from "@/components/Destinations";
import Properties from "@/components/Properties";
import FloatingContact from "@/components/FloatingContact";
import Footer from "@/components/Footer";
import { useEffect, useState, useCallback } from "react";
import { Loader2, Download, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const Index = () => {
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showInstallBanner, setShowInstallBanner] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      console.log('beforeinstallprompt event fired');
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstallBanner(true);
    };

    const handleAppInstalled = () => {
      console.log('App was installed');
      setDeferredPrompt(null);
      setShowInstallBanner(false);
      toast.success("App installed successfully! Check your home screen.");
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleAppInstalled);

    if (window.matchMedia('(display-mode: standalone)').matches) {
      setShowInstallBanner(false);
    }

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, []);

  const handleInstallClick = useCallback(async () => {
    if (!deferredPrompt) {
      console.log('No deferredPrompt available');
      const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
      if (isIOS) {
        toast.info("To install: Tap 'Share' then 'Add to Home Screen' 📲");
      } else {
        toast.error("Installation not ready yet. Please wait 2-3 seconds for the browser to recognize the app and click again. 🚀");
      }
      return;
    }
    
    try {
      // Show the native browser install prompt
      await deferredPrompt.prompt();
      
      // Wait for the user to respond to the prompt
      const { outcome } = await deferredPrompt.userChoice;
      console.log(`User response to the install prompt: ${outcome}`);
      
      if (outcome === 'accepted') {
        setDeferredPrompt(null);
        setShowInstallBanner(false);
      }
    } catch (err) {
      console.error("Installation error:", err);
      toast.error("Please use your browser menu to 'Install' or 'Add to Home Screen'.");
    }
  }, [deferredPrompt]);

  const handleCloseBanner = () => {
    setShowInstallBanner(false);
  };

  useEffect(() => {
    const savedPosition = sessionStorage.getItem("homeScrollPosition");
    
    // Set a 0.5s timer for the loader
    const loaderTimer = setTimeout(() => {
      setIsInitialLoading(false);
      
      // Use requestAnimationFrame to ensure the DOM is painted before scrolling
      if (savedPosition) {
        requestAnimationFrame(() => {
          window.scrollTo({
            top: parseInt(savedPosition),
            behavior: "instant"
          });
          sessionStorage.removeItem("homeScrollPosition");
        });
      }
    }, 500);

    return () => clearTimeout(loaderTimer);
  }, []);

  if (isInitialLoading) {
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
          <span className="text-sm font-medium tracking-widest uppercase text-muted-foreground animate-pulse">
            PawnaHavenCamp
          </span>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>PawnaHavenCamp - #1 Luxury Pawna Lake Camping & Lonavala Villa Booking</title>
        <meta
          name="description"
          content="PawnaHavenCamp offers the best luxury glamping domes at Pawna Lake and premium villas in Lonavala. Book lakeside camping with pool, AC, and meals. Top-rated stays near Mumbai & Pune."
        />
        <meta
          name="keywords"
          content="Pawna camping, Pawna Lake resorts, Lonavala villa booking, glamping near Mumbai, luxury dome resort, lakeside stay Lonavala"
        />
        <link rel="canonical" href="https://looncamp.com" />
      </Helmet>

      {showInstallBanner && (
        <div className="fixed bottom-24 left-4 right-4 z-[60] bg-background border border-border p-4 rounded-xl shadow-2xl animate-in fade-in slide-in-from-bottom-4 md:max-w-md md:left-auto md:right-8">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="bg-primary/10 p-2 rounded-lg">
                <Download className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-sm">Install App</h3>
                <p className="text-xs text-muted-foreground">Add to home screen for quick access</p>
              </div>
            </div>
            <button 
              onClick={handleCloseBanner}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="flex gap-3 mt-4">
            <Button 
              variant="outline" 
              size="sm" 
              className="flex-1 text-xs"
              onClick={handleCloseBanner}
            >
              Cancel
            </Button>
            <Button 
              size="sm" 
              className="flex-1 text-xs"
              onClick={handleInstallClick}
            >
              Install
            </Button>
          </div>
        </div>
      )}

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
