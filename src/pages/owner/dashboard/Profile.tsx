import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { User, LogOut, Home, Phone } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const OwnerProfile = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('isOwnerLoggedIn');
    navigate('/owner');
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">My Profile</h1>

      <Card>
        <CardContent className="pt-6 flex flex-col items-center">
          <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mb-4">
            <User className="w-12 h-12 text-gray-400" />
          </div>
          <h2 className="text-xl font-bold">John Doe</h2>
          <p className="text-sm text-gray-500">Owner, Pawna Haven Camp</p>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          <div className="divide-y">
            <div className="p-4 flex items-center space-x-3">
              <Home className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-xs text-gray-500">Property Name</p>
                <p className="text-sm font-medium">Pawna Haven Resort & Glamping</p>
              </div>
            </div>
            <div className="p-4 flex items-center space-x-3">
              <Phone className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-xs text-gray-500">Contact Number</p>
                <p className="text-sm font-medium">+91 99999 99999</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Button
        variant="destructive"
        className="w-full flex items-center justify-center space-x-2"
        onClick={handleLogout}
      >
        <LogOut className="w-4 h-4" />
        <span>Logout</span>
      </Button>
    </div>
  );
};

export default OwnerProfile;
