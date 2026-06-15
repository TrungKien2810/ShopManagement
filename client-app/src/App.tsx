import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { LandingPage } from "./pages/LandingPage";
import { LoginPage } from "./pages/LoginPage";
import { RegisterPage } from "./pages/RegisterPage";
import { ShopListPage } from "./pages/ShopListPage";
import { ShopCreationPage } from "./pages/ShopCreationPage";
import { Dashboard } from "./pages/Dashboard";
import { QROrderPage } from "./pages/QROrderPage";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { MenuPage } from "./pages/MenuPage";
import { SettingsPage } from "./pages/SettingsPage";
import { BranchListPage } from "./pages/BranchListPage";

import { Toaster } from "sonner";
import { MainLayout } from "./components/layout/MainLayout";

function App() {
  return (
    <AuthProvider>
      <Toaster theme="dark" position="top-right" richColors />
      <Router>
        <Routes>
          {/* Public Routes with minimal layout */}
          <Route path="/" element={<MainLayout showSidebar={false}><LandingPage /></MainLayout>} />
          <Route path="/login" element={<MainLayout showSidebar={false}><LoginPage /></MainLayout>} />
          <Route path="/register" element={<MainLayout showSidebar={false}><RegisterPage /></MainLayout>} />
          <Route path="/menu" element={<MainLayout showSidebar={false}><MenuPage /></MainLayout>} />

          {/* Public QR Order */}
          <Route path="/t/:tableId" element={<MainLayout showSidebar={false}><QROrderPage /></MainLayout>} />

          {/* Cần đăng nhập nhưng chưa cần chọn quán */}
          <Route element={<ProtectedRoute requireShop={false} />}>
            <Route path="/shops" element={<MainLayout><ShopListPage /></MainLayout>} />
            <Route path="/create-shop" element={<MainLayout><ShopCreationPage /></MainLayout>} />
          </Route>

          {/* Cần đăng nhập VÀ đã chọn quán */}
          <Route element={<ProtectedRoute requireShop={true} />}>
            <Route path="/shop/:shopId/branches" element={<MainLayout><BranchListPage /></MainLayout>} />
            <Route path="/shop/:shopId/settings" element={<MainLayout><SettingsPage /></MainLayout>} />
            
            <Route path="/branch/:branchId" element={<MainLayout><Dashboard /></MainLayout>} />
            <Route path="/branch/:branchId/dashboard" element={<MainLayout><Dashboard /></MainLayout>} />
            <Route path="/branch/:branchId/tables" element={<MainLayout><Dashboard /></MainLayout>} />
            <Route path="/branch/:branchId/employees" element={<MainLayout><Dashboard /></MainLayout>} />
            <Route path="/branch/:branchId/menu" element={<MainLayout><MenuPage /></MainLayout>} />
          </Route>

          {/* Mặc định chuyển về Landing Page nếu không khớp */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
