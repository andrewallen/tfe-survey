import React from 'react';
import WeightStackRating from './WeightStackRating';
import RopeSlider from './RopeSlider';
import KettlebellOptions from './KettlebellOptions';
import BarbellPlateRating from './BarbellPlateRating';
import BattleRopeWave from './BattleRopeWave';
import MedicineBallSelector from './MedicineBallSelector';
import { Question } from '../../types/survey';

interface GymThemeQuestionProps {
  question: Question;
  value: string | string[] | number;
  onChange: (value: string | string[] | number) => void;
  mode?: 'classic' | 'weightStack' | 'ropeSlider' | 'kettlebell' | 'barbellPlate' | 'battleRope' | 'medicineBall';
}

const GymThemeQuestion: React.FC<GymThemeQuestionProps> = ({
  question,
  value,
  onChange,
  mode = 'weightStack',
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
          onChange={(val) => onChange(val)}
          labels={labels}
        />
      );
    } else if (mode === 'barbellPlate') {
      return (
        <BarbellPlateRating 
          min={min}
          max={max}
          value={typeof value === 'number' ? value : min}
          onChange={(val) => onChange(val)}
          labels={labels}
        />
      );
    } else if (mode === 'battleRope') {
      return (
        <BattleRopeWave 
          min={min}
          max={max}
          value={typeof value === 'number' ? value : min}
          onChange={(val) => onChange(val)}
          labels={labels}
        />
      );
    }
    
    // Default to weight stack
    return (
      <WeightStackRating 
        min={min}
        max={max}
        value={typeof value === 'number' ? value : min}
        onChange={(val) => onChange(val)}
        labels={labels}
      />
    );
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
