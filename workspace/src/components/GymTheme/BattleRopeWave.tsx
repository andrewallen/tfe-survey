import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';

interface BattleRopeWaveProps {
  min: number;
  max: number;
  value: number;
  onChange: (value: number) => void;
  labels?: { [key: number]: string };
}

const BattleRopeWave: React.FC<BattleRopeWaveProps> = ({
  min,
  max,
  value,
  onChange,
  labels,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [animateWave, setAnimateWave] = useState(false);
  const sliderRef = useRef<HTMLDivElement>(null);
  
  // Calculate percentage for positioning and wave intensity
  const percentage = ((value - min) / (max - min)) * 100;
  const waveIntensity = (value - min) / (max - min); // 0 to 1
  
  // Handle user interaction
  const updateValue = (clientX: number) => {
    if (!sliderRef.current) return;
    
    const rect = sliderRef.current.getBoundingClientRect();
    const position = (clientX - rect.left) / rect.width;
    const newValue = Math.round(min + position * (max - min));
    
    // Clamp value between min and max
    const clampedValue = Math.max(min, Math.min(max, newValue));
    onChange(clampedValue);
    
    // Animate the wave when value changes
    setAnimateWave(true);
    setTimeout(() => setAnimateWave(false), 600);
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

  // Generate wave path based on intensity
  const generateWavePath = () => {
    const amplitude = 10 + waveIntensity * 30; // Increases with value
    const frequency = 2 + waveIntensity * 3; // More waves with higher value
    
    let path = `M 0 50`;
    
    const steps = 200;
    for (let i = 0; i <= steps; i++) {
      const x = (i / steps) * 100;
      const y = 50 + Math.sin(x * 0.1 * frequency + (animateWave ? Date.now() * 0.01 : 0)) * amplitude;
      path += ` L ${x} ${y}`;
    }
    
    return path;
  };

  return (
    <div className="space-y-6 py-6">
      {/* Battle rope slider */}
      <div
        ref={sliderRef}
        className="relative h-24 cursor-pointer"
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
      >
        {/* Wave visualization */}
        <svg 
          className="w-full h-full overflow-visible"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
        >
          {/* Wave path */}
          <motion.path
            d={generateWavePath()}
            fill="none"
            strokeWidth={3 + waveIntensity * 4}
            stroke="var(--tfe-gray-600)"
            strokeLinecap="round"
            animate={{ 
              d: generateWavePath(),
              strokeWidth: 3 + waveIntensity * 4
            }}
            transition={{ 
              repeat: Infinity,
              duration: 0.5,
              ease: "linear" 
            }}
          />
          
          {/* Secondary wave for visual effect */}
          <motion.path
            d={generateWavePath()}
            fill="none"
            strokeWidth={2 + waveIntensity * 2}
            stroke="var(--tfe-primary)"
            strokeLinecap="round"
            strokeDasharray="4 4"
            animate={{ 
              d: generateWavePath(),
              strokeWidth: 2 + waveIntensity * 2
            }}
            transition={{ 
              repeat: Infinity,
              duration: 0.4,
              ease: "linear",
              delay: 0.2
            }}
          />
        </svg>
        
        {/* Value indicators/ticks */}
        <div className="absolute left-0 right-0 bottom-0 flex justify-between px-4">
          {Array.from({ length: max - min + 1 }).map((_, i) => (
            <div
              key={i}
              className="w-1 h-4 bg-tfe-gray-500 rounded-full"
              onClick={() => onChange(min + i)}
            />
          ))}
        </div>
        
        {/* Handle/grip */}
        <motion.div
          className="absolute bottom-6 w-12 h-12 -ml-6 flex items-center justify-center"
          style={{ 
            left: `${percentage}%`,
            cursor: isDragging ? 'grabbing' : 'grab'
          }}
          animate={{ 
            scale: isDragging ? 1.1 : 1,
            y: animateWave ? [0, -10, 0] : 0
          }}
          transition={{
            type: 'spring',
            stiffness: 300,
            damping: 20
          }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          {/* Grip texture/handle */}
          <div className="w-12 h-12 rounded-full bg-tfe-primary flex items-center justify-center shadow-lg">
            <div className="w-8 h-8 rounded-full bg-tfe-gray-200 flex items-center justify-center">
              <span className="text-lg font-bold text-tfe-gray-800">{value}</span>
            </div>
            {/* Grip texture lines */}
            <div className="absolute w-full h-full">
              {[45, 135, 225, 315].map((rotation) => (
                <div 
                  key={rotation}
                  className="absolute w-full h-0.5 bg-tfe-primary-dark opacity-50 top-1/2 left-0"
                  style={{ 
                    transform: `translateY(-50%) rotate(${rotation}deg)`,
                  }}
                />
              ))}
            </div>
          </div>
        </motion.div>
      </div>
      
      {/* Labels */}
      {labels && (
        <div className="flex justify-between text-sm text-tfe-gray-600 px-2">
          <span>{labels[min]}</span>
          {max - min > 2 && labels[Math.floor((max + min) / 2)] && (
            <span>{labels[Math.floor((max + min) / 2)]}</span>
          )}
          <span>{labels[max]}</span>
        </div>
      )}
      
      {/* Intensity description based on value */}
      <div className="text-center text-sm font-medium" style={{ color: `var(--tfe-primary)` }}>
        {waveIntensity < 0.25 && "Light Waves"}
        {waveIntensity >= 0.25 && waveIntensity < 0.5 && "Building Momentum"}
        {waveIntensity >= 0.5 && waveIntensity < 0.75 && "Strong Waves"}
        {waveIntensity >= 0.75 && "Maximum Intensity!"}
      </div>
    </div>
  );
};

export default BattleRopeWave;
