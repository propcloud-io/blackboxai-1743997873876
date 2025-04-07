import React from 'react';

export default function FeaturesSection() {
  const features = [
    {
      title: "Automated Guest Communication",
      description: "AI-powered messaging handles all guest inquiries instantly",
      icon: "💬"
    },
    {
      title: "Smart Pricing",
      description: "Dynamic pricing adjusts based on demand and competition",
      icon: "💰" 
    },
    {
      title: "Unified Calendar",
      description: "Syncs across all booking platforms in real-time",
      icon: "📅"
    }
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">Powerful Features</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition">
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}