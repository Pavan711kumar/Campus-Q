import { Navigate, Route, Routes } from 'react-router-dom';
import { CartProvider } from './context/CartContext.jsx';
import { ToastProvider } from './components/ui/Toast.jsx';
import { AppLayout } from './components/Layout.jsx';
import { ProtectedRoute } from './components/ProtectedRoute.jsx';
import LandingPage from './pages/LandingPage.jsx';
import LoginPage from './pages/auth/LoginPage.jsx';
import SignupPage from './pages/auth/SignupPage.jsx';
import StudentDashboard from './pages/student/StudentDashboard.jsx';
import MenuPage from './pages/student/MenuPage.jsx';
import CartPage from './pages/student/CartPage.jsx';
import CheckoutPage from './pages/student/CheckoutPage.jsx';
import OrdersPage from './pages/student/OrdersPage.jsx';
import CanteenDashboard from './pages/canteen/CanteenDashboard.jsx';
import IncomingOrdersPage from './pages/canteen/IncomingOrdersPage.jsx';
import MenuManagementPage from './pages/canteen/MenuManagementPage.jsx';
import AdminDashboard from './pages/admin/AdminDashboard.jsx';

export default function App() {
  return (
    <ToastProvider>
      <CartProvider>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/disabled" element={<div className="page-shell grid min-h-screen place-items-center px-4 text-center"><div><h1 className="text-3xl font-black">Account disabled</h1><p className="mt-2 text-stone-600">Please contact the campus administrator.</p></div></div>} />

          <Route element={<ProtectedRoute roles={['student']} />}>
            <Route element={<AppLayout />}>
              <Route path="/student" element={<StudentDashboard />} />
              <Route path="/student/menu" element={<MenuPage />} />
              <Route path="/student/cart" element={<CartPage />} />
              <Route path="/student/checkout" element={<CheckoutPage />} />
              <Route path="/student/orders" element={<OrdersPage />} />
            </Route>
          </Route>

          <Route element={<ProtectedRoute roles={['canteen']} />}>
            <Route element={<AppLayout />}>
              <Route path="/canteen" element={<CanteenDashboard />} />
              <Route path="/canteen/orders" element={<IncomingOrdersPage />} />
              <Route path="/canteen/menu" element={<MenuManagementPage />} />
            </Route>
          </Route>

          <Route element={<ProtectedRoute roles={['admin']} />}>
            <Route element={<AppLayout />}>
              <Route path="/admin" element={<AdminDashboard />} />
            </Route>
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </CartProvider>
    </ToastProvider>
  );
}
