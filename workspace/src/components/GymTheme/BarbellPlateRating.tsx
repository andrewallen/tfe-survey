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
  const ratingValues = Array.from({ length: max - min + 1 }, (_, i) => min + i);
  
  // Simplified plate configurations
  const plateConfigs = {
    1: { weight: '2.5kg', color: '#10B981', size: 40 }, // emerald
    2: { weight: '5kg', color: '#3B82F6', size: 45 },   // blue
    3: { weight: '10kg', color: '#F59E0B', size: 55 },  // amber
    4: { weight: '15kg', color: '#EF4444', size: 65 },  // red
    5: { weight: '20kg', color: '#8B5CF6', size: 75 },  // violet
    6: { weight: '25kg', color: '#06B6D4', size: 85 },  // cyan
    7: { weight: '35kg', color: '#F97316', size: 95 },  // orange
    8: { weight: '45kg', color: '#EC4899', size: 105 }, // pink
    9: { weight: '55kg', color: '#14B8A6', size: 115 }, // teal
    10: { weight: '70kg', color: '#DC2626', size: 125 } // red-600
  };

  const getPlateConfig = (rating: number) => {
    return plateConfigs[rating as keyof typeof plateConfigs] || plateConfigs[1];
  };

  const totalWeight = ratingValues
    .filter(r => r <= value)
    .reduce((sum, r) => {
      const config = getPlateConfig(r);
      return sum + parseFloat(config.weight.replace('kg', ''));
    }, 0);

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6 py-4">
      {/* Weight Display */}
      <div className="text-center">
        <motion.div 
          className="text-2xl md:text-3xl font-bold text-tfe-primary mb-2"
          animate={{ scale: value ? 1.05 : 1 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          {totalWeight}kg
        </motion.div>
        <div className="text-sm text-tfe-gray-600">
          {value === 0 ? 'Select your rating' : `Rating: ${value}/${max}`}
        </div>
      </div>

      {/* Barbell Visualization */}
      <div className="relative w-full h-32 flex items-center justify-center">
        {/* Olympic Barbell */}
        <motion.div 
          className="absolute bg-gradient-to-r from-gray-400 via-gray-500 to-gray-400 z-10 shadow-md"
          style={{ 
            width: '280px', 
            height: '12px',
            borderRadius: '6px'
          }}
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        />

        {/* Barbell Sleeves */}
        <div className="absolute left-1/2 transform -translate-x-1/2 w-80 h-4 bg-gray-600 rounded-lg z-5" />

        {/* Plate Loading Animation */}
        <div className="absolute inset-0 flex items-center justify-center">
          {value > 0 && ratingValues.filter(r => r <= value).map((plateValue, index) => {
            const config = getPlateConfig(plateValue);
            const plateOffset = (index + 1) * 8; // Spacing between plates
            
            return (
              <React.Fragment key={plateValue}>
                {/* Left Side Plate */}
                <motion.div
                  className="absolute rounded-lg border-2 border-gray-800 shadow-lg"
                  style={{
                    left: `calc(50% - 140px - ${plateOffset}px)`,
                    width: '12px',
                    height: `${config.size}px`,
                    backgroundColor: config.color,
                    zIndex: 20 + index
                  }}
                  initial={{ x: -50, opacity: 0, scale: 0.8 }}
                  animate={{ x: 0, opacity: 1, scale: 1 }}
                  transition={{ 
                    delay: index * 0.15,
                    type: "spring",
                    stiffness: 200,
                    damping: 15
                  }}
                >
                  {/* Center hole */}
                  <div 
                    className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-gray-800 rounded-full"
                    style={{ width: '6px', height: '6px' }}
                  />
                </motion.div>

                {/* Right Side Plate */}
                <motion.div
                  className="absolute rounded-lg border-2 border-gray-800 shadow-lg"
                  style={{
                    right: `calc(50% - 140px - ${plateOffset}px)`,
                    width: '12px',
                    height: `${config.size}px`,
                    backgroundColor: config.color,
                    zIndex: 20 + index
                  }}
                  initial={{ x: 50, opacity: 0, scale: 0.8 }}
                  animate={{ x: 0, opacity: 1, scale: 1 }}
                  transition={{ 
                    delay: index * 0.15,
                    type: "spring",
                    stiffness: 200,
                    damping: 15
                  }}
                >
                  {/* Center hole */}
                  <div 
                    className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-gray-800 rounded-full"
                    style={{ width: '6px', height: '6px' }}
                  />
                </motion.div>
              </React.Fragment>
            );
          })}
        </div>

        {/* Barbell Clips */}
        <motion.div 
          className="absolute left-6 bg-gray-700 z-30 rounded-sm"
          style={{ width: '8px', height: '20px' }}
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.3 }}
        />
        <motion.div 
          className="absolute right-6 bg-gray-700 z-30 rounded-sm"
          style={{ width: '8px', height: '20px' }}
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.3 }}
        />
      </div>

      {/* Rating Selection Buttons */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 px-4">
        {ratingValues.map((plateValue) => {
          const config = getPlateConfig(plateValue);
          const isSelected = value === plateValue;
          const isActive = value >= plateValue;
          
          return (
            <motion.button
              key={plateValue}
              onClick={() => onChange(plateValue)}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className="relative flex flex-col items-center p-4 rounded-xl border-2 transition-all duration-200 bg-white hover:shadow-lg"
              style={{
                borderColor: isSelected ? config.color : isActive ? `${config.color}80` : '#e5e7eb',
                backgroundColor: isSelected ? config.color : isActive ? `${config.color}15` : 'white',
                boxShadow: isSelected ? `0 4px 12px ${config.color}40` : '0 2px 4px rgba(0,0,0,0.05)'
              }}
            >
              {/* Plate Icon */}
              <div 
                className="w-6 h-6 rounded-lg border-2 border-gray-800 mb-2 relative flex-shrink-0"
                style={{ 
                  backgroundColor: config.color,
                  boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                }}
              >
                <div 
                  className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-gray-800 rounded-full"
                  style={{ width: '4px', height: '4px' }}
                />
              </div>
              
              {/* Rating Number */}
              <div className={`text-lg font-bold mb-1 ${isSelected ? 'text-white' : isActive ? 'text-gray-800' : 'text-gray-500'}`}>
                {plateValue}
              </div>
              
              {/* Weight Label */}
              <div className={`text-xs ${isSelected ? 'text-white' : isActive ? 'text-gray-600' : 'text-gray-400'}`}>
                {config.weight}
              </div>
            </motion.button>
          );
        })}
      </div>

      {/* Labels */}
      {labels && (
        <motion.div 
          className="flex justify-between text-sm text-tfe-gray-600 px-4 mt-4"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <span className="text-left max-w-[30%] text-xs sm:text-sm">{labels[min]}</span>
          {max - min > 2 && labels[Math.floor((max + min) / 2)] && (
            <span className="text-center max-w-[30%] text-xs sm:text-sm">{labels[Math.floor((max + min) / 2)]}</span>
          )}
          <span className="text-right max-w-[30%] text-xs sm:text-sm">{labels[max]}</span>
        </motion.div>
      )}
    </div>
  );
};

export default BarbellPlateRating;
