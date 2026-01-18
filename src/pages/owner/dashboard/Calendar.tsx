import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerFooter, DrawerClose } from '@/components/ui/drawer';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths } from 'date-fns';

const OwnerCalendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Mock data for availability
  const mockAvailability: Record<string, 'available' | 'booked' | 'blocked'> = {
    '2026-01-18': 'booked',
    '2026-01-19': 'booked',
    '2026-01-20': 'blocked',
    '2026-01-25': 'booked',
  };

  const days = eachDayOfInterval({
    start: startOfMonth(currentDate),
    end: endOfMonth(currentDate),
  });

  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
    setIsDrawerOpen(true);
  };

  const getStatusColor = (date: Date) => {
    const key = format(date, 'yyyy-MM-dd');
    const status = mockAvailability[key] || 'available';
    switch (status) {
      case 'booked': return 'bg-red-500 text-white';
      case 'blocked': return 'bg-yellow-500 text-white';
      default: return 'bg-green-500 text-white';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Availability</h1>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="icon" onClick={() => setCurrentDate(subMonths(currentDate, 1))}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="font-semibold min-w-[120px] text-center">
            {format(currentDate, 'MMMM yyyy')}
          </span>
          <Button variant="outline" size="icon" onClick={() => setCurrentDate(addMonths(currentDate, 1))}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-7 gap-2 mb-4">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="text-center text-xs font-medium text-gray-500">{day}</div>
            ))}
            {days.map((day, i) => (
              <div
                key={day.toString()}
                onClick={() => handleDateClick(day)}
                className={`
                  aspect-square flex items-center justify-center rounded-md cursor-pointer text-sm font-medium transition-colors
                  ${!isSameMonth(day, currentDate) ? 'opacity-20' : ''}
                  ${getStatusColor(day)}
                `}
              >
                {format(day, 'd')}
              </div>
            ))}
          </div>

          <div className="flex justify-center space-x-4 text-xs">
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 bg-green-500 rounded-full" />
              <span>Available</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 bg-red-500 rounded-full" />
              <span>Booked</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 bg-yellow-500 rounded-full" />
              <span>Blocked</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>
              {selectedDate && format(selectedDate, 'EEEE, MMMM do')}
            </DrawerTitle>
          </DrawerHeader>
          <div className="p-4 space-y-4">
            <div className="space-y-2">
              <Label>Status</Label>
              <Select defaultValue="available">
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="available">Available</SelectItem>
                  <SelectItem value="blocked">Blocked</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Custom Price (Optional)</Label>
              <Input type="number" placeholder="Enter custom price for this day" />
            </div>
          </div>
          <DrawerFooter>
            <Button onClick={() => setIsDrawerOpen(false)}>Save Changes</Button>
            <DrawerClose asChild>
              <Button variant="outline">Cancel</Button>
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </div>
  );
};

export default OwnerCalendar;
