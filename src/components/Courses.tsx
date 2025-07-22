import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Clock, User, ArrowRight, Database, Server, Shield, Cloud, BarChart } from 'lucide-react';
import CourseModal from './CourseModal';

const courses = [
  {
    id: 'data-engineering',
    title: 'Data Engineering',
    duration: '90 days',
    overview: 'Master the art of building robust data pipelines with Apache Spark, real-time and batch processing systems, and cloud-native architectures. Learn to design scalable data infrastructure that powers modern analytics and machine learning applications.',
    instructor: {
      name: 'Yash',
      title: 'Senior Data Engineer',
      bio: 'Expert in Apache Spark and Cloud Data Systems with 8+ years of experience building enterprise-scale data platforms. Has worked with Fortune 500 companies to implement real-time analytics solutions.',
    },
    careerPaths: {
      beginner: {
        title: 'Junior Data Engineer',
        description: 'Start your journey in data engineering with foundational skills in data processing and pipeline development.',
        skills: ['Python/SQL', 'ETL Basics', 'Data Modeling', 'Version Control', 'Basic Cloud Services'],
      },
      midSenior: {
        title: 'Senior Data Engineer',
        description: 'Lead data infrastructure projects and mentor junior team members while designing complex data systems.',
        responsibilities: ['Design data architectures', 'Optimize pipeline performance', 'Implement data governance', 'Lead technical discussions'],
        certifications: ['AWS Data Engineer', 'Google Cloud Data Engineer', 'Databricks Certified'],
      },
      senior: {
        title: 'Principal Data Engineer / Data Architect',
        description: 'Drive strategic data initiatives and establish enterprise-wide data standards and best practices.',
        focus: ['Enterprise architecture', 'Technology strategy', 'Cross-functional leadership', 'Innovation initiatives'],
        growth: ['VP of Engineering', 'Chief Data Officer', 'Technical Consultant', 'Startup Founder'],
      },
    },
    color: 'from-blue-600 to-blue-800',
    icon: Database,
  },
  {
    id: 'service-delivery',
    title: 'Service Delivery',
    duration: '45 days',
    overview: 'Master ITIL frameworks, SLA management, and incident/change management workflows. Learn to deliver exceptional IT services while maintaining operational excellence and customer satisfaction.',
    instructor: {
      name: 'Srinivas',
      title: 'ITIL Certified Service Manager',
      bio: 'ITIL Expert with 12+ years in service management, specializing in digital transformation and service optimization. Has led service delivery improvements for global enterprises.',
    },
    careerPaths: {
      beginner: {
        title: 'Service Desk Analyst',
        description: 'Begin your IT service career by providing first-line support and learning service management fundamentals.',
        skills: ['ITIL Foundation', 'Incident Management', 'Customer Service', 'Ticketing Systems', 'Basic Networking'],
      },
      midSenior: {
        title: 'Service Delivery Manager',
        description: 'Manage service delivery operations and ensure SLA compliance while driving continuous improvement.',
        responsibilities: ['Manage service portfolios', 'Ensure SLA compliance', 'Lead improvement initiatives', 'Stakeholder management'],
        certifications: ['ITIL Expert', 'PMP', 'Six Sigma Green Belt', 'COBIT'],
      },
      senior: {
        title: 'Head of Service Management',
        description: 'Define service strategy and lead organizational transformation in service delivery excellence.',
        focus: ['Service strategy', 'Digital transformation', 'Organizational change', 'Vendor management'],
        growth: ['IT Director', 'Chief Information Officer', 'Consulting Partner', 'Service Management Consultant'],
      },
    },
    color: 'from-green-600 to-green-800',
    icon: Server,
  },
  {
    id: 'database-administrator',
    title: 'Database Administrator',
    duration: '90 days',
    overview: 'Learn comprehensive database management including installation, performance tuning, backup strategies, and security implementation for PostgreSQL and NoSQL systems.',
    instructor: {
      name: 'Venkat',
      title: 'Senior Database Administrator',
      bio: 'Senior DBA with 10+ years of experience managing mission-critical databases for enterprise applications. Expert in performance optimization and disaster recovery planning.',
    },
    careerPaths: {
      beginner: {
        title: 'Junior Database Administrator',
        description: 'Start with basic database operations, monitoring, and maintenance tasks under senior guidance.',
        skills: ['SQL Fundamentals', 'Database Basics', 'Backup/Restore', 'Monitoring Tools', 'Security Basics'],
      },
      midSenior: {
        title: 'Senior Database Administrator',
        description: 'Manage complex database environments and lead performance optimization initiatives.',
        responsibilities: ['Database architecture design', 'Performance tuning', 'Disaster recovery planning', 'Security implementation'],
        certifications: ['Oracle DBA', 'Microsoft SQL Server', 'PostgreSQL Professional', 'MongoDB Certified'],
      },
      senior: {
        title: 'Database Architect / Data Platform Lead',
        description: 'Design enterprise database strategies and lead data platform transformation initiatives.',
        focus: ['Enterprise data strategy', 'Cloud migration', 'Technology evaluation', 'Team leadership'],
        growth: ['Data Engineering Manager', 'Chief Data Officer', 'Database Consultant', 'Technical Architect'],
      },
    },
    color: 'from-purple-600 to-purple-800',
    icon: Shield,
  },
  {
    id: 'devops',
    title: 'DevOps',
    duration: '75 days',
    overview: 'Master CI/CD pipelines, containerization with Docker and Kubernetes, infrastructure monitoring, and cloud DevOps tooling for modern software delivery.',
    instructor: {
      name: 'Hazrath',
      title: 'Cloud DevOps Architect',
      bio: 'Cloud DevOps Architect with expertise in building scalable CI/CD pipelines and container orchestration. Has implemented DevOps practices for startups to enterprise organizations.',
    },
    careerPaths: {
      beginner: {
        title: 'DevOps Engineer',
        description: 'Learn automation fundamentals and basic CI/CD pipeline development.',
        skills: ['Linux/Scripting', 'Git/Version Control', 'Docker Basics', 'CI/CD Tools', 'Cloud Fundamentals'],
      },
      midSenior: {
        title: 'Senior DevOps Engineer',
        description: 'Design and implement complex automation solutions and mentor junior team members.',
        responsibilities: ['Infrastructure as Code', 'Container orchestration', 'Monitoring implementation', 'Security automation'],
        certifications: ['AWS DevOps', 'Kubernetes Administrator', 'Docker Certified', 'Terraform Associate'],
      },
      senior: {
        title: 'DevOps Architect / Platform Engineering Lead',
        description: 'Define DevOps strategy and lead platform engineering initiatives across the organization.',
        focus: ['Platform strategy', 'Tool evaluation', 'Process optimization', 'Cross-team collaboration'],
        growth: ['Engineering Manager', 'Site Reliability Engineer', 'Cloud Architect', 'Technical Consultant'],
      },
    },
    color: 'from-orange-600 to-orange-800',
    icon: Cloud,
  },
  {
    id: 'business-analysis',
    title: 'Business and Process Analysis',
    duration: '60 days',
    overview: 'Learn BPMN modeling, gap analysis, process optimization, and stakeholder communication to bridge the gap between business needs and technical solutions.',
    instructor: {
      name: 'Ashish',
      title: 'Business Analyst and Transformation Consultant',
      bio: 'Business Analyst and Transformation Consultant with 9+ years of experience in process improvement and digital transformation. Specializes in agile methodologies and stakeholder management.',
    },
    careerPaths: {
      beginner: {
        title: 'Junior Business Analyst',
        description: 'Start by gathering requirements and supporting process documentation initiatives.',
        skills: ['Requirements Gathering', 'Process Mapping', 'Stakeholder Communication', 'Documentation', 'Basic Analytics'],
      },
      midSenior: {
        title: 'Senior Business Analyst',
        description: 'Lead business analysis projects and drive process improvement initiatives.',
        responsibilities: ['Process optimization', 'Stakeholder management', 'Solution design', 'Change management'],
        certifications: ['CBAP', 'PMI-PBA', 'Agile Analysis', 'Six Sigma Black Belt'],
      },
      senior: {
        title: 'Principal Business Analyst / Process Excellence Manager',
        description: 'Define business analysis standards and lead organizational transformation initiatives.',
        focus: ['Strategic planning', 'Process excellence', 'Digital transformation', 'Organizational change'],
        growth: ['Product Manager', 'Program Manager', 'Business Consultant', 'Operations Director'],
      },
    },
    color: 'from-indigo-600 to-indigo-800',
    icon: BarChart,
  },
];

