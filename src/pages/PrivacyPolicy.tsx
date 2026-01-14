import Header from "@/components/Header";
import Footer from "@/components/Footer";

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow pt-24 pb-12">
        <div className="container mx-auto px-4 max-w-4xl">
          <h1 className="text-3xl font-display font-bold mb-8 text-primary">Privacy Policy</h1>
          <div className="prose prose-gold max-w-none space-y-6 text-muted-foreground">
            <p>At PawnaHavenCamp, we respect your privacy and are committed to protecting the personal information you share with us.</p>
            <section>
              <h2 className="text-xl font-bold text-foreground">1. Information Collection</h2>
              <p>We collect basic information such as your name, mobile number, and email address when you make a booking or inquiry.</p>
            </section>
            <section>
              <h2 className="text-xl font-bold text-foreground">2. Use of Information</h2>
              <p>Your information is used solely for processing your booking, communicating stay details, and improving our services.</p>
            </section>
            <section>
              <h2 className="text-xl font-bold text-foreground">3. Data Security</h2>
              <p>We implement secure protocols to ensure your data is protected against unauthorized access. We do not store credit card/debit card details; all payments are processed through secure gateways (Paytm).</p>
            </section>
            <section>
              <h2 className="text-xl font-bold text-foreground">4. Third-Party Sharing</h2>
              <p>We do not sell or share your personal information with third parties for marketing purposes.</p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PrivacyPolicy;
