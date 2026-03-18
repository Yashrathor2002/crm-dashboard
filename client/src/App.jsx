import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Sidebar from "./components/Sidebar";
import PrivateRoute from "./components/PrivateRoute";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Leads from "./pages/Leads";
import Tasks from "./pages/Tasks";
import LeadDetail from "./pages/LeadDetail";

const AppLayout = ({ children }) => {
  const location = useLocation();
  const isAuth = ["/login", "/register"].includes(location.pathname);
  const { user } = useAuth();

  if (isAuth || !user) return children;

  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-content">
        <div className="page-container page-enter">{children}</div>
      </div>
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppLayoutWrapper />
      </BrowserRouter>
    </AuthProvider>
  );
}

function AppLayoutWrapper() {
  return (
    <AppLayout>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/leads"
          element={
            <PrivateRoute>
              <Leads />
            </PrivateRoute>
          }
        />
        <Route
          path="/leads/:id"
          element={
            <PrivateRoute>
              <LeadDetail />
            </PrivateRoute>
          }
        />
        <Route
          path="/tasks"
          element={
            <PrivateRoute>
              <Tasks />
            </PrivateRoute>
          }
        />
        <Route path="*" element={<Navigate to="/dashboard" />} />
      </Routes>
    </AppLayout>
  );
}
