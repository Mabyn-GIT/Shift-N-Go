import React, { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("hero");

  // Add scroll observer to detect which section is currently in view
  useEffect(() => {
    const sections = ["hero", "inventory", "why-shiftngo", "contact"];

    const observerOptions = {
      root: null,
      rootMargin: "-80px 0px -20% 0px", // Adjust rootMargin to account for header height
      threshold: 0.3,
    };

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        // If the section is in view
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(
      observerCallback,
      observerOptions
    );

    // Observe all sections
    sections.forEach((sectionId) => {
      const element = document.getElementById(sectionId);
      if (element) {
        observer.observe(element);
      }
    });

    return () => {
      // Clean up observer when component unmounts
      sections.forEach((sectionId) => {
        const element = document.getElementById(sectionId);
        if (element) {
          observer.unobserve(element);
        }
      });
    };
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      setActiveSection(sectionId);
    }
    setIsMenuOpen(false);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 shadow-md bg-[#F8F8F8]">
      <div className="w-full flex items-center justify-between">
        {/* Left side with logo */}
        <div className="flex items-center space-x-3 pl-4 sm:pl-6 lg:pl-8 py-1">
          <img
            src="/images/shiftngo-logo.png"
            alt="Shift N' Go Logo"
            className="object-contain h-12 sm:h-14 lg:h-16"
          />
          <div className="flex flex-col items-center">
            <h1 
              className="text-xl sm:text-2xl lg:text-3xl font-bold text-red-600 leading-tight tracking-wide italic relative"
              style={{
          fontFamily: '"Mensa Exp Bold Italic", "Arial Black", sans-serif',
          textShadow: `
            1px 1px 0px #8B0000,
            2px 2px 0px #660000,
            3px 3px 0px #440000,
            4px 4px 6px rgba(0,0,0,0.3)
          `,
          transform: 'perspective(300px) rotateX(8deg)',
          filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))',
          borderBottom: '3px solid #B30000', // Darker red underline with increased thickness
          paddingBottom: '2px',
          boxShadow: '0 4px 6px -4px rgba(139,0,0,0.8)' // 3D effect for the underline
              }}
            >
              SHIFT N' GO
            </h1>
            <p 
              className="text-xs sm:text-sm text-black font-bold tracking-widest mt-1"
              style={{
          fontFamily: '"Mensa Exp Bold Italic", "Arial Black", sans-serif',
          transform: 'perspective(300px) rotateX(10deg)',
          color: '#000000',
          WebkitTextStroke: '0.5px #333', // Adding depth to text
          letterSpacing: '1px',
          filter: 'drop-shadow(0px 2px 1px rgba(0,0,0,0.4))' // Enhanced 3D effect
              }}
            >
              THE CAR SHOP
            </p>
          </div>
        </div>

        {/* Right side with navigation on white background */}
        <div className="h-full pr-8 sm:pr-12 md:pr-16">
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-10">
            <button
              onClick={() => scrollToSection("hero")}
              className={`font-medium transition-colors ${
                activeSection === "hero"
                  ? "text-red-600 border-b-2 border-red-600"
                  : "text-gray-800 hover:text-red-600 hover:border-b-2 hover:border-red-600"
              }`}
            >
              Home
            </button>
            <button
              onClick={() => scrollToSection("inventory")}
              className={`font-medium transition-colors ${
                activeSection === "inventory"
                  ? "text-red-600 border-b-2 border-red-600"
                  : "text-gray-800 hover:text-red-600 hover:border-b-2 hover:border-red-600"
              }`}
            >
              Inventory
            </button>
            <button
              onClick={() => scrollToSection("why-shiftngo")}
              className={`font-medium transition-colors ${
                activeSection === "why-shiftngo"
                  ? "text-red-600 border-b-2 border-red-600"
                  : "text-gray-800 hover:text-red-600 hover:border-b-2 hover:border-red-600"
              }`}
            >
              Why ShiftNgo
            </button>
            <button
              onClick={() => scrollToSection("contact")}
              className={`font-medium transition-colors ${
                activeSection === "contact"
                  ? "text-red-600 border-b-2 border-red-600"
                  : "text-gray-800 hover:text-red-600 hover:border-b-2 hover:border-red-600"
              }`}
            >
              Contact
            </button>
          </nav>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-lg bg-gray-200 hover:bg-gray-300 transition-colors"
          >
            {isMenuOpen ? (
              <X className="h-6 w-6 text-gray-900" />
            ) : (
              <Menu className="h-6 w-6 text-gray-900" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="absolute top-20 left-0 right-0 md:hidden py-4 bg-[#F8F8F8] shadow-lg">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <nav className="flex flex-col space-y-4">
              <button
                onClick={() => scrollToSection("hero")}
                className={`font-medium transition-colors px-2 py-1 text-left ${
                  activeSection === "hero"
                    ? "text-red-600 border-l-4 border-red-600 pl-3"
                    : "text-gray-800 hover:text-red-600 hover:border-l-4 hover:border-red-600 hover:pl-3"
                }`}
              >
                Home
              </button>
              <button
                onClick={() => scrollToSection("inventory")}
                className={`font-medium transition-colors px-2 py-1 text-left ${
                  activeSection === "inventory"
                    ? "text-red-600 border-l-4 border-red-600 pl-3"
                    : "text-gray-800 hover:text-red-600 hover:border-l-4 hover:border-red-600 hover:pl-3"
                }`}
              >
                Inventory
              </button>
              <button
                onClick={() => scrollToSection("why-shiftngo")}
                className={`font-medium transition-colors px-2 py-1 text-left ${
                  activeSection === "why-shiftngo"
                    ? "text-red-600 border-l-4 border-red-600 pl-3"
                    : "text-gray-800 hover:text-red-600 hover:border-l-4 hover:border-red-600 hover:pl-3"
                }`}
              >
                Why ShiftNgo
              </button>
              <button
                onClick={() => scrollToSection("contact")}
                className={`font-medium transition-colors px-2 py-1 text-left ${
                  activeSection === "contact"
                    ? "text-red-600 border-l-4 border-red-600 pl-3"
                    : "text-gray-800 hover:text-red-600 hover:border-l-4 hover:border-red-600 hover:pl-3"
                }`}
              >
                Contact
              </button>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
