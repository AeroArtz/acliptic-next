import React from 'react';
import Image from 'next/image';
import FeatureCard from './getToKnowCard';


const FeatureSection = () => {
  const dialogContent = (
    <div className="space-y-4">
        <p>Learn more about our platform and services.</p>
    </div>
  );

  const privacyDialogContent = (
    <div className="space-y-6">
      <div className="relative w-full h-[300px] rounded-xl overflow-hidden">
        <Image
          src="/sec1.avif"
          alt="Analytics Dashboard"
          fill
          className="object-cover"
        />
      </div>
      <div className="grid grid-cols-3 gap-4">
        <div className="p-4 bg-gray-50 rounded-lg text-center">
          <h4 className="font-medium mb-2">Security Features</h4>
          <p className="text-gray-600">Real-time view counts and engagement metrics</p>
        </div>
        <div className="p-4 bg-gray-50 rounded-lg text-center">
          <h4 className="font-medium mb-2">End-to-end encryption</h4>
          <p className="text-gray-600">Detailed viewer demographics and behavior</p>
        </div>
        <div className="p-4 bg-gray-50 rounded-lg text-center">
          <h4 className="font-medium mb-2">Compliance with industry standards</h4>
          <p className="text-gray-600">Comprehensive performance analytics</p>
        </div>
      </div>
    </div>
  );

  const analyticsDialogContent = (
    <div className="space-y-6">
      <div className="relative w-full h-[300px] rounded-xl overflow-hidden">
        <Image
          src="/analyticsDia.jpeg"
          alt="Analytics Dashboard"
          fill
          className="object-cover"
        />
      </div>
      <div className="grid grid-cols-3 gap-4">
        <div className="p-4 bg-gray-50 rounded-lg text-center">
          <h4 className="font-medium mb-2">View Tracking</h4>
          <p className="text-gray-600">Real-time view counts and engagement metrics</p>
        </div>
        <div className="p-4 bg-gray-50 rounded-lg text-center">
          <h4 className="font-medium mb-2">User Insights</h4>
          <p className="text-gray-600">Detailed viewer demographics and behavior</p>
        </div>
        <div className="p-4 bg-gray-50 rounded-lg text-center">
          <h4 className="font-medium mb-2">Performance</h4>
          <p className="text-gray-600">Comprehensive performance analytics</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="mt-[150px] ml-2 px-16 max-w-[1380px]">
      <h2 className="text-[40px] mb-8 font-medium">
        Get to know Side-Effect
      </h2>

      <div className="flex gap-8 mt-[80px]">
        <FeatureCard
          title="About Us"
          subtitle="Context aware and reframe capable."
          image="/know2.jpeg"
          dialogContent={{
            title: "About Us",
            content: dialogContent
          }}
        />

        <FeatureCard
          title="Privacy and Security"
          subtitle="Your business is nobody else's."
          isGradient={true}
          gradientColors={[
            'from-[#6790BC]',
            'via-[#91B7D9]',
            'to-[#BBDDF6]'
          ]}
          dialogContent={{
            title: "Privacy and Security",
            content: privacyDialogContent
          }}
        >
          <div className="flex justify-center items-center mt-32">
            <img
              src="lock.png"
              alt="Lock"
              className="w-60 h-60 object-contain"
            />
          </div>
          <div className="flex justify-center space-x-4 mt-20">
            {[...Array(7)].map((_, i) => (
              <div
                key={i}
                className="w-4 h-4 rounded-full bg-white"
              />
            ))}
          </div>
        </FeatureCard>

        <FeatureCard
          title="Analytics"
          subtitle="See views for the clips"
          image="/analytics.png"
          dialogContent={{
            title: "Analytics",
            content: analyticsDialogContent
          }}
        />
      </div>
    </div>
  );
};

export default FeatureSection;