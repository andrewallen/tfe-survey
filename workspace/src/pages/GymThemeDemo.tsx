import React, { useState } from 'react';
import GymThemeQuestion from '../components/GymTheme/GymThemeQuestion';
import { Question } from '../types/survey';

const GymThemeDemo: React.FC = () => {
  // Example questions for demonstration
  const ratingQuestion: Question = {
    id: 'rating-demo',
    type: 'rating',
    title: 'How would you rate your workout experience?',
    required: true,
    ratingScale: {
      min: 1,
      max: 5,
      labels: {
        1: 'Poor',
        3: 'Neutral',
        5: 'Excellent'
      }
    }
  };
  
  const choiceQuestion: Question = {
    id: 'choice-demo',
    type: 'multiple-choice',
    title: 'Which workout areas interest you most?',
    subtitle: 'Select up to 3 options',
    required: true,
    maxSelections: 3,
    options: [
      'Strength Training',
      'Cardio',
      'Flexibility',
      'HIIT',
      'Functional Training',
      'Olympic Lifting'
    ]
  };
  
  const singleChoiceQuestion: Question = {
    id: 'single-choice-demo',
    type: 'single-choice',
    title: 'How often do you visit the gym?',
    required: true,
    options: [
      'Daily',
      '3-4 times per week',
      '1-2 times per week',
      'Few times per month',
      'Rarely'
    ]
  };

  // State for storing responses
  const [ratingValues, setRatingValues] = useState<{[key: string]: number}>({
    ropeSlider: 4
  });
  
  const [multipleChoiceValue, setMultipleChoiceValue] = useState<string[]>(['Strength Training']);
  const [singleChoiceValue, setSingleChoiceValue] = useState<string>('3-4 times per week');

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white">
      <h1 className="text-3xl font-bold mb-8 text-tfe-primary">Gym-Themed UI Components</h1>
      
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-6 text-tfe-gray-800">Rating Components</h2>
        
        <div className="mb-8 p-6 bg-gray-50 rounded-lg">
          <h3 className="text-xl font-medium mb-4">Rope Slider Rating</h3>
          <p className="text-sm mb-4 text-tfe-gray-600">{ratingQuestion.title}</p>
          <GymThemeQuestion 
            question={ratingQuestion} 
            value={ratingValues.ropeSlider}
            onChange={(val) => setRatingValues({...ratingValues, ropeSlider: val as number})}
            mode="ropeSlider"
          />
          <p className="mt-3 text-sm text-tfe-gray-500">Selected value: {ratingValues.ropeSlider}</p>
        </div>
      </section>
      
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-6 text-tfe-gray-800">Choice Components</h2>
        
        <div className="mb-8 p-6 bg-gray-50 rounded-lg">
          <h3 className="text-xl font-medium mb-4">Kettlebell Options</h3>
          <p className="text-sm mb-4 text-tfe-gray-600">{choiceQuestion.title}</p>
          <p className="text-xs mb-4 text-tfe-gray-500">{choiceQuestion.subtitle}</p>
          <GymThemeQuestion 
            question={choiceQuestion} 
            value={multipleChoiceValue}
            onChange={(val) => setMultipleChoiceValue(Array.isArray(val) 
              ? val.map(item => String(item)) 
              : [String(val)])}
            mode="kettlebell"
          />
          <p className="mt-3 text-sm text-tfe-gray-500">Selected values: {multipleChoiceValue.join(', ')}</p>
        </div>
        
        <div className="mb-8 p-6 bg-gray-50 rounded-lg">
          <h3 className="text-xl font-medium mb-4">Medicine Ball Selector</h3>
          <p className="text-sm mb-4 text-tfe-gray-600">{singleChoiceQuestion.title}</p>
          <GymThemeQuestion 
            question={singleChoiceQuestion} 
            value={singleChoiceValue}
            onChange={(val) => setSingleChoiceValue(val as string)}
            mode="medicineBall"
          />
          <p className="mt-3 text-sm text-tfe-gray-500">Selected value: {singleChoiceValue}</p>
        </div>
      </section>
    </div>
  );
};

export default GymThemeDemo;
