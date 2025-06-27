import React from "react";
import { ArrowRight } from "lucide-react";

const Hero: React.FC = () => {
  const scrollToInventory = () => {
    const element = document.getElementById("inventory");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleWhatsApp = () => {
    window.open(
      "https://wa.me/919585889519?text=Hi, I want to know more about ShiftNgo cars",
      "_blank"
    );
  };

  return (
    <section
      id="hero"
      className="pt-[90px] min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-black relative overflow-hidden"
    >
      {/* Background decoration */}
      <div className="absolute inset-0 bg-grid-gray-800 opacity-25"></div>
      <div className="absolute top-20 right-10 w-72 h-72 bg-gradient-to-r from-red-500 to-red-700 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
      <div className="absolute bottom-20 left-10 w-96 h-96 bg-gradient-to-r from-red-600 to-red-800 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-1000"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <div className="max-w-4xl mx-auto flex flex-col items-center">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
            Every Car Has{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-red-700">
              a Story
            </span>
            .
            <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-red-600">
              Start yours{" "}
            </span>
            Here.
          </h1>

          <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
            Behind every wheel is a story waiting to continue.
            <br/>Ready for the right person to write the next chapter.
            <br/>
            <span className="italic text-red-400">
              May be that's you.
            </span>
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6 mb-16">
            <button
              onClick={scrollToInventory}
              className="bg-gradient-to-r from-red-600 to-red-700 text-white px-8 py-4 rounded-full font-semibold text-lg hover:from-red-700 hover:to-red-800 transition-all transform hover:scale-105 shadow-xl flex items-center space-x-2 group"
            >
              <span>Browse Garage</span>
              <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              onClick={handleWhatsApp}
              className="bg-white text-gray-900 px-8 py-4 rounded-full font-semibold text-lg border-2 border-gray-200 hover:border-red-600 hover:text-red-600 transition-all transform hover:scale-105 shadow-lg"
            >
              WhatsApp Us
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
