import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, User, Phone } from 'lucide-react';

const OwnerBookings = () => {
  const bookings = [
    {
      id: 'BK-1001',
      guest: 'Amit Sharma',
      property: 'Luxury Dome Resort',
      checkIn: 'Jan 18, 2026',
      checkOut: 'Jan 20, 2026',
      status: 'Check-in Today',
      amount: '₹14,998',
    },
    {
      id: 'BK-1002',
      guest: 'Priya Patel',
      property: 'Wooden Cottage',
      checkIn: 'Jan 19, 2026',
      checkOut: 'Jan 21, 2026',
      status: 'Upcoming',
      amount: '₹7,998',
    },
    {
      id: 'BK-1003',
      guest: 'Rahul Verma',
      property: 'Private Villa',
      checkIn: 'Jan 15, 2026',
      checkOut: 'Jan 17, 2026',
      status: 'Completed',
      amount: '₹24,000',
    }
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Bookings</h1>

      <div className="space-y-4">
        {bookings.map((booking) => (
          <Card key={booking.id}>
            <CardContent className="p-4 space-y-3">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-xs text-gray-500 font-medium">{booking.id}</p>
                  <h3 className="font-bold text-lg">{booking.guest}</h3>
                </div>
                <Badge variant={booking.status === 'Check-in Today' ? 'default' : 'secondary'}>
                  {booking.status}
                </Badge>
              </div>

              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="flex items-center space-x-2 text-gray-600">
                  <Calendar className="w-4 h-4" />
                  <span>{booking.checkIn}</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-600">
                  <User className="w-4 h-4" />
                  <span>2 Adults</span>
                </div>
              </div>

              <div className="pt-2 border-t flex justify-between items-center">
                <p className="text-sm font-semibold">{booking.property}</p>
                <p className="font-bold text-blue-600">{booking.amount}</p>
              </div>

              <div className="flex space-x-2">
                <Button variant="outline" size="sm" className="flex-1">Details</Button>
                <Button variant="outline" size="sm" className="flex-1 text-green-600">
                  <Phone className="w-3 h-3 mr-1" /> Call
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default OwnerBookings;
