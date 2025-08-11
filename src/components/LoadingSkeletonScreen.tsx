// components/LoadingScreen.tsx
import React from "react";
import { HashLoader } from "react-spinners";

const SkeletonLoader = ({ className = "" }: { className?: string }) => (
  <div className={`animate-pulse bg-gray-400 dark:bg-gray-700 rounded ${className}`}></div>
);

const LoadingScreen = () => {
  return (
    <div className="flex justify-center items-center h-screen">
      <HashLoader 
        color="#000000"
        size={50}
        speedMultiplier={0.9}
      />
    </div>
  );
};

export { SkeletonLoader, LoadingScreen };