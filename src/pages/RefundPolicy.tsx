import Header from "@/components/Header";
import Footer from "@/components/Footer";

const RefundPolicy = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow pt-24 pb-12">
        <div className="container mx-auto px-4 max-w-4xl">
          <h1 className="text-3xl font-display font-bold mb-8 text-primary">Refund & Cancellation Policy</h1>
          <div className="prose prose-gold max-w-none space-y-6 text-muted-foreground">
            <section>
              <h2 className="text-xl font-bold text-foreground">1. Cancellation by Guest</h2>
              <p>Cancellations made 7 days or more before the check-in date are eligible for a 50% refund of the advance amount paid.</p>
              <p>Cancellations made within 7 days of the check-in date are non-refundable.</p>
            </section>
            <section>
              <h2 className="text-xl font-bold text-foreground">2. No-Show</h2>
              <p>Failure to arrive at the property on the scheduled date will be treated as a no-show, and the advance payment will be forfeited.</p>
            </section>
            <section>
              <h2 className="text-xl font-bold text-foreground">3. Cancellation by Property</h2>
              <p>In the rare event that we must cancel your booking due to unforeseen circumstances, a 100% refund of the advance amount will be issued.</p>
            </section>
            <section>
              <h2 className="text-xl font-bold text-foreground">4. Refund Processing</h2>
              <p>Approved refunds will be processed within 5-7 business days through the original payment method (Paytm/Bank Transfer).</p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default RefundPolicy;
