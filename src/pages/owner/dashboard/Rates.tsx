import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

const OwnerRates = () => {
  const [rates, setRates] = useState({
    weekday: '',
    weekend: '',
    price_note: ''
  });
  const [loading, setLoading] = useState(true);
  const [propertyId, setPropertyId] = useState<string | null>(null);

  useEffect(() => {
    const fetchRates = async () => {
      const ownerDataString = localStorage.getItem('ownerData');
      if (!ownerDataString) return;
      const ownerData = JSON.parse(ownerDataString);
      const id = ownerData.property_id || ownerData.propertyId;
      setPropertyId(id);

      try {
        const response = await fetch(`/api/properties/${id}`);
        const result = await response.json();
        if (result.success) {
          const prop = result.data;
          setRates({
            weekday: prop.weekday_price || prop.price || '',
            weekend: prop.weekend_price || '',
            price_note: prop.price_note || ''
          });
        }
      } catch (error) {
        console.error('Error fetching rates:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchRates();
  }, []);

  const handleSave = async () => {
    if (!propertyId) return;
    
    try {
      const token = localStorage.getItem('ownerToken') || localStorage.getItem('adminToken');
      const response = await fetch(`/api/properties/${propertyId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          weekday_price: rates.weekday,
          weekend_price: rates.weekend,
          price_note: rates.price_note,
          price: rates.weekday // Use weekday as base price
        })
      });
      
      if (response.ok) {
        toast.success('Rates updated successfully and synced with all calendars.');
      } else {
        toast.error('Failed to update rates.');
      }
    } catch (error) {
      toast.error('Error updating rates.');
    }
  };

  if (loading) return <div className="p-8 text-center text-[#D4AF37]">Loading rates...</div>;

  return (
    <div className="space-y-6 max-w-2xl mx-auto px-4 sm:px-0">
      <h1 className="text-2xl font-bold text-[#D4AF37] font-display">Manage Prices & Rates</h1>
      
      <Card className="glass border-[#D4AF37]/30 bg-black/40">
        <CardContent className="pt-6 space-y-4">
          <div className="space-y-2">
            <Label className="text-[#D4AF37] text-xs font-bold uppercase tracking-widest">Weekday Price (Mon - Fri)</Label>
            <div className="relative">
              <span className="absolute left-3 top-2.5 text-gray-400">₹</span>
              <Input 
                type="text" 
                className="pl-7 bg-black/60 border-[#D4AF37]/20 text-white" 
                value={rates.weekday}
                onChange={(e) => setRates({...rates, weekday: e.target.value})}
                placeholder="e.g. 7499"
              />
            </div>
            <p className="text-[10px] text-gray-500 italic">* Automatically shows in calendar cells for weekdays.</p>
          </div>

          <div className="space-y-2">
            <Label className="text-[#D4AF37] text-xs font-bold uppercase tracking-widest">Weekend Price (Sat - Sun)</Label>
            <div className="relative">
              <span className="absolute left-3 top-2.5 text-gray-400">₹</span>
              <Input 
                type="text" 
                className="pl-7 bg-black/60 border-[#D4AF37]/20 text-white" 
                value={rates.weekend}
                onChange={(e) => setRates({...rates, weekend: e.target.value})}
                placeholder="e.g. 8999"
              />
            </div>
            <p className="text-[10px] text-gray-500 italic">* Automatically shows in calendar cells for weekends.</p>
          </div>

          <div className="space-y-2">
            <Label className="text-[#D4AF37] text-xs font-bold uppercase tracking-widest">Price Note</Label>
            <Input 
              type="text" 
              className="bg-black/60 border-[#D4AF37]/20 text-white" 
              value={rates.price_note}
              onChange={(e) => setRates({...rates, price_note: e.target.value})}
              placeholder="e.g. per person with meals"
            />
          </div>

          <Button 
            className="w-full bg-[#D4AF37] hover:bg-[#B8962E] text-black font-bold mt-4 h-12 rounded-xl"
            onClick={handleSave}
          >
            Update Rates & Sync Calendars
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default OwnerRates;
