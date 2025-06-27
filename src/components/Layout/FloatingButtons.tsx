import React from 'react';
import { MessageCircle, Phone } from 'lucide-react';

const FloatingButtons: React.FC = () => {
  const handleWhatsApp = () => {
    window.open('https://wa.me/919585889519?text=Hi, I am interested in buying a car from ShiftNgo', '_blank');
  };

  const handleCall = () => {
    window.open('tel:+919876543210', '_self');
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col space-y-3">
      {/* WhatsApp Button */}
      <button
        onClick={handleWhatsApp}
        className="bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-xl transition-all transform hover:scale-110 hover:shadow-2xl group"
      >
        <MessageCircle className="h-6 w-6" />
        <div className="absolute right-full mr-3 top-1/2 transform -translate-y-1/2 bg-gray-900 text-white text-sm px-3 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
          WhatsApp Us
        </div>
      </button>

      {/* Call Button */}
      <button
        onClick={handleCall}
        className="bg-blue-500 hover:bg-blue-600 text-white p-4 rounded-full shadow-xl transition-all transform hover:scale-110 hover:shadow-2xl group"
      >
        <Phone className="h-6 w-6" />
        <div className="absolute right-full mr-3 top-1/2 transform -translate-y-1/2 bg-gray-900 text-white text-sm px-3 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
          Call Now
        </div>
      </button>
    </div>
  );
};

export default FloatingButtons;