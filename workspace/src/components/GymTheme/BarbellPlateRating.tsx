import React, { useState, useRef, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

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
  const [isDragging, setIsDragging] = useState(false);
  const [isLifting, setIsLifting] = useState(false);
  const sliderRef = useRef<HTMLDivElement>(null);

  // Plate configurations with larger, more prominent sizes
  const plateConfigs = {
    1: { weight: '2.5kg', color: '#10B981', size: 100, thickness: 16, difficulty: 'Easy' },   // emerald
    2: { weight: '5kg', color: '#3B82F6', size: 130, thickness: 20, difficulty: 'Light' },    // blue  
    3: { weight: '10kg', color: '#F59E0B', size: 160, thickness: 28, difficulty: 'Medium' },  // amber
    4: { weight: '20kg', color: '#EF4444', size: 200, thickness: 36, difficulty: 'Heavy' },   // red
    5: { weight: '25kg', color: '#8B5CF6', size: 220, thickness: 44, difficulty: 'Beast' },   // violet
  };

  // Generate gym characters - spotters and cheerers
  const gymCharacters = useMemo(() => [
    { id: 1, position: 'left', type: 'spotter', color: '#FF6B6B', emoji: '💪' },
    { id: 2, position: 'right', type: 'spotter', color: '#4ECDC4', emoji: '🔥' },
    { id: 3, position: 'far-left', type: 'cheerer', color: '#45B7D1', emoji: '👏' },
    { id: 4, position: 'far-right', type: 'cheerer', color: '#96CEB4', emoji: '🎉' },
  ], []);

  const getPlateConfig = (rating: number) => {
    return plateConfigs[rating as keyof typeof plateConfigs] || plateConfigs[1];
  };

  // Get the proper plate loading sequence for realistic gym loading
  const getPlateLoadingSequence = (rating: number) => {
    const sequences = {
      1: [1], // Just 2.5kg plates
      2: [2], // Just 5kg plates  
      3: [3], // Just 10kg plates
      4: [3, 2], // 10kg + 5kg plates (15kg equivalent for rating 4)
      5: [4, 2] // 20kg + 5kg plates (25kg equivalent for rating 5)
    };
    return sequences[rating as keyof typeof sequences] || [];
  };

  // Calculate barbell loading progress
  const percentage = ((value - min) / (max - min)) * 100;
  const intensity = value / max; // 0 to 1 for animation intensity
  const plateSequence = getPlateLoadingSequence(value);

  
  // Handle dragging interaction similar to rope slider
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
    const handleEnd = () => {
      setIsDragging(false);
      setIsLifting(false);
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

  // Lifting animation trigger
  useEffect(() => {
    if (value > 0 && !isDragging) {
      setIsLifting(true);
      const timer = setTimeout(() => setIsLifting(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [value, isDragging]);

  const currentPlate = value > 0 ? getPlateConfig(value) : null;
  const ratingValues = Array.from({ length: max - min + 1 }, (_, i) => min + i);

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6 py-4">
      {/* Weight Display and Difficulty */}
      <div className="text-center">
        <motion.div 
          className="text-3xl md:text-4xl font-bold text-tfe-primary mb-2"
          animate={{ 
            scale: isDragging ? [1, 1.1, 1] : value ? 1.05 : 1,
            color: currentPlate ? currentPlate.color : '#374151'
          }}
          transition={{ type: "spring", stiffness: 300, duration: 0.3 }}
        >
          {currentPlate ? currentPlate.weight : '0kg'}
        </motion.div>
        <motion.div 
          className="text-lg font-semibold mb-1"
          animate={{ 
            opacity: value > 0 ? 1 : 0.5,
            color: currentPlate ? currentPlate.color : '#6B7280'
          }}
        >
          {currentPlate ? currentPlate.difficulty : 'Ready to lift?'}
        </motion.div>
        <div className="text-sm text-tfe-gray-600">
          {isDragging ? 'Loading plates...' : value === 0 ? 'Drag to load the barbell' : `Rating: ${value}/${max}`}
        </div>
      </div>

      {/* Interactive Gym Scene - increased height for bigger plates */}
      <div className="relative h-56">
        {/* Gym floor */}
        <div className="absolute bottom-0 left-0 w-full h-3 bg-gradient-to-r from-gray-800 via-gray-700 to-gray-800 rounded-full opacity-80" />
        <div className="absolute bottom-1 left-0 w-full h-1 bg-gray-900 rounded-full opacity-60" />
        
        {/* Gym Characters */}
        {gymCharacters.map((character) => (
          <motion.div
            key={character.id}
            className={`absolute ${
              character.position === 'left' ? 'left-8' :
              character.position === 'right' ? 'right-8' :
              character.position === 'far-left' ? 'left-2' : 'right-2'
            } top-8`}
            animate={{
              y: isDragging ? [0, -4, 0] : isLifting ? [0, -8, 0] : 0,
              rotate: isDragging ? [-2, 2, -2] : 0,
              scale: intensity > 0.7 ? [1, 1.1, 1] : 1,
            }}
            transition={{
              duration: isDragging ? 0.6 : isLifting ? 1.2 : 0.3,
              repeat: (isDragging || isLifting) ? Infinity : 0,
              delay: character.id * 0.1
            }}
          >
            {/* Character body */}
            <div 
              className="w-7 h-14 rounded-full relative"
              style={{
                background: `linear-gradient(135deg, ${character.color}, ${character.color}dd)`,
                boxShadow: '0 3px 6px rgba(0,0,0,0.3)'
              }}
            >
              {/* Head */}
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-5 h-5 rounded-full bg-orange-200 border border-orange-300" />
              
              {/* Arms - different poses for spotters vs cheerers */}
              {character.type === 'spotter' ? (
                <>
                  <motion.div 
                    className="absolute top-3 -left-1 w-4 h-1 bg-orange-200 rounded-full"
                    animate={{
                      rotate: isDragging ? -60 : -40,
                    }}
                    style={{ transformOrigin: 'right center' }}
                  />
                  <motion.div 
                    className="absolute top-5 -left-1 w-4 h-1 bg-orange-200 rounded-full"
                    animate={{
                      rotate: isDragging ? -45 : -30,
                    }}
                    style={{ transformOrigin: 'right center' }}
                  />
                </>
              ) : (
                <>
                  <motion.div 
                    className="absolute top-2 -left-1 w-3 h-1 bg-orange-200 rounded-full"
                    animate={{
                      rotate: isDragging || isLifting ? [45, 60, 45] : 20,
                    }}
                    transition={{ duration: 0.5, repeat: (isDragging || isLifting) ? Infinity : 0 }}
                    style={{ transformOrigin: 'right center' }}
                  />
                  <motion.div 
                    className="absolute top-2 -right-1 w-3 h-1 bg-orange-200 rounded-full"
                    animate={{
                      rotate: isDragging || isLifting ? [-45, -60, -45] : -20,
                    }}
                    transition={{ duration: 0.5, repeat: (isDragging || isLifting) ? Infinity : 0 }}
                    style={{ transformOrigin: 'left center' }}
                  />
                </>
              )}
              
              {/* Legs */}
              <div className="absolute -bottom-3 left-1 w-1 h-5 bg-blue-800 rounded-full" />
              <div className="absolute -bottom-3 right-1 w-1 h-5 bg-blue-800 rounded-full" />
            </div>
            
            {/* Motivation emojis */}
            {(isDragging || isLifting || intensity > 0.3) && (
              <motion.div
                className="absolute -top-8 left-1/2 transform -translate-x-1/2"
                initial={{ opacity: 0, scale: 0 }}
                animate={{ 
                  opacity: [0, 1, 0],
                  scale: [0.5, 1.3, 0.8],
                  y: [-5, -12, -5]
                }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  delay: character.id * 0.2
                }}
              >
                <div className="text-lg">{character.emoji}</div>
              </motion.div>
            )}
          </motion.div>
        ))}

        {/* Interactive Barbell - positioned at the center */}
        <div
          ref={sliderRef}
          className="absolute top-20 left-16 right-16 h-16 cursor-grab active:cursor-grabbing"
          onMouseDown={handleMouseDown}
          onTouchStart={handleTouchStart}
        >
          {/* Barbell shadow */}
          <div
            className="absolute top-24 left-0 right-0 h-4 bg-black rounded-full opacity-20"
            style={{
              filter: `blur(${4 + intensity * 3}px)`,
              transform: `scaleY(${1 + intensity * 0.4})`
            }}
          />

          {/* Main Olympic barbell bar - centered and fixed position */}
          <div
            className="absolute top-6 left-0 right-0 h-4 rounded-full bg-gradient-to-r from-gray-500 via-gray-400 to-gray-500 border border-gray-600"
            style={{
              boxShadow: `
                inset 0 2px 4px rgba(0,0,0,0.3),
                inset 0 -1px 2px rgba(255,255,255,0.2),
                0 2px 8px rgba(0,0,0,0.2)
              `,
              zIndex: 15
            }}
          >
            {/* Barbell knurling texture */}
            <div 
              className="absolute inset-0 rounded-full opacity-30"
              style={{
                background: `
                  repeating-linear-gradient(
                    90deg,
                    rgba(0,0,0,0.2) 0px,
                    transparent 1px,
                    rgba(255,255,255,0.1) 2px,
                    transparent 3px
                  )
                `,
              }}
            />
          </div>

          {/* Weight plates on both sides - properly centered on the barbell */}
          <AnimatePresence>
            {plateSequence.length > 0 && (
              <>
                {/* Left side plates - stacked from collar inward using proper sequence */}
                {plateSequence.map((plateRating, plateIndex) => {
                  const plateConfig = getPlateConfig(plateRating);
                  const plateOffset = plateIndex * (plateConfig.thickness + 6); // Each plate adds thickness + gap
                  
                  return (
                    <motion.div
                      key={`left-${plateRating}-${plateIndex}`}
                      className="absolute border-4 border-gray-800 rounded-xl flex items-center justify-center"
                      style={{
                        left: `${60 + plateOffset}px`, // Position near left collar area
                        width: `${plateConfig.thickness}px`,
                        height: `${plateConfig.size}px`,
                        backgroundColor: plateConfig.color,
                        top: `${96 - plateConfig.size/2}px`, // Center on the barbell (barbell center at 96px: top-20 + 6px + 8px)
                        zIndex: 20 + plateIndex,
                        boxShadow: `0 8px 25px ${plateConfig.color}60, inset 0 3px 6px rgba(255,255,255,0.3)`
                      }}
                      initial={{ x: -200, opacity: 0, rotateY: -90, scale: 0.6 }}
                      animate={{ 
                        x: 0, 
                        opacity: 1, 
                        rotateY: 0,
                        scale: 1
                      }}
                      exit={{ x: -200, opacity: 0, rotateY: -90, scale: 0.6 }}
                      transition={{ 
                        type: "spring",
                        stiffness: 300,
                        damping: 25,
                        delay: plateIndex * 0.2 // Stagger the loading animation
                      }}
                    >
                      {/* Barbell hole in center of plate */}
                      <div 
                        className="absolute bg-gray-900 rounded-full border-2 border-gray-800"
                        style={{ 
                          width: '24px', 
                          height: '24px',
                          left: '50%',
                          top: '50%',
                          transform: 'translate(-50%, -50%)'
                        }}
                      />
                      
                      {/* Weight text */}
                      <div 
                        className="absolute text-white font-bold pointer-events-none"
                        style={{ 
                          fontSize: `${Math.max(12, plateConfig.size * 0.09)}px`,
                          bottom: '12px',
                          left: '50%',
                          transform: 'translateX(-50%)',
                          textShadow: '0 2px 4px rgba(0,0,0,0.8)'
                        }}
                      >
                        {plateConfig.weight}
                      </div>
                    </motion.div>
                  );
                })}

                {/* Right side plates - stacked from collar inward using proper sequence */}
                {plateSequence.map((plateRating, plateIndex) => {
                  const plateConfig = getPlateConfig(plateRating);
                  const plateOffset = plateIndex * (plateConfig.thickness + 6); // Each plate adds thickness + gap
                  
                  return (
                    <motion.div
                      key={`right-${plateRating}-${plateIndex}`}
                      className="absolute border-4 border-gray-800 rounded-xl flex items-center justify-center"
                      style={{
                        right: `${60 + plateOffset}px`, // Position near right collar area
                        width: `${plateConfig.thickness}px`,
                        height: `${plateConfig.size}px`,
                        backgroundColor: plateConfig.color,
                        top: `${96 - plateConfig.size/2}px`, // Center on the barbell (barbell center at 96px: top-20 + 6px + 8px)
                        zIndex: 20 + plateIndex,
                        boxShadow: `0 8px 25px ${plateConfig.color}60, inset 0 3px 6px rgba(255,255,255,0.3)`
                      }}
                      initial={{ x: 200, opacity: 0, rotateY: 90, scale: 0.6 }}
                      animate={{ 
                        x: 0, 
                        opacity: 1, 
                        rotateY: 0,
                        scale: 1
                      }}
                      exit={{ x: 200, opacity: 0, rotateY: 90, scale: 0.6 }}
                      transition={{ 
                        type: "spring",
                        stiffness: 300,
                        damping: 25,
                        delay: plateIndex * 0.2 + 0.1 // Slight delay for alternating side loading
                      }}
                    >
                      {/* Barbell hole in center of plate */}
                      <div 
                        className="absolute bg-gray-900 rounded-full border-2 border-gray-800"
                        style={{ 
                          width: '24px', 
                          height: '24px',
                          left: '50%',
                          top: '50%',
                          transform: 'translate(-50%, -50%)'
                        }}
                      />
                      
                      {/* Weight text */}
                      <div 
                        className="absolute text-white font-bold pointer-events-none"
                        style={{ 
                          fontSize: `${Math.max(12, plateConfig.size * 0.09)}px`,
                          bottom: '12px',
                          left: '50%',
                          transform: 'translateX(-50%)',
                          textShadow: '0 2px 4px rgba(0,0,0,0.8)'
                        }}
                      >
                        {plateConfig.weight}
                      </div>
                    </motion.div>
                  );
                })}
              </>
            )}
          </AnimatePresence>

          {/* Barbell collars/clips - positioned outside the plates */}
          <motion.div 
            className="absolute bg-gray-700 rounded-md border border-gray-800"
            style={{ 
              width: '16px', 
              height: '40px',
              left: `${44 + (plateSequence.length > 0 ? plateSequence.reduce((acc, rating) => acc + getPlateConfig(rating).thickness + 6, 0) : 0)}px`,
              top: '76px', // Centered on barbell (barbell center at 96px, collar height 40px, so 96-20=76px)
              zIndex: 30,
              boxShadow: '0 4px 8px rgba(0,0,0,0.4)'
            }}
            animate={{ 
              rotateZ: isDragging ? [0, 4, -4, 0] : 0,
            }}
            transition={{ 
              duration: 0.6, 
              repeat: isDragging ? Infinity : 0,
              layout: { duration: 0.4 }
            }}
          />
          <motion.div 
            className="absolute bg-gray-700 rounded-md border border-gray-800"
            style={{ 
              width: '16px', 
              height: '40px',
              right: `${44 + (plateSequence.length > 0 ? plateSequence.reduce((acc, rating) => acc + getPlateConfig(rating).thickness + 6, 0) : 0)}px`,
              top: '76px', // Centered on barbell (barbell center at 96px, collar height 40px, so 96-20=76px)
              zIndex: 30,
              boxShadow: '0 4px 8px rgba(0,0,0,0.4)'
            }}
            animate={{ 
              rotateZ: isDragging ? [0, -4, 4, 0] : 0,
            }}
            transition={{ 
              duration: 0.6, 
              repeat: isDragging ? Infinity : 0,
              layout: { duration: 0.4 }
            }}
          />

          {/* Power/effort visualization */}
          {isDragging && (
            <motion.div
              className="absolute inset-0 pointer-events-none"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {/* Energy waves */}
              {Array.from({ length: 4 }).map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute bg-yellow-400 rounded-full opacity-60"
                  style={{
                    width: '2px',
                    height: `${8 + i * 3}px`,
                    left: `${25 + i * 15}%`,
                    top: '16px',
                  }}
                  animate={{
                    y: [-3, 3, -3],
                    opacity: [0.6, 1, 0.6],
                    scaleY: [1, 1.5, 1]
                  }}
                  transition={{
                    duration: 0.5,
                    repeat: Infinity,
                    delay: i * 0.1
                  }}
                />
              ))}
              
              {/* Power sparks */}
              {Array.from({ length: 6 }).map((_, i) => (
                <motion.div
                  key={`spark-${i}`}
                  className="absolute w-1 h-1 bg-orange-400 rounded-full"
                  style={{
                    left: `${20 + Math.random() * 60}%`,
                    top: `${12 + Math.random() * 16}px`
                  }}
                  animate={{
                    scale: [0, 1, 0],
                    opacity: [0, 1, 0],
                    rotate: [0, 180, 360]
                  }}
                  transition={{
                    duration: 0.8,
                    repeat: Infinity,
                    delay: i * 0.2
                  }}
                />
              ))}
            </motion.div>
          )}
        </div>

        {/* Performance indicator */}
        <motion.div
          className="absolute right-4 top-2 text-center"
          animate={{
            scale: intensity > 0.8 ? [1, 1.2, 1] : 1,
            opacity: intensity > 0.2 ? 1 : 0.6
          }}
          transition={{ duration: 0.3 }}
        >
          <div className="text-3xl mb-1">
            {intensity > 0.8 ? '🔥' : intensity > 0.6 ? '💪' : intensity > 0.4 ? '💯' : intensity > 0.2 ? '👍' : '💭'}
          </div>
          <div className="text-xs text-gray-600 font-medium">
            {intensity > 0.8 ? 'Beast Mode!' : intensity > 0.6 ? 'Strong!' : intensity > 0.4 ? 'Good Form!' : intensity > 0.2 ? 'Getting There!' : 'Warm Up'}
          </div>
        </motion.div>

        {/* Progress bar */}
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 w-64 h-3 bg-gray-200 rounded-full overflow-hidden">
          <motion.div
            className="h-full rounded-full"
            style={{
              background: currentPlate ? 
                `linear-gradient(90deg, ${currentPlate.color}88, ${currentPlate.color})` :
                'linear-gradient(90deg, #e5e7eb, #d1d5db)'
            }}
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          />
        </div>
      </div>

      {/* Interactive Rating Buttons */}
      <div className="flex justify-center gap-3 px-4 flex-wrap">
        {ratingValues.map((plateValue) => {
          const config = getPlateConfig(plateValue);
          const isSelected = value === plateValue;
          
          return (
            <motion.button
              key={plateValue}
              onClick={() => onChange(plateValue)}
              whileHover={{ scale: 1.08, y: -3 }}
              whileTap={{ scale: 0.92 }}
              className="relative flex flex-col items-center p-4 rounded-2xl border-2 transition-all duration-300 bg-white hover:shadow-xl min-w-[90px] group"
              style={{
                borderColor: isSelected ? config.color : '#e5e7eb',
                backgroundColor: isSelected ? `${config.color}10` : 'white',
                boxShadow: isSelected ? 
                  `0 8px 25px ${config.color}30, 0 0 0 3px ${config.color}20` : 
                  '0 4px 6px rgba(0,0,0,0.05)'
              }}
            >
              {/* Animated plate icon */}
              <motion.div 
                className="rounded-xl border-3 mb-3 relative flex-shrink-0 flex items-center justify-center overflow-hidden"
                style={{ 
                  width: '40px',
                  height: '40px',
                  backgroundColor: config.color,
                  borderColor: isSelected ? '#374151' : '#6B7280',
                  boxShadow: `0 4px 12px ${config.color}40`
                }}
                animate={{
                  rotateY: isSelected ? [0, 360] : 0,
                  scale: isSelected ? [1, 1.1, 1] : 1
                }}
                transition={{
                  rotateY: { duration: 0.8, ease: "easeInOut" },
                  scale: { duration: 0.3 }
                }}
              >
                {/* Plate hole */}
                <div 
                  className="bg-gray-800 rounded-full border border-gray-900"
                  style={{ width: '12px', height: '12px' }}
                />
                
                {/* Shine effect */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-tr from-transparent via-white to-transparent opacity-20 rounded-xl"
                  animate={{
                    x: isSelected ? [-100, 100] : 0,
                    opacity: isSelected ? [0, 0.4, 0] : 0.2
                  }}
                  transition={{
                    duration: 1.2,
                    repeat: isSelected ? Infinity : 0,
                    repeatDelay: 2
                  }}
                />
              </motion.div>
              
              {/* Rating number with pulse effect */}
              <motion.div 
                className={`text-xl font-bold mb-2 ${isSelected ? 'text-gray-800' : 'text-gray-700'}`}
                animate={{
                  scale: isSelected ? [1, 1.15, 1] : 1,
                  color: isSelected ? config.color : '#374151'
                }}
                transition={{ duration: 0.3 }}
              >
                {plateValue}
              </motion.div>
              
              {/* Weight and difficulty labels */}
              <div className="text-center">
                <div className={`text-sm font-semibold ${isSelected ? 'text-gray-800' : 'text-gray-600'}`}>
                  {config.weight}
                </div>
                <motion.div 
                  className={`text-xs font-medium mt-1 ${isSelected ? 'text-gray-700' : 'text-gray-500'}`}
                  animate={{
                    opacity: isSelected ? 1 : 0.7
                  }}
                >
                  {config.difficulty}
                </motion.div>
              </div>

              {/* Selection indicator */}
              {isSelected && (
                <motion.div
                  className="absolute -top-2 -right-2 w-6 h-6 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: config.color }}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: "spring", stiffness: 500, damping: 25 }}
                >
                  <div className="text-white text-xs font-bold">✓</div>
                </motion.div>
              )}

              {/* Hover glow effect */}
              <motion.div
                className="absolute inset-0 rounded-2xl pointer-events-none"
                style={{
                  background: `radial-gradient(circle at center, ${config.color}15, transparent 70%)`,
                }}
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              />
            </motion.button>
          );
        })}
      </div>

      {/* Descriptive Labels */}
      {labels && (
        <motion.div 
          className="flex justify-between items-center text-sm font-medium text-gray-700 px-6 mt-6"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <motion.div 
            className="flex items-center space-x-3 max-w-[30%]"
            whileHover={{ scale: 1.05 }}
          >
            <div 
              className="w-4 h-4 rounded-full shadow-sm"
              style={{ backgroundColor: getPlateConfig(min).color }}
            />
            <span className="text-xs sm:text-sm">{labels[min]}</span>
          </motion.div>
          
          {max - min > 2 && labels[Math.floor((max + min) / 2)] && (
            <motion.div 
              className="flex items-center space-x-3 max-w-[30%]"
              whileHover={{ scale: 1.05 }}
            >
              <div 
                className="w-4 h-4 rounded-full shadow-sm"
                style={{ backgroundColor: getPlateConfig(Math.floor((max + min) / 2)).color }}
              />
              <span className="text-xs sm:text-sm text-center">{labels[Math.floor((max + min) / 2)]}</span>
            </motion.div>
          )}
          
          <motion.div 
            className="flex items-center space-x-3 max-w-[30%] justify-end"
            whileHover={{ scale: 1.05 }}
          >
            <span className="text-xs sm:text-sm text-right">{labels[max]}</span>
            <div 
              className="w-4 h-4 rounded-full shadow-sm"
              style={{ backgroundColor: getPlateConfig(max).color }}
            />
          </motion.div>
        </motion.div>
      )}

      {/* Fun instruction text */}
      <motion.div
        className="text-center text-sm text-gray-500 italic"
        initial={{ opacity: 0 }}
        animate={{ opacity: value === 0 ? 1 : 0.6 }}
        transition={{ duration: 0.3 }}
      >
        {value === 0 ? 
          "💡 Drag the barbell or click a weight to rate your experience" :
          "🏋️‍♂️ Great choice! Your training partners are cheering you on!"
        }
      </motion.div>
    </div>
  );
};

export default BarbellPlateRating;
