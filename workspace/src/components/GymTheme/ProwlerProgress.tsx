import React from 'react';
import { motion } from 'framer-motion';

interface ProwlerProgressProps {
  progress: number; // 0 to 100
}

const ProwlerProgress: React.FC<ProwlerProgressProps> = ({ progress }) => {
  return (
    <div className="mt-4">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm text-tfe-gray-600">Push to the finish!</span>
        <span className="text-sm font-medium text-tfe-gray-800">
          {Math.round(progress)}%
        </span>
      </div>
      <div className="relative h-12 bg-tfe-gray-200 rounded-lg overflow-hidden">
        {/* Track/Floor */}
        <div className="absolute inset-0 w-full h-full">
          {/* Floor markings */}
          {Array.from({ length: 10 }).map((_, i) => (
            <div 
              key={i} 
              className="absolute h-full w-0.5 bg-tfe-gray-300"
              style={{ left: `${i * 10}%` }}
            />
          ))}
        </div>
        
        {/* The prowler sled */}
        <motion.div
          className="absolute h-full flex items-center"
          initial={{ x: 0 }}
          animate={{ x: `${progress}%` }}
          transition={{ type: 'spring', stiffness: 50, damping: 15 }}
          style={{ left: `-80px` }} // Offset to account for prowler width
        >
          <svg 
            className="h-10" 
            width="80" 
            viewBox="0 0 80 40" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Simplified Prowler Shape */}
            <path 
              d="M10 5 L70 5 L78 20 L70 35 L10 35 L2 20 Z" 
              fill="var(--tfe-primary)" 
              stroke="var(--tfe-primary-dark)" 
              strokeWidth="2"
            />
            {/* Handles */}
            <rect x="15" y="2" width="5" height="36" rx="2" fill="var(--tfe-secondary)" />
            <rect x="60" y="2" width="5" height="36" rx="2" fill="var(--tfe-secondary)" />
            {/* Weight plates */}
            <circle cx="25" cy="20" r="6" fill="var(--tfe-gray-700)" stroke="var(--tfe-gray-500)" />
            <circle cx="55" cy="20" r="6" fill="var(--tfe-gray-700)" stroke="var(--tfe-gray-500)" />
          </svg>
        </motion.div>
        
        {/* Finish line */}
        <div className="absolute right-0 top-0 h-full w-2 bg-tfe-accent" 
             style={{ 
               backgroundImage: 'repeating-linear-gradient(45deg, var(--tfe-accent), var(--tfe-accent) 10px, var(--tfe-accent-dark) 10px, var(--tfe-accent-dark) 20px)'
             }} 
        />

        {/* Progress sweat trail */}
        <motion.div
          className="h-full"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          style={{ 
            background: 'linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(87, 194, 126, 0.2) 100%)',
          }}
        />
      </div>
      
      {/* Motivational message based on progress */}
      <motion.p 
        className="text-xs text-center mt-2 text-tfe-gray-600 italic"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        {progress < 25 && "Get started! You've got this!"}
        {progress >= 25 && progress < 50 && "Keep pushing! You're making great progress!"}
        {progress >= 50 && progress < 75 && "Halfway there! Keep up the good work!"}
        {progress >= 75 && progress < 100 && "Almost at the finish line! Keep going!"}
        {progress === 100 && "You did it! Great job completing the survey!"}
      </motion.p>
    </div>
  );
};

export default ProwlerProgress;
