import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { User, Mail, Phone, BookOpen, Camera, Save, Loader2, ArrowLeft } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../hooks/useAuth'
import ProfileImageUploader from './ProfileImageUploader'

interface StudentProfileData {
  id: string
  name: string
  email: string
  phone: string
  course: string
  photo_url: string
  updated_at?: string
}

interface StudentProfileProps {
  onNavigate?: (section: string) => void;
}

export default function StudentProfile({ onNavigate }: StudentProfileProps) {
  const { user } = useAuth()
  const [profile, setProfile] = useState<StudentProfileData>({
    id: '',
    name: '',
    email: '',
    phone: '',
    course: '',
    photo_url: '',
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [showImageUploader, setShowImageUploader] = useState(false)

  useEffect(() => {
    if (user) {
      fetchProfile()
    }
  }, [user])

  const fetchProfile = async () => {
    if (!user) return

    try {
      setLoading(true)
      setError('')

      const { data, error } = await supabase
        .from('student_profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      if (error && error.code !== 'PGRST116') {
        throw error
      }

      if (data) {
        setProfile(data)
      } else {
        // Create initial profile if it doesn't exist
        const newProfile = {
          id: user.id,
          name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'User',
          email: user.email || '',
          phone: '',
          course: '',
          photo_url: '',
        }
        
        const { error: insertError } = await supabase
          .from('student_profiles')
          .insert(newProfile)

        if (!insertError) {
          setProfile(newProfile)
        }
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load profile')
    } finally {
      setLoading(false)
    }
  }

  const updateProfile = async () => {
    if (!user) return

    try {
      setSaving(true)
      setError('')
      setSuccess('')

      const { error } = await supabase
        .from('student_profiles')
        .update({
          name: profile.name,
          phone: profile.phone,
          course: profile.course,
          photo_url: profile.photo_url,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id)

      if (error) throw error

      setSuccess('Profile updated successfully!')
      setTimeout(() => setSuccess(''), 3000)
    } catch (err: any) {
      setError(err.message || 'Failed to update profile')
    } finally {
      setSaving(false)
    }
  }

  const handleInputChange = (field: keyof StudentProfileData, value: string) => {
    setProfile(prev => ({ ...prev, [field]: value }))
  }

  const handleImageUpload = (imageUrl: string) => {
    setProfile(prev => ({ ...prev, photo_url: imageUrl }))
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <User className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Please Sign In
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            You need to be signed in to view your profile.
          </p>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-300">Loading your profile...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        {/* Back Button */}
        {onNavigate && (
          <button
            onClick={() => onNavigate('home')}
            className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Home</span>
          </button>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 shadow-xl rounded-xl overflow-hidden"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-8">
            <div className="text-center">
              <h1 className="text-3xl font-bold text-white mb-2">My Profile</h1>
              <p className="text-blue-100">Manage your account information</p>
            </div>
          </div>

          {/* Content */}
          <div className="p-8">
            {/* Alerts */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 p-4 bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-700 rounded-xl text-red-700 dark:text-red-400"
              >
                {error}
              </motion.div>
            )}

            {success && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 p-4 bg-green-100 dark:bg-green-900/30 border border-green-300 dark:border-green-700 rounded-xl text-green-700 dark:text-green-400"
              >
                {success}
              </motion.div>
            )}

            <form onSubmit={(e) => { e.preventDefault(); updateProfile(); }} className="space-y-8">
              {/* Profile Picture Section */}
              <div className="flex flex-col sm:flex-row items-center gap-6">
                <div className="relative">
                  <img
                    src={profile.photo_url || '/default-avatar.png'}
                    alt="Profile avatar"
                    className="h-24 w-24 rounded-full border-4 border-gray-200 dark:border-gray-600 object-cover bg-gray-100 dark:bg-gray-700"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = '/default-avatar.png';
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowImageUploader(true)}
                    className="absolute -bottom-2 -right-2 p-2 bg-blue-600 hover:bg-blue-700 rounded-full shadow-lg transition-colors"
                  >
                    <Camera className="w-4 h-4 text-white" />
                  </button>
                </div>
                <div className="text-center sm:text-left">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                    Profile Picture
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                    Click the camera icon to update your profile picture
                  </p>
                  <button
                    type="button"
                    onClick={() => setShowImageUploader(true)}
                    className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    Change Picture
                  </button>
                </div>
              </div>

              {/* Form Fields */}
              <div className="grid gap-6">
                {/* Name */}
                <div>
                  <label htmlFor="name" className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    <User className="w-4 h-4 mr-2" />
                    Full Name
                  </label>
                  <input
                    id="name"
                    type="text"
                    value={profile.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="Enter your full name"
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-colors"
                    required
                  />
                </div>

                {/* Email (readonly) */}
                <div>
                  <label htmlFor="email" className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    <Mail className="w-4 h-4 mr-2" />
                    Email Address
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={profile.email}
                    readOnly
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-600 text-gray-700 dark:text-gray-300 cursor-not-allowed"
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Email cannot be changed
                  </p>
                </div>

                {/* Phone */}
                <div>
                  <label htmlFor="phone" className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    <Phone className="w-4 h-4 mr-2" />
                    Phone Number
                  </label>
                  <input
                    id="phone"
                    type="tel"
                    value={profile.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    placeholder="Enter your phone number"
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-colors"
                  />
                </div>

                {/* Course */}
                <div>
                  <label htmlFor="course" className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    <BookOpen className="w-4 h-4 mr-2" />
                    Current Course
                  </label>
                  <select
                    id="course"
                    value={profile.course}
                    onChange={(e) => handleInputChange('course', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors"
                  >
                    <option value="">Select a course</option>
                    <option value="Data Engineering">Data Engineering</option>
                    <option value="Service Delivery">Service Delivery</option>
                    <option value="Database Administrator">Database Administrator</option>
                    <option value="DevOps">DevOps</option>
                    <option value="Business and Process Analysis">Business and Process Analysis</option>
                  </select>
                </div>
              </div>

              {/* Save Button */}
              <motion.button
                type="submit"
                disabled={saving}
                whileHover={{ scale: saving ? 1 : 1.02 }}
                whileTap={{ scale: saving ? 1 : 0.98 }}
                className="w-full flex items-center justify-center space-x-2 py-4 px-6 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-blue-400 disabled:to-purple-400 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg"
              >
                {saving ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Saving Changes...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5" />
                    <span>Save Changes</span>
                  </>
                )}
              </motion.button>
            </form>
          </div>
        </motion.div>

        {/* Additional Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-8 text-center"
        >
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Need help? Contact us at{' '}
            <a
              href="mailto:deepdataresearchlabs@gmail.com"
              className="text-blue-600 dark:text-blue-400 hover:underline"
            >
              deepdataresearchlabs@gmail.com
            </a>
          </p>
        </motion.div>
      </div>

      <ProfileImageUploader
        isOpen={showImageUploader}
        onClose={() => setShowImageUploader(false)}
        onImageUpload={handleImageUpload}
        currentImageUrl={profile.photo_url}
      />
    </div>
  )
}