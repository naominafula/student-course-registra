import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { isFirebaseConfigured } from "../firebase";

export default function Login() {
  const { loginWithGoogle } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      await loginWithGoogle();
      navigate("/dashboard");
    } catch (error) {
      console.error("Authentication failed:", error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-xl shadow-md text-center">
        <h2 className="text-3xl font-extrabold text-gray-900">EduReg Portal</h2>
        <p className="text-gray-500">Sign in to manage your course registrations</p>
        {!isFirebaseConfigured && (
          <div className="rounded-lg bg-yellow-50 border border-yellow-200 text-yellow-900 p-4 text-sm mb-4">
            Firebase is not configured. Copy <code className="font-mono">.env.example</code> to <code className="font-mono">.env</code>, fill in your Firebase values, then restart the dev server.
          </div>
        )}
        <button
          type="button"
          onClick={handleLogin}
          disabled={!isFirebaseConfigured}
          className={`w-full flex items-center justify-center gap-3 px-4 py-3 border rounded-lg text-gray-700 bg-white hover:bg-gray-50 font-medium shadow-sm transition ${!isFirebaseConfigured ? "opacity-50 cursor-not-allowed border-gray-200" : "border-gray-300"}`}
        >
          <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-5 h-5"/>
          Continue with Google
        </button>
      </div>
    </div>
  );
}















