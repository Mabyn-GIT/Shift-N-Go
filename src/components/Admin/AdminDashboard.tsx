import React, { useState, useEffect } from "react";
import { supabase } from "../../lib/supabase";
import { LogOut, Plus, Car, BarChart3, Menu, X } from "lucide-react";
import CarUploadForm from "./CarUploadForm";
import CarManagement from "./CarManagement";
import toast from "react-hot-toast";

const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"upload" | "manage" | "analytics">(
    "upload"
  );
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Check if the screen is mobile size
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkIfMobile();
    window.addEventListener("resize", checkIfMobile);

    return () => {
      window.removeEventListener("resize", checkIfMobile);
    };
  }, []);

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      toast.success("Logout successful");
    } catch (error: any) {
      toast.error("Logout failed");
    }
  };

  const handleTabChange = (tabId: "upload" | "manage" | "analytics") => {
    setActiveTab(tabId);
    if (isMobile) {
      setMobileMenuOpen(false);
    }
  };

  const tabs = [
    { id: "upload", label: "Upload Car", icon: Plus },
    { id: "manage", label: "Manage Cars", icon: Car },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-4 md:px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div>
              <img
                src="/images/shiftngo-logo.png"
                alt="ShiftNgo Logo"
                className="h-10 w-10 object-contain"
              />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">
                ShiftNgo Admin
              </h1>
              <p className="text-sm text-gray-500 hidden sm:block">
                Car Inventory Management
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden text-gray-600 hover:text-blue-600 focus:outline-none"
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>

            {/* Mobile Navigation Menu - Tabs in header for mobile */}
            {isMobile && mobileMenuOpen && (
              <div className="absolute top-16 left-0 right-0 bg-white z-50 border-b border-gray-200 shadow-lg">
                <div className="p-4 space-y-2">
                  {tabs.map((tab) => {
                    const Icon = tab.icon;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => handleTabChange(tab.id as any)}
                        className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                          activeTab === tab.id
                            ? "bg-blue-50 text-blue-700 border border-blue-200"
                            : "text-gray-600 hover:bg-gray-50"
                        }`}
                      >
                        <Icon className="h-5 w-5" />
                        <span className="font-medium">{tab.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            <button
              onClick={handleLogout}
              className="flex items-center space-x-1 md:space-x-2 text-gray-600 hover:text-red-600 transition-colors"
            >
              <LogOut className="h-5 w-5" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </header>

      <div className="flex flex-col md:flex-row">
        {/* Sidebar - Hidden on mobile */}
        <div className="hidden md:block md:w-64 bg-white border-r border-gray-200 min-h-screen">
          <nav className="p-4 space-y-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                    activeTab === tab.id
                      ? "bg-blue-50 text-blue-700 border border-blue-200"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span className="font-medium">{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-4 md:p-6 overflow-x-hidden">
          {activeTab === "upload" && <CarUploadForm />}
          {activeTab === "manage" && <CarManagement />}
          {activeTab === "analytics" && (
            <div className="bg-white rounded-lg p-6 md:p-8 text-center">
              <BarChart3 className="h-12 w-12 md:h-16 md:w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg md:text-xl font-semibold text-gray-900 mb-2">
                Analytics Coming Soon
              </h3>
              <p className="text-sm md:text-base text-gray-600">
                Detailed analytics and insights will be available in the next
                update.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
