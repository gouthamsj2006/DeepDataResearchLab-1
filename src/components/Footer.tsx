import React from 'react';
import { motion } from 'framer-motion';
import { Facebook, Twitter, Linkedin, Instagram } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gradient-to-r from-blue-900 to-indigo-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          {/* Logo and Company Info */}
          <div className="mb-8">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <img 
                src="/logo.png" 
                alt="DDRL Logo" 
                className="h-12 w-auto object-contain"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                }}
              />
              <div>
                <h3 className="text-2xl font-bold">DDRL</h3>
                <p className="text-blue-200 text-sm">Deep Data Research Lab</p>
              </div>
            </div>
            
            <p className="text-xl font-medium text-blue-200 mb-6">
              Train. Transform. Thrive.
            </p>
            
            <p className="text-blue-100 max-w-2xl mx-auto">
              Empowering professionals with cutting-edge skills in AI, Data Engineering, 
              Cloud Technologies, and Business Analysis through expert-led training programs.
            </p>
          </div>

          {/* Social Media Links */}
          <div className="flex justify-center space-x-6 mb-8">
            {[
              { icon: Facebook, href: '#', label: 'Facebook' },
              { icon: Twitter, href: '#', label: 'Twitter' },
              { icon: Linkedin, href: '#', label: 'LinkedIn' },
              { icon: Instagram, href: '#', label: 'Instagram' },
            ].map(({ icon: Icon, href, label }) => (
              <motion.a
                key={label}
                href={href}
                whileHover={{ scale: 1.1, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="p-3 bg-white/10 rounded-full hover:bg-white/20 transition-colors"
                aria-label={label}
              >
                <Icon className="w-5 h-5" />
              </motion.a>
            ))}
          </div>

          {/* Quick Links */}
          <div className="grid md:grid-cols-3 gap-8 mb-8 text-sm">
            <div>
              <h4 className="font-semibold mb-3">Courses</h4>
              <ul className="space-y-2 text-blue-200">
                <li><a href="#" className="hover:text-white transition-colors">Data Engineering</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Service Delivery</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Database Administration</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-3">More Courses</h4>
              <ul className="space-y-2 text-blue-200">
                <li><a href="#" className="hover:text-white transition-colors">DevOps</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Business and Process Analysis</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-3">Contact</h4>
              <ul className="space-y-2 text-blue-200">
                <li>
                  <a href="mailto:deepdataresearchlabs@gmail.com" className="hover:text-white transition-colors">
                    deepdataresearchlabs@gmail.com
                  </a>
                </li>
                <li>
                  <a href="tel:+919663550858" className="hover:text-white transition-colors">
                    +91 9663550858
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Copyright */}
          <div className="border-t border-blue-800 pt-8">
            <p className="text-blue-200">
              © 2025 DDRL – Deep Data Research Lab. All Rights Reserved.
            </p>
          </div>
        </motion.div>
      </div>
    </footer>
  );
}