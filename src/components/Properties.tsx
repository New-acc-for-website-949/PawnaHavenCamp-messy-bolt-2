import { useState, useEffect } from "react";
import PropertyCard from "./PropertyCard";
import { propertyAPI } from "@/lib/api";
import { Skeleton } from "@/components/ui/skeleton";

const categoryLabels: Record<string, string> = {
  all: "All Properties",
  camping: "Glamping",
  villa: "Villas",
  cottage: "Cottages",
};

const Properties = () => {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [properties, setProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const response = await propertyAPI.getPublicList();
        if (response.success) {
          const mappedProperties = response.data.map((p: any) => ({
            ...p,
            priceNote: p.price_note,
            isAvailable: p.is_available,
            image: p.images && p.images.length > 0 ? p.images[0].image_url : "",
            images: p.images ? p.images.map((img: any) => img.image_url) : []
          }));
          setProperties(mappedProperties);
        }
      } catch (error) {
        console.error("Failed to fetch properties:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProperties();
  }, []);

  const filteredProperties = selectedCategory === "all"
    ? properties
    : properties.filter((p) => p.category === selectedCategory);

  const categories = ["all", "camping", "villa", "cottage"];

  return (
    <section id="properties" className="py-24 md:py-32">
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8 mb-12">
          <div className="max-w-2xl">
            <span className="text-xs uppercase tracking-[0.3em] text-primary font-semibold mb-4 block">
              Our Collection
            </span>
            <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-foreground">
              Curated
              <span className="text-gradient-gold italic"> Stays</span>
            </h2>
          </div>

          {/* Category Tabs */}
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${
                  selectedCategory === category
                    ? "bg-gradient-to-r from-primary to-gold-light text-primary-foreground shadow-gold"
                    : "bg-secondary text-muted-foreground hover:text-foreground hover:bg-secondary/80"
                }`}
              >
                {categoryLabels[category]}
              </button>
            ))}
          </div>
        </div>

        {/* Properties Grid */}
        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="space-y-4">
                <Skeleton className="h-72 w-full rounded-2xl" />
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            ))}
          </div>
        ) : filteredProperties.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProperties.map((property, index) => (
              <div
                key={property.id}
                className="opacity-0 animate-fade-up"
                style={{ animationDelay: `${index * 100}ms`, animationFillMode: "forwards" }}
              >
                <PropertyCard
                  id={property.id}
                  slug={property.slug}
                  image={property.image}
                  images={property.images}
                  title={property.title}
                  location={property.location}
                  price={property.price}
                  priceNote={property.priceNote}
                  rating={property.rating}
                  amenities={property.amenities || []}
                  category={property.category}
                  isTopSelling={property.is_top_selling}
                  isAvailable={property.isAvailable}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-muted-foreground text-lg">No properties found in this category.</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default Properties;
