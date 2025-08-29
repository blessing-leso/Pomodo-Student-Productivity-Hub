
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { LogOut, Menu, Star, User } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";

const Navbar: React.FC = () => {
  const { currentUser, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Failed to log out', error);
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-primary">
      <div className="flex h-16 items-center px-4 md:px-6">
        <div className="flex items-center space-x-4">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden text-white">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[240px] sm:w-[300px]">
              <div className="flex flex-col space-y-4 py-4">
                <Link to="/" className="text-lg font-medium">Dashboard</Link>
                <Link to="/tasks" className="text-lg font-medium">To-Do</Link>
                <Link to="/profile" className="text-lg font-medium">Profile</Link>
                {currentUser && (
                  <Button 
                    variant="destructive" 
                    onClick={handleLogout} 
                    className="flex items-center"
                  >
                    <LogOut className="mr-2 h-4 w-4" /> Logout
                  </Button>
                )}
              </div>
            </SheetContent>
          </Sheet>
          <Link to="/" className="flex items-center text-xl font-bold text-white">
            <div className="flex items-center mr-2">
              <div className="flex items-end">
                <Star className="h-3 w-3 text-white" />
                <Star className="h-4 w-4 text-white mx-0.5" />
                <Star className="h-3 w-3 text-white" />
              </div>
            </div>
            Pomodo
          </Link>
        </div>
        <div className="ml-auto flex items-center space-x-2">
          <div className="hidden md:flex md:items-center md:space-x-4">
            <Link to="/" className="text-sm font-medium text-white">Dashboard</Link>
            <Link to="/tasks" className="text-sm font-medium text-white">To-Do</Link>
          </div>
          {currentUser ? (
            <div className="flex items-center space-x-2">
              <Link to="/profile" className="hidden md:flex">
                <Button variant="ghost" size="icon" className="text-white">
                  <User className="h-5 w-5" />
                  <span className="sr-only">Profile</span>
                </Button>
              </Link>
              <Button 
                variant="outline" 
                onClick={handleLogout} 
                className="hidden md:flex md:items-center text-black border-white"
              >
                <LogOut className="mr-2 h-4 w-4" /> Logout
              </Button>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <Link to="/login">
                <Button variant="ghost" className="text-white">Login</Button>
              </Link>
              <Link to="/signup">
                <Button variant="outline" className="text-white">Sign up</Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
