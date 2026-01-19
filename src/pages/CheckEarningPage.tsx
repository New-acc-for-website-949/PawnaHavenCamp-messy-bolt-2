import { useState } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { 
  ChevronLeft, 
  ShieldCheck, 
  Smartphone, 
  Lock,
  Wallet,
  User,
  History,
  Clock,
  CheckCircle2,
  Send,
  AlertCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

const CheckEarningPage = () => {
  const [step, setStep] = useState<"verify" | "otp" | "dashboard">("verify");
  const [formData, setFormData] = useState({
    code: "",
    otp: "",
    withdrawCode: "",
    accountDetails: "",
    withdrawAmount: ""
  });

  const availableBalance = 12450.00;
  const isAmountInvalid = parseFloat(formData.withdrawAmount) > availableBalance;

  const handleSendOTP = () => {
    if (formData.code === "HRUSHI77") {
      setStep("otp");
    } else {
      alert("Invalid Referral Code (Try HRUSHI77)");
    }
  };

  const handleVerifyOTP = () => {
    if (formData.otp === "000000") {
      setStep("dashboard");
    } else {
      alert("Invalid OTP (Try 000000)");
    }
  };

  return (
    <div className="min-h-screen bg-black text-white pb-20">
      <Helmet>
        <title>Check Earning - PawnaHavenCamp</title>
      </Helmet>

      {/* Header */}
      <div className="sticky top-0 z-50 bg-black border-b border-border/50">
        <div className="container mx-auto px-6 py-4 flex items-center gap-4">
          <Link to="/referral" className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-foreground/70 hover:bg-primary hover:text-primary-foreground transition-all">
            <ChevronLeft className="w-6 h-6" />
          </Link>
          <h1 className="font-display text-xl font-bold">Check Earning</h1>
        </div>
      </div>

      <div className="container mx-auto px-6 pt-8 max-w-md">
        {step === "verify" && (
          <div className="space-y-8 animate-fade-up">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mx-auto mb-4">
                <ShieldCheck className="w-8 h-8" />
              </div>
              <h2 className="text-2xl font-display font-bold">Verify Referral</h2>
              <p className="text-sm text-muted-foreground">Enter your code to receive an OTP</p>
            </div>
            <Card className="p-6 bg-card border-border/50 rounded-3xl space-y-4">
              <div className="space-y-2">
                <Label>Enter your code</Label>
                <Input 
                  placeholder="e.g. HRUSHI77" 
                  value={formData.code}
                  onChange={(e) => setFormData({...formData, code: e.target.value})}
                  className="h-12 bg-secondary/50 rounded-xl"
                />
              </div>
              <Button onClick={handleSendOTP} className="w-full h-12 rounded-xl font-bold gap-2">
                <Send className="w-4 h-4" />
                Send OTP
              </Button>
            </Card>
          </div>
        )}

        {step === "otp" && (
          <div className="space-y-8 animate-fade-up">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mx-auto mb-4">
                <Lock className="w-8 h-8" />
              </div>
              <h2 className="text-2xl font-display font-bold">Enter OTP</h2>
              <p className="text-sm text-muted-foreground">Verification code sent to your mobile</p>
            </div>
            <Card className="p-6 bg-card border-border/50 rounded-3xl space-y-4">
              <div className="space-y-2">
                <Label>OTP Code</Label>
                <Input 
                  placeholder="000000" 
                  value={formData.otp}
                  onChange={(e) => setFormData({...formData, otp: e.target.value})}
                  className="h-12 bg-secondary/50 rounded-xl text-center text-2xl tracking-[0.5em] font-bold"
                  maxLength={6}
                />
              </div>
              <Button onClick={handleVerifyOTP} className="w-full h-12 rounded-xl font-bold">
                Verify & Continue
              </Button>
            </Card>
          </div>
        )}

        {step === "dashboard" && (
          <div className="space-y-6 animate-fade-up">
            <Card className="p-6 bg-gradient-to-br from-primary to-gold-dark text-white rounded-[2rem] border-none shadow-gold relative overflow-hidden">
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                    <User className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-xs text-white/70 font-bold uppercase tracking-widest">Welcome back</p>
                    <p className="text-xl font-display font-bold">Hrushi Patel (HRUSHI77)</p>
                  </div>
                </div>
                <div className="pt-4 border-t border-white/10">
                  <p className="text-xs text-white/70 font-bold uppercase tracking-widest mb-1">Available Balance</p>
                  <p className="text-4xl font-display font-bold">₹12,450.00</p>
                </div>
              </div>
              <Wallet className="absolute -right-6 -bottom-6 w-32 h-32 text-white/10" />
            </Card>

            <Tabs defaultValue="withdraw" className="w-full">
              <TabsList className="grid w-full grid-cols-2 bg-secondary/50 rounded-2xl p-1 h-14">
                <TabsTrigger value="withdraw" className="rounded-xl font-bold data-[state=active]:bg-primary">
                  <Wallet className="w-4 h-4 mr-2" />
                  Withdraw
                </TabsTrigger>
                <TabsTrigger value="history" className="rounded-xl font-bold data-[state=active]:bg-primary">
                  <History className="w-4 h-4 mr-2" />
                  History
                </TabsTrigger>
              </TabsList>

              <TabsContent value="withdraw" className="mt-6 space-y-6">
                <Card className="p-6 bg-card border-border/50 rounded-3xl space-y-4">
                  <div className="space-y-2">
                    <Label>Enter your referral code</Label>
                    <Input 
                      placeholder="HRUSHI77" 
                      value={formData.withdrawCode}
                      onChange={(e) => setFormData({...formData, withdrawCode: e.target.value})}
                      className="h-12 bg-secondary/50 rounded-xl"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Account Details (UPI/Bank)</Label>
                    <Input 
                      placeholder="Enter UPI ID or Bank details" 
                      value={formData.accountDetails}
                      onChange={(e) => setFormData({...formData, accountDetails: e.target.value})}
                      className="h-12 bg-secondary/50 rounded-xl"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className={cn(isAmountInvalid && "text-red-500 font-bold")}>
                      Enter withdraw amount
                    </Label>
                    <Input 
                      placeholder="e.g. 5000" 
                      type="number"
                      inputMode="numeric"
                      value={formData.withdrawAmount}
                      onChange={(e) => setFormData({...formData, withdrawAmount: e.target.value})}
                      className={cn(
                        "h-12 bg-secondary/50 rounded-xl transition-all",
                        isAmountInvalid && "border-red-500 bg-red-500/10 text-red-500"
                      )}
                    />
                    {isAmountInvalid && (
                      <p className="text-[10px] text-red-500 font-bold uppercase tracking-wider animate-pulse">
                        Amount exceeds available balance
                      </p>
                    )}
                  </div>
                  <Button 
                    disabled={isAmountInvalid || !formData.withdrawAmount || parseFloat(formData.withdrawAmount) <= 0}
                    className={cn(
                      "w-full h-14 rounded-2xl font-bold transition-all shadow-gold",
                      isAmountInvalid && "opacity-50 grayscale cursor-not-allowed shadow-none"
                    )}
                  >
                    Withdraw Amount
                  </Button>
                </Card>

                <div className="space-y-3">
                  <h3 className="text-sm font-bold flex items-center gap-2 px-2">
                    <Clock className="w-4 h-4 text-orange-500" />
                    Pending Requests
                  </h3>
                  <Card className="p-4 bg-card border-orange-500/20 rounded-2xl flex justify-between items-center">
                    <div>
                      <p className="font-bold">₹2,500.00</p>
                      <p className="text-[10px] text-muted-foreground uppercase tracking-widest">Withdrawal Request</p>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] bg-orange-500/10 text-orange-500 px-3 py-1 rounded-full font-bold uppercase tracking-widest border border-orange-500/20">
                        Pending
                      </span>
                      <p className="text-[10px] text-muted-foreground mt-1">16 Jan, 2026</p>
                    </div>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="history" className="mt-6 space-y-4">
                <h3 className="text-sm font-bold flex items-center gap-2 px-2">
                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                  Withdraw History
                </h3>
                <div className="space-y-3">
                  {[1, 2].map((i) => (
                    <Card key={i} className="p-4 bg-card border-green-500/20 rounded-2xl flex justify-between items-center">
                      <div>
                        <p className="font-bold">₹5,000.00</p>
                        <p className="text-[10px] text-muted-foreground uppercase tracking-widest">Paid to UPI ID</p>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] bg-green-500/10 text-green-500 px-3 py-1 rounded-full font-bold uppercase tracking-widest border border-green-500/20">
                          Paid
                        </span>
                        <p className="text-[10px] text-muted-foreground mt-1">10 Jan, 2026</p>
                      </div>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        )}
      </div>
    </div>
  );
};

export default CheckEarningPage;
