import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/protectedRoute";
import Navbar from "./components/Navbar";
import Login from "./Pages/Login";
import Dashboard from "./Pages/Dashboard";
import AvailableCourse from "./Pages/AvailableCourse";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter basename="/student-course-registra">
        <Routes>
          {/* Public Route */}
          <Route path="/login" element={<Login />} />

          {/* Protected Routes enclosed under the Navbar layout wrapper */}
          <Route 
            path="/" 
            element={
              <ProtectedRoute>
                <Navbar />
              </ProtectedRoute>
            }
          >
            {/* Automatic root path redirection to Dashboard */}
            <Route index element={<Navigate to="/dashboard" replace />} />
            
            {/* Child endpoints rendered within the Navbar's <Outlet /> */}
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="courses" element={<AvailableCourse />} />
          </Route>

          {/* Catch-all fallback route to prevent dead space screens */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
