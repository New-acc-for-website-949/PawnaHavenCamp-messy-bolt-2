import { useState, useEffect } from 'react';
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface CalendarSyncProps {
  propertyId: string;
  isAdmin?: boolean;
  onDateSelect?: (date: Date) => void;
}

export const CalendarSync = ({ propertyId, isAdmin = false, onDateSelect }: CalendarSyncProps) => {
  const [calendarData, setCalendarData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCalendar = async () => {
    try {
      const response = await fetch(`/api/properties/${propertyId}/calendar`);
      const result = await response.json();
      if (result.success) {
        setCalendarData(result.data);
      }
    } catch (error) {
      console.error("Failed to fetch calendar:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (propertyId) fetchCalendar();
  }, [propertyId]);

  const handleUpdate = async (date: Date, isBooked: boolean) => {
    if (!isAdmin) return;
    
    try {
      const token = localStorage.getItem('adminToken') || localStorage.getItem('ownerToken');
      const response = await fetch(`/api/properties/${propertyId}/calendar`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          date: format(date, 'yyyy-MM-dd'),
          is_booked: isBooked,
          price: null // Can be extended to support custom pricing
        })
      });
      
      if (response.ok) {
        toast.success("Calendar updated");
        fetchCalendar();
      }
    } catch (error) {
      toast.error("Failed to update calendar");
    }
  };

  return (
    <div className="p-4 bg-black/40 rounded-3xl border border-white/10">
      <Calendar
        mode="single"
        className="w-full"
        onSelect={(date) => {
          if (date && isAdmin) {
            const dateStr = format(date, 'yyyy-MM-dd');
            const current = calendarData.find(d => format(new Date(d.date), 'yyyy-MM-dd') === dateStr);
            handleUpdate(date, !current?.is_booked);
          }
          if (date && onDateSelect) onDateSelect(date);
        }}
        modifiers={{
          booked: (date) => {
            const dateStr = format(date, 'yyyy-MM-dd');
            return calendarData.find(d => format(new Date(d.date), 'yyyy-MM-dd') === dateStr)?.is_booked;
          }
        }}
        modifiersClassNames={{
          booked: "bg-red-500/20 text-red-500 line-through"
        }}
      />
    </div>
  );
};
