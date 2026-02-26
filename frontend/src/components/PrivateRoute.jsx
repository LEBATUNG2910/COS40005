// src/components/PrivateRoute.jsx
import { Navigate } from 'react-router-dom';
import { authService } from '../services/authService';

export default function PrivateRoute({ children }) {
  if (!authService.isAuthenticated()) {
    return <Navigate to="/" replace />;
  }
  return children;
}