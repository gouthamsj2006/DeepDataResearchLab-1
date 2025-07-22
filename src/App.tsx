import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import { useTheme } from './hooks/useTheme';
import Header from './components/Header';
import Hero from './components/Hero';
import Courses from './components/Courses';
import Contact from './components/Contact';
import Footer from './components/Footer';
import AppThemeWrapper from './components/AppThemeWrapper'
import HireDeckPage from './pages/HireDeckPage';

function App() {
  const { loading } = useAuth();
  const { isDark } = useTheme();

  const handleNavigate = (section: string) => {
    
    // Smooth scroll to section
    const element = document.getElementById(section);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    } else if (section === 'home') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Handle scroll-based section detection
  useEffect(() => {
    const handleScroll = () => {
      const sections = ['home', 'courses', 'contact'];
      const scrollPosition = window.scrollY + 100;

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            break;
          }
        } else if (section === 'home' && scrollPosition < 100) {
          // setCurrentSection('home'); // This line was removed
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <Router>
      <AppThemeWrapper>
        <div className={`min-h-screen ${isDark ? 'dark' : ''}`}>
          <Routes>
            <Route path="/hiredeck" element={<HireDeckPage />} />
            <Route path="/" element={
              <div className="bg-white dark:bg-gray-900 transition-colors duration-300">
                <Header onNavigate={handleNavigate} />
                
                <main>
                  <section id="home">
                    <Hero onNavigate={handleNavigate} />
                  </section>
                  
                  <section id="courses">
                    <Courses />
                  </section>
                  
                  <section id="about">
                    <div className="py-20 bg-white dark:bg-gray-800">
                      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <motion.div
                          initial={{ opacity: 0, y: 30 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          className="text-center"
                        >
                          <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-8">
                            About DDRL
                          </h2>
                          <div className="max-w-4xl mx-auto">
                            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
                              Deep Data Research Lab (DDRL) is a premier training institute dedicated to advancing 
                              careers in data engineering, cloud technologies, and business analysis. Our mission 
                              is to bridge the gap between academic knowledge and industry requirements through 
                              practical, hands-on training programs.
                            </p>
                            
                            <div className="grid md:grid-cols-3 gap-8 mt-12">
                              <div className="text-center">
                                <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
                                  <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">5+</span>
                                </div>
                                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Expert Courses</h3>
                                <p className="text-gray-600 dark:text-gray-300">Comprehensive training programs</p>
                              </div>
                              
                              <div className="text-center">
                                <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
                                  <span className="text-2xl font-bold text-green-600 dark:text-green-400">100+</span>
                                </div>
                                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Success Stories</h3>
                                <p className="text-gray-600 dark:text-gray-300">Professionals trained and placed</p>
                              </div>
                              
                              <div className="text-center">
                                <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mx-auto mb-4">
                                  <span className="text-2xl font-bold text-purple-600 dark:text-purple-400">24/7</span>
                                </div>
                                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Support</h3>
                                <p className="text-gray-600 dark:text-gray-300">Continuous learning assistance</p>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      </div>
                    </div>
                  </section>
                  
                  <section id="contact">
                    <Contact />
                  </section>
                </main>
                
                <Footer />
              </div>
            } />
          </Routes>
        </div>
      </AppThemeWrapper>
    </Router>
  );
}

export default App;