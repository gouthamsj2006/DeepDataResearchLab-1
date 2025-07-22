import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import HireDeckHeader from '../components/HireDeck/HireDeckHeader';
import HireDeckDashboard from '../components/HireDeck/HireDeckDashboard';
import HRSignup from '../components/HireDeck/HRSignup';
import StudentSignup from '../components/HireDeck/StudentSignup';

type ViewMode = 'dashboard' | 'hr-signup' | 'student-signup';

export default function HireDeckPage() {
  const [currentView, setCurrentView] = useState<ViewMode>('dashboard');

  const handleHRSignup = () => {
    setCurrentView('hr-signup');
  };

  const handleStudentSignup = () => {
    setCurrentView('student-signup');
  };

  const handleSignupSuccess = () => {
    setCurrentView('dashboard');
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <HireDeckHeader 
        onHRSignup={handleHRSignup}
        onStudentSignup={handleStudentSignup}
      />
      
      <AnimatePresence mode="wait">
        {currentView === 'dashboard' && (
          <motion.div
            key="dashboard"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <HireDeckDashboard />
          </motion.div>
        )}
        
        {currentView === 'hr-signup' && (
          <motion.div
            key="hr-signup"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <HRSignup onSuccess={handleSignupSuccess} />
          </motion.div>
        )}
        
        {currentView === 'student-signup' && (
          <motion.div
            key="student-signup"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <StudentSignup onSuccess={handleSignupSuccess} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}