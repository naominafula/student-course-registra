import { useState } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Menu, X, BookOpen, LayoutDashboard, LogOut, GraduationCap } from "lucide-react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const NavLinks = () => (
    <>
      <Link 
        to="/dashboard" 
        className="flex items-center gap-2 hover:text-indigo-600 transition"
        onClick={() => setIsOpen(false)}
      >
        <LayoutDashboard size={20} />
        <span>Dashboard</span>
      </Link>
      <Link 
        to="/courses" 
        className="flex items-center gap-2 hover:text-indigo-600 transition"
        onClick={() => setIsOpen(false)}
      >
        <BookOpen size={20} />
        <span>Available Courses</span>
      </Link>
    </>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            {/* Logo Section */}
            <div className="flex items-center gap-2 text-indigo-600 font-bold text-xl">
              <GraduationCap size={28} />
              <span className="hidden sm:block">Registration Portal</span>
            </div>

            
            <div className="hidden md:flex items-center gap-8 font-medium text-gray-600">
              <NavLinks />
            </div>

            
            <div className="flex items-center gap-4">
              <div className="hidden sm:flex items-center gap-3 pr-4 border-r border-gray-200">
                <img 
                  src={user?.photoURL} 
                  alt="Avatar" 
                  className="w-8 h-8 rounded-full border border-indigo-100" 
                />
                <span className="text-sm font-medium text-gray-700">{user?.displayName?.split(' ')[0]}</span>
              </div>
              
              <button 
                onClick={handleLogout}
                className="hidden md:flex items-center gap-2 text-gray-500 hover:text-red-600 transition"
              >
                <LogOut size={20} />
              </button>

              
              <button 
                className="md:hidden text-gray-600"
                onClick={() => setIsOpen(!isOpen)}
              >
                {isOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        
        {isOpen && (
          <div className="md:hidden bg-white border-b border-gray-200 px-4 pt-2 pb-6 flex flex-col gap-4 text-gray-600 font-medium animate-in slide-in-from-top duration-200">
            <NavLinks />
            <hr className="border-gray-100" />
            <button 
              onClick={handleLogout}
              className="flex items-center gap-2 text-red-500 pt-2"
            >
              <LogOut size={20} />
              <span>Sign Out</span>
            </button>
          </div>
        )}
      </nav>

      <main className="max-w-7xl mx-auto py-6">
        <Outlet />
      </main>
    </div>
  );
}
