import Header from "@/components/Header";
import Footer from "@/components/Footer";

const TermsConditions = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow pt-24 pb-12">
        <div className="container mx-auto px-4 max-w-4xl">
          <h1 className="text-3xl font-display font-bold mb-8 text-primary">Terms & Conditions</h1>
          <div className="prose prose-gold max-w-none space-y-6 text-muted-foreground">
            <section>
              <h2 className="text-xl font-bold text-foreground">1. Introduction</h2>
              <p>Welcome to PawnaHavenCamp. By booking with us, you agree to comply with and be bound by the following terms and conditions.</p>
            </section>
            <section>
              <h2 className="text-xl font-bold text-foreground">2. Booking and Payments</h2>
              <p>To confirm a booking, an advance payment of 30% of the total booking value is required. The remaining 70% must be paid at the time of check-in at the property.</p>
            </section>
            <section>
              <h2 className="text-xl font-bold text-foreground">3. Check-in and Check-out</h2>
              <p>Standard Check-in time is 11:00 AM and Check-out time is 10:00 AM. Early check-in or late check-out is subject to availability and may incur additional charges.</p>
            </section>
            <section>
              <h2 className="text-xl font-bold text-foreground">4. Guest Responsibility</h2>
              <p>Guests are responsible for any damage caused to the property during their stay. We reserve the right to charge for any repairs or replacements required.</p>
            </section>
            <section>
              <h2 className="text-xl font-bold text-foreground">5. Governing Law</h2>
              <p>These terms are governed by the laws of India. Any disputes shall be subject to the exclusive jurisdiction of the courts in Pune, Maharashtra.</p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default TermsConditions;
