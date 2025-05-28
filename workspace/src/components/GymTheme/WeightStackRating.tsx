import React from 'react';
import { motion } from 'framer-motion';

interface WeightStackRatingProps {
  min: number;
  max: number;
  value: number;
  onChange: (value: number) => void;
  labels?: { [key: number]: string };
}

const WeightStackRating: React.FC<WeightStackRatingProps> = ({
  min,
  max,
  value,
  onChange,
  labels,
}) => {
  // Create an array from min to max
  const weightValues = Array.from({ length: max - min + 1 }, (_, i) => min + i);
  
  return (
    <div className="space-y-4">
      <div className="relative flex flex-col items-center">
        {/* Weight stack pole */}
        <div className="absolute h-full w-1.5 bg-tfe-secondary rounded-full z-0" />
        
        {/* Weight plates */}
        <div className="space-y-3 z-10">
          {weightValues.map((weightValue) => {
            const isSelected = value === weightValue;
            const plateWidth = 100 + (weightValue - min) * 10; // Gradually increasing width
            
            return (
              <motion.button
                key={weightValue}
                onClick={() => onChange(weightValue)}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: weightValue * 0.05 }}
                className={`
                  relative flex items-center justify-center
                  h-14 rounded-md shadow-md transition-all duration-200
                  font-bold text-xl
                  ${isSelected 
                    ? 'bg-tfe-primary text-white border-2 border-white' 
                    : 'bg-tfe-gray-300 text-tfe-gray-700 hover:bg-tfe-gray-400'
                  }
                `}
                style={{ 
                  width: `${plateWidth}px`,
                  transform: isSelected ? 'translateY(-4px)' : 'translateY(0)',
                  zIndex: isSelected ? 20 : 10 - weightValue // Higher values appear on top for 3D effect
                }}
              >
                {/* Weight hole */}
                <div className="absolute left-[calc(50%-8px)] w-4 h-4 bg-tfe-gray-700 rounded-full" />
                <span className="ml-4">{weightValue}</span>
              </motion.button>
            );
          })}
        </div>
        
        {/* Base stand */}
        <div className="w-24 h-5 mt-3 bg-tfe-gray-700 rounded-md" />
      </div>

      {/* Labels at bottom if provided */}
      {labels && (
        <div className="flex justify-between text-sm text-tfe-gray-600 mt-4 px-2">
          <span>{labels[min]}</span>
          {max - min > 2 && labels[Math.floor((max + min) / 2)] && (
            <span>{labels[Math.floor((max + min) / 2)]}</span>
          )}
          <span>{labels[max]}</span>
        </div>
      )}
    </div>
  );
};

export default WeightStackRating;
