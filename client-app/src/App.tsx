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

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Public QR Order (No Login required, uses TableId) */}
          <Route path="/t/:tableId" element={<QROrderPage />} />

          {/* Cần đăng nhập nhưng chưa cần chọn quán */}
          <Route element={<ProtectedRoute requireShop={false} />}>
            <Route path="/shops" element={<ShopListPage />} />
            <Route path="/create-shop" element={<ShopCreationPage />} />
          </Route>

          {/* Cần đăng nhập VÀ đã chọn quán */}
          <Route element={<ProtectedRoute requireShop={true} />}>
            <Route path="/dashboard" element={<Dashboard />} />
          </Route>

          {/* Mặc định chuyển về Dashboard nếu không khớp */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
