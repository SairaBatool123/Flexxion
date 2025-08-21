import React from 'react'
import useAuthStore from "../store/authStore";
import { useNavigate } from "react-router-dom";



function Navbar() {
    const navigate = useNavigate();
    const { user,logout } = useAuthStore();

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Loading...</h2>
        </div>
      </div>
    );
  }
    const handleLogout = () => {
      logout();
      toast.success("Logged out successfully!");
      navigate("/login");
    };
  return (
    <>
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-gray-900">Ĺ𝑜ỖקℓⓎ</h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                {user.profileImage && (
                  <img
                    src={user.profileImage}
                    alt={user.name}
                    className="w-8 h-8 rounded-full"
                  />
                )}
                <span className="text-sm font-medium text-gray-700">
                  Welcome, {user.name}!
                </span>
              </div>
              <button
                onClick={() => navigate("/profile")}
                className="text-sm text-gray-700 font-medium"
              >
                Profile
              </button>
              <button onClick={handleLogout} className="btn-secondary text-sm">
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>
    </>
  );
}

export default Navbar