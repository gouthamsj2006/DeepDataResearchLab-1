import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Clock, User, Star, BookOpen } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { supabase } from '../lib/supabase';
import EnrollmentForm from './EnrollmentForm';

interface Course {
  id: string;
  title: string;
  duration: string;
  overview: string;
  instructor: {
    name: string;
    title: string;
    bio: string;
    image?: string;
  };
  careerPaths: {
    beginner: {
      title: string;
      description: string;
      skills: string[];
    };
    midSenior: {
      title: string;
      description: string;
      responsibilities: string[];
      certifications: string[];
    };
    senior: {
      title: string;
      description: string;
      focus: string[];
      growth: string[];
    };
  };
  color: string;
}

interface CourseModalProps {
  course: Course | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function CourseModal({ course, isOpen, onClose }: CourseModalProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'career' | 'instructor'>('overview');
  const [activeCareerLevel, setActiveCareerLevel] = useState<'beginner' | 'midSenior' | 'senior'>('beginner');
  const [showEnrollment, setShowEnrollment] = useState(false);
  const { user } = useAuth();

  if (!course) return null;

  const handleEnroll = () => {
    if (!user) {
      alert('Please sign in to enroll in courses');
      return;
    }
    setShowEnrollment(true);
  };

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
            className="w-full max-w-4xl max-h-[90vh] bg-white dark:bg-gray-800 rounded-xl shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className={`p-6 bg-gradient-to-r ${course.color} text-white`}>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-3xl font-bold">{course.title}</h2>
                <button
                  onClick={onClose}
                  className="p-2 text-white/80 hover:text-white transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              <div className="flex items-center space-x-6 text-white/90">
                <div className="flex items-center space-x-2">
                  <Clock className="w-5 h-5" />
                  <span>{course.duration}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <User className="w-5 h-5" />
                  <span>{course.instructor.name}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Star className="w-5 h-5" />
                  <span>4.8/5 Rating</span>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="border-b border-gray-200 dark:border-gray-700">
              <nav className="flex space-x-8 px-6">
                {[
                  { id: 'overview', label: 'Overview', icon: BookOpen },
                  { id: 'career', label: 'Career Path', icon: Star },
                  { id: 'instructor', label: 'Instructor', icon: User },
                ].map(({ id, label, icon: Icon }) => (
                  <button
                    key={id}
                    onClick={() => setActiveTab(id as any)}
                    className={`flex items-center space-x-2 py-4 border-b-2 font-medium text-sm transition-colors ${
                      activeTab === id
                        ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                        : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{label}</span>
                  </button>
                ))}
              </nav>
            </div>

            {/* Content */}
            <div className="p-6 max-h-96 overflow-y-auto">
              {activeTab === 'overview' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-6"
                >
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                      Course Overview
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                      {course.overview}
                    </p>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                        What You'll Learn
                      </h4>
                      <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                        <li>• Industry-standard tools and practices</li>
                        <li>• Real-world project experience</li>
                        <li>• Career-focused skill development</li>
                        <li>• Expert mentorship and guidance</li>
                      </ul>
                    </div>
                    
                    <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                        Course Format
                      </h4>
                      <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                        <li>• Interactive online sessions</li>
                        <li>• Hands-on practical assignments</li>
                        <li>• Group projects and collaboration</li>
                        <li>• 1-on-1 mentorship sessions</li>
                      </ul>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'career' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-6"
                >
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                      Career Progression Path
                    </h3>
                    
                    {/* Career Level Tabs */}
                    <div className="flex space-x-4 mb-6">
                      {[
                        { id: 'beginner', label: 'Beginner' },
                        { id: 'midSenior', label: 'Mid-Senior' },
                        { id: 'senior', label: 'Senior' },
                      ].map(({ id, label }) => (
                        <button
                          key={id}
                          onClick={() => setActiveCareerLevel(id as any)}
                          className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                            activeCareerLevel === id
                              ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
                              : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-400 dark:hover:bg-gray-600'
                          }`}
                        >
                          {label}
                        </button>
                      ))}
                    </div>

                    {/* Career Level Content */}
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={activeCareerLevel}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.2 }}
                        className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg"
                      >
                        {activeCareerLevel === 'beginner' && (
                          <div>
                            <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                              {course.careerPaths.beginner.title}
                            </h4>
                            <p className="text-gray-600 dark:text-gray-300 mb-4">
                              {course.careerPaths.beginner.description}
                            </p>
                            <div>
                              <h5 className="font-medium text-gray-900 dark:text-white mb-2">Key Skills:</h5>
                              <div className="flex flex-wrap gap-2">
                                {course.careerPaths.beginner.skills.map((skill, index) => (
                                  <span
                                    key={index}
                                    className="px-3 py-1 bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300 rounded-full text-sm"
                                  >
                                    {skill}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>
                        )}

                        {activeCareerLevel === 'midSenior' && (
                          <div>
                            <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                              {course.careerPaths.midSenior.title}
                            </h4>
                            <p className="text-gray-600 dark:text-gray-300 mb-4">
                              {course.careerPaths.midSenior.description}
                            </p>
                            <div className="grid md:grid-cols-2 gap-4">
                              <div>
                                <h5 className="font-medium text-gray-900 dark:text-white mb-2">Responsibilities:</h5>
                                <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-300">
                                  {course.careerPaths.midSenior.responsibilities.map((resp, index) => (
                                    <li key={index}>• {resp}</li>
                                  ))}
                                </ul>
                              </div>
                              <div>
                                <h5 className="font-medium text-gray-900 dark:text-white mb-2">Certifications:</h5>
                                <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-300">
                                  {course.careerPaths.midSenior.certifications.map((cert, index) => (
                                    <li key={index}>• {cert}</li>
                                  ))}
                                </ul>
                              </div>
                            </div>
                          </div>
                        )}

                        {activeCareerLevel === 'senior' && (
                          <div>
                            <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                              {course.careerPaths.senior.title}
                            </h4>
                            <p className="text-gray-600 dark:text-gray-300 mb-4">
                              {course.careerPaths.senior.description}
                            </p>
                            <div className="grid md:grid-cols-2 gap-4">
                              <div>
                                <h5 className="font-medium text-gray-900 dark:text-white mb-2">Strategic Focus:</h5>
                                <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-300">
                                  {course.careerPaths.senior.focus.map((focus, index) => (
                                    <li key={index}>• {focus}</li>
                                  ))}
                                </ul>
                              </div>
                              <div>
                                <h5 className="font-medium text-gray-900 dark:text-white mb-2">Growth Path:</h5>
                                <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-300">
                                  {course.careerPaths.senior.growth.map((growth, index) => (
                                    <li key={index}>• {growth}</li>
                                  ))}
                                </ul>
                              </div>
                            </div>
                          </div>
                        )}
                      </motion.div>
                    </AnimatePresence>
                  </div>
                </motion.div>
              )}

              {activeTab === 'instructor' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-6"
                >
                  <div className="flex items-start space-x-6">
                    <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                      {course.instructor.name.charAt(0)}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-1">
                        {course.instructor.name}
                      </h3>
                      <p className="text-blue-600 dark:text-blue-400 font-medium mb-4">
                        {course.instructor.title}
                      </p>
                      <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                        {course.instructor.bio}
                      </p>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg">
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-3">
                      Why Learn from {course.instructor.name.split(' ')[0]}?
                    </h4>
                    <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                      <li>• Industry expert with proven track record</li>
                      <li>• Hands-on experience with real-world projects</li>
                      <li>• Personalized mentorship and career guidance</li>
                      <li>• Active in the professional community</li>
                    </ul>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Footer */}
            <div className="p-6 bg-gray-50 dark:bg-gray-700 border-t border-gray-200 dark:border-gray-600">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Ready to advance your career?
                  </p>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">
                    Start your journey today
                  </p>
                </div>
                <button
                  onClick={handleEnroll}
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
                >
                  Enroll Now
                </button>
              </div>
            </div>
          </motion.div>

          <EnrollmentForm
            course={course}
            isOpen={showEnrollment}
            onClose={() => setShowEnrollment(false)}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}