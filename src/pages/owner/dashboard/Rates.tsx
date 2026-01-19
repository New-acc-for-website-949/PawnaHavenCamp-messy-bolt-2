import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Plus, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

const OwnerRates = () => {
  const [rates, setRates] = useState({
    weekday: '1499',
    weekend: '3999'
  });

  const [customRates, setCustomRates] = useState<{ id: string, date: string, price: string }[]>([]);

  useEffect(() => {
    const savedRates = localStorage.getItem('propertyRates');
    if (savedRates) {
      const parsed = JSON.parse(savedRates);
      if (parsed.rates) setRates(parsed.rates);
      if (parsed.customRates) setCustomRates(parsed.customRates);
    }
  }, []);

  const handleSave = () => {
    localStorage.setItem('propertyRates', JSON.stringify({ rates, customRates }));
    // Dispatch storage event manually for same-page updates in Main.tsx
    window.dispatchEvent(new Event('storage'));
    toast.success('Rates updated successfully');
  };

  const addSpecialDate = () => {
    const today = new Date().toISOString().split('T')[0];
    setCustomRates([...customRates, { id: Math.random().toString(36).substr(2, 9), date: today, price: '0' }]);
  };

  const removeSpecialDate = (id: string) => {
    setCustomRates(customRates.filter(r => r.id !== id));
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-[#D4AF37]">Prices / Rates</h2>

      <Card className="bg-[#1A1A1A] border-[#D4AF37]/20">
        <CardHeader>
          <CardTitle className="text-sm text-[#D4AF37]">Base Rates</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label className="text-gray-300">Weekday Rate (Mon–Fri)</Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#D4AF37]">₹</span>
              <Input 
                className="pl-7 bg-black/40 border-[#D4AF37]/20 text-white focus:border-[#D4AF37]" 
                type="number" 
                inputMode="numeric"
                pattern="[0-9]*"
                value={rates.weekday} 
                onChange={e => setRates({...rates, weekday: e.target.value})}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label className="text-gray-300">Weekend Rate (Sat–Sun)</Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#D4AF37]">₹</span>
              <Input 
                className="pl-7 bg-black/40 border-[#D4AF37]/20 text-white focus:border-[#D4AF37]" 
                type="number" 
                inputMode="numeric"
                pattern="[0-9]*"
                value={rates.weekend} 
                onChange={e => setRates({...rates, weekend: e.target.value})}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-[#1A1A1A] border-[#D4AF37]/20">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm text-[#D4AF37]">Special Date Prices</CardTitle>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={addSpecialDate}
            className="h-7 text-[10px] border-[#D4AF37]/40 text-[#D4AF37] hover:bg-[#D4AF37]/10"
          >
            <Plus className="w-3 h-3 mr-1" /> Add Date
          </Button>
        </CardHeader>
        <CardContent className="space-y-3">
          {customRates.map((cr) => (
            <div key={cr.id} className="flex items-center space-x-2">
              <Input 
                type="date" 
                className="flex-1 bg-black/40 border-[#D4AF37]/20 text-white h-8 text-xs" 
                value={cr.date}
                onChange={e => {
                  const newRates = [...customRates];
                  const index = newRates.findIndex(r => r.id === cr.id);
                  newRates[index].date = e.target.value;
                  setCustomRates(newRates);
                }}
              />
              <div className="w-24 relative">
                <span className="absolute left-2 top-1/2 -translate-y-1/2 text-[#D4AF37] text-xs">₹</span>
                <Input 
                  className="pl-5 h-8 text-sm bg-black/40 border-[#D4AF37]/20 text-white" 
                  type="number"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  value={cr.price} 
                  onChange={e => {
                    const newRates = [...customRates];
                    const index = newRates.findIndex(r => r.id === cr.id);
                    newRates[index].price = e.target.value;
                    setCustomRates(newRates);
                  }}
                />
              </div>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8 text-red-400 hover:text-red-300"
                onClick={() => removeSpecialDate(cr.id)}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          ))}
          {customRates.length === 0 && (
            <p className="text-center text-xs text-gray-500 py-4">No special dates added</p>
          )}
        </CardContent>
      </Card>

      <Button onClick={handleSave} className="w-full bg-[#D4AF37] hover:bg-[#B8860B] text-black font-bold h-12 shadow-xl mt-4">
        Save Rates
      </Button>
    </div>
  );
};

export default OwnerRates;
