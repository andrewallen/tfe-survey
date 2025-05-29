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

  // Cache random fray details so rope ends stay consistent between renders
  const leftFrays = useMemo(
    () =>
      Array.from({ length: 6 }).map(() => ({
        height: 4 + Math.random() * 6,
        offset: Math.random() * 12,
        top: 8 + Math.random() * 16,
        rotate: -30 + Math.random() * 60,
      })),
    []
  );

  const rightFrays = useMemo(
    () =>
      Array.from({ length: 6 }).map(() => ({
        height: 4 + Math.random() * 6,
        offset: Math.random() * 12,
        top: 8 + Math.random() * 16,
        rotate: -30 + Math.random() * 60,
      })),
    []
  );
  
  // Calculate percentage for positioning
  const percentage = ((value - min) / (max - min)) * 100;
  const tension = Math.abs(percentage - 50) / 50;
  const sag = tension * 4;
  
  // Handle user interaction - simplified
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
    <div className="space-y-6 py-6">
      {/* Tug-of-war rope slider */}
      <div
        ref={sliderRef}
        className="relative h-12 cursor-pointer"
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        {/* Rope shadow */}
        <div
          className="absolute top-1/2 left-0 w-full h-3 bg-black opacity-10 rounded-full"
          style={{
            filter: 'blur(3px)',
            transform: `translateY(calc(-50% + ${4 + sag}px))`
          }}
        />
        
        {/* Main tug-of-war rope */}
        <div
          className="absolute top-1/2 left-0 w-full h-6 rounded-full overflow-hidden"
          style={{
            background:
              'linear-gradient(135deg, #D4C5A0 0%, #B8A888 25%, #D4C5A0 50%, #E6D7B8 75%, #D4C5A0 100%)',
            boxShadow:
              'inset 0 2px 4px rgba(0,0,0,0.2), inset 0 -1px 2px rgba(255,255,255,0.3), 0 2px 6px rgba(0,0,0,0.15)',
            transform: `translateY(calc(-50% + ${sag}px))`,
            filter: `brightness(${1 - tension * 0.1})`
          }}
        >
          {/* Rope twist pattern */}
          <div 
            className="absolute inset-0 opacity-40"
            style={{
              background: `
                repeating-linear-gradient(
                  45deg,
                  transparent 0px,
                  rgba(139,115,85,0.3) 3px,
                  transparent 6px,
                  rgba(139,115,85,0.3) 9px,
                  transparent 12px
                ),
                repeating-linear-gradient(
                  -45deg,
                  transparent 0px,
                  rgba(160,144,111,0.3) 3px,
                  transparent 6px,
                  rgba(160,144,111,0.3) 9px,
                  transparent 12px
                )
              `
            }}
          />
          
          {/* Natural fiber texture */}
          <div 
            className="absolute inset-0 opacity-30"
            style={{
              background: `
                repeating-linear-gradient(
                  90deg,
                  rgba(184,168,136,0.6) 0px,
                  rgba(212,197,160,0.6) 2px,
                  rgba(184,168,136,0.6) 4px,
                  rgba(230,215,184,0.6) 6px
                )
              `
            }}
          />
        </div>
        
        {/* Rope end fraying - left */}
        <div className="absolute top-1/2 left-0 w-3 h-8 transform -translate-y-1/2 overflow-hidden">
          {leftFrays.map((f, i) => (
            <div
              key={i}
              className="absolute w-px bg-amber-700 rounded-full opacity-50"
              style={{
                height: `${f.height}px`,
                left: `${f.offset}px`,
                top: `${f.top}px`,
                transform: `rotate(${f.rotate}deg)`
              }}
            />
          ))}
        </div>
        
        {/* Rope end fraying - right */}
        <div className="absolute top-1/2 right-0 w-3 h-8 transform -translate-y-1/2 overflow-hidden">
          {rightFrays.map((f, i) => (
            <div
              key={i}
              className="absolute w-px bg-amber-700 rounded-full opacity-50"
              style={{
                height: `${f.height}px`,
                right: `${f.offset}px`,
                top: `${f.top}px`,
                transform: `rotate(${f.rotate}deg)`
              }}
            />
          ))}
        </div>
        
        {/* Simple rope knots as tick marks */}
        {Array.from({ length: max - min + 1 }).map((_, i) => {
          const knotPosition = (i / (max - min)) * 100;
          const isActiveKnot = Math.abs(percentage - knotPosition) < 5;
          
          return (
            <div
              key={i}
              className="absolute top-1/2 transform -translate-y-1/2 -translate-x-1/2"
              style={{ left: `${knotPosition}%` }}
            >
              <div
                className={`w-3 h-8 rounded-full transition-all duration-200 ${
                  isActiveKnot ? 'scale-110' : ''
                }`}
                style={{
                  background: isActiveKnot
                    ? 'var(--tfe-accent)'
                    : 'linear-gradient(135deg, #B8A888, #D4C5A0, #B8A888)',
                  boxShadow:
                    '0 1px 3px rgba(0,0,0,0.3), inset 0 1px 1px rgba(255,255,255,0.2)'
                }}
              />
            </div>
          );
        })}
        
        {/* Red bandana grip marker - positioned to center on nearest knot */}
        <motion.div
          className="absolute top-1/2 transform -translate-y-1/2 -translate-x-1/2 z-10"
          style={{ 
            left: `${((value - min) / (max - min)) * 100}%` 
          }}
          animate={{
            scale: isDragging ? 1.05 : isHovering ? 1.02 : 1,
            rotate: isDragging ? [-2, 2, -2] : 0
          }}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.98 }}
          transition={{
            scale: { type: 'spring', stiffness: 300, damping: 20 },
            rotate: isDragging
              ? { duration: 0.3, repeat: Infinity, repeatType: 'mirror' }
              : { duration: 0.2 }
          }}
        >
          {/* Bandana background */}
          <div
            className="relative w-16 h-10 rounded-lg overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, var(--tfe-primary) 0%, var(--tfe-accent) 100%)',
              boxShadow: '0 3px 8px rgba(0,0,0,0.3), inset 0 1px 2px rgba(255,255,255,0.3)'
            }}
          >
            {/* Bandana pattern */}
            <div 
              className="absolute inset-0 opacity-40"
              style={{
                background: `
                  repeating-linear-gradient(
                    45deg,
                    transparent 0px,
                    rgba(255,255,255,0.2) 2px,
                    transparent 4px,
                    rgba(0,0,0,0.1) 6px,
                    transparent 8px
                  )
                `
              }}
            />
            
            {/* Bandana knot/tie marks */}
            <div className="absolute top-1 left-2 w-2 h-1 bg-red-900 rounded-full opacity-60" />
            <div className="absolute top-1 right-2 w-2 h-1 bg-red-900 rounded-full opacity-60" />
            <div className="absolute bottom-1 left-3 w-3 h-1 bg-red-800 rounded-full opacity-50" />
            
            {/* Value display */}
            <div className="absolute inset-0 flex items-center justify-center">
              <span 
                className="text-lg font-bold text-white drop-shadow-lg"
                style={{
                  textShadow: '1px 1px 2px rgba(0,0,0,0.8), 0 0 4px rgba(0,0,0,0.5)',
                  fontFamily: 'system-ui, sans-serif'
                }}
              >
                {value}
              </span>
            </div>
            
            {/* Fabric texture overlay */}
            <div 
              className="absolute inset-0 opacity-20"
              style={{
                background: `
                  repeating-linear-gradient(
                    0deg,
                    transparent 0px,
                    rgba(0,0,0,0.1) 1px,
                    transparent 2px
                  ),
                  repeating-linear-gradient(
                    90deg,
                    transparent 0px,
                    rgba(255,255,255,0.1) 1px,
                    transparent 2px
                  )
                `
              }}
            />
          </div>
          
          {/* Bandana tie effect */}
          <div 
            className="absolute -top-1 left-1/2 w-2 h-2 transform -translate-x-1/2 rounded-full"
            style={{
              background: 'linear-gradient(135deg, #A0201D, #C53030)',
              boxShadow: '0 1px 2px rgba(0,0,0,0.4)'
            }}
          />
        </motion.div>
      </div>
      
      {/* Labels */}
      {labels && (
        <div className="flex justify-between text-sm text-tfe-gray-600 px-2 mt-4">
          <span className="font-medium">{labels[min]}</span>
          {max - min > 2 && labels[Math.round((max + min) / 2)] && (
            <span className="font-medium">{labels[Math.round((max + min) / 2)]}</span>
          )}
          <span className="font-medium">{labels[max]}</span>
        </div>
      )}
    </div>
  );
};

export default RopeSlider;
