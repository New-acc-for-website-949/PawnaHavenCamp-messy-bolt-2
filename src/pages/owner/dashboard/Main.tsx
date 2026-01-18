import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Users, CalendarDays, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';

const OwnerDashboard = () => {
  const [emergencyBlock, setEmergencyBlock] = useState(false);

  const stats = [
    { label: 'Today Arrivals', value: '4', icon: Users, color: 'text-blue-600' },
    { label: 'Current Guests', value: '12', icon: TrendingUp, color: 'text-green-600' },
    { label: 'Pending Bookings', value: '3', icon: CalendarDays, color: 'text-orange-600' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Owner Dashboard</h1>
        <Badge variant="outline" className="text-green-600 border-green-200 bg-green-50">Live</Badge>
      </div>

      <Card className="border-red-100 bg-red-50/50">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="text-red-500 w-5 h-5" />
              <div>
                <Label htmlFor="emergency" className="font-semibold text-red-700">Emergency Block</Label>
                <p className="text-xs text-red-600">Instantly stop all new bookings</p>
              </div>
            </div>
            <Switch
              id="emergency"
              checked={emergencyBlock}
              onCheckedChange={setEmergencyBlock}
            />
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardContent className="pt-6 flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">{stat.label}</p>
                <p className="text-2xl font-bold">{stat.value}</p>
              </div>
              <stat.icon className={cn("w-8 h-8 opacity-20", stat.color)} />
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Property Status Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center py-2 border-b">
              <span className="text-sm">Glamping Domes</span>
              <Badge>3/5 Available</Badge>
            </div>
            <div className="flex justify-between items-center py-2 border-b">
              <span className="text-sm">Luxury Cottages</span>
              <Badge>1/2 Available</Badge>
            </div>
            <div className="flex justify-between items-center py-2 border-b">
              <span className="text-sm">Private Villa</span>
              <Badge variant="destructive">Booked</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OwnerDashboard;
