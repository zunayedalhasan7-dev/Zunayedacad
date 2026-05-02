import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Layout from './components/Layout';
import DashboardLayout from './components/DashboardLayout';
import ScrollToTop from './components/ScrollToTop';

// Lazy load pages
const Home = React.lazy(() => import('./pages/Home'));
const Courses = React.lazy(() => import('./pages/Courses'));
const CourseDetail = React.lazy(() => import('./pages/CourseDetail'));
const Login = React.lazy(() => import('./pages/Login'));
const Register = React.lazy(() => import('./pages/Register'));
const ForgotPassword = React.lazy(() => import('./pages/ForgotPassword'));
const Products = React.lazy(() => import('./pages/Products'));
const ProductDetail = React.lazy(() => import('./pages/ProductDetail'));
const Instructors = React.lazy(() => import('./pages/Instructors'));
const EBooks = React.lazy(() => import('./pages/EBooks'));
const Dashboard = React.lazy(() => import('./pages/Dashboard'));
const AdminDashboard = React.lazy(() => import('./pages/AdminDashboard'));
const InstructorDashboard = React.lazy(() => import('./pages/InstructorDashboard'));
const Settings = React.lazy(() => import('./pages/Settings'));
const FreeCourses = React.lazy(() => import('./pages/FreeCourses'));
const Contact = React.lazy(() => import('./pages/Contact'));
const About = React.lazy(() => import('./pages/About'));
const Unauthorized = React.lazy(() => import('./pages/Unauthorized'));
const Checkout = React.lazy(() => import('./pages/Checkout'));
const LessonPlayer = React.lazy(() => import('./pages/LessonPlayer'));
const Blog = React.lazy(() => import('./pages/Blog'));
const SuccessStories = React.lazy(() => import('./pages/SuccessStories'));
const PrivacyPolicy = React.lazy(() => import('./pages/PrivacyPolicy'));
const Terms = React.lazy(() => import('./pages/Terms'));
const RefundPolicy = React.lazy(() => import('./pages/RefundPolicy'));
const NotFound = React.lazy(() => import('./pages/NotFound'));

function PrivateRoute({ children, role }: { children: React.ReactNode, role?: 'admin' | 'student' | 'instructor' }) {
  const { user, profile, loading } = useAuth();

  if (loading) return null;
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
        <ScrollToTop />
        <React.Suspense fallback={null}>
          <Routes>
            {/* App Layout */}
            <Route path="/" element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="courses" element={<Courses />} />
              <Route path="courses/:id" element={<CourseDetail />} />
              <Route path="free-courses" element={<FreeCourses />} />
              <Route path="checkout" element={<Checkout />} />
              <Route path="contact" element={<Contact />} />
              <Route path="about" element={<About />} />
              <Route path="login" element={<Login />} />
              <Route path="register" element={<Register />} />
              <Route path="forgot-password" element={<ForgotPassword />} />
              <Route path="products" element={<Products />} />
              <Route path="products/:id" element={<ProductDetail />} />
              <Route path="instructors" element={<Instructors />} />
              <Route path="ebooks" element={<EBooks />} />
              <Route path="blog" element={<Blog />} />
              <Route path="success-stories" element={<SuccessStories />} />
              <Route path="privacy-policy" element={<PrivacyPolicy />} />
              <Route path="terms" element={<Terms />} />
              <Route path="refund-policy" element={<RefundPolicy />} />
              <Route path="unauthorized" element={<Unauthorized />} />

              {/* Nested Dashboard Layout inside Main Layout */}
              <Route element={<DashboardLayout />}>
                {/* Student Dashboard */}
                <Route path="dashboard" element={
                  <PrivateRoute>
                    <Dashboard />
                  </PrivateRoute>
                } />
                
                {/* Instructor Dashboard */}
                <Route path="instructor" element={
                  <PrivateRoute role="instructor">
                    <InstructorDashboard />
                  </PrivateRoute>
                } />
                
                {/* Settings / Profile */}
                <Route path="settings" element={
                  <PrivateRoute>
                    <Settings />
                  </PrivateRoute>
                } />
                
                {/* Admin Panel */}
                <Route path="admin" element={
                  <PrivateRoute role="admin">
                    <AdminDashboard />
                  </PrivateRoute>
                } />
                <Route path="admin/:tab" element={
                  <PrivateRoute role="admin">
                    <AdminDashboard />
                  </PrivateRoute>
                } />
              </Route>
              
              <Route path="*" element={<NotFound />} />
            </Route>

            {/* No Layout Routes */}
            <Route path="/play/:courseId/:lessonId" element={
              <PrivateRoute>
                <React.Suspense fallback={null}>
                  <LessonPlayer />
                </React.Suspense>
              </PrivateRoute>
            } />
          </Routes>
        </React.Suspense>
      </BrowserRouter>
    </AuthProvider>
  );
}
