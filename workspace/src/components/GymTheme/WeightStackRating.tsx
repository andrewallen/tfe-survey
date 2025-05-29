import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

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
  const [hoveredWeight, setHoveredWeight] = useState<number | null>(null);
  
  // Effect for rack tilting animation
  const tiltPercentage = (((value - min) / (max - min)) - 0.5) * 100 * 0.5;
  
  // For hover/interactive effects
  const handleHoverStart = (weight: number) => setHoveredWeight(weight);
  const handleHoverEnd = () => setHoveredWeight(null);
  
  // Generate random variations for realistic dumbbells
  const dumbbellVariations = weightValues.map((_, i) => ({
    baseColor: [
      '#3B82F6', // blue
      '#10B981', // emerald
      '#6366F1', // indigo
      '#F59E0B', // amber
      '#EF4444', // red
    ][i % 5],
    gripRotation: Math.random() * 20 - 10,
    shineOffset: Math.random(),
  }));

  return (
    <div className="space-y-6 py-4" ref={containerRef}>
      <h2 className="text-2xl font-bold text-center mb-2">Dumbbell Rating</h2>
      <p className="text-center text-tfe-gray-700 mb-6">Select a weight that reflects your experience:</p>
      
      {/* Main dumbbell rack container */}
      <motion.div 
        className="relative h-60 md:h-72 flex items-center justify-center overflow-hidden"
        animate={{
          rotateX: 30,
          rotateZ: tiltPercentage,
        }}
        style={{
          perspective: '1000px',
          transformStyle: 'preserve-3d'
        }}
      >
        {/* Wooden rack base */}
        <motion.div
          className="absolute bottom-8 w-[95%] h-20 rounded-md z-0"
          style={{
            background: 'linear-gradient(to bottom, #8B4513 0%, #A0522D 100%)',
            boxShadow: '0 10px 30px rgba(0,0,0,0.3), inset 0 2px 10px rgba(0,0,0,0.4)'
          }}
          animate={{
            rotateX: 70,
            z: -30,
          }}
        >
          {/* Wooden rack texture */}
          <div 
            className="absolute inset-0 opacity-70"
            style={{
              background: `
                repeating-linear-gradient(
                  90deg,
                  transparent,
                  transparent 10px,
                  rgba(0,0,0,0.15) 10px,
                  rgba(0,0,0,0.15) 12px
                )
              `
            }}
          />
          
          {/* Rack feet/supports */}
          <div className="absolute -bottom-6 left-4 w-10 h-10 bg-[#5D4037] rounded-b-lg" 
              style={{ transformOrigin: 'top center', transform: 'rotateX(-60deg)' }} />
          <div className="absolute -bottom-6 right-4 w-10 h-10 bg-[#5D4037] rounded-b-lg" 
              style={{ transformOrigin: 'top center', transform: 'rotateX(-60deg)' }} />
        </motion.div>

        {/* Dumbbell container - horizontal layout */}
        <div className="relative flex justify-between items-center w-full max-w-4xl px-4 py-2">
          {weightValues.map((weight, index) => {
            const isSelected = weight === value;
            const isHovered = weight === hoveredWeight;
            // Calculate dumbbell size based on weight - larger weights get bigger dumbbells
            const weightPercentage = (weight - min) / (max - min);
            const dumbbellSize = 30 + weightPercentage * 85;
            const variations = dumbbellVariations[index];
            
            return (
              <motion.div
                key={weight}
                className="relative flex flex-col items-center justify-center group"
                initial={{ opacity: 0, scale: 0.8, y: -50 }}
                animate={{ 
                  opacity: 1, 
                  scale: 1, 
                  y: 0,
                  rotateX: isSelected ? -10 : 0,
                  rotateY: isSelected ? 10 : 0,
                }}
                transition={{ 
                  type: 'spring',
                  stiffness: 300,
                  damping: 20,
                  delay: index * 0.1
                }}
                whileHover={{ scale: 1.1, y: -10, rotateX: -10 }}
                onHoverStart={() => handleHoverStart(weight)}
                onHoverEnd={handleHoverEnd}
                onClick={() => onChange(weight)}
                style={{ transformOrigin: 'bottom center', zIndex: isSelected ? 10 : 1 }}
              >
                {/* Dumbbell component */}
                <motion.div
                  className="relative cursor-pointer"
                  animate={{ 
                    y: isSelected ? -20 : 0,
                    rotateZ: isSelected ? [0, -5, 5, 0] : 0
                  }}
                  transition={{ 
                    y: { type: 'spring', stiffness: 300, damping: 15 },
                    rotateZ: isSelected ? { 
                      duration: 0.5,
                      repeat: 1,
                      repeatType: 'reverse'
                    } : {}
                  }}
                >
                  {/* Dumbbell handle */}
                  <motion.div 
                    className="relative rounded-full"
                    style={{ 
                      width: `${dumbbellSize}px`,
                      height: `${dumbbellSize / 5}px`, 
                      backgroundColor: '#888',
                      backgroundImage: 'linear-gradient(to bottom, #AAA, #555)',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.3)',
                      transform: `rotate(${variations.gripRotation}deg)`
                    }}
                    animate={{
                      scale: isSelected ? 0.95 : 1,
                    }}
                  >
                    {/* Grip texture */}
                    <div
                      className="absolute inset-0 rounded-full"
                      style={{ 
                        backgroundImage: `
                          repeating-linear-gradient(
                            90deg, 
                            transparent, 
                            transparent 2px, 
                            rgba(0,0,0,0.2) 2px, 
                            rgba(0,0,0,0.2) 4px
                          )
                        `,
                        opacity: 0.6
                      }}
                    />
                  </motion.div>
                  
                  {/* Left weight plate */}
                  <motion.div
                    className="absolute rounded-full"
                    style={{
                      width: `${dumbbellSize * 0.9}px`,
                      height: `${dumbbellSize * 0.9}px`,
                      left: `-${dumbbellSize * 0.7}px`,
                      top: `${(dumbbellSize / 5) / 2 - (dumbbellSize * 0.9) / 2}px`,
                      background: `linear-gradient(135deg, ${variations.baseColor}cc, ${variations.baseColor})`,
                      border: '2px solid #444',
                      boxShadow: 'inset 0 2px 4px rgba(255,255,255,0.3), inset 0 -2px 4px rgba(0,0,0,0.4)'
                    }}
                  >
                    {/* Metallic shine effect */}
                    <div
                      className="absolute rounded-full"
                      style={{
                        width: '60%',
                        height: '30%',
                        top: `${variations.shineOffset * 20}%`,
                        left: '20%',
                        background: 'rgba(255,255,255,0.2)',
                        transform: 'rotate(-30deg)',
                        filter: 'blur(2px)'
                      }}
                    />
                  </motion.div>
                  
                  {/* Right weight plate */}
                  <motion.div
                    className="absolute rounded-full"
                    style={{
                      width: `${dumbbellSize * 0.9}px`,
                      height: `${dumbbellSize * 0.9}px`,
                      right: `-${dumbbellSize * 0.7}px`,
                      top: `${(dumbbellSize / 5) / 2 - (dumbbellSize * 0.9) / 2}px`,
                      background: `linear-gradient(135deg, ${variations.baseColor}cc, ${variations.baseColor})`,
                      border: '2px solid #444',
                      boxShadow: 'inset 0 2px 4px rgba(255,255,255,0.3), inset 0 -2px 4px rgba(0,0,0,0.4)'
                    }}
                  >
                    {/* Metallic shine effect */}
                    <div
                      className="absolute rounded-full"
                      style={{
                        width: '60%',
                        height: '30%',
                        top: `${variations.shineOffset * 20}%`,
                        left: '20%',
                        background: 'rgba(255,255,255,0.2)',
                        transform: 'rotate(-30deg)',
                        filter: 'blur(2px)'
                      }}
                    />
                  </motion.div>

                  {/* Weight number */}
                  <div
                    className="absolute font-bold text-white text-center"
                    style={{
                      width: `${dumbbellSize * 0.9}px`,
                      height: `${dumbbellSize * 0.9}px`,
                      right: `-${dumbbellSize * 0.7}px`,
                      top: `${(dumbbellSize / 5) / 2 - (dumbbellSize * 0.9) / 2}px`,
                      fontSize: `${dumbbellSize * 0.4}px`,
                      lineHeight: `${dumbbellSize * 0.9}px`,
                      textShadow: '1px 1px 2px rgba(0,0,0,0.7)'
                    }}
                  >
                    {weight}
                  </div>

                  {/* Selection indicator */}
                  <AnimatePresence>
                    {isSelected && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1, rotate: 360 }}
                        exit={{ opacity: 0, scale: 0 }}
                        transition={{ duration: 0.3 }}
                        className="absolute top-0 left-0 w-full h-full flex items-center justify-center"
                      >
                        <div className="absolute bg-yellow-400 rounded-full opacity-50 animate-ping" 
                          style={{ width: `${dumbbellSize * 2}px`, height: `${dumbbellSize * 2}px` }} />
                        <div className="absolute text-4xl">✨</div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>

                {/* Shadow under dumbbell */}
                <motion.div
                  className="absolute bottom-0 rounded-full bg-black opacity-20 blur-sm"
                  style={{ 
                    width: `${dumbbellSize * 1.6}px`,
                    height: `${dumbbellSize * 0.2}px`
                  }}
                  animate={{
                    opacity: isSelected ? 0.3 : 0.2,
                    width: isSelected ? `${dumbbellSize * 1.8}px` : `${dumbbellSize * 1.6}px`,
                    scaleY: isSelected ? 1.2 : 1
                  }}
                />

                {/* Hover/selected indicator */}
                <motion.div
                  className={`absolute -bottom-10 text-xs font-medium transition-opacity duration-200 text-center ${(isHovered || isSelected) ? 'opacity-100' : 'opacity-0'}`}
                  animate={{
                    scale: isSelected ? 1.2 : 1
                  }}
                >
                  {labels?.[weight] || weight}
                </motion.div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* Labels at bottom */}
      <div className="grid grid-cols-3 text-lg font-medium text-tfe-gray-700 mt-8 w-full">
        <span className="text-left">{labels?.[min] || 'Poor'}</span>
        <span className="text-center">{labels?.[Math.floor((max + min) / 2)] || 'Neutral'}</span>
        <span className="text-right">{labels?.[max] || 'Excellent'}</span>
      </div>
    </div>
  );
};

export default WeightStackRating;
