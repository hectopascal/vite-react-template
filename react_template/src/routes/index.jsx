import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Login from '../components/auth/Login';
import Register from '../components/auth/Register';
import Dashboard from '../components/dashboard/Dashboard';
import VideoUpload from '../components/analysis/VideoUpload';
import VideoAnalysis from '../components/analysis/VideoAnalysis';
import RealTimeAnalysis from '../components/analysis/RealTimeAnalysis';
import TrainingProgram from '../components/training/TrainingProgram';
import SessionDetail from '../components/training/SessionDetail';
import PerformanceTracker from '../components/performance/PerformanceTracker';

// Protected route component
function ProtectedRoute({ children }) {
  const { currentUser } = useAuth();
  
  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
}

function AppRoutes() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      
      {/* Protected routes */}
      <Route 
        path="/dashboard" 
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/analysis/upload" 
        element={
          <ProtectedRoute>
            <VideoUpload />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/analysis/videos/:videoId" 
        element={
          <ProtectedRoute>
            <VideoAnalysis />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/analysis/videos" 
        element={
          <ProtectedRoute>
            <VideoAnalysis />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/analysis/realtime" 
        element={
          <ProtectedRoute>
            <RealTimeAnalysis />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/training" 
        element={
          <ProtectedRoute>
            <TrainingProgram />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/training/:programId" 
        element={
          <ProtectedRoute>
            <TrainingProgram />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/training/session/:sessionId" 
        element={
          <ProtectedRoute>
            <SessionDetail />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/performance" 
        element={
          <ProtectedRoute>
            <PerformanceTracker />
          </ProtectedRoute>
        } 
      />
      
      {/* Redirect root to dashboard if logged in, otherwise to login */}
      <Route 
        path="/" 
        element={
          <Navigate to="/dashboard" replace />
        } 
      />
      
      {/* Catch all other routes and redirect to dashboard */}
      <Route 
        path="*" 
        element={
          <Navigate to="/dashboard" replace />
        } 
      />
    </Routes>
  );
}

export default AppRoutes;