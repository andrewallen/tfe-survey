import React from 'react';
import { motion } from 'framer-motion';

interface BarbellPlateRatingProps {
  min: number;
  max: number;
  value: number;
  onChange: (value: number) => void;
  labels?: { [key: number]: string };
}

const BarbellPlateRating: React.FC<BarbellPlateRatingProps> = ({
  min,
  max,
  value,
  onChange,
  labels,
}) => {
  // Create an array from min to max
  const ratingValues = Array.from({ length: max - min + 1 }, (_, i) => min + i);
  
  return (
    <div className="space-y-6 py-4">
      <div className="relative flex flex-col items-center justify-center h-32">
        {/* Center point markers */}
        <div className="absolute top-0 bottom-0 w-0.5 bg-tfe-gray-400" />
        
        {/* Barbell */}
        <div className="w-full h-3 bg-tfe-gray-700 rounded-full z-20 mb-2" />
        
        {/* Plates container */}
        <div className="flex items-center justify-center mt-2">
          {ratingValues.map((plateValue) => {
            const isSelected = value === plateValue;
            const isActive = value >= plateValue;
            const plateSize = 50 + (plateValue - min) * 10; // Gradually increasing size
            const plateWidth = 12;
            
            return (
              <motion.button
                key={plateValue}
                onClick={() => onChange(plateValue)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ 
                  opacity: 1, 
                  y: 0,
                  scale: isSelected ? 1.1 : 1
                }}
                transition={{ 
                  delay: (plateValue - min) * 0.1,
                  type: 'spring',
                  stiffness: 100,
                  damping: 15
                }}
                className="relative"
                style={{
                  zIndex: max - plateValue,
                  marginLeft: plateValue === min ? 0 : -plateWidth/2,
                  marginRight: plateValue === max ? 0 : -plateWidth/2
                }}
              >
                {/* Plate shape */}
                <div 
                  className="rounded-sm flex items-center justify-center font-bold transition-all duration-200 border-2"
                  style={{
                    height: `${plateSize}px`,
                    width: `${plateWidth}px`,
                    background: isSelected 
                      ? 'var(--tfe-primary)' 
                      : isActive 
                        ? 'var(--tfe-primary-light)' 
                        : 'var(--tfe-gray-300)',
                    borderColor: isSelected 
                      ? 'var(--tfe-primary-dark)' 
                      : isActive 
                        ? 'var(--tfe-primary)' 
                        : 'var(--tfe-gray-400)',
                    transform: isSelected ? 'translateY(-8px)' : 'translateY(0)',
                    boxShadow: isSelected ? '0 4px 8px rgba(0,0,0,0.2)' : 'none'
                  }}
                >
                  {/* Center hole */}
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-tfe-gray-700 rounded-full" />
                  
                  {/* Plate value text */}
                  <div 
                    className="absolute top-1/2 transform -translate-y-1/2 right-[-24px] rounded-full w-6 h-6 flex items-center justify-center"
                    style={{
                      background: isSelected ? 'var(--tfe-primary-dark)' : 'var(--tfe-gray-200)',
                      color: isSelected ? 'white' : 'var(--tfe-gray-700)',
                      fontSize: '0.75rem',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                    }}
                  >
                    {plateValue}
                  </div>
                </div>
              </motion.button>
            );
          })}
        </div>
        
        {/* Barbell ends */}
        <div className="absolute left-2 top-[46px] w-6 h-10 bg-tfe-gray-500 rounded-l-full" />
        <div className="absolute right-2 top-[46px] w-6 h-10 bg-tfe-gray-500 rounded-r-full" />
      </div>

      {/* Labels if provided */}
      {labels && (
        <div className="flex justify-between text-sm text-tfe-gray-600 px-4 mt-6">
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

export default BarbellPlateRating;
