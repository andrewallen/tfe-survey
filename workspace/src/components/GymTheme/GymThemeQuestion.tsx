import React from 'react';
import RopeSlider from './RopeSlider';
import KettlebellOptions from './KettlebellOptions';
import MedicineBallSelector from './MedicineBallSelector';
import { Question } from '../../types/survey';

interface GymThemeQuestionProps {
  question: Question;
  value: string | string[] | number;
  onChange: (value: string | string[] | number) => void;
  mode?: 'classic' | 'ropeSlider' | 'kettlebell' | 'medicineBall';
}

const GymThemeQuestion: React.FC<GymThemeQuestionProps> = ({
  question,
  value,
  onChange,
  mode = 'ropeSlider',
}) => {
  // Render rating scales
  const renderRating = () => {
    const { min = 1, max = 5, labels = {} } = question.ratingScale || {};
    
    if (mode === 'ropeSlider') {
      return (
        <RopeSlider 
          min={min}
          max={max}
          value={typeof value === 'number' ? value : min}
          onChange={(val: number) => onChange(val)}
          labels={labels}
        />
      );
    }
    
    // Default to null for classic mode (will use default renderer)
    return null;
  };
  
  // Render choice questions
  const renderChoices = () => {
    if (!question.options) return null;
    
    if (mode === 'kettlebell') {
      return (
        <KettlebellOptions
          options={question.options}
          selectedValues={typeof value === 'number' ? value.toString() : value}
          onChange={(val) => onChange(val)}
          maxSelections={question.maxSelections}
          mode={question.type === 'single-choice' ? 'single' : 'multiple'}
        />
      );
    } else if (mode === 'medicineBall') {
      return (
        <MedicineBallSelector
          options={question.options}
          selectedValues={typeof value === 'number' ? value.toString() : value}
          onChange={(val) => onChange(val)}
          maxSelections={question.maxSelections}
          mode={question.type === 'single-choice' ? 'single' : 'multiple'}
        />
      );
    }
    
    // Default to classic rendering (no gym theme)
    return null;
  };
  
  // Render the appropriate component based on question type
  const renderQuestion = () => {
    switch (question.type) {
      case 'rating':
        return renderRating();
      case 'single-choice':
      case 'multiple-choice':
        return renderChoices();
      default:
        // For text, number, consent types, we'll use the default rendering
        return null;
    }
  };
  
  // If we're returning null, it means we should use the default renderer
  return renderQuestion();
};

export default GymThemeQuestion;
