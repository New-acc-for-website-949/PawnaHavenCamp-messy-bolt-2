import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Edit2, Save, X, LayoutGrid } from 'lucide-react';
import { toast } from 'sonner';
import { propertyAPI } from "@/lib/api";

const OwnerUnits = () => {
  const [loading, setLoading] = useState(true);
  const [property, setProperty] = useState<any>(null);
  const [units, setUnits] = useState<any[]>([]);
  const [editingUnit, setEditingUnit] = useState<any>(null);
  const [formData, setFormData] = useState<any>({
    name: '',
    available_persons: '',
    total_persons: '',
    amenities: '',
    price_per_person: ''
  });

  const fetchData = async () => {
    const ownerDataString = localStorage.getItem('ownerData');
    if (!ownerDataString) return;
    const ownerData = JSON.parse(ownerDataString);
    const id = ownerData.property_id || ownerData.propertyId;

    try {
      const token = localStorage.getItem('ownerToken') || localStorage.getItem('adminToken');
      const response = await fetch(`/api/properties/${id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const result = await response.json();
      
      if (result.success && result.data) {
        setProperty(result.data);
        if (result.data.category === 'campings_cottages') {
          const unitsRes = await propertyAPI.getUnits(id);
          if (unitsRes.success) {
            setUnits(unitsRes.data);
          }
        }
      }
    } catch (error) {
      console.error('Error fetching units:', error);
      toast.error('Failed to load units');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleEdit = (unit: any) => {
    setEditingUnit(unit);
    setFormData({
      name: unit.name || '',
      available_persons: unit.available_persons || '',
      total_persons: unit.total_persons || '',
      amenities: unit.amenities || '',
      price_per_person: unit.price_per_person || ''
    });
  };

  const handleCancel = () => {
    setEditingUnit(null);
  };

  const handleSave = async () => {
    if (!editingUnit) return;

    try {
      const result = await propertyAPI.updateUnit(editingUnit.id, {
        ...formData,
        available_persons: parseInt(formData.available_persons),
        total_persons: parseInt(formData.total_persons)
      });

      if (result.success) {
        toast.success('Unit updated successfully');
        setEditingUnit(null);
        fetchData();
      } else {
        toast.error('Failed to update unit');
      }
    } catch (error) {
      console.error('Error updating unit:', error);
      toast.error('An error occurred while updating');
    }
  };

  if (loading) return <div className="p-8 text-center text-[#D4AF37]">Loading units...</div>;

  if (property?.category !== 'campings_cottages') {
    return (
      <div className="p-8 text-center text-gray-400">
        This section is only available for camping and cottage properties.
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-full sm:max-w-4xl mx-auto px-4 sm:px-4 pb-10">
      <div className="flex items-center justify-between">
        <h1 className="text-xl sm:text-2xl font-bold text-[#D4AF37] font-display tracking-tight">Manage Units</h1>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {units.map((unit) => (
          <Card key={unit.id} className="glass border-[#D4AF37]/20 bg-black/40 rounded-2xl overflow-hidden shadow-xl">
            {editingUnit?.id === unit.id ? (
              <CardContent className="p-4 sm:p-6 space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <Label className="text-[#D4AF37] text-[10px] uppercase font-bold tracking-widest opacity-80">Unit Name</Label>
                    <Input 
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="bg-black/60 border-[#D4AF37]/20 text-white h-11 focus:border-[#D4AF37]/50"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[#D4AF37] text-[10px] uppercase font-bold tracking-widest opacity-80">Price per Person</Label>
                    <Input 
                      value={formData.price_per_person}
                      onChange={(e) => setFormData({...formData, price_per_person: e.target.value})}
                      className="bg-black/60 border-[#D4AF37]/20 text-white h-11 focus:border-[#D4AF37]/50"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[#D4AF37] text-[10px] uppercase font-bold tracking-widest opacity-80">Available Persons</Label>
                    <Input 
                      type="number"
                      value={formData.available_persons}
                      onChange={(e) => setFormData({...formData, available_persons: e.target.value})}
                      className="bg-black/60 border-[#D4AF37]/20 text-white h-11 text-green-400 font-bold focus:border-[#D4AF37]/50"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[#D4AF37] text-[10px] uppercase font-bold tracking-widest opacity-80">Total Capacity</Label>
                    <Input 
                      type="number"
                      value={formData.total_persons}
                      onChange={(e) => setFormData({...formData, total_persons: e.target.value})}
                      className="bg-black/60 border-[#D4AF37]/20 text-white h-11 text-orange-400 font-bold focus:border-[#D4AF37]/50"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-[#D4AF37] text-[10px] uppercase font-bold tracking-widest opacity-80">Amenities (comma separated)</Label>
                  <Textarea 
                    value={formData.amenities}
                    onChange={(e) => setFormData({...formData, amenities: e.target.value})}
                    className="bg-black/60 border-[#D4AF37]/20 text-white min-h-[100px] focus:border-[#D4AF37]/50"
                  />
                </div>
                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <Button onClick={handleSave} className="w-full sm:flex-1 bg-green-600 hover:bg-green-700 text-white h-11 font-bold rounded-xl transition-all">
                    <Save className="w-4 h-4 mr-2" /> Save Changes
                  </Button>
                  <Button onClick={handleCancel} variant="outline" className="w-full sm:flex-1 border-white/10 text-white hover:bg-white/5 h-11 font-bold rounded-xl transition-all">
                    <X className="w-4 h-4 mr-2" /> Cancel
                  </Button>
                </div>
              </CardContent>
            ) : (
              <CardContent className="p-5">
                <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-5">
                  <div className="space-y-2">
                    <h3 className="text-xl font-bold text-white tracking-tight">{unit.name}</h3>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-[10px] font-bold text-green-400 bg-green-400/10 px-2.5 py-1 rounded-full border border-green-400/20 uppercase tracking-wider">
                        {unit.available_persons} Available
                      </span>
                      <span className="text-[10px] font-bold text-orange-400 bg-orange-400/10 px-2.5 py-1 rounded-full border border-orange-400/20 uppercase tracking-wider">
                        {unit.total_persons} Total
                      </span>
                    </div>
                  </div>
                  <div className="w-full sm:w-auto text-left sm:text-right bg-white/5 sm:bg-transparent p-3 sm:p-0 rounded-xl">
                    <div className="text-2xl font-black text-[#D4AF37] leading-none">₹{unit.price_per_person}</div>
                    <div className="text-[10px] text-gray-500 uppercase tracking-[0.2em] mt-1 font-bold">Per Person</div>
                  </div>
                </div>
                
                {unit.amenities && (
                  <div className="mb-6">
                    <Label className="text-[10px] text-gray-500 uppercase font-bold tracking-[0.2em] mb-2.5 block opacity-60">Amenities</Label>
                    <div className="flex flex-wrap gap-2">
                      {unit.amenities.split(',').map((am: string, i: number) => (
                        <span key={i} className="text-[10px] bg-white/5 text-gray-300 px-3 py-1.5 rounded-lg border border-white/10 font-medium transition-colors hover:border-[#D4AF37]/20">
                          {am.trim()}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <Button 
                  onClick={() => handleEdit(unit)}
                  className="w-full bg-[#D4AF37]/5 hover:bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/20 h-11 rounded-xl font-bold transition-all shadow-lg"
                >
                  <Edit2 className="w-4 h-4 mr-2" /> Edit Unit Details
                </Button>
              </CardContent>
            )}
          </Card>
        ))}

        {units.length === 0 && (
          <div className="text-center py-16 glass border border-white/5 rounded-2xl bg-black/20">
            <LayoutGrid className="w-12 h-12 text-gray-700 mx-auto mb-4 opacity-50" />
            <p className="text-gray-500 font-medium italic">No units found for this property.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default OwnerUnits;
