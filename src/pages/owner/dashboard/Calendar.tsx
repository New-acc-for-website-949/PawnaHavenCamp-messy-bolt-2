import React, { useState, useEffect } from 'react';
import { CalendarSync } from "@/components/CalendarSync";

const OwnerCalendar = () => {
  const [propertyId, setPropertyId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const ownerDataString = localStorage.getItem('ownerData');
    if (ownerDataString) {
      const ownerData = JSON.parse(ownerDataString);
      setPropertyId(ownerData.property_id || ownerData.propertyId);
    }
    setLoading(false);
  }, []);

  if (loading) return <div className="p-8 text-center text-gold">Loading calendar...</div>;

  return (
    <div className="space-y-6 w-full px-2 sm:px-0">
      <div className="flex flex-col space-y-1">
        <h1 className="text-2xl font-bold text-[#D4AF37] font-display">Availability</h1>
        <p className="text-[10px] text-gray-400 italic">
          * Toggle future dates. Past dates frozen.
        </p>
      </div>

      <div className="w-full">
        {propertyId ? (
          <CalendarSync propertyId={propertyId} isAdmin={true} />
        ) : (
          <div className="p-12 text-center text-gray-500 glass rounded-3xl">
            No property linked to this account.
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-2 text-[10px] font-bold uppercase tracking-tighter">
        <div className="flex items-center justify-center space-x-2 bg-black/40 p-2 rounded-xl border border-[#00FF00]/20">
          <div className="w-2 h-2 bg-[#00FF00] rounded-full" />
          <span className="text-[#00FF00]">Available</span>
        </div>
        <div className="flex items-center justify-center space-x-2 bg-black/40 p-2 rounded-xl border border-[#FF0000]/20">
          <div className="w-2 h-2 bg-[#FF0000] rounded-full" />
          <span className="text-[#FF0000]">Booked</span>
        </div>
      </div>
    </div>
  );
};

export default OwnerCalendar;
