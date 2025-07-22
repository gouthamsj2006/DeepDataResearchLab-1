import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Eye, EyeOff } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useAuth } from '../hooks/useAuth';
import HRSignup from './HireDeck/HRSignup';
import StudentSignup from './HireDeck/StudentSignup';

const countryCodes = [
  { code: '+91', country: 'India', flag: '🇮🇳' },
  { code: '+1', country: 'USA', flag: '🇺🇸' },
  { code: '+44', country: 'UK', flag: '🇬🇧' },
  { code: '+86', country: 'China', flag: '🇨🇳' },
  { code: '+81', country: 'Japan', flag: '🇯🇵' },
];

const degrees = [
  'B.Tech', 'M.Tech', 'B.Sc', 'M.Sc', 'BE', 'ME', 
  'BCA', 'MCA', 'BBA', 'MBA', 'BA', 'MA'
];

const signUpSchema = yup.object({
  fullName: yup.string().required('Full name is required'),
  age: yup.number().required('Age is required').min(16, 'Must be at least 16').max(100, 'Must be less than 100'),
  countryCode: yup.string().required('Country code is required'),
  phoneNumber: yup.string().required('Phone number is required'),
  email: yup.string().email('Invalid email').required('Email is required'),
  degree: yup.string().required('Degree is required'),
  password: yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
  confirmPassword: yup.string().oneOf([yup.ref('password')], 'Passwords must match').required('Confirm password is required'),
});

const signInSchema = yup.object({
  email: yup.string().email('Invalid email').required('Email is required'),
  password: yup.string().required('Password is required'),
});

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [role, setRole] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { signUp, signIn } = useAuth();

  const signUpForm = useForm({
    resolver: yupResolver(signUpSchema),
    defaultValues: {
      fullName: '',
      age: '',
      countryCode: '+91',
      phoneNumber: '',
      email: '',
      degree: '',
      password: '',
      confirmPassword: '',
    },
  });

  const signInForm = useForm({
    resolver: yupResolver(signInSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const handleSignUp = async (data: any) => {
    setLoading(true);
    setError('');
    
    try {
      const result = await signUp(data.email, data.password, {
        fullName: data.fullName,
        age: parseInt(data.age),
        phoneNumber: `${data.countryCode}${data.phoneNumber}`,
        email: data.email,
        degree: data.degree,
      });
      
      // Show success toast
      const toast = document.createElement('div');
      toast.className = 'fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50';
      toast.textContent = '✅ Successfully registered! You can now explore our courses.';
      document.body.appendChild(toast);
      setTimeout(() => document.body.removeChild(toast), 5000);
      
      onClose();
    } catch (err: any) {
      setError(err.message || 'An error occurred during sign up');
    } finally {
      setLoading(false);
    }
  };

  const handleSignIn = async (data: any) => {
    setLoading(true);
    setError('');
    
    try {
      await signIn(data.email, data.password);
      onClose();
    } catch (err: any) {
      setError(err.message || 'An error occurred during sign in');
    } finally {
      setLoading(false);
    }
  };

  const resetForms = () => {
    signUpForm.reset();
    signInForm.reset();
    setError('');
    setShowPassword(false);
    setShowConfirmPassword(false);
    setRole(null);
  };

  const handleClose = () => {
    resetForms();
    onClose();
  };

  const switchMode = () => {
    resetForms();
    setIsSignUp(!isSignUp);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          onClick={handleClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="w-[95%] max-w-[520px] bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {isSignUp ? (role === 'student' ? 'Student Sign Up' : role === 'hr' ? 'HR Sign Up' : 'Create Account') : 'Welcome Back'}
                </h2>
                <button
                  onClick={handleClose}
                  className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {error && (
                <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-700 rounded-lg text-red-700 dark:text-red-400 text-sm">
                  {error}
                </div>
              )}

              {isSignUp ? (
                role === null ? (
                  <div className="flex flex-col items-center space-y-4">
                    <p className="mb-2 text-gray-700 dark:text-gray-300">Sign up as:</p>
                    <div className="flex space-x-4">
                      <button
                        onClick={() => setRole('student')}
                        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        Student
                      </button>
                      <button
                        onClick={() => setRole('hr')}
                        className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                      >
                        HR
                      </button>
                    </div>
                  </div>
                ) : role === 'student' ? (
                  <StudentSignup onSuccess={handleClose} />
                ) : (
                  <HRSignup onSuccess={handleClose} />
                )
              ) : (
                <>
                  <form onSubmit={signInForm.handleSubmit(handleSignIn)} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Email
                      </label>
                      <input
                        {...signInForm.register('email')}
                        type="email"
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      />
                      {signInForm.formState.errors.email && (
                        <p className="text-red-500 text-xs mt-1">{signInForm.formState.errors.email.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Password
                      </label>
                      <div className="relative">
                        <input
                          {...signInForm.register('password')}
                          type={showPassword ? 'text' : 'password'}
                          className="w-full px-3 py-2 pr-10 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                      {signInForm.formState.errors.password && (
                        <p className="text-red-500 text-xs mt-1">{signInForm.formState.errors.password.message}</p>
                      )}
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium rounded-lg transition-colors"
                    >
                      {loading ? 'Signing In...' : 'Sign In'}
                    </button>
                  </form>

                  {/* User Details Summary after sign in (if available) */}
                  {/* This assumes you have access to user details in context or props. Adjust as needed. */}
                  {/* Example: */}
                  {/*
                  {user && (
                    <div className="mt-6 p-4 rounded-lg bg-gray-100 dark:bg-gray-700">
                      <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">Your Details</h3>
                      <div className="grid grid-cols-1 gap-2 text-sm">
                        <div><span className="font-medium">Name:</span> {user.user_metadata?.full_name || 'N/A'}</div>
                        <div><span className="font-medium">Email:</span> {user.email}</div>
                        <div><span className="font-medium">Phone:</span> {user.user_metadata?.phoneNumber || 'N/A'}</div>
                        <div><span className="font-medium">Degree:</span> {user.user_metadata?.degree || 'N/A'}</div>
                        <div><span className="font-medium">Selected Course:</span> {user.user_metadata?.course ? user.user_metadata.course : <span className="italic text-gray-500">No course selected</span>}</div>
                      </div>
                    </div>
                  )}
                  */}
                </>
              )}

              <div className="mt-6 text-center">
                <button
                  onClick={switchMode}
                  className="text-blue-600 dark:text-blue-400 hover:underline text-sm"
                >
                  {isSignUp ? 'Already have an account? Sign in' : "Don't have an account? Sign up"}
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}