import React from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

interface KettlebellOptionsProps {
  options: string[];
  selectedValues: string | string[];
  onChange: (value: string | string[]) => void;
  maxSelections?: number;
  mode: 'single' | 'multiple';
}

const KettlebellOptions: React.FC<KettlebellOptionsProps> = ({
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

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {options.map((option, index) => {
          const isSelected = selected.includes(option);
          const isDisabled = !canSelect(option) && !isSelected;
          
          return (
            <motion.button
              key={option}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => !isDisabled && handleSelection(option)}
              disabled={isDisabled}
              className={`
                relative px-5 py-4 text-left rounded-xl transition-all duration-200
                ${isSelected 
                  ? 'text-white shadow-lg transform -translate-y-1' 
                  : 'text-tfe-gray-800 hover:text-tfe-primary hover:-translate-y-1'
                }
                ${isDisabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
              `}
              style={{
                background: isSelected ? 'var(--tfe-primary)' : 'white',
                border: `2px solid ${isSelected ? 'var(--tfe-primary)' : 'var(--tfe-gray-200)'}`,
              }}
            >
              {/* Kettlebell shape background */}
              <div className="absolute inset-0 -z-10 overflow-hidden">
                <svg 
                  viewBox="0 0 100 100" 
                  className="absolute top-0 left-0 w-full h-full opacity-10"
                >
                  <path 
                    d="M50,10 C60,10 70,15 70,30 L70,40 C80,45 90,55 90,70 C90,85 75,90 50,90 C25,90 10,85 10,70 C10,55 20,45 30,40 L30,30 C30,15 40,10 50,10 Z" 
                    fill={isSelected ? 'white' : 'var(--tfe-primary)'}
                  />
                  <circle cx="50" cy="20" r="8" fill={isSelected ? 'white' : 'var(--tfe-primary)'} />
                </svg>
              </div>
              
              {/* Option text */}
              <div className="flex items-center justify-between">
                <span className="pr-8">{option}</span>
                {isSelected && (
                  <Check className="w-5 h-5 flex-shrink-0" />
                )}
              </div>
              
              {/* Handle detail */}
              <div 
                className={`absolute top-0 left-1/2 h-2 w-10 rounded-b-xl -translate-x-1/2 transition-all duration-200
                  ${isSelected ? 'bg-tfe-accent' : 'bg-tfe-gray-300'}
                `} 
              />
            </motion.button>
          );
        })}
      </div>
      
      {/* Show max selections hint for multiple choice */}
      {mode === 'multiple' && maxSelections < Infinity && (
        <p className="text-sm text-tfe-gray-500 mt-2">
          Select up to {maxSelections} options
          <span className="ml-2 font-medium">
            ({selected.length}/{maxSelections})
          </span>
        </p>
      )}
    </div>
  );
};

export default KettlebellOptions;
