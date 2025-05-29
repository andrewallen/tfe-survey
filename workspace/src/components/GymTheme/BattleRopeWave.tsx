import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

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
  const [isActive, setIsActive] = useState(false);
  const [showPulse, setShowPulse] = useState(false);
  
  // Calculate intensity based on value
  const intensity = (value - min) / (max - min);
  
  // Auto-animate waves based on intensity
  useEffect(() => {
    const interval = setInterval(() => {
      if (intensity > 0) {
        setShowPulse(true);
        setTimeout(() => setShowPulse(false), 300);
      }
    }, 800 - (intensity * 600)); // Faster animation at higher intensities
    
    return () => clearInterval(interval);
  }, [intensity]);

  // Generate dynamic wave pattern
  const generateWaves = (time: number) => {
    const waves = [];
    const numWaves = Math.ceil(intensity * 5) + 1;
    
    for (let i = 0; i < numWaves; i++) {
      const amplitude = 15 + (intensity * 25);
      const frequency = 0.05 + (intensity * 0.03);
      const phase = (time * 0.003) + (i * Math.PI / 3);
      
      waves.push({
        id: i,
        amplitude,
        frequency,
        phase,
        opacity: 0.7 - (i * 0.15)
      });
    }
    
    return waves;
  };

  // Get rope thickness based on intensity
  const getRopeThickness = () => {
    return 8 + (intensity * 12);
  };

  // Get intensity description
  const getIntensityText = () => {
    if (intensity === 0) return "Select intensity";
    if (intensity < 0.2) return "Gentle waves";
    if (intensity < 0.4) return "Building rhythm";
    if (intensity < 0.6) return "Strong motion";
    if (intensity < 0.8) return "High intensity";
    return "Maximum power!";
  };

  // Get color based on intensity
  const getIntensityColor = () => {
    if (intensity < 0.3) return "var(--tfe-blue-500)";
    if (intensity < 0.6) return "var(--tfe-green-500)";
    if (intensity < 0.8) return "var(--tfe-yellow-500)";
    return "var(--tfe-red-500)";
  };

  return (
    <div className="space-y-8 py-6">
      {/* Wave Visualization */}
      <div className="relative h-32 bg-gradient-to-b from-gray-50 to-gray-100 rounded-xl overflow-hidden border border-gray-200">
        {/* Anchor points */}
        <div className="absolute left-4 top-1/2 w-4 h-4 bg-gray-800 rounded-full transform -translate-y-1/2 z-10"></div>
        <div className="absolute right-4 top-1/2 w-4 h-4 bg-gray-800 rounded-full transform -translate-y-1/2 z-10"></div>
        
        {/* Animated rope waves */}
        <svg className="w-full h-full absolute inset-0" viewBox="0 0 400 120">
          <defs>
            <linearGradient id="ropeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#4B5563" />
              <stop offset="50%" stopColor="#6B7280" />
              <stop offset="100%" stopColor="#4B5563" />
            </linearGradient>
            <filter id="shadow">
              <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.3"/>
            </filter>
          </defs>
          
          <AnimatePresence>
            {generateWaves(Date.now()).map((wave) => (
              <motion.path
                key={wave.id}
                d={`M 20 60 Q 100 ${60 - wave.amplitude * Math.sin(wave.phase)} 200 60 Q 300 ${60 + wave.amplitude * Math.sin(wave.phase + Math.PI)} 380 60`}
                fill="none"
                stroke={intensity > 0.7 ? getIntensityColor() : "url(#ropeGradient)"}
                strokeWidth={getRopeThickness() - (wave.id * 2)}
                strokeLinecap="round"
                opacity={wave.opacity}
                filter="url(#shadow)"
                animate={{
                  d: [
                    `M 20 60 Q 100 ${60 - wave.amplitude * Math.sin(wave.phase)} 200 60 Q 300 ${60 + wave.amplitude * Math.sin(wave.phase + Math.PI)} 380 60`,
                    `M 20 60 Q 100 ${60 + wave.amplitude * Math.sin(wave.phase + Math.PI)} 200 60 Q 300 ${60 - wave.amplitude * Math.sin(wave.phase)} 380 60`,
                    `M 20 60 Q 100 ${60 - wave.amplitude * Math.sin(wave.phase)} 200 60 Q 300 ${60 + wave.amplitude * Math.sin(wave.phase + Math.PI)} 380 60`
                  ]
                }}
                transition={{
                  duration: 1.5 - (intensity * 0.8),
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
            ))}
          </AnimatePresence>
          
          {/* Pulse effect */}
          {showPulse && (
            <motion.circle
              cx="200"
              cy="60"
              r="0"
              fill={getIntensityColor()}
              opacity="0.3"
              animate={{
                r: [0, 40, 60],
                opacity: [0.3, 0.1, 0]
              }}
              transition={{ duration: 0.6 }}
            />
          )}
        </svg>
      </div>

      {/* Interactive Rating Buttons */}
      <div className="grid grid-cols-5 gap-3">
        {Array.from({ length: max - min + 1 }).map((_, index) => {
          const ratingValue = min + index;
          const isSelected = value === ratingValue;
          const buttonIntensity = index / (max - min);
          
          return (
            <motion.button
              key={ratingValue}
              onClick={() => {
                onChange(ratingValue);
                setIsActive(true);
                setTimeout(() => setIsActive(false), 200);
              }}
              className={`
                relative h-16 rounded-lg border-2 font-semibold text-lg transition-all duration-200
                ${isSelected 
                  ? 'border-tfe-primary bg-tfe-primary text-white shadow-lg' 
                  : 'border-gray-300 bg-white text-gray-700 hover:border-tfe-primary hover:bg-tfe-primary/10'
                }
              `}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              animate={isSelected && isActive ? { scale: [1, 1.1, 1] } : {}}
            >
              {ratingValue}
              
              {/* Intensity indicator bars */}
              <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-0.5">
                {Array.from({ length: 3 }).map((_, barIndex) => (
                  <div
                    key={barIndex}
                    className={`
                      w-1 rounded-full transition-all duration-300
                      ${buttonIntensity > (barIndex * 0.33) 
                        ? isSelected 
                          ? 'bg-white h-2' 
                          : 'bg-tfe-primary h-2'
                        : 'bg-gray-300 h-1'
                      }
                    `}
                  />
                ))}
              </div>
            </motion.button>
          );
        })}
      </div>

      {/* Labels */}
      {labels && (
        <div className="flex justify-between text-sm text-gray-600 px-2">
          <span className="font-medium">{labels[min]}</span>
          <span className="font-medium">{labels[max]}</span>
        </div>
      )}

      {/* Intensity Feedback */}
      <motion.div 
        className="text-center space-y-2"
        animate={{ 
          scale: showPulse ? [1, 1.05, 1] : 1,
          color: getIntensityColor()
        }}
      >
        <div className="text-lg font-bold">
          {getIntensityText()}
        </div>
        
        {intensity > 0 && (
          <motion.div 
            className="flex justify-center space-x-1"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            {Array.from({ length: 5 }).map((_, i) => (
              <motion.div
                key={i}
                className="w-2 h-6 rounded-full"
                style={{ backgroundColor: getIntensityColor() }}
                animate={{
                  height: intensity > (i * 0.2) ? 24 : 8,
                  opacity: intensity > (i * 0.2) ? 1 : 0.3
                }}
                transition={{ delay: i * 0.1 }}
              />
            ))}
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default BattleRopeWave;
