import React from "react";
import {
  Car,
  Phone,
  Mail,
  MapPin,
  MessageCircle,
  Facebook,
  Twitter,
  Instagram,
} from "lucide-react";

const Footer: React.FC = () => {
  const handleInstagram = () => {
    window.open(
      "https://www.instagram.com/shift_n_go_preownedcars/?igsh=emQ5c25uOTRxenM%3D#",
      "_blank"
    );
  };

  const handleFacebook = () => {
    window.open(
      "https://www.facebook.com/profile.php?id=61568444363158&ref=_ig_profile_ac",
      "_blank"
    );
  };
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              
              <span className="text-2xl font-bold">Shift N' Go</span>
            </div>
            <p className="text-gray-400 leading-relaxed">
              Your trusted partner in finding the perfect pre-owned car. Drive
              premium, pay less with our certified collection.
            </p>
            <div className="flex space-x-4">
              <button
                onClick={handleFacebook}
                className="bg-gray-800 p-2 rounded-lg hover:bg-gray-700 transition-colors"
              >
                <Facebook className="h-5 w-5" />
              </button>
              <button
                onClick={handleInstagram}
                className="bg-gray-800 p-2 rounded-lg hover:bg-gray-700 transition-colors"
              >
                <Instagram className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Home
                </a>
              </li>
              <li>
                <a
                  href="#inventory"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Our Inventory
                </a>
              </li>
              <li>
                <a
                  href="#why-shiftngo"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Why Choose Us
                </a>
              </li>
              <li>
                <a
                  href="#contact"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Contact Us
                </a>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Our Services</h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Buy Pre-owned Cars
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Car Inspection
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Insurance Support
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Info</h3>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 text-blue-400 mt-0.5 flex-shrink-0" />
                <p className="text-gray-400 text-sm">
                  173 Karlmarx 2nd Street, Mudakkusalai<br />
                    Madurai, Tamil Nadu 625016<br />
                </p>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-blue-400 flex-shrink-0" />
                <a
                  href="tel:+919585889519"
                  className="text-gray-400 hover:text-white transition-colors text-sm"
                >
                  +91 95858 89519
                </a>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-blue-400 flex-shrink-0" />
                <a
                  href="https://mail.google.com/mail/?view=cm&fs=1&to=mabyninigo2001@gmail.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition-colors text-sm"
                >
                  mabyninigo2001@gmail.com
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm text-center w-full">
              © 2024 ShiftNgo. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
