

import { useAuth } from '../contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import '../firebase'; 
const Index = () => {
  const { currentUser, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-primary"></div>
      </div>
    );
  }

  return <Navigate to={currentUser ? "/dashboard" : "/login"} />;
};

export default Index;
