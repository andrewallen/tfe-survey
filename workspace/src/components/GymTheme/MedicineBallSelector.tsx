import React from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

interface MedicineBallSelectorProps {
  options: string[];
  selectedValues: string | string[];
  onChange: (value: string | string[]) => void;
  maxSelections?: number;
  mode: 'single' | 'multiple';
}

const MedicineBallSelector: React.FC<MedicineBallSelectorProps> = ({
  options,
  selectedValues,
  onChange,
  maxSelections = Infinity,
  mode = 'single',
}) => {
  // For single-choice, ensure we convert the single value to an array
  const selected = Array.isArray(selectedValues) ? selectedValues : [selectedValues];
  
  const handleSelection = (option: string) => {
    const isSelected = selected.includes(option);
    
    if (mode === 'single') {
      // For single choice, just select the one option
      onChange(option);
    } else {
      // For multiple choice
      if (isSelected) {
        // If already selected, remove it (toggle behavior)
        const newSelection = selected.filter(item => item !== option);
        onChange(newSelection.length === 1 ? newSelection[0] : newSelection);
      } else {
        // If not selected and we haven't hit max, add it
        if (selected.length < maxSelections || maxSelections === Infinity) {
          const newSelection = [...selected, option];
          onChange(newSelection.length === 1 ? newSelection[0] : newSelection);
        }
      }
    }
  };
  
  // Check if we can select more options (for multiple choice)
  const canSelect = (option: string) => {
    if (mode === 'single') return true;
    return selected.length < maxSelections || selected.includes(option);
  };

  // Generate grid layout - 2 columns for mobile, 3 for larger screens
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {options.map((option, index) => {
          const isSelected = selected.includes(option);
          const isDisabled = !canSelect(option) && !isSelected;
          
          // Generate a unique but consistent color for each ball
          const hue = (index * 30) % 360;
          const ballColor = isSelected 
            ? 'var(--tfe-primary)' 
            : `hsl(${hue}, ${isDisabled ? '10%' : '70%'}, ${isDisabled ? '75%' : '45%'})`;
          const textColor = isSelected || hue > 200 ? 'white' : '#333';
          
          return (
            <motion.button
              key={option}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ 
                opacity: 1, 
                scale: isSelected ? 1.05 : 1,
                y: isSelected ? -5 : 0
              }}
              transition={{ 
                delay: index * 0.05,
                type: "spring",
                stiffness: 400,
                damping: 20
              }}
              onClick={() => !isDisabled && handleSelection(option)}
              disabled={isDisabled}
              className={`
                flex items-center justify-center text-center p-4 relative
                transition-all duration-300 rounded-full aspect-square
                ${isDisabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:scale-105'}
              `}
              style={{
                background: ballColor,
                boxShadow: isSelected 
                  ? '0 8px 16px rgba(0, 0, 0, 0.25), inset 0 -8px 0 rgba(0, 0, 0, 0.2)' 
                  : '0 4px 8px rgba(0, 0, 0, 0.15), inset 0 -4px 0 rgba(0, 0, 0, 0.1)',
              }}
              whileHover={!isDisabled ? { scale: 1.05 } : {}}
              whileTap={!isDisabled ? { scale: 0.95 } : {}}
            >
              {/* Text content */}
              <span 
                className="font-medium text-sm sm:text-base relative z-10"
                style={{ color: textColor }}
              >
                {option}
              </span>
              
              {/* Selection check mark */}
              {isSelected && (
                <motion.div 
                  className="absolute top-2 right-2 bg-white rounded-full p-0.5"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 500, damping: 15 }}
                >
                  <Check size={16} className="text-tfe-primary" />
                </motion.div>
              )}
              
              {/* Medicine ball texture - grid pattern overlay */}
              <div className="absolute inset-0 rounded-full overflow-hidden opacity-20 pointer-events-none">
                <div className="w-full h-full" style={{
                  backgroundImage: `
                    linear-gradient(0deg, transparent 0%, transparent 49%, rgba(0,0,0,0.3) 50%, rgba(0,0,0,0.3) 51%, transparent 52%, transparent 100%), 
                    linear-gradient(90deg, transparent 0%, transparent 49%, rgba(0,0,0,0.3) 50%, rgba(0,0,0,0.3) 51%, transparent 52%, transparent 100%)
                  `,
                  backgroundSize: '8px 8px'
                }} />
              </div>
              
              {/* Highlight effect on top */}
              <div className="absolute top-0 left-0 right-0 h-1/3 rounded-t-full bg-white opacity-20 pointer-events-none" />
            </motion.button>
          );
        })}
      </div>
      
      {/* Show max selections hint for multiple choice */}
      {mode === 'multiple' && maxSelections < Infinity && (
        <p className="text-sm text-tfe-gray-500 mt-2 text-center">
          Select up to {maxSelections} options
          <span className="ml-2 font-medium">
            ({selected.length}/{maxSelections})
          </span>
        </p>
      )}
    </div>
  );
};

export default MedicineBallSelector;
