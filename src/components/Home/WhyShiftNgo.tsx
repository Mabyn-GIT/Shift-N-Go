import React from "react";
import { Shield, Search, CreditCard, Users, Award, Clock } from "lucide-react";

const WhyShiftNgo: React.FC = () => {
  const features = [
    {
      icon: Shield,
      title: "Certified Cars",
      description:
        "Every vehicle undergoes rigorous 200-point inspection to ensure quality and reliability.",
      color: "from-blue-500 to-blue-600",
    },
    {
      icon: Search,
      title: "Free Inspection",
      description:
        "Comprehensive inspection report provided for complete transparency and peace of mind.",
      color: "from-green-500 to-green-600",
    },
    {
      icon: CreditCard,
      title: "Easy Financing",
      description:
        "Flexible financing options with competitive rates to make your dream car affordable.",
      color: "from-purple-500 to-purple-600",
    },
    {
      icon: Users,
      title: "Trusted Sellers",
      description:
        "Work with verified and trusted sellers who prioritize customer satisfaction.",
      color: "from-orange-500 to-orange-600",
    },
    {
      icon: Award,
      title: "Quality Guarantee",
      description:
        "7-day return policy if you are not completely satisfied with your purchase.",
      color: "from-red-500 to-red-600",
    },
    {
      icon: Clock,
      title: "24/7 Support",
      description:
        "Round-the-clock customer support to assist you throughout your car buying journey.",
      color: "from-teal-500 to-teal-600",
    },
  ];

  return (
    <section
      id="why-shiftngo"
      className="py-24 bg-gradient-to-br from-gray-800 via-gray-700 to-gray-800 relative overflow-hidden"
    >
      {/* Background decoration with red touch */}
      <div className="absolute top-20 right-10 w-64 h-64 bg-gradient-to-r from-red-500 to-red-700 rounded-full mix-blend-multiply filter blur-xl opacity-15 animate-pulse"></div>
      <div className="absolute bottom-20 left-10 w-72 h-72 bg-gradient-to-r from-red-600 to-red-800 rounded-full mix-blend-multiply filter blur-xl opacity-15 animate-pulse delay-1000"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-20">
          <h2 className="text-4xl font-bold text-white mb-4">
            Why Choose ShiftNgo
          </h2>
          <div className="h-1 w-24 bg-red-600 mx-auto"></div>
          <p className="mt-6 text-xl text-gray-300 max-w-3xl mx-auto">
            We make buying pre-owned cars simple, transparent, and hassle-free
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white/10 backdrop-blur-sm rounded-xl p-8 transition-all duration-300 hover:bg-white/20 hover:shadow-xl border border-white/10 relative overflow-hidden group"
            >
              <div
                className={`absolute bottom-0 right-0 w-24 h-24 bg-gradient-${feature.color} rounded-full mix-blend-multiply filter blur-xl opacity-20 group-hover:opacity-30 transition-opacity duration-300`}
              ></div>
              <div className="relative z-10">
                <div
                  className={`inline-flex items-center justify-center p-3 rounded-lg bg-gradient-to-r ${feature.color} text-white mb-6`}
                >
                  <feature.icon className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-300">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyShiftNgo;
