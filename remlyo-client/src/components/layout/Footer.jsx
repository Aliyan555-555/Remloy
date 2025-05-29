// src/components/layout/Footer.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="py-6">
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap justify-between items-center">
          <div className="flex space-x-6 mb-4 sm:mb-0">
            <Link to="/about" className="text-gray-600 hover:text-brand-green">About</Link>
            <Link to="/terms" className="text-gray-600 hover:text-brand-green">Terms</Link>
            <Link to="/privacy" className="text-gray-600 hover:text-brand-green">Privacy</Link>
            <Link to="/help" className="text-gray-600 hover:text-brand-green">Help</Link>
            <Link to="/contact" className="text-gray-600 hover:text-brand-green">Contact</Link>
          </div>
          <div className="text-gray-500 text-sm">
            Remlyo @ All right reserved
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;