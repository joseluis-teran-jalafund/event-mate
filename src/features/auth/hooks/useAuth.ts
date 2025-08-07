import { useState } from 'react';
import { useNavigate } from 'react-router';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut as firebaseSignOut,
  // type User
} from 'firebase/auth';
import { firebaseAuth, googleProvider } from '../../../services/firebase/FirebaseConfig';
import { useAuthState } from 'react-firebase-hooks/auth';

export const useAuth = () => {
  const [user] = useAuthState(firebaseAuth);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const login = async ({ email, password }: { email: string; password: string }) => {
    try {
      await signInWithEmailAndPassword(firebaseAuth, email, password);
      navigate('/events');
    } catch (err) {
      setError('Invalid email or password');
    }
  };

  const register = async ({ email, password }: { email: string; password: string }) => {
    try {
      await createUserWithEmailAndPassword(firebaseAuth, email, password);
      navigate('/events');
    } catch (err) {
      setError('Registration failed. Please try again.');
    }
  };

  const loginWithGoogle = async () => {
    try {
      await signInWithPopup(firebaseAuth, googleProvider);
      navigate('/events');
    } catch (err) {
      setError('Google sign in failed');
    }
  };

  const signOut = async () => {
    try {
      await firebaseSignOut(firebaseAuth);
      navigate('/login');
    } catch (err) {
      setError('Sign out failed');
    }
  };

  return {
    user,
    login,
    register,
    loginWithGoogle,
    signOut,
    error
  };
};
