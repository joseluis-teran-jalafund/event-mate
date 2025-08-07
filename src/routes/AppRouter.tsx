import React from 'react';
import { BrowserRouter, Navigate, Routes, Route } from 'react-router';
import { LoginPage } from '../pages/LoginPage';
import { RegisterPage } from '../pages/RegisterPage';
import { EventsPage } from '../pages/EventsPage';
import { PrivateRoute } from './PrivateRoute';
import { AuthProvider } from '../providers/AuthProvider';
import { CreateEventPage } from '../pages/CreateEventPage';
import { EditEventPage } from '../pages/EditEventPage';
import { UserProfilePage } from '../pages/UserProfilePage';

export const AppRouter: React.FC = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/profile" element={<UserProfilePage />} />
          <Route 
            path="/events" 
            element={
              <PrivateRoute>
                <EventsPage />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/events" 
            element={
              <PrivateRoute>
                <EventsPage />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/events/new" 
            element={
              <PrivateRoute>
                <CreateEventPage />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/events/:id/edit" 
            element={
              <PrivateRoute>
                <EditEventPage />
              </PrivateRoute>
            } 
          />
          <Route path="/" element={<Navigate to="/events" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
};
