import { HashRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext"; 
import ProtectedRoute from "./components/protectedRoute";
import Navbar from "./components/Navbar";
import Login from "./Pages/Login";
import Dashboard from "./Pages/Dashboard";
import AvailableCourse from "./Pages/AvailableCourse";

export default function App() {
  return (
    <AuthProvider>
      <HashRouter>
        <Routes>
          
          <Route path="/login" element={<Login />} />

          
          <Route 
            path="/" 
            element={
              <ProtectedRoute>
                <Navbar />
              </ProtectedRoute>
            }
          >
            
            <Route index element={<Navigate to="/dashboard" replace />} />
            
            
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="courses" element={<AvailableCourse />} />
          </Route>

          
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </HashRouter>
    </AuthProvider>
  );
}
