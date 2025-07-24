import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, FileText, Download, User, Calendar, MessageCircle, Sparkles } from 'lucide-react';
import AIAssistant from './AIAssistant';

interface HRUser {
  id: string;
  name: string;
  email: string;
  company_name: string;
  user_type: string;
}

interface Candidate {
  id: string;
  name: string;
  email: string;
  experience: number;
  skills: string[];
  photo_url?: string;
  resume_url?: string;
  matched_keywords: string[];
  match_score: number;
}

const domains = [
  'All Domains',
  'Software Engineering',
  'Data Engineering',
  'Product Management',
  'Quality Assurance',
  'DevOps',
  'UI/UX Design',
  'Data Science',
  'Machine Learning',
  'Cybersecurity'
];

const employmentTypes = [
  'All Types',
  'Full-time',
  'Internship',
  'Contract',
  'Remote'
];

export default function HireDeckDashboard() {
  const [hrUser, setHrUser] = useState<HRUser | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDomain, setSelectedDomain] = useState('All Domains');
  const [selectedEmploymentType, setSelectedEmploymentType] = useState('All Types');
  const [jobDescription, setJobDescription] = useState('');
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(false);
  const [showAIAssistant, setShowAIAssistant] = useState(false);

  useEffect(() => {
    // Get HR user from localStorage
    const storedHrUser = localStorage.getItem('hr_user');
    if (storedHrUser) {
      setHrUser(JSON.parse(storedHrUser));
    }
  }, []);

  const handleJDAnalysis = async () => {
    if (!jobDescription.trim()) {
      alert('Please paste a job description first');
      return;
    }

    setLoading(true);
    try {
      // Simulate API call to backend for JD analysis
      // In production, this would call your FastAPI backend with LLaMA integration
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock candidate results
      const mockCandidates: Candidate[] = [
        {
          id: '1',
          name: 'John Doe',
          email: 'john.doe@email.com',
          experience: 3,
          skills: ['React', 'Node.js', 'Python', 'AWS'],
          matched_keywords: ['React', 'Node.js', 'AWS'],
          match_score: 92,
          resume_url: '/sample-resume.pdf'
        },
        {
          id: '2',
          name: 'Jane Smith',
          email: 'jane.smith@email.com',
          experience: 5,
          skills: ['Python', 'Django', 'PostgreSQL', 'Docker'],
          matched_keywords: ['Python', 'Django', 'Docker'],
          match_score: 88,
          resume_url: '/sample-resume.pdf'
        },
        {
          id: '3',
          name: 'Mike Johnson',
          email: 'mike.johnson@email.com',
          experience: 2,
          skills: ['JavaScript', 'Vue.js', 'MongoDB', 'Express'],
          matched_keywords: ['JavaScript', 'Vue.js', 'MongoDB'],
          match_score: 85,
          resume_url: '/sample-resume.pdf'
        }
      ];

      setCandidates(mockCandidates);
      
      // Show success toast
      const toast = document.createElement('div');
      toast.className = 'fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50';
      toast.textContent = `✅ Found ${mockCandidates.length} matching candidates!`;
      document.body.appendChild(toast);
      setTimeout(() => document.body.removeChild(toast), 3000);
      
    } catch (error) {
      console.error('Error analyzing JD:', error);
      alert('Error analyzing job description. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    // Implement search functionality
    console.log('Searching for:', searchQuery, selectedDomain, selectedEmploymentType);
  };

  const downloadResume = (candidate: Candidate) => {
    // In production, this would download the actual resume
    const link = document.createElement('a');
    link.href = candidate.resume_url || '#';
    link.download = `${candidate.name}_Resume.pdf`;
    link.click();
  };

  if (!hrUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <User className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Please Sign In
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            You need to be signed in as an HR to access HireDeck.
          </p>
        </div>
      </div>
    );
  }
else
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Panel - Welcome */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-1"
          >
            <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-8 text-white">
              <div className="mb-6">
                <h1 className="text-3xl font-bold mb-2">
                  Welcome, {hrUser.name}!
                </h1>
                <p className="text-blue-100 text-lg">
                  Hire smarter, Hire from Us
                </p>
              </div>
              
              <div className="space-y-4">
                <div className="bg-white/10 rounded-lg p-4">
                  <h3 className="font-semibold mb-2">Company</h3>
                  <p className="text-blue-100">{hrUser.company_name}</p>
                </div>
                
                <div className="bg-white/10 rounded-lg p-4">
                  <h3 className="font-semibold mb-2">Quick Stats</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-blue-200">Total Searches</p>
                      <p className="text-xl font-bold">24</p>
                    </div>
                    <div>
                      <p className="text-blue-200">Candidates Found</p>
                      <p className="text-xl font-bold">156</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Panel - Search & Results */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-2 space-y-6"
          >
            {/* Search Section */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                Find Perfect Candidates
              </h2>
              
              {/* Search Bar */}
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by role, domain, or skill"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>

              {/* Filters */}
              <div className="grid md:grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Domain
                  </label>
                  <select
                    value={selectedDomain}
                    onChange={(e) => setSelectedDomain(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    {domains.map((domain) => (
                      <option key={domain} value={domain}>
                        {domain}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Employment Type
                  </label>
                  <select
                    value={selectedEmploymentType}
                    onChange={(e) => setSelectedEmploymentType(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    {employmentTypes.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <button
                onClick={handleSearch}
                className="w-full md:w-auto px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
              >
                Search Candidates
              </button>
            </div>

            {/* JD Analysis Section */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
              <div className="flex items-center space-x-2 mb-4">
                <FileText className="w-5 h-5 text-indigo-600" />
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  AI-Powered JD Matching
                </h2>
                <Sparkles className="w-5 h-5 text-yellow-500" />
              </div>
              
              <textarea
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="Paste your Job Description here for AI-powered candidate matching..."
                rows={6}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none"
              />
              
              <button
                onClick={handleJDAnalysis}
                disabled={loading}
                className="mt-4 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 disabled:from-indigo-400 disabled:to-purple-400 text-white font-semibold rounded-lg transition-all shadow-lg"
              >
                {loading ? 'Analyzing JD...' : 'Find Matching Candidates'}
              </button>
            </div>

            {/* Results Section */}
            {candidates.length > 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                  Matching Candidates ({candidates.length})
                </h2>
                
                <div className="space-y-4">
                  {candidates.map((candidate) => (
                    <motion.div
                      key={candidate.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="border border-gray-200 dark:border-gray-700 rounded-xl p-6 hover:shadow-lg transition-shadow"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-4">
                          <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center">
                            <User className="w-6 h-6 text-white" />
                          </div>
                          
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                              {candidate.name}
                            </h3>
                            <p className="text-gray-600 dark:text-gray-400 mb-2">
                              {candidate.email}
                            </p>
                            
                            <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400 mb-3">
                              <div className="flex items-center space-x-1">
                                <Calendar className="w-4 h-4" />
                                <span>{candidate.experience} years exp</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <Sparkles className="w-4 h-4 text-green-500" />
                                <span className="text-green-600 dark:text-green-400 font-medium">
                                  {candidate.match_score}% match
                                </span>
                              </div>
                            </div>
                            
                            {/* Matched Keywords */}
                            <div className="mb-3">
                              <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Matched Keywords:
                              </p>
                              <div className="flex flex-wrap gap-2">
                                {candidate.matched_keywords.map((keyword, index) => (
                                  <span
                                    key={index}
                                    className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full text-xs font-medium"
                                  >
                                    {keyword}
                                  </span>
                                ))}
                              </div>
                            </div>
                            
                            {/* All Skills */}
                            <div>
                              <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Skills:
                              </p>
                              <div className="flex flex-wrap gap-2">
                                {candidate.skills.map((skill, index) => (
                                  <span
                                    key={index}
                                    className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-full text-xs"
                                  >
                                    {skill}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex flex-col space-y-2">
                          <button
                            onClick={() => downloadResume(candidate)}
                            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                          >
                            <Download className="w-4 h-4" />
                            <span>Resume</span>
                          </button>
                          
                          <button className="flex items-center space-x-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors">
                            <Calendar className="w-4 h-4" />
                            <span>Interview</span>
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>

      {/* AI Assistant Toggle */}
      <button
        onClick={() => setShowAIAssistant(true)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-full shadow-lg flex items-center justify-center transition-all hover:scale-110"
      >
        <MessageCircle className="w-6 h-6" />
      </button>

      {/* AI Assistant */}
      <AIAssistant
        isOpen={showAIAssistant}
        onClose={() => setShowAIAssistant(false)}
        hrUser={hrUser}
      />
    </div>
  );
}
