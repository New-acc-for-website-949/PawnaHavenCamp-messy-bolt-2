import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths, isWeekend } from 'date-fns';
import { cn } from '@/lib/utils';

const OwnerDashboard = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  
  // Mock data for availability: true = Available, false = Booked
  const [availability, setAvailability] = useState<Record<string, boolean>>({
    '2026-01-18': false,
    '2026-01-19': false,
  });

  const days = eachDayOfInterval({
    start: startOfMonth(currentDate),
    end: endOfMonth(currentDate),
  });

  const getDayStatus = (date: Date) => {
    const key = format(date, 'yyyy-MM-dd');
    return availability[key] !== false; // Default true (Available)
  };

  const toggleAvailability = () => {
    const key = format(selectedDate, 'yyyy-MM-dd');
    setAvailability({
      ...availability,
      [key]: !getDayStatus(selectedDate)
    });
  };

  // Weekend logic: Sat-Sun are weekends, Mon-Fri are weekdays
  const isSelectedWeekend = isWeekend(selectedDate);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-xl font-bold text-[#D4AF37]">Availability</h2>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="icon" className="border-[#D4AF37]/20 text-[#D4AF37] hover:bg-[#D4AF37]/10" onClick={() => setCurrentDate(subMonths(currentDate, 1))}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="font-semibold text-sm text-[#D4AF37]">
            {format(currentDate, 'MMMM yyyy')}
          </span>
          <Button variant="outline" size="icon" className="border-[#D4AF37]/20 text-[#D4AF37] hover:bg-[#D4AF37]/10" onClick={() => setCurrentDate(addMonths(currentDate, 1))}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <Card className="bg-[#1A1A1A] border-[#D4AF37]/20 shadow-xl">
        <CardContent className="p-4">
          <div className="grid grid-cols-7 gap-2">
            {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(day => (
              <div key={day} className="text-center text-xs font-medium text-gray-500">{day}</div>
            ))}
            {days.map((day) => (
              <div
                key={day.toString()}
                onClick={() => setSelectedDate(day)}
                className={`
                  aspect-square flex items-center justify-center rounded-md cursor-pointer text-sm font-medium transition-all
                  ${!isSameMonth(day, currentDate) ? 'opacity-10' : ''}
                  ${isSameDay(day, selectedDate) ? 'ring-2 ring-[#D4AF37] ring-offset-2 ring-offset-black' : ''}
                  ${getDayStatus(day) ? 'bg-[#00FF00] text-black shadow-[0_0_10px_rgba(0,255,0,0.3)]' : 'bg-[#FF0000] text-white shadow-[0_0_10px_rgba(255,0,0,0.3)]'}
                `}
              >
                {format(day, 'd')}
              </div>
            ))}
          </div>

          <div className="mt-4 flex justify-center space-x-6 text-[10px] font-bold uppercase tracking-wider">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-[#00FF00] rounded-full shadow-[0_0_5px_#00FF00]" />
              <span className="text-[#00FF00]">Available</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-[#FF0000] rounded-full shadow-[0_0_5px_#FF0000]" />
              <span className="text-[#FF0000]">Booked</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-[#1A1A1A] border-[#D4AF37]/20 shadow-xl">
        <CardContent className="p-4">
          <div className="flex flex-col space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-[10px] uppercase tracking-widest text-gray-400 mb-1">Status for</p>
                <p className="font-bold text-white text-lg">{format(selectedDate, 'EEEE, MMM do')}</p>
                <p className="text-[10px] text-[#D4AF37] uppercase">{isSelectedWeekend ? 'Weekend (Sat-Sun)' : 'Weekday (Mon-Fri)'}</p>
              </div>
              <div className="flex items-center space-x-3">
                <Label htmlFor="status" className={cn(
                  "text-xs font-bold uppercase transition-colors",
                  getDayStatus(selectedDate) ? "text-[#00FF00]" : "text-[#FF0000]"
                )}>
                  {getDayStatus(selectedDate) ? 'Available' : 'Booked'}
                </Label>
                <Switch 
                  id="status" 
                  checked={getDayStatus(selectedDate)} 
                  onCheckedChange={toggleAvailability}
                  className="data-[state=checked]:bg-[#00FF00] data-[state=unchecked]:bg-[#FF0000]"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OwnerDashboard;
