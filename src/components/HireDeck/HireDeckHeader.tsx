import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, User, Settings, LogOut, Building } from 'lucide-react';

interface HRUser {
  id: string;
  name: string;
  email: string;
  company_name: string;
  user_type: string;
}

interface HireDeckHeaderProps {
  onHRSignup: () => void;
  onStudentSignup: () => void;
}

export default function HireDeckHeader({ onHRSignup, onStudentSignup }: HireDeckHeaderProps) {
  const [hrUser, setHrUser] = useState<HRUser | null>(null);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);

  useEffect(() => {
    // Check for HR user in localStorage
    const storedHrUser = localStorage.getItem('hr_user');
    if (storedHrUser) {
      setHrUser(JSON.parse(storedHrUser));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('hr_user');
    setHrUser(null);
    setShowProfileDropdown(false);
    window.location.reload();
  };

  return (
    <header className="bg-white dark:bg-gray-900 shadow-lg border-b border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Brand */}
          <div className="flex items-center space-x-4">
            <img 
              src="/logo.png" 
              alt="Company Logo" 
              className="h-10 w-auto"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
              }}
            />
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                HireDeck
              </h1>
              <p className="text-xs text-gray-500 dark:text-gray-400">AI-Powered Resume Matching</p>
            </div>
          </div>

          {/* Right Side - Auth Buttons or Profile */}
          <div className="flex items-center space-x-4">
            {hrUser ? (
              /* HR Profile Dropdown */
              <div className="relative">
                <button
                  onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                  className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-white" />
                  </div>
                  <div className="text-left hidden sm:block">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{hrUser.name}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{hrUser.company_name}</p>
                  </div>
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                </button>

                <AnimatePresence>
                  {showProfileDropdown && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 z-50"
                    >
                      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                        <div className="flex items-center space-x-3">
                          <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center">
                            <User className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900 dark:text-white">{hrUser.name}</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">{hrUser.email}</p>
                            <div className="flex items-center space-x-1 mt-1">
                              <Building className="w-3 h-3 text-gray-400" />
                              <p className="text-xs text-gray-500 dark:text-gray-400">{hrUser.company_name}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="p-2">
                        <button className="w-full flex items-center space-x-2 px-3 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                          <Settings className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-700 dark:text-gray-300">Edit Profile</span>
                        </button>
                        
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center space-x-2 px-3 py-2 text-left hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors text-red-600 dark:text-red-400"
                        >
                          <LogOut className="w-4 h-4" />
                          <span className="text-sm">Sign Out</span>
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              /* Auth Buttons */
              <div className="flex items-center space-x-3">
                <motion.button
                  onClick={onStudentSignup}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-4 py-2 text-green-600 dark:text-green-400 border border-green-600 dark:border-green-400 rounded-lg hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors font-medium"
                >
                  Student Signup
                </motion.button>
                
                <motion.button
                  onClick={onHRSignup}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all font-medium shadow-lg"
                >
                  HR Signup
                </motion.button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}