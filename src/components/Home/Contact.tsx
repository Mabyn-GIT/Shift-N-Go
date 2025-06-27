import React from "react";
import { MapPin, Phone, Mail, Clock, MessageCircle } from "lucide-react";

const Contact: React.FC = () => {
  const handleWhatsApp = () => {
    window.open(
      "https://wa.me/919876543210?text=Hi, I would like to know more about ShiftNgo services",
      "_blank"
    );
  };

  return (
    <section
      id="contact"
      className="py-20 bg-gradient-to-br from-gray-800 via-gray-700 to-gray-800 relative overflow-hidden"
    >
      {/* Background decoration with red touch */}
      <div className="absolute top-10 right-20 w-64 h-64 bg-gradient-to-r from-red-600 to-red-800 rounded-full mix-blend-multiply filter blur-xl opacity-15 animate-pulse"></div>
      <div className="absolute bottom-40 left-20 w-48 h-48 bg-gradient-to-r from-red-500 to-red-700 rounded-full mix-blend-multiply filter blur-xl opacity-15 animate-pulse delay-700"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4">Get in Touch</h2>
          <div className="h-1 w-24 bg-red-600 mx-auto"></div>
          <p className="mt-6 text-xl text-gray-300 max-w-3xl mx-auto">
        Ready to find your dream car? Contact us today and let our experts
        help you make the right choice
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* Contact Information */}
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8 border border-white/10 shadow-lg">
        <h3 className="text-2xl font-bold text-white mb-6">
          Contact Information
        </h3>

        <div className="space-y-6">
          <div className="flex items-start">
            <div className="flex-shrink-0">
          <MapPin className="h-6 w-6 text-red-500" />
            </div>
            <div className="ml-4">
          <p className="text-white font-medium">Location</p>
          <p className="text-gray-300">
            173 Karlmarx 2nd Street, Mudakkusalai<br />
                    Madurai, Tamil Nadu 625016<br />
          </p>
            </div>
          </div>

          <div className="flex items-start">
            <div className="flex-shrink-0">
          <Phone className="h-6 w-6 text-red-500" />
            </div>
            <div className="ml-4">
          <p className="text-white font-medium">Phone</p>
          <p className="text-gray-300">+91 95858 89519</p>
            </div>
          </div>

          <div className="flex items-start">
            <div className="flex-shrink-0">
          <Mail className="h-6 w-6 text-red-500" />
            </div>
            <div className="ml-4">
          <p className="text-white font-medium">Email</p>
          <p className="text-gray-300">mabyninigo2001@gmail.com</p>
            </div>
          </div>

          <div className="flex items-start">
            <div className="flex-shrink-0">
          <Clock className="h-6 w-6 text-red-500" />
            </div>
            <div className="ml-4">
          <p className="text-white font-medium">Business Hours</p>
          <p className="text-gray-300">
            Monday - Saturday: 10:00 AM - 8:00 PM
          </p>
          <p className="text-gray-300">Sunday: By appointment only</p>
            </div>
          </div>
        </div>

        <div className="mt-10">
          <button
            onClick={handleWhatsApp}
            className="flex items-center justify-center w-full py-3 px-6 bg-gradient-to-r from-red-600 to-red-700 rounded-lg text-white font-medium hover:from-red-700 hover:to-red-800 transition-all duration-300"
          >
            <MessageCircle className="h-5 w-5 mr-2" />
            Chat on WhatsApp
          </button>
        </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg overflow-hidden relative h-full min-h-[400px]">
        <iframe 
          src="https://www.google.com/maps/embed?pb=!1m17!1m12!1m3!1d3929.984738058291!2d78.08914727370426!3d9.935227474148649!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m2!1m1!2zOcKwNTYnMDYuOCJOIDc4wrAwNSczMC4yIkU!5e0!3m2!1sen!2sin!4v1750920564710!5m2!1sen!2sin" 
          className="w-full h-full border-0"
          allowFullScreen
          loading="lazy" 
          referrerPolicy="no-referrer-when-downgrade"
        ></iframe>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
