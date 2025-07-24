import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, FileText, Download, User, Calendar, MessageCircle, Sparkles, ChevronDown, Star, ExternalLink } from 'lucide-react';
import AIAssistant from './AIAssistant';
import { useNavigate } from 'react-router-dom';

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
  status?: 'new' | 'contacted' | 'interviewed' | 'hired';
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

const statusFilters = [
  { value: 'all', label: 'All Candidates' },
  { value: 'new', label: 'New' },
  { value: 'contacted', label: 'Contacted' },
  { value: 'interviewed', label: 'Interviewed' },
  { value: 'hired', label: 'Hired' }
];

export default function HireDeckDashboard() {
  const [hrUser, setHrUser] = useState<HRUser | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDomain, setSelectedDomain] = useState('All Domains');
  const [selectedEmploymentType, setSelectedEmploymentType] = useState('All Types');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [jobDescription, setJobDescription] = useState('');
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(false);
  const [showAIAssistant, setShowAIAssistant] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check authentication and get HR user
    const storedHrUser = localStorage.getItem('hr_user');
    if (!storedHrUser) {
      navigate('/hr-login');
      return;
    }
    setHrUser(JSON.parse(storedHrUser));
    
    // Load any saved candidates from localStorage
    const savedCandidates = localStorage.getItem('hr_candidates');
    if (savedCandidates) {
      setCandidates(JSON.parse(savedCandidates));
    }
  }, [navigate]);

  const showToast = (message: string, isSuccess: boolean) => {
    const toast = document.createElement('div');
    toast.className = `fixed top-4 right-4 px-6 py-3 rounded-lg shadow-lg z-50 flex items-center ${
      isSuccess ? 'bg-green-500' : 'bg-red-500'
    } text-white`;
    toast.innerHTML = `
      ${isSuccess ? '✅' : '❌'} 
      <span class="ml-2">${message}</span>
    `;
    document.body.appendChild(toast);
    setTimeout(() => document.body.removeChild(toast), 3000);
  };

  const handleJDAnalysis = async () => {
    if (!jobDescription.trim()) {
      showToast('Please paste a job description first', false);
      return;
    }

    setLoading(true);
    try {
      // Simulate API call with timeout
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Enhanced mock candidate data
      const mockCandidates: Candidate[] = [
        {
          id: '1',
          name: 'John Doe',
          email: 'john.doe@email.com',
          experience: 3,
          skills: ['React', 'Node.js', 'Python', 'AWS', 'TypeScript'],
          matched_keywords: ['React', 'Node.js', 'AWS', 'TypeScript'],
          match_score: 92,
          resume_url: '/sample-resume.pdf',
          status: 'new'
        },
        {
          id: '2',
          name: 'Jane Smith',
          email: 'jane.smith@email.com',
          experience: 5,
          skills: ['Python', 'Django', 'PostgreSQL', 'Docker', 'CI/CD'],
          matched_keywords: ['Python', 'Django', 'Docker', 'CI/CD'],
          match_score: 88,
          resume_url: '/sample-resume.pdf',
          status: 'new'
        },
        {
          id: '3',
          name: 'Mike Johnson',
          email: 'mike.johnson@email.com',
          experience: 2,
          skills: ['JavaScript', 'Vue.js', 'MongoDB', 'Express', 'REST APIs'],
          matched_keywords: ['JavaScript', 'Vue.js', 'MongoDB', 'REST APIs'],
          match_score: 85,
          resume_url: '/sample-resume.pdf',
          status: 'new'
        }
      ];

      setCandidates(mockCandidates);
      localStorage.setItem('hr_candidates', JSON.stringify(mockCandidates));
      showToast(`Found ${mockCandidates.length} matching candidates!`, true);
      
    } catch (error) {
      console.error('Error analyzing JD:', error);
      showToast('Error analyzing job description. Please try again.', false);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    // Implement actual search functionality
    console.log('Searching with filters:', {
      searchQuery,
      selectedDomain,
      selectedEmploymentType,
      selectedStatus
    });
    showToast('Search functionality coming soon!', true);
  };

  const downloadResume = (candidate: Candidate) => {
    if (!candidate.resume_url) {
      showToast('Resume not available for this candidate', false);
      return;
    }
    
    const link = document.createElement('a');
    link.href = candidate.resume_url;
    link.download = `${candidate.name.replace(/\s+/g, '_')}_Resume.pdf`;
    link.click();
    showToast(`Downloading ${candidate.name}'s resume`, true);
  };

  const updateCandidateStatus = (candidateId: string, newStatus: Candidate['status']) => {
    const updatedCandidates = candidates.map(candidate => {
      if (candidate.id === candidateId) {
        return { ...candidate, status: newStatus };
      }
      return candidate;
    });
    
    setCandidates(updatedCandidates);
    localStorage.setItem('hr_candidates', JSON.stringify(updatedCandidates));
    showToast('Candidate status updated', true);
  };

  const filteredCandidates = candidates.filter(candidate => {
    // Filter by status
    if (selectedStatus !== 'all' && candidate.status !== selectedStatus) {
      return false;
    }
    
    // Filter by search query
    if (searchQuery && !candidate.name.toLowerCase().includes(searchQuery.toLowerCase()) && 
        !candidate.skills.some(skill => skill.toLowerCase().includes(searchQuery.toLowerCase()))) {
      return false;
    }
    
    return true;
  });

  if (!hrUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center p-8 max-w-md">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500 mx-auto mb-6"></div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Loading Dashboard...
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Please wait while we verify your HR credentials.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Panel - Welcome */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-1"
          >
            <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-8 text-white h-full flex flex-col">
              <div className="mb-6">
                <h1 className="text-3xl font-bold mb-2">
                  Welcome, {hrUser.name.split(' ')[0]}!
                </h1>
                <p className="text-blue-100 text-lg">
                  {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                </p>
              </div>
              
              <div className="space-y-4 flex-1">
                <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
                  <h3 className="font-semibold mb-2 flex items-center">
                    <Building className="w-5 h-5 mr-2" />
                    Company
                  </h3>
                  <p className="text-blue-100">{hrUser.company_name}</p>
                </div>
                
                <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
                  <h3 className="font-semibold mb-2">Quick Stats</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="bg-white/5 p-2 rounded-lg">
                      <p className="text-blue-200">Total Searches</p>
                      <p className="text-xl font-bold">24</p>
                    </div>
                    <div className="bg-white/5 p-2 rounded-lg">
                      <p className="text-blue-200">Candidates</p>
                      <p className="text-xl font-bold">156</p>
                    </div>
                    <div className="bg-white/5 p-2 rounded-lg">
                      <p className="text-blue-200">Interviews</p>
                      <p className="text-xl font-bold">32</p>
                    </div>
                    <div className="bg-white/5 p-2 rounded-lg">
                      <p className="text-blue-200">Hired</p>
                      <p className="text-xl font-bold">8</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-blue-500/20">
                <button 
                  onClick={() => {
                    localStorage.removeItem('hr_user');
                    navigate('/hr-login');
                  }}
                  className="w-full py-2 px-4 bg-white/10 hover:bg-white/20 rounded-lg transition-colors flex items-center justify-center"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </button>
              </div>
            </div>
          </motion.div>

          {/* Right Panel - Search & Results */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-2 space-y-6"
          >
            {/* Search Section */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Find Perfect Candidates
                </h2>
                <button 
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center space-x-1 px-3 py-1.5 bg-gray-100 dark:bg-gray-700 rounded-lg text-sm"
                >
                  <Filter className="w-4 h-4" />
                  <span>Filters</span>
                  <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
                </button>
              </div>
              
              {/* Search Bar */}
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by name, skills, or keywords"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>

              {/* Expanded Filters */}
              {showFilters && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden"
                >
                  <div className="grid md:grid-cols-3 gap-4 mb-6 pt-4 border-t border-gray-200 dark:border-gray-700">
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

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Status
                      </label>
                      <select
                        value={selectedStatus}
                        onChange={(e) => setSelectedStatus(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      >
                        {statusFilters.map((filter) => (
                          <option key={filter.value} value={filter.value}>
                            {filter.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </motion.div>
              )}

              <button
                onClick={handleSearch}
                className="w-full md:w-auto px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors flex items-center justify-center space-x-2"
              >
                <Search className="w-4 h-4" />
                <span>Search Candidates</span>
              </button>
            </div>

            {/* JD Analysis Section */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <FileText className="w-5 h-5 text-indigo-600" />
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                    AI-Powered JD Matching
                  </h2>
                  <Sparkles className="w-5 h-5 text-yellow-500" />
                </div>
                <button 
                  onClick={() => setJobDescription('')}
                  className="text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                >
                  Clear
                </button>
              </div>
              
              <textarea
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder={`Paste your Job Description here for AI-powered candidate matching...\nExample:\n"Looking for a React developer with 3+ years experience in building responsive web applications. Must have expertise in TypeScript, Redux, and REST APIs. Experience with testing frameworks like Jest is a plus."`}
                rows={6}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none font-mono text-sm"
              />
              
              <div className="mt-4 flex justify-between items-center">
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {jobDescription.length > 0 ? `${jobDescription.length} characters` : ''}
                </div>
                <button
                  onClick={handleJDAnalysis}
                  disabled={loading || !jobDescription.trim()}
                  className={`px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-lg transition-all shadow-lg flex items-center space-x-2 ${
                    loading ? 'opacity-75' : 'hover:from-indigo-700 hover:to-purple-700'
                  } ${
                    !jobDescription.trim() ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span>Analyzing...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      <span>Find Matching Candidates</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Results Section */}
            {filteredCandidates.length > 0 ? (
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Matching Candidates ({filteredCandidates.length})
                  </h2>
                  <div className="flex items-center space-x-2">
                    <select
                      value={selectedStatus}
                      onChange={(e) => setSelectedStatus(e.target.value)}
                      className="text-sm px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700"
                    >
                      {statusFilters.map((filter) => (
                        <option key={filter.value} value={filter.value}>
                          {filter.label}
                        </option>
                      ))}
                    </select>
                    <button 
                      onClick={() => {
                        setSearchQuery('');
                        setSelectedDomain('All Domains');
                        setSelectedEmploymentType('All Types');
                        setSelectedStatus('all');
                      }}
                      className="text-sm px-3 py-1 text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      Reset
                    </button>
                  </div>
                </div>
                
                <div className="space-y-4">
                  {filteredCandidates.map((candidate) => (
                    <motion.div
                      key={candidate.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      className={`border rounded-xl p-6 hover:shadow-lg transition-shadow ${
                        candidate.status === 'hired' 
                          ? 'border-green-500 bg-green-50/50 dark:bg-green-900/10'
                          : candidate.status === 'interviewed'
                          ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-900/10'
                          : candidate.status === 'contacted'
                          ? 'border-purple-500 bg-purple-50/50 dark:bg-purple-900/10'
                          : 'border-gray-200 dark:border-gray-700'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-4 flex-1">
                          <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                            candidate.status === 'hired' 
                              ? 'bg-green-100 dark:bg-green-900/30'
                              : candidate.status === 'interviewed'
                              ? 'bg-blue-100 dark:bg-blue-900/30'
                              : candidate.status === 'contacted'
                              ? 'bg-purple-100 dark:bg-purple-900/30'
                              : 'bg-gradient-to-r from-blue-500 to-indigo-500'
                          }`}>
                            <User className={`w-6 h-6 ${
                              candidate.status ? 'text-gray-700 dark:text-gray-300' : 'text-white'
                            }`} />
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center space-x-2">
                              <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate">
                                {candidate.name}
                              </h3>
                              {candidate.match_score > 90 && (
                                <span className="flex items-center text-xs bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200 px-2 py-0.5 rounded-full">
                                  <Star className="w-3 h-3 mr-1" />
                                  Top Match
                                </span>
                              )}
                            </div>
                            <p className="text-gray-600 dark:text-gray-400 mb-2 truncate">
                              {candidate.email}
                            </p>
                            
                            <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500 dark:text-gray-400 mb-3">
                              <div className="flex items-center space-x-1">
                                <Calendar className="w-4 h-4" />
                                <span>{candidate.experience} yrs exp</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <Sparkles className="w-4 h-4 text-green-500" />
                                <span className="font-medium text-green-600 dark:text-green-400">
                                  {candidate.match_score}% match
                                </span>
                              </div>
                              {candidate.status && (
                                <div className={`px-2 py-0.5 rounded-full text-xs ${
                                  candidate.status === 'hired'
                                    ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200'
                                    : candidate.status === 'interviewed'
                                    ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200'
                                    : candidate.status === 'contacted'
                                    ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-200'
                                    : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
                                }`}>
                                  {candidate.status.charAt(0).toUpperCase() + candidate.status.slice(1)}
                                </div>
                              )}
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
                                    className={`px-2 py-1 rounded-full text-xs ${
                                      candidate.matched_keywords.includes(skill)
                                        ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 font-medium'
                                        : 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400'
                                    }`}
                                  >
                                    {skill}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex flex-col space-y-2 min-w-[120px]">
                          <button
                            onClick={() => downloadResume(candidate)}
                            className="flex items-center justify-center space-x-2 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm"
                          >
                            <Download className="w-3 h-3" />
                            <span>Resume</span>
                          </button>
                          
                          <div className="flex space-x-2">
                            <button 
                              onClick={() => updateCandidateStatus(candidate.id, 'contacted')}
                              className={`flex-1 px-2 py-1.5 rounded-lg text-sm ${
                                candidate.status === 'contacted' || candidate.status === 'interviewed' || candidate.status === 'hired'
                                  ? 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                                  : 'bg-purple-600 hover:bg-purple-700 text-white'
                              }`}
                              disabled={candidate.status === 'contacted' || candidate.status === 'interviewed' || candidate.status === 'hired'}
                            >
                              Contact
                            </button>
                            <button 
                              onClick={() => updateCandidateStatus(candidate.id, 'interviewed')}
                              className={`flex-1 px-2 py-1.5 rounded-lg text-sm ${
                                candidate.status === 'interviewed' || candidate.status === 'hired'
                                  ? 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                                  : candidate.status === 'contacted'
                                  ? 'bg-blue-600 hover:bg-blue-700 text-white'
                                  : 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                              }`}
                              disabled={candidate.status === 'interviewed' || candidate.status === 'hired' || candidate.status !== 'contacted'}
                            >
                              Interview
                            </button>
                          </div>
                          <button 
                            onClick={() => updateCandidateStatus(candidate.id, 'hired')}
                            className={`w-full px-2 py-1.5 rounded-lg text-sm ${
                              candidate.status === 'hired'
                                ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                                : candidate.status === 'interviewed'
                                ? 'bg-green-600 hover:bg-green-700 text-white'
                                : 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                            }`}
                            disabled={candidate.status === 'hired' || candidate.status !== 'interviewed'}
                          >
                            {candidate.status === 'hired' ? 'Hired!' : 'Hire'}
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            ) : candidates.length > 0 ? (
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 text-center">
                <Filter className="w-10 h-10 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  No candidates match your current filters
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Try adjusting your search criteria or clear all filters
                </p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedDomain('All Domains');
                    setSelectedEmploymentType('All Types');
                    setSelectedStatus('all');
                  }}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 text-center">
                <FileText className="w-10 h-10 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  No candidates found yet
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Paste a job description above to find matching candidates using our AI
                </p>
              </div>
            )}
          </motion.div>
        </div>
      </div>

      {/* AI Assistant Toggle */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setShowAIAssistant(true)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-full shadow-lg flex items-center justify-center transition-all z-40"
      >
        <MessageCircle className="w-6 h-6" />
      </motion.button>

      {/* AI Assistant */}
      <AIAssistant
        isOpen={showAIAssistant}
        onClose={() => setShowAIAssistant(false)}
        hrUser={hrUser}
        jobDescription={jobDescription}
      />
    </div>
  );
}
