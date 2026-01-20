import { Helmet } from "react-helmet-async";
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Button, buttonVariants } from "@/components/ui/button";
import { 
  Star, 
  MapPin, 
  Users, 
  Wifi, 
  Wind, 
  Coffee, 
  ChevronLeft, 
  Calendar as CalendarIcon, 
  Phone, 
  Share2, 
  MessageCircle,
  Waves,
  Utensils,
  Tv,
  Flame,
  Camera,
  Waves as Water,
  Sun,
  ShieldCheck,
  Clock,
  Car
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import ImageSlider from "@/components/ImageSlider";
import { BookingForm } from "@/components/BookingForm";
import { propertyAPI } from "@/lib/api";
import { Skeleton } from "@/components/ui/skeleton";
import { Calendar } from "@/components/ui/calendar";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { cn } from "@/lib/utils";

// Helper for mapping icons
const getIcon = (amenity: string) => {
  const a = amenity.toLowerCase();
  if (a.includes("pool") || a.includes("swim")) return <Waves className="w-5 h-5" />;
  if (a.includes("ac") || a.includes("air")) return <Wind className="w-5 h-5" />;
  if (a.includes("food") || a.includes("meal") || a.includes("breakfast") || a.includes("dining")) return <Utensils className="w-5 h-5" />;
  if (a.includes("theatre") || a.includes("tv") || a.includes("projector")) return <Tv className="w-5 h-5" />;
  if (a.includes("bbq") || a.includes("bonfire") || a.includes("fire")) return <Flame className="w-5 h-5" />;
  if (a.includes("photo")) return <Camera className="w-5 h-5" />;
  if (a.includes("hike") || a.includes("walk") || a.includes("trail")) return <MapPin className="w-5 h-5" />;
  if (a.includes("boat")) return <Water className="w-5 h-5" />;
  if (a.includes("yoga") || a.includes("meditation") || a.includes("wellness")) return <Sun className="w-5 h-5" />;
  if (a.includes("parking")) return <Car className="w-5 h-5" />;
  if (a.includes("washroom") || a.includes("toilet")) return <ShieldCheck className="w-5 h-5" />;
  if (a.includes("fridge")) return <Coffee className="w-5 h-5" />;
  return <ShieldCheck className="w-5 h-5 opacity-50" />;
};

// Extended property interface with full details
interface PropertyDetail {
  id: string;
  slug: string;
  image: string;
  images: string[];
  title: string;
  price: string;
  pricePerNight?: string;
  priceNote: string;
  amenities: string[];
  is_top_selling: boolean;
  location: string;
  rating: number;
  category: "camping" | "cottage" | "villa";
  description: string;
  capacity: number;
  max_capacity?: number;
  maxCapacity?: number;
  check_in_time?: string;
  check_out_time?: string;
  highlights: string[];
  activities: string[];
  policies?: string[];
  contact?: string;
  owner_mobile?: string;
  map_link?: string;
  is_available: boolean;
}

const PropertyDetails = () => {
  const { propertyId } = useParams();
  const [propertyData, setPropertyData] = useState<PropertyDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });

    const fetchProperty = async () => {
      try {
        if (!propertyId) return;
        const response = await propertyAPI.getPublicBySlug(propertyId);
        if (response.success) {
          const p = response.data;
          setPropertyData({
            ...p,
            priceNote: p.price_note,
            is_available: p.is_available,
            map_link: p.map_link,
            image: p.images && p.images.length > 0 ? p.images[0].image_url : "https://images.unsplash.com/photo-1571508601166-972e0a1f3ced?w=1200",
            images: p.images ? p.images.map((img: any) => img.image_url) : []
          });
        }
      } catch (error) {
        console.error("Failed to fetch property details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProperty();
  }, [propertyId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] p-6 space-y-8">
        <Skeleton className="h-[60vh] w-full rounded-3xl" />
        <div className="space-y-6 max-w-2xl mx-auto">
          <Skeleton className="h-12 w-3/4" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
        </div>
      </div>
    );
  }

  if (!propertyData) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center bg-[#0A0A0A] text-white">
        <h2 className="text-3xl font-display font-bold mb-4">Property Not Found</h2>
        <p className="text-gray-400 mb-8">The property you're looking for might have been moved or is no longer active.</p>
        <Link to="/">
          <Button size="lg" className="bg-[#D4AF37] text-black">Return Home</Button>
        </Link>
      </div>
    );
  }

  const isVilla = propertyData.category === "villa";

  return (
    <>
      <Helmet>
        <title>{propertyData.title} - Luxury {propertyData.category === 'camping' ? 'Pawna Camping' : 'Lonavala Booking'} | PawnaHavenCamp</title>
        <meta name="description" content={`Book ${propertyData.title} at ${propertyData.location}. Luxury ${propertyData.category} with ${propertyData.amenities.slice(0, 5).join(', ')}. ${propertyData.description.substring(0, 100)}...`} />
        <meta property="og:type" content="website" />
        <meta property="og:title" content={`${propertyData.title} - ${propertyData.category} in ${propertyData.location}`} />
        <meta property="og:description" content={`Stay at ${propertyData.title} for ${propertyData.price}. Perfect ${propertyData.category} experience near Pawna Lake & Lonavala.`} />
        <meta property="og:image" content={propertyData.image} />
        <meta property="og:url" content={window.location.href} />
      </Helmet>

      <div className="min-h-screen bg-[#0A0A0A] text-white font-sans">
        {/* Hero Section */}
        <div className="relative w-full h-[60vh] md:h-[70vh] overflow-hidden">
          <ImageSlider images={propertyData.images || [propertyData.image]} title={propertyData.title} />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-transparent to-transparent pointer-events-none" />
          
          <Link to="/" className="absolute top-6 left-6 w-10 h-10 rounded-full bg-black/40 backdrop-blur-md border border-white/10 flex items-center justify-center text-white z-50 hover:bg-black/60 transition-all">
            <ChevronLeft className="w-6 h-6" />
          </Link>
          
          <button 
            className="absolute top-6 right-6 w-10 h-10 rounded-full bg-black/40 backdrop-blur-md border border-white/10 flex items-center justify-center text-white z-50 hover:bg-black/60 transition-all"
            onClick={() => {
              const shareUrl = window.location.href;
              const text = `🏡 *${propertyData.title}*\n📍 ${propertyData.location}\n💰 *${propertyData.price}* ${propertyData.priceNote}\n\nCheck out this beautiful property on PawnaHavenCamp:\n${shareUrl}`;
              window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
            }}
          >
            <Share2 className="w-5 h-5" />
          </button>

          <div className="absolute bottom-8 left-6 right-6 z-20">
            <p className="text-[10px] uppercase tracking-[0.3em] font-bold text-gray-400 mb-1">Total Starting At</p>
            <div className="flex items-center justify-between">
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-bold text-[#D4AF37]">₹{propertyData.price}</span>
                <span className="text-gray-400 text-sm">/person</span>
              </div>
              <div className="flex items-center gap-2 bg-[#1A1A1A]/80 backdrop-blur-md px-4 py-2 rounded-full border border-white/5">
                <div className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]" />
                <span className="text-xs font-medium">with meals</span>
              </div>
            </div>
          </div>
        </div>

        <div className="px-6 py-6 space-y-8 max-w-2xl mx-auto pb-24">
          {/* Quick Badges */}
          <div className="flex items-center gap-3">
            <div className="px-5 py-2 rounded-xl bg-[#1A1A1A] border border-white/5 text-xs font-bold capitalize text-gray-300">
              {propertyData.category}
            </div>
            <div className={cn(
              "px-5 py-2 rounded-xl border text-xs font-bold",
              propertyData.is_available 
                ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-500" 
                : "bg-red-500/10 border-red-500/20 text-red-500"
            )}>
              {propertyData.is_available ? "Available" : "Booked"}
            </div>
            <div className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#1A1A1A] border border-white/5">
              <Star className="w-3.5 h-3.5 text-[#D4AF37] fill-[#D4AF37]" />
              <span className="text-xs font-bold">{propertyData.rating}</span>
              <span className="text-[10px] text-gray-500 font-medium">(86)</span>
            </div>
          </div>

          {/* Action Grid */}
          <div className="grid grid-cols-4 gap-3">
            <Dialog>
              <DialogTrigger asChild>
                <button className="flex flex-col items-center justify-center gap-2 bg-[#1A1A1A] border border-white/5 aspect-square rounded-2xl group active:scale-95 transition-all">
                  <CalendarIcon className="w-6 h-6 text-gray-400 group-hover:text-[#D4AF37]" />
                  <span className="text-[9px] uppercase font-bold tracking-widest text-gray-500">Book Stay</span>
                </button>
              </DialogTrigger>
              <DialogContent className="bg-[#1A1A1A] border-[#D4AF37]/30 text-white rounded-[2rem]">
                <DialogHeader><DialogTitle className="text-[#D4AF37]">Book Your Stay</DialogTitle></DialogHeader>
                <BookingForm 
                  propertyName={propertyData.title} 
                  propertyId={propertyData.id}
                  pricePerPerson={parseInt(propertyData.price.replace(/[^\d]/g, "")) || 0}
                  propertyCategory={propertyData.category}
                  maxCapacity={propertyData.max_capacity || propertyData.capacity}
                />
              </DialogContent>
            </Dialog>

            <button 
              className="col-span-2 bg-gradient-to-r from-[#00C853] to-[#00B0FF] rounded-2xl flex items-center justify-center gap-2 text-white font-bold text-sm active:scale-95 transition-all shadow-lg shadow-emerald-500/20"
              onClick={() => window.open(`https://api.whatsapp.com/send?phone=919356874010`, '_blank')}
            >
              <MessageCircle className="w-5 h-5" />
              Call / WhatsApp
            </button>

            <button 
              className="bg-[#7B1FA2] rounded-2xl flex items-center justify-center active:scale-95 transition-all shadow-lg shadow-purple-500/20"
              onClick={() => window.open(propertyData.map_link || 'https://www.google.com/maps', '_blank')}
            >
              <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                <MapPin className="w-5 h-5 text-white" />
              </div>
            </button>
          </div>

          {/* Support Section */}
          <div className="bg-[#1A1A1A] border border-white/5 rounded-3xl p-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-[#D4AF37]/10 border border-[#D4AF37]/20 flex items-center justify-center">
                <Phone className="w-5 h-5 text-[#D4AF37]" />
              </div>
              <div>
                <p className="text-[9px] uppercase tracking-widest font-bold text-gray-500">24/7 Support</p>
                <p className="text-sm font-bold text-white">+91 8806092609</p>
              </div>
            </div>
            <button 
              onClick={() => document.getElementById('availability-trigger')?.click()}
              className="px-4 py-2.5 rounded-xl border border-white/10 text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:bg-white/5 transition-all"
            >
              Check Availability
            </button>
          </div>

          {/* Title & Description */}
          <div className="space-y-4">
            <h1 className="text-4xl font-bold tracking-tight text-white">{propertyData.title}</h1>
            <p className="text-gray-400 text-lg leading-relaxed font-medium">
              {propertyData.description}
            </p>
          </div>

          {/* Info Cards */}
          <div className="grid grid-cols-4 gap-3">
            {[
              { label: 'Capacity', value: `${propertyData.capacity} Guests`, icon: Users },
              { label: 'Check-in', value: propertyData.check_in_time, icon: Clock },
              { label: 'Check-out', value: propertyData.check_out_time, icon: Clock },
              { label: 'Status', value: 'Verified', icon: ShieldCheck, color: 'text-emerald-500' },
            ].map((item, i) => (
              <div key={i} className="bg-[#1A1A1A] border border-white/5 rounded-2xl p-3 flex flex-col items-center gap-1.5">
                <item.icon className="w-4 h-4 text-[#D4AF37]" />
                <span className="text-[8px] uppercase font-bold tracking-widest text-gray-500">{item.label}</span>
                <span className={cn("text-[10px] font-bold text-center", item.color || "text-white")}>{item.value}</span>
              </div>
            ))}
          </div>

          {/* Amenities Grid */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <Wifi className="w-5 h-5 text-[#D4AF37]" />
              <h3 className="text-lg font-bold">Amenities</h3>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {propertyData.amenities.map((amenity, i) => (
                <div key={i} className="bg-[#1A1A1A] border border-white/5 rounded-2xl p-4 flex flex-col items-center justify-center gap-3 group hover:border-[#D4AF37]/30 transition-all">
                  <div className="text-[#D4AF37]">{getIcon(amenity)}</div>
                  <span className="text-[9px] font-bold text-center text-gray-300 group-hover:text-white">{amenity}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Activities Grid */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <Star className="w-5 h-5 text-[#D4AF37]" />
              <h3 className="text-lg font-bold">Activities</h3>
            </div>
            <div className="grid grid-cols-4 gap-3">
              {propertyData.activities.map((activity, i) => (
                <div key={i} className="bg-[#1A1A1A] border border-white/5 rounded-2xl p-4 flex flex-col items-center justify-center gap-3 group hover:border-[#D4AF37]/30 transition-all">
                  <div className="text-[#D4AF37]">{getIcon(activity)}</div>
                  <span className="text-[8px] font-bold text-center text-gray-300 group-hover:text-white">{activity}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Accordion Sections */}
          <div className="space-y-3">
            <Accordion type="single" collapsible className="space-y-3">
              <AccordionItem value="highlights" className="border-none bg-[#1A1A1A] rounded-2xl px-6 border border-white/5">
                <AccordionTrigger className="hover:no-underline py-5">
                  <div className="flex items-center gap-3">
                    <Star className="w-5 h-5 text-[#D4AF37]" />
                    <span className="text-sm font-bold">What You'll Love</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pb-5">
                  <ul className="space-y-3">
                    {propertyData.highlights.map((h, i) => (
                      <li key={i} className="text-sm text-gray-400 flex items-start gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] mt-1.5 shrink-0" />
                        {h}
                      </li>
                    ))}
                  </ul>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="policies" className="border-none bg-[#1A1A1A] rounded-2xl px-6 border border-white/5">
                <AccordionTrigger className="hover:no-underline py-5">
                  <div className="flex items-center gap-3">
                    <ShieldCheck className="w-5 h-5 text-[#D4AF37]" />
                    <span className="text-sm font-bold">Policies</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pb-5">
                  <ul className="space-y-3">
                    {propertyData.policies?.map((p, i) => (
                      <li key={i} className="text-sm text-gray-400 flex items-start gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] mt-1.5 shrink-0" />
                        {p}
                      </li>
                    ))}
                  </ul>
                </AccordionContent>
              </AccordionItem>

              {isVilla && (
                <AccordionItem value="availability" className="border-none bg-[#1A1A1A] rounded-2xl px-6 border border-white/5">
                  <AccordionTrigger id="availability-trigger" className="hover:no-underline py-5">
                    <div className="flex items-center gap-3">
                      <CalendarIcon className="w-5 h-5 text-[#D4AF37]" />
                      <span className="text-sm font-bold">Availability Calendar</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="pb-5">
                    <div className="bg-black/40 rounded-2xl border border-white/5 p-2">
                      <Calendar
                        mode="single"
                        className="w-full text-white"
                        classNames={{
                          head_cell: "text-gray-500 w-full font-bold text-[10px] uppercase",
                          cell: "text-center text-sm p-0 relative focus-within:relative focus-within:z-20 w-full",
                          day: cn(
                            buttonVariants({ variant: "ghost" }),
                            "h-10 w-full p-0 font-medium aria-selected:opacity-100 hover:bg-[#D4AF37]/10 transition-colors text-white"
                          ),
                          day_today: "bg-[#D4AF37]/20 text-[#D4AF37]",
                          day_disabled: "text-red-500 opacity-50 line-through font-bold cursor-not-allowed",
                        }}
                        disabled={(date) => date < new Date()}
                      />
                    </div>
                  </AccordionContent>
                </AccordionItem>
              )}
            </Accordion>
          </div>
        </div>
      </div>
    </>
  );
};

export default PropertyDetails;
