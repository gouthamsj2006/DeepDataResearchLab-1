import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Camera, Save, Loader2, LogOut } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { supabase } from '../lib/supabase';
import ImageUploader from './ImageUploader';

interface ProfilePopupProps {
  isOpen: boolean;
  onClose: () => void;
  userProfile: any;
  onProfileUpdate: (profile: any) => void;
  onSignOut: () => Promise<void>;
}

export default function ProfilePopup({ isOpen, onClose, userProfile, onProfileUpdate, onSignOut }: ProfilePopupProps) {
  const [loading, setLoading] = useState(false);
  const [showImageUploader, setShowImageUploader] = useState(false);
  const [course, setCourse] = useState('Loading...');
  const [formData, setFormData] = useState({
    name: '',
    phone: ''
  });

  const { user } = useAuth();

  // Fetch user profile and selected course
  useEffect(() => {
    if (!user?.id) return;

    const fetchProfile = async () => {
      const { data: profile } = await supabase
        .from('user_profiles')
        .select('full_name, phone_number, id')
        .eq('auth_user_id', user.id)
        .single();

      if (profile) {
        setFormData({
          name: profile.full_name,
          phone: profile.phone_number,
        });

        // Try enrollment tables one by one
        const enrollmentTables = [
          'data_engineering_enrollments',
          'service_delivery_enrollments',
          'dba_enrollments',
          'devops_enrollments',
          'business_analysis_enrollments',
        ];

        for (const table of enrollmentTables) {
          const { data } = await supabase
            .from(table)
            .select('selected_course')
            .eq('user_id', profile.id)
            .maybeSingle();

          if (data?.selected_course) {
            setCourse(data.selected_course);
            return;
          }
        }

        setCourse('No Enrollment');
      }
    };

    fetchProfile();
  }, [user?.id]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    if (!user) return;
    setLoading(true);

    try {
      const { error } = await supabase
        .from('user_profiles')
        .update({
          full_name: formData.name,
          phone_number: formData.phone,
        })
        .eq('auth_user_id', user.id);

      if (error) throw error;

      onProfileUpdate({ ...userProfile, ...formData });
      const toast = document.createElement('div');
      toast.className = 'fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50';
      toast.textContent = '✅ Profile updated successfully!';
      document.body.appendChild(toast);
      setTimeout(() => document.body.removeChild(toast), 3000);
      onClose();
    } catch (error: any) {
      const toast = document.createElement('div');
      toast.className = 'fixed top-4 right-4 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg z-50';
      toast.textContent = '❌ Failed to update profile';
      document.body.appendChild(toast);
      setTimeout(() => document.body.removeChild(toast), 3000);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.reload(); // or navigate to home/login
  };

  if (!userProfile) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="w-full max-w-md bg-white dark:bg-gray-800 rounded-xl shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">My Profile</h2>
                <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Profile Picture */}
              <div className="flex items-center space-x-4 mb-4">
                <div className="relative">
                  <img
                    src={userProfile.photo_url || '/default-avatar.png'}
                    alt="Profile"
                    className="h-20 w-20 rounded-full object-cover border-4 border-gray-200 dark:border-gray-600"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = '/default-avatar.png';
                    }}
                  />
                  <button
                    onClick={() => setShowImageUploader(true)}
                    className="absolute -bottom-2 -right-2 p-2 bg-blue-600 hover:bg-blue-700 rounded-full shadow-lg"
                  >
                    <Camera className="w-4 h-4 text-white" />
                  </button>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">Profile Picture</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Click to update</p>
                </div>
              </div>

              {/* Form Fields */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Full Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Phone Number</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
                  <input
                    type="email"
                    value={userProfile.email}
                    readOnly
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-100 dark:bg-gray-600 text-gray-700 dark:text-gray-300 cursor-not-allowed"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Selected Course</label>
                  <input
                    type="text"
                    value={course}
                    readOnly
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-100 dark:bg-gray-600 text-gray-700 dark:text-gray-300"
                  />
                </div>

                <button
                  onClick={handleSave}
                  disabled={loading}
                  className="w-full flex items-center justify-center space-x-2 py-3 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold rounded-lg"
                >
                  {loading ? <Loader2 className="animate-spin w-5 h-5" /> : <Save className="w-5 h-5" />}
                  <span>{loading ? 'Saving...' : 'Save Changes'}</span>
                </button>

                <button
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center space-x-2 py-3 px-4 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg"
                >
                  <LogOut className="w-5 h-5" />
                  <span>Logout</span>
                </button>
              </div>
            </div>

            <ImageUploader
              isOpen={showImageUploader}
              onClose={() => setShowImageUploader(false)}
              onImageUpload={(url) => onProfileUpdate({ ...userProfile, photo_url: url })}
              currentImageUrl={userProfile.photo_url}
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
