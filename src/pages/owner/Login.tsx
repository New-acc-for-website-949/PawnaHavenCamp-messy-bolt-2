import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { toast } from 'sonner';

const OwnerLogin = () => {
  const [mobile, setMobile] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState(1);
  const navigate = useNavigate();

  const handleSendOTP = (e: React.FormEvent) => {
    e.preventDefault();
    if (mobile === '9999999999') {
      setStep(2);
      toast.success('OTP sent: 000000');
    } else {
      toast.error('Invalid mobile number for demo (Use: 9999999999)');
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (otp === '000000') {
      localStorage.setItem('isOwnerLoggedIn', 'true');
      toast.success('Login successful');
      navigate('/owner/dashboard');
    } else {
      toast.error('Invalid OTP (Use: 000000)');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Owner Login</CardTitle>
          <CardDescription className="text-center">
            Access your property management dashboard
          </CardDescription>
        </CardHeader>
        <CardContent>
          {step === 1 ? (
            <form onSubmit={handleSendOTP} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Mobile Number</label>
                <Input
                  type="tel"
                  placeholder="9999999999"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
                Send OTP
              </Button>
            </form>
          ) : (
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">OTP Code</label>
                <Input
                  type="text"
                  placeholder="000000"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
                Verify & Login
              </Button>
              <Button variant="ghost" className="w-full" onClick={() => setStep(1)}>
                Change Number
              </Button>
            </form>
          )}
        </CardContent>
        <CardFooter className="flex justify-center text-sm text-gray-500">
          Demo: 9999999999 / 000000
        </CardFooter>
      </Card>
    </div>
  );
};

export default OwnerLogin;
