import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Layout from './components/Layout';
import DashboardLayout from './components/DashboardLayout';
import LoadingScreen from './components/LoadingScreen';

// Lazy load pages
const Home = React.lazy(() => import('./pages/Home'));
const Courses = React.lazy(() => import('./pages/Courses'));
const CourseDetail = React.lazy(() => import('./pages/CourseDetail'));
const Login = React.lazy(() => import('./pages/Login'));
const Register = React.lazy(() => import('./pages/Register'));
const Dashboard = React.lazy(() => import('./pages/Dashboard'));
const AdminDashboard = React.lazy(() => import('./pages/AdminDashboard'));
const FreeCourses = React.lazy(() => import('./pages/FreeCourses'));
const Contact = React.lazy(() => import('./pages/Contact'));
const Unauthorized = React.lazy(() => import('./pages/Unauthorized'));

function PrivateRoute({ children, role }: { children: React.ReactNode, role?: 'admin' | 'student' }) {
  const { user, profile, loading } = useAuth();

  if (loading) return <LoadingScreen />;
  if (!user) return <Navigate to="/login" replace />;
  
  // Strict role check
  if (role && profile?.role !== role) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <React.Suspense fallback={<LoadingScreen />}>
          <Routes>
            {/* App Layout */}
            <Route path="/" element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="courses" element={<Courses />} />
              <Route path="courses/:id" element={<CourseDetail />} />
              <Route path="free-courses" element={<FreeCourses />} />
              <Route path="contact" element={<Contact />} />
              <Route path="login" element={<Login />} />
              <Route path="register" element={<Register />} />
              <Route path="unauthorized" element={<Unauthorized />} />

              {/* Nested Dashboard Layout inside Main Layout */}
              <Route element={<DashboardLayout />}>
                {/* Student Dashboard */}
                <Route path="dashboard" element={
                  <PrivateRoute role="student">
                    <Dashboard />
                  </PrivateRoute>
                } />
                
                {/* Admin Panel */}
                <Route path="admin" element={
                  <PrivateRoute role="admin">
                    <AdminDashboard />
                  </PrivateRoute>
                } />
              </Route>
            </Route>
          </Routes>
        </React.Suspense>
      </BrowserRouter>
    </AuthProvider>
  );
}
