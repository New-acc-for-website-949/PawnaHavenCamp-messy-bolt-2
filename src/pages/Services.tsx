import Header from "@/components/Header";
import Footer from "@/components/Footer";

const Services = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow pt-24 pb-12">
        <div className="container mx-auto px-4 max-w-4xl">
          <h1 className="text-3xl font-display font-bold mb-8 text-primary">Our Services</h1>
          <div className="prose prose-gold max-w-none space-y-8 text-muted-foreground">
            <p>PawnaHavenCamp provides premium accommodation and hospitality services near Pawna Lake and Lonavala.</p>
            
            <div className="grid md:grid-cols-2 gap-6 mt-8">
              <div className="p-6 bg-secondary/20 rounded-2xl border border-border/40">
                <h3 className="text-lg font-bold text-foreground mb-2">Luxury Accommodations</h3>
                <p className="text-sm">We offer high-end glamping domes, cozy cottages, and private villas designed for comfort and luxury.</p>
              </div>
              <div className="p-6 bg-secondary/20 rounded-2xl border border-border/40">
                <h3 className="text-lg font-bold text-foreground mb-2">Dining Services</h3>
                <p className="text-sm">Authentic local meals (Veg and Non-Veg options) are included in most packages, prepared fresh by our local chefs.</p>
              </div>
              <div className="p-6 bg-secondary/20 rounded-2xl border border-border/40">
                <h3 className="text-lg font-bold text-foreground mb-2">Event Hosting</h3>
                <p className="text-sm">Our properties are perfect for small gatherings, birthdays, and corporate retreats.</p>
              </div>
              <div className="p-6 bg-secondary/20 rounded-2xl border border-border/40">
                <h3 className="text-lg font-bold text-foreground mb-2">Activities</h3>
                <p className="text-sm">Boating, trekking, and campfire arrangements are available to make your stay memorable.</p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Services;