export default function Courses() {
  const [selectedCourse, setSelectedCourse] = useState(null);

  return (
    <section id="courses" className="py-20 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Our Courses
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Comprehensive training programs designed to advance your career in data, technology, and business analysis
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {courses.map((course, index) => {
            const IconComponent = course.icon;
            return (
              <motion.div
                key={course.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden group cursor-pointer"
                onClick={() => setSelectedCourse(course)}
              >
                <div className={`h-2 bg-gradient-to-r ${course.color}`} />
                
                <div className="p-6">
                  <div className="flex items-center mb-4">
                    <div className={`p-3 rounded-lg bg-gradient-to-r ${course.color} text-white mr-4`}>
                      <IconComponent className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                        {course.title}
                      </h3>
                      <div className="flex items-center text-gray-500 dark:text-gray-400 text-sm mt-1">
                        <Clock className="w-4 h-4 mr-1" />
                        <span>{course.duration}</span>
                      </div>
                    </div>
                  </div>

                  <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">
                    {course.overview.substring(0, 120)}...
                  </p>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                      <User className="w-4 h-4 mr-1" />
                      <span>{course.instructor.name}</span>
                    </div>
                    
                    <motion.button
                      whileHover={{ x: 5 }}
                      className="flex items-center text-blue-600 dark:text-blue-400 font-medium text-sm group-hover:text-blue-700 dark:group-hover:text-blue-300 transition-colors"
                    >
                      Learn More
                      <ArrowRight className="w-4 h-4 ml-1" />
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      <CourseModal
        course={selectedCourse}
        isOpen={!!selectedCourse}
        onClose={() => setSelectedCourse(null)}
      />
    </section>
  );
}