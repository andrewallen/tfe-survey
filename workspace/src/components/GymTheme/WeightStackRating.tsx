import React, { useRef } from 'react';
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
  const containerRef = useRef<HTMLDivElement>(null);
  
  // For better visualization, weights are shown from top (max) to bottom (min)
  // This is how actual weight stacks typically work in gym machines
  const displayValues = [...weightValues].reverse();
  
  return (
    <div className="space-y-6" ref={containerRef}>
      <h2 className="text-2xl font-bold text-center mb-4">Weight Stack Rating</h2>
      <p className="text-center text-tfe-gray-700 mb-4">How would you rate your workout experience?</p>
      
      <div className="relative flex flex-col items-center py-4">
        {/* Weight stack pole */}
        <div className="absolute h-full w-3 bg-tfe-gray-800 rounded-full z-10" />
        
        {/* Pin holder */}
        <div className="absolute h-full w-1 bg-tfe-gray-600 rounded-full z-0 left-[calc(50%+14px)]" />
        
        {/* Weight stack plates */}
        <div className="space-y-3 z-10 flex flex-col items-center">
          {displayValues.map((weightValue) => {
            const isSelected = value === weightValue;
            const weightIndex = displayValues.indexOf(weightValue);
            
            return (
              <div key={weightValue} className="relative w-full flex items-center justify-center">
                {/* Weight number (outside the plate for better readability) */}
                <div className="absolute right-[calc(50%+120px)] font-bold text-2xl text-tfe-gray-800 z-20">
                  {weightValue}
                </div>
                
                <motion.button
                  onClick={() => onChange(weightValue)}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ 
                    opacity: 1,
                    x: 0,
                    y: isSelected ? -4 : 0
                  }}
                  whileHover={{ 
                    scale: 1.02,
                    y: -2
                  }}
                  transition={{ 
                    duration: 0.2,
                    delay: weightIndex * 0.05 
                  }}
                  className={`
                    relative flex items-center justify-center
                    h-14 md:h-16 w-64 md:w-80
                    rounded-md shadow-lg transition-all duration-200
                    ${isSelected 
                      ? 'bg-tfe-primary text-white border-2 border-white' 
                      : 'bg-tfe-gray-300 text-tfe-gray-700 hover:bg-tfe-gray-400'
                    }
                  `}
                  style={{
                    zIndex: displayValues.length - weightIndex + (isSelected ? 20 : 0),
                    boxShadow: isSelected 
                      ? '0 8px 16px rgba(0, 0, 0, 0.3)' 
                      : '0 4px 6px rgba(0, 0, 0, 0.1)'
                  }}
                  aria-label={`Rate ${weightValue}`}
                  aria-pressed={isSelected}
                >
                  {/* Weight hole (center) */}
                  <div className="absolute left-1/2 transform -translate-x-1/2 w-8 h-8 bg-tfe-gray-700 rounded-full flex items-center justify-center overflow-hidden">
                    <div className="w-4 h-4 bg-tfe-gray-900 rounded-full"></div>
                  </div>
                  
                  {/* Selection pin (right side) */}
                  {isSelected && (
                    <motion.div 
                      className="absolute right-8 w-14 h-4 bg-tfe-secondary rounded-md z-20 shadow-lg"
                      initial={{ x: 20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      exit={{ x: 20, opacity: 0 }}
                    />
                  )}
                </motion.button>
              </div>
            );
          })}
        </div>
        
        {/* Base stand */}
        <div className="w-72 h-8 mt-6 bg-tfe-gray-800 rounded-md shadow-md"></div>
        <div className="w-96 h-4 mt-1 bg-tfe-gray-700 rounded-b-md shadow-inner"></div>
      </div>

      {/* Labels at bottom */}
      <div className="grid grid-cols-3 text-lg font-medium text-tfe-gray-700 mt-6 w-full">
        <span className="text-left">{labels?.[min] || 'Poor'}</span>
        <span className="text-center">{labels?.[Math.floor((max + min) / 2)] || 'Neutral'}</span>
        <span className="text-right">{labels?.[max] || 'Excellent'}</span>
      </div>
      
      {/* Selected value */}
      <div className="text-center text-tfe-gray-600 font-medium mt-2">
        Selected value: {value}
      </div>
    </div>
  );
};

export default WeightStackRating;
