import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';

interface RopeSliderProps {
  min: number;
  max: number;
  value: number;
  onChange: (value: number) => void;
  labels?: { [key: number]: string };
}

const RopeSlider: React.FC<RopeSliderProps> = ({
  min,
  max,
  value,
  onChange,
  labels,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const sliderRef = useRef<HTMLDivElement>(null);
  
  // Calculate percentage for positioning
  const percentage = ((value - min) / (max - min)) * 100;
  
  // Handle user interaction
  const updateValue = (clientX: number) => {
    if (!sliderRef.current) return;
    
    const rect = sliderRef.current.getBoundingClientRect();
    const position = (clientX - rect.left) / rect.width;
    const newValue = Math.round(min + position * (max - min));
    
    // Clamp value between min and max
    const clampedValue = Math.max(min, Math.min(max, newValue));
    onChange(clampedValue);
  };
  
  // Mouse event handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    updateValue(e.clientX);
  };
  
  // Touch event handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    updateValue(e.touches[0].clientX);
  };
  
  // Setup event listeners for move and end events
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        updateValue(e.clientX);
      }
    };
    
    const handleTouchMove = (e: TouchEvent) => {
      if (isDragging && e.touches[0]) {
        updateValue(e.touches[0].clientX);
      }
    };
    
    const handleEnd = () => {
      setIsDragging(false);
    };
    
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('touchmove', handleTouchMove);
      window.addEventListener('mouseup', handleEnd);
      window.addEventListener('touchend', handleEnd);
    }
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('mouseup', handleEnd);
      window.removeEventListener('touchend', handleEnd);
    };
  }, [isDragging]);

  return (
    <div className="space-y-8 py-6">
      {/* Rope slider */}
      <div
        ref={sliderRef}
        className="relative h-10 cursor-pointer"
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
      >
        {/* Rope track */}
        <div className="absolute top-1/2 left-0 w-full h-2 bg-tfe-gray-400 rounded-full transform -translate-y-1/2" />
        
        {/* Rope detail - wavy pattern */}
        <div className="absolute top-1/2 left-0 w-full h-2 overflow-hidden transform -translate-y-1/2">
          <div 
            className="h-full"
            style={{
              background: 'repeating-linear-gradient(90deg, var(--tfe-gray-500), var(--tfe-gray-500) 5px, var(--tfe-gray-400) 5px, var(--tfe-gray-400) 10px)'
            }}
          />
        </div>
        
        {/* Tick marks */}
        {Array.from({ length: max - min + 1 }).map((_, i) => (
          <div
            key={i}
            className="absolute top-1/2 w-1 h-4 bg-tfe-gray-600 rounded-full transform -translate-y-1/2"
            style={{ left: `${(i / (max - min)) * 100}%` }}
          />
        ))}
        
        {/* Handle - "climbing grip" */}
        <motion.div
          className={`absolute top-1/2 w-10 h-10 -ml-5 rounded-full transform -translate-y-1/2 flex items-center justify-center
            ${isDragging ? 'scale-110' : ''}
          `}
          style={{ 
            left: `${percentage}%`,
            background: 'var(--tfe-primary)',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)',
            cursor: 'grab'
          }}
          animate={{ 
            scale: isDragging ? 1.1 : 1 
          }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95, cursor: 'grabbing' }}
        >
          {/* Handle grip texture */}
          <div className="w-6 h-6 rounded-full bg-tfe-gray-200 flex items-center justify-center">
            <span className="text-sm font-bold text-tfe-gray-800">{value}</span>
          </div>
        </motion.div>
      </div>
      
      {/* Labels */}
      {labels && (
        <div className="flex justify-between text-sm text-tfe-gray-600 px-1">
          <span>{labels[min]}</span>
          {max - min > 2 && labels[Math.round((max + min) / 2)] && (
            <span>{labels[Math.round((max + min) / 2)]}</span>
          )}
          <span>{labels[max]}</span>
        </div>
      )}
    </div>
  );
};

export default RopeSlider;
