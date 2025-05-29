import React, { useState, useRef, useEffect, useMemo } from 'react';
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
  const [isHovering, setIsHovering] = useState(false);
  const sliderRef = useRef<HTMLDivElement>(null);

  // Generate team members - always 4 people pulling
  const teamMembers = useMemo(() => 
    Array.from({ length: 4 }).map((_, i) => ({
      id: i,
      offsetY: (i % 2) * 15 - 7, // Stagger heights slightly
      delay: i * 0.1,
      color: ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4'][i],
      size: 20 + (i % 2) * 4, // Vary sizes slightly
    })), []
  );

  // Calculate rope extension based on value (1-5 maps to different rope lengths)
  const percentage = ((value - min) / (max - min)) * 100;
  const ropeLength = 20 + (percentage * 0.6); // Rope extends from 20% to 80% of container
  const tugEffort = (value - min) / (max - min); // 0 to 1 for animation intensity
  
  // Handle user interaction
  const updateValue = (clientX: number) => {
    if (!sliderRef.current) return;
    
    const rect = sliderRef.current.getBoundingClientRect();
    const position = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    const newValue = Math.round(min + position * (max - min));
    const clampedValue = Math.max(min, Math.min(max, newValue));
    
    onChange(clampedValue);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    updateValue(e.clientX);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    updateValue(e.touches[0].clientX);
  };

  // Mouse and touch movement handling
  useEffect(() => {
    const handleMove = (clientX: number) => {
      if (isDragging) {
        updateValue(clientX);
      }
    };

    const handleMouseMove = (e: MouseEvent) => handleMove(e.clientX);
    const handleTouchMove = (e: TouchEvent) => e.touches[0] && handleMove(e.touches[0].clientX);
    const handleEnd = () => setIsDragging(false);

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
    <div className="space-y-8 py-8">
      {/* Tug-of-war scene */}
      <div className="relative h-32">
        {/* Ground/floor */}
        <div className="absolute bottom-0 left-0 w-full h-2 bg-gradient-to-r from-green-800 via-green-600 to-green-800 rounded-full opacity-70" />
        <div className="absolute bottom-0 left-0 w-full h-1 bg-brown-600 rounded-full" />
        
        {/* Team members on the left */}
        <div className="absolute left-4 top-6 flex space-x-2">
          {teamMembers.map((member) => (
            <motion.div
              key={member.id}
              className="relative flex flex-col items-center"
              animate={{
                x: isDragging ? -tugEffort * 8 : 0,
                y: member.offsetY + (isDragging ? Math.sin(Date.now() * 0.01 + member.delay) * 2 : 0),
                rotate: isDragging ? -5 - tugEffort * 10 : -2,
              }}
              transition={{
                type: 'spring',
                stiffness: 200,
                damping: 20,
                delay: member.delay
              }}
            >
              {/* Person body */}
              <div 
                className="w-6 h-12 rounded-full relative"
                style={{
                  background: `linear-gradient(135deg, ${member.color}, ${member.color}dd)`,
                  boxShadow: '0 2px 4px rgba(0,0,0,0.3)'
                }}
              >
                {/* Head */}
                <div 
                  className="absolute -top-3 left-1/2 transform -translate-x-1/2 w-4 h-4 rounded-full bg-orange-200 border border-orange-300"
                  style={{ boxShadow: '0 1px 2px rgba(0,0,0,0.2)' }}
                />
                
                {/* Arms */}
                <motion.div 
                  className="absolute top-2 -right-1 w-3 h-1 bg-orange-200 rounded-full"
                  animate={{
                    rotate: isDragging ? -45 - tugEffort * 20 : -30,
                  }}
                  style={{ transformOrigin: 'left center' }}
                />
                <motion.div 
                  className="absolute top-4 -right-1 w-3 h-1 bg-orange-200 rounded-full"
                  animate={{
                    rotate: isDragging ? -30 - tugEffort * 15 : -20,
                  }}
                  style={{ transformOrigin: 'left center' }}
                />
                
                {/* Legs */}
                <div className="absolute -bottom-2 left-1 w-1 h-4 bg-blue-800 rounded-full" />
                <div className="absolute -bottom-2 right-1 w-1 h-4 bg-blue-800 rounded-full" />
              </div>
              
              {/* Effort indicators */}
              {isDragging && (
                <motion.div
                  className="absolute -top-6 left-1/2 transform -translate-x-1/2"
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ 
                    opacity: [0, 1, 0],
                    scale: [0.5, 1.2, 0.8],
                    y: [-5, -10, -5]
                  }}
                  transition={{
                    duration: 0.8,
                    repeat: Infinity,
                    delay: member.delay
                  }}
                >
                  <div className="text-xs font-bold text-red-500">💪</div>
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>

        {/* Tug-of-war rope */}
        <div
          ref={sliderRef}
          className="absolute top-12 left-20 right-8 h-8 cursor-grab active:cursor-grabbing"
          onMouseDown={handleMouseDown}
          onTouchStart={handleTouchStart}
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
        >
          {/* Rope shadow */}
          <motion.div
            className="absolute top-6 left-0 h-2 bg-black rounded-full opacity-20"
            style={{ width: `${ropeLength}%` }}
            animate={{
              filter: `blur(${2 + tugEffort * 2}px)`,
            }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          />

          {/* Main rope */}
          <motion.div
            className="absolute top-2 left-0 h-4 rounded-full"
            style={{
              width: `${ropeLength}%`,
              background: `
                linear-gradient(90deg,
                  #8B7355 0%,
                  #A0906F 15%,
                  #D4C5A0 30%,
                  #B8A888 45%,
                  #9C8B6B 60%,
                  #D4C5A0 75%,
                  #A0906F 90%,
                  #8B7355 100%
                )
              `,
              boxShadow: `
                inset 0 2px 4px rgba(0,0,0,0.3),
                inset 0 -1px 2px rgba(255,255,255,0.2),
                0 2px 8px rgba(0,0,0,0.2)
              `,
            }}
            animate={{
              scaleY: 1 + (isDragging ? tugEffort * 0.2 : 0),
              filter: `brightness(${1 - tugEffort * 0.1}) saturate(${1 + tugEffort * 0.3})`,
            }}
            transition={{ type: 'spring', stiffness: 250, damping: 20 }}
          >
            {/* Rope braiding pattern */}
            <div 
              className="absolute inset-0 rounded-full"
              style={{
                background: `
                  repeating-linear-gradient(
                    45deg,
                    rgba(139,115,85,0.4) 0px,
                    transparent 2px,
                    rgba(184,168,136,0.3) 4px,
                    transparent 6px
                  ),
                  repeating-linear-gradient(
                    -45deg,
                    rgba(160,144,111,0.3) 0px,
                    transparent 2px,
                    rgba(212,197,160,0.2) 4px,
                    transparent 6px
                  )
                `,
                opacity: 0.7
              }}
            />
          </motion.div>

          {/* Rope end/handle where user grabs */}
          <motion.div
            className="absolute top-0 h-8 z-20 cursor-grab active:cursor-grabbing"
            style={{ left: `${ropeLength}%`, marginLeft: '-20px' }}
            animate={{
              scale: isDragging ? 1.1 : isHovering ? 1.05 : 1,
              rotate: isDragging ? [0, -2, 2, 0] : 0,
            }}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.95 }}
            transition={{
              scale: { type: 'spring', stiffness: 400, damping: 25 },
              rotate: isDragging 
                ? { duration: 0.3, repeat: Infinity, repeatType: 'reverse' }
                : { duration: 0.2 }
            }}
          >
            {/* Rope handle/grip */}
            <div
              className="relative w-10 h-8 rounded-lg overflow-hidden"
              style={{
                background: `
                  linear-gradient(135deg, 
                    #8B4513 0%, 
                    #A0522D 25%, 
                    #CD853F 50%, 
                    #D2691E 75%, 
                    #8B4513 100%
                  )
                `,
                boxShadow: `
                  0 4px 12px rgba(0,0,0,0.4),
                  inset 0 1px 2px rgba(255,255,255,0.2),
                  inset 0 -1px 2px rgba(0,0,0,0.3)
                `,
                border: '1px solid #654321'
              }}
            >
              {/* Handle texture */}
              <div 
                className="absolute inset-0"
                style={{
                  background: `
                    repeating-linear-gradient(
                      0deg,
                      transparent 0px,
                      rgba(0,0,0,0.1) 1px,
                      transparent 2px
                    )
                  `,
                  opacity: 0.5
                }}
              />

              {/* Value display */}
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.span 
                  className="text-sm font-bold text-amber-100"
                  style={{
                    textShadow: '1px 1px 2px rgba(0,0,0,0.8)',
                    fontFamily: 'system-ui, sans-serif'
                  }}
                  animate={{
                    scale: isDragging ? [1, 1.1, 1] : 1
                  }}
                  transition={{ duration: 0.2 }}
                >
                  {value}
                </motion.span>
              </div>
            </div>
          </motion.div>

          {/* Tension/strain effects when dragging */}
          {isDragging && (
            <motion.div
              className="absolute inset-0 pointer-events-none"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {/* Stress lines along rope */}
              {Array.from({ length: 3 }).map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute bg-yellow-400 rounded-full opacity-40"
                  style={{
                    width: '1px',
                    height: `${6 + i * 2}px`,
                    left: `${20 + i * (ropeLength - 20) / 3}%`,
                    top: '50%',
                    transformOrigin: 'center'
                  }}
                  animate={{
                    y: [-2, 2, -2],
                    opacity: [0.4, 0.8, 0.4],
                    scaleY: [1, 1.5, 1]
                  }}
                  transition={{
                    duration: 0.4,
                    repeat: Infinity,
                    delay: i * 0.1
                  }}
                />
              ))}
              
              {/* Pulling effect particles */}
              {Array.from({ length: 5 }).map((_, i) => (
                <motion.div
                  key={`particle-${i}`}
                  className="absolute w-1 h-1 bg-red-400 rounded-full opacity-60"
                  style={{
                    left: `${ropeLength}%`,
                    top: '50%'
                  }}
                  animate={{
                    x: [0, 20 + i * 10, 0],
                    y: [(i - 2) * 4, (i - 2) * 8, (i - 2) * 4],
                    opacity: [0.6, 0, 0.6]
                  }}
                  transition={{
                    duration: 0.6,
                    repeat: Infinity,
                    delay: i * 0.1
                  }}
                />
              ))}
            </motion.div>
          )}
        </div>

        {/* Center line marker */}
        <div className="absolute left-1/2 top-16 w-px h-8 bg-red-500 opacity-50 transform -translate-x-1/2">
          <div className="absolute -top-1 left-1/2 w-2 h-2 bg-red-500 rounded-full transform -translate-x-1/2" />
        </div>

        {/* Victory/effort indicator */}
        <motion.div
          className="absolute right-8 top-8 text-right"
          animate={{
            scale: tugEffort > 0.8 ? [1, 1.2, 1] : 1,
            opacity: tugEffort > 0.5 ? 1 : 0.5
          }}
          transition={{ duration: 0.3 }}
        >
          <div className="text-2xl">
            {tugEffort > 0.8 ? '🏆' : tugEffort > 0.6 ? '💪' : tugEffort > 0.3 ? '😤' : '🤔'}
          </div>
          <div className="text-xs text-gray-600 mt-1">
            {tugEffort > 0.8 ? 'Victory!' : tugEffort > 0.6 ? 'Strong!' : tugEffort > 0.3 ? 'Pulling!' : 'Starting...'}
          </div>
        </motion.div>
      </div>

      {/* Value labels */}
      {labels && (
        <div className="flex justify-between items-center text-sm font-medium text-amber-800 px-4 mt-6">
          <motion.div 
            className="flex items-center space-x-2"
            whileHover={{ scale: 1.05 }}
          >
            <div className="w-3 h-3 bg-amber-600 rounded-full shadow-sm" />
            <span>{labels[min]}</span>
          </motion.div>
          
          {max - min > 2 && labels[Math.round((max + min) / 2)] && (
            <motion.div 
              className="flex items-center space-x-2"
              whileHover={{ scale: 1.05 }}
            >
              <div className="w-3 h-3 bg-amber-700 rounded-full shadow-sm" />
              <span>{labels[Math.round((max + min) / 2)]}</span>
            </motion.div>
          )}
          
          <motion.div 
            className="flex items-center space-x-2"
            whileHover={{ scale: 1.05 }}
          >
            <div className="w-3 h-3 bg-amber-800 rounded-full shadow-sm" />
            <span>{labels[max]}</span>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default RopeSlider;
