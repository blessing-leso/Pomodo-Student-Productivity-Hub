
import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { User, LogOut } from 'lucide-react';

const Profile: React.FC = () => {
  const { currentUser, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Failed to log out:', error);
    }
  };

  if (!currentUser) {
    return null;
  }

  return (
    <div className="animate-fadeIn mx-auto max-w-md">
      <h1 className="text-3xl font-bold mb-6">Your Profile</h1>
      
      <Card>
        <CardHeader className="text-center">
          <div className="w-24 h-24 mx-auto rounded-full bg-primary text-white flex items-center justify-center">
            <User className="h-12 w-12" />
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center">
            <p className="text-lg font-medium">{currentUser.email}</p>
            <p className="text-sm text-gray-500">Member since {new Date(currentUser.metadata.creationTime).toLocaleDateString()}</p>
          </div>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button variant="destructive" onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" /> Sign Out
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Profile;
