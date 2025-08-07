import React from 'react';
import { Navigate } from 'react-router';
import { useAuthState } from 'react-firebase-hooks/auth';
import { firebaseAuth } from '../services/firebase/FirebaseConfig';

export const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, loading] = useAuthState(firebaseAuth);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};
