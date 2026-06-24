import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider }        from './context/AuthContext';
import ProtectedRoute          from './components/auth/ProtectedRoute';
import LoginPage               from './pages/LoginPage';
import RegisterPage            from './pages/RegisterPage';
import DashboardPage           from './pages/DashboardPage';
import AppointmentsPage        from './pages/AppointmentsPage';
import BookAppointmentPage     from './pages/BookAppointmentPage';
import AdminDashboardPage      from './pages/AdminDashboardPage';
import AdminAppointmentsPage   from './pages/AdminAppointmentsPage';
import AdminServicesPage       from './pages/AdminServicesPage';
import AdminUsersPage          from './pages/AdminUsersPage';
import ProfilePage             from './pages/ProfilePage';
import RecommendationsPage     from './pages/RecommendationsPage';
import AdminReviewsPage from './pages/AdminReviewsPage';
import MyReviewsPage from './pages/MyReviewsPage';
function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/"         element={<Navigate to="/login" />} />
          <Route path="/login"    element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/admin/users" element={
  <ProtectedRoute role="admin"><AdminUsersPage /></ProtectedRoute>
} />
          <Route path="/dashboard" element={
            <ProtectedRoute><DashboardPage /></ProtectedRoute>
          } />
          <Route path="/appointments" element={
            <ProtectedRoute><AppointmentsPage /></ProtectedRoute>
          } />
          <Route path="/appointments/book" element={
            <ProtectedRoute><BookAppointmentPage /></ProtectedRoute>
          } />
          <Route path="/admin/reviews" element={
            <ProtectedRoute role="admin"><AdminReviewsPage /></ProtectedRoute>
          } />
          <Route path="/admin/dashboard" element={
            <ProtectedRoute role="admin"><AdminDashboardPage /></ProtectedRoute>
          } />
          <Route path="/admin/appointments" element={
            <ProtectedRoute role="admin"><AdminAppointmentsPage /></ProtectedRoute>
          } />
          <Route path="/admin/services" element={
            <ProtectedRoute role="admin"><AdminServicesPage /></ProtectedRoute>
          } />
          <Route path="/profile" element={
            <ProtectedRoute><ProfilePage /></ProtectedRoute>
          } />
          <Route path="/recommendations" element={
            <ProtectedRoute><RecommendationsPage /></ProtectedRoute>
          } />
          <Route path="/reviews" element={
            <ProtectedRoute><MyReviewsPage /></ProtectedRoute>
          } />
        </Routes>

      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;