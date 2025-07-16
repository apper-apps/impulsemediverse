import React from "react";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";

const Footer = ({ className }) => {
  const footerSections = [
    {
      title: 'Platform',
      links: [
        { name: 'Features', href: '#' },
        { name: 'Specialties', href: '#' },
        { name: 'API', href: '#' }
      ]
    },
    {
      title: 'Pricing',
      links: [
        { name: 'Pricing Plans', href: '#' },
        { name: 'Enterprise', href: '#' },
        { name: 'Student Discount', href: '#' }
      ]
    },
    {
      title: 'Support',
      links: [
        { name: 'Support Center', href: '#' },
        { name: 'FAQ', href: '#' },
        { name: 'Help Center', href: '#' }
      ]
    },
    {
      title: 'Legal',
      links: [
        { name: 'Privacy Policy', href: '#' },
        { name: 'Terms of Service', href: '#' },
        { name: 'Contact Us', href: '#' }
      ]
    }
  ];

  return (
<footer className={cn("bg-gray-50 border-t border-gray-200", className)}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                <ApperIcon name="Heart" size={20} className="text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">MediVerse AI</h3>
                <p className="text-sm text-gray-600">AI General Hospital</p>
              </div>
            </div>
            <p className="text-gray-600 mb-6 max-w-md">
              Revolutionizing healthcare with AI-powered medical consultations, 
              comprehensive health monitoring, and personalized treatment plans 
              available 24/7.
            </p>
            <div className="flex items-center space-x-2 px-3 py-2 bg-gradient-to-r from-green-100 to-green-200 rounded-lg inline-flex">
              <ApperIcon name="Shield" size={16} className="text-green-600" />
              <span className="text-sm font-medium text-green-800">HIPAA Compliant & Secure</span>
            </div>
          </div>

          {/* Link Sections */}
          {footerSections.map((section) => (
            <div key={section.title}>
              <h4 className="font-semibold text-gray-900 mb-4">{section.title}</h4>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <a 
                      href={link.href}
                      className="text-gray-600 hover:text-blue-600 transition-colors duration-200 text-sm footer-link"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-200 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex items-center space-x-6">
              <p className="text-sm text-gray-600">
                © 2024 MediVerse AI. All rights reserved.
              </p>
              <div className="hidden md:flex items-center space-x-2 text-xs text-gray-500">
                <ApperIcon name="MapPin" size={12} />
                <span>Global Healthcare Network</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                {['Facebook', 'Twitter', 'Linkedin', 'Instagram'].map((social) => (
                  <button
                    key={social}
                    className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                    aria-label={`Follow us on ${social}`}
                  >
                    <ApperIcon name={social} size={16} className="text-gray-600 hover:text-blue-600" />
                  </button>
                ))}
              </div>
            </div>
          </div>
</div>
      </div>
    </footer>
  );
};

export default Footer;