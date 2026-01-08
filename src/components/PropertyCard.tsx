import { Link, useNavigate } from "react-router-dom";
import { Star, MapPin, ArrowUpRight, Share2, MessageCircle, ChevronLeft, ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getOptimizedImageUrl } from "@/lib/cloudinary";
import { useState, useRef } from "react";

interface PropertyCardProps {
  id?: string;
  slug?: string;
  image: string;
  images?: string[];
  title: string;
  location?: string;
  price: string;
  priceNote?: string;
  rating?: number;
  amenities: string[];
  category?: string;
  isTopSelling?: boolean;
  isAvailable?: boolean;
}

const PropertyCard = ({
  id = "1",
  slug,
  image,
  images = [],
  title,
  location = "Pawna Lake",
  price,
  priceNote = "person",
  rating = 4.9,
  amenities,
  category,
  isTopSelling,
  isAvailable = true,
}: PropertyCardProps) => {
  const navigate = useNavigate();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);
  
  const displayImages = images.length > 0 ? images : [image];
  const navigationId = slug || id;

  const handleShare = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const shareUrl = `${window.location.origin}/property/${navigationId}`;
    const text = `🏡 *${title}*\n📍 ${location}\n💰 *${price}* /${priceNote}\n\nCheck out this property:\n${shareUrl}`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
  };

  const handleBookNow = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    window.open(`https://api.whatsapp.com/send?phone=918669505727&text=I'm interested in booking ${encodeURIComponent(title)}`, '_blank');
  };

  const nextImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev === displayImages.length - 1 ? 0 : prev + 1));
  };

  const prevImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev === 0 ? displayImages.length - 1 : prev - 1));
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    const diff = touchStartX.current - touchEndX.current;
    if (diff > 50) {
      setCurrentImageIndex((prev) => (prev === displayImages.length - 1 ? 0 : prev + 1));
    } else if (diff < -50) {
      setCurrentImageIndex((prev) => (prev === 0 ? displayImages.length - 1 : prev - 1));
    }
    touchStartX.current = null;
    touchEndX.current = null;
  };

  const handleNavigate = () => {
    navigate(`/property/${navigationId}`);
  };

  return (
    <div className="group h-full" onClick={handleNavigate}>
      <div className="card-luxury bg-card rounded-3xl overflow-hidden border border-border/30 hover:border-primary/30 transition-all duration-500 cursor-pointer h-full">
        {/* Image Container */}
        <div 
          className="relative h-72 overflow-hidden"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <img
            src={getOptimizedImageUrl(displayImages[currentImageIndex], 600)}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
          
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

          {/* Top Badges */}
          <div className="absolute top-4 left-4 flex gap-2">
            {isTopSelling && (
              <Badge className="bg-gradient-to-r from-primary to-gold-light text-primary-foreground border-none shadow-gold font-semibold">
                <Star className="w-3 h-3 mr-1 fill-current" />
                Top Rated
              </Badge>
            )}
            {category && (
              <Badge className="bg-background/80 backdrop-blur-sm text-foreground border-none capitalize">
                {category}
              </Badge>
            )}
          </div>

          {/* Availability Badge */}
          <Badge 
            className={`absolute top-4 right-4 font-semibold text-xs px-3 py-1.5 rounded-full border-none ${
              isAvailable 
                ? "bg-emerald-500/90 text-white" 
                : "bg-red-500/90 text-white"
            }`}
          >
            {isAvailable ? "Available" : "Booked"}
          </Badge>

          {/* Image Navigation */}
          {displayImages.length > 1 && (
            <>
              <button 
                onClick={prevImage}
                className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-card/90 hover:bg-card text-foreground opacity-0 group-hover:opacity-100 transition-all z-10"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button 
                onClick={nextImage}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-card/90 hover:bg-card text-foreground opacity-0 group-hover:opacity-100 transition-all z-10"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
              
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5">
                {displayImages.slice(0, 5).map((_, index) => (
                  <button
                    key={index}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setCurrentImageIndex(index);
                    }}
                    className={`w-2 h-2 rounded-full transition-all ${
                      index === currentImageIndex
                        ? "bg-primary w-6"
                        : "bg-foreground/50 hover:bg-foreground/80"
                    }`}
                  />
                ))}
              </div>
            </>
          )}

          {/* Quick Actions */}
          <div className="absolute bottom-4 right-4 flex gap-2 z-20">
            <Button
              size="icon"
              variant="secondary"
              className="rounded-full w-10 h-10 bg-card/90 hover:bg-card text-foreground"
              onClick={handleShare}
            >
              <Share2 className="w-4 h-4" />
            </Button>
            <Button
              size="icon"
              className="rounded-full w-10 h-10 bg-primary hover:bg-gold-light text-primary-foreground shadow-gold"
              onClick={handleBookNow}
            >
              <MessageCircle className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Location & Rating */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-1.5 text-muted-foreground text-sm">
              <MapPin className="w-4 h-4" />
              <span>{location}</span>
            </div>
            <div className="flex items-center gap-1 text-primary">
              <Star className="w-4 h-4 fill-current" />
              <span className="font-semibold">{rating}</span>
            </div>
          </div>

          {/* Title */}
          <h3 className="font-display text-xl font-semibold text-foreground mb-4 line-clamp-1 group-hover:text-primary transition-colors">
            {title}
          </h3>

          {/* Amenities */}
          <div className="flex gap-2 mb-5 flex-wrap">
            {amenities.slice(0, 3).map((amenity, index) => (
              <span
                key={index}
                className="text-xs text-muted-foreground bg-secondary px-3 py-1.5 rounded-full"
              >
                {amenity}
              </span>
            ))}
          </div>

          {/* Price */}
          <div className="flex items-center justify-between pt-4 border-t border-border/50">
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-display font-bold text-gradient-gold">{price}</span>
              <span className="text-sm text-muted-foreground">/ {priceNote}</span>
            </div>
            <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
              <ArrowUpRight className="w-5 h-5" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyCard;
