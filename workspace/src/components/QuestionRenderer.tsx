import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Question } from '../types/survey';
import { useSurvey } from '../contexts/SurveyContext';
import { Check } from 'lucide-react';
import clsx from 'clsx';

interface QuestionRendererProps {
  question: Question;
}

export default function QuestionRenderer({ question }: QuestionRendererProps) {
  const { answerQuestion, getResponse, shouldShowQuestion } = useSurvey();
  const [selectedValue, setSelectedValue] = useState<string | string[] | number | Record<string, string>>('');
  const [textValue, setTextValue] = useState('');

  const existingResponse = getResponse(question.id);
  
  // Use the centralized shouldShowQuestion function from the context
  // Remove auto-advance logic to avoid conflicts with Survey.tsx navigation
  // The Survey component now handles the navigation logic

  if (!shouldShowQuestion(question)) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-tfe-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-tfe-gray-600">Loading next question...</p>
        </div>
      </div>
    );
  }

  useEffect(() => {
    if (existingResponse) {
      setSelectedValue(existingResponse.answer);
      if (typeof existingResponse.answer === 'string') {
        setTextValue(existingResponse.answer);
      }
    } else {
      if (question.type === 'multiple-choice') {
        setSelectedValue([]);
      } else if (question.type === 'matrix') {
        setSelectedValue({});
      } else {
        setSelectedValue('');
      }
      setTextValue('');
    }
  }, [question.id, existingResponse]);

  const handleAnswer = (value: string | string[] | number | Record<string, string>) => {
    setSelectedValue(value);
    answerQuestion(question.id, value);
  };

  const handleTextChange = (value: string) => {
    setTextValue(value);
    setSelectedValue(value);
    answerQuestion(question.id, value);
  };

  const renderSingleChoice = () => (
    <div className="space-y-3">
      {question.options?.map((option, index) => (
        <motion.button
          key={option}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          onClick={() => handleAnswer(option)}
          className={clsx(
            'option-button',
            selectedValue === option && 'selected'
          )}
        >
          <div className="flex items-center justify-between">
            <span>{option}</span>
            {selectedValue === option && (
              <Check className="w-5 h-5 flex-shrink-0" />
            )}
          </div>
        </motion.button>
      ))}
    </div>
  );

  const renderMultipleChoice = () => {
    const selectedArray = Array.isArray(selectedValue) ? selectedValue : [];
    
    return (
      <div className="space-y-3">
        {question.options?.map((option, index) => {
          const isSelected = selectedArray.includes(option);
          const canSelect = selectedArray.length < (question.maxSelections || 999) || isSelected;
          
          return (
            <motion.button
              key={option}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => {
                if (!canSelect && !isSelected) return;
                
                const newSelection = isSelected
                  ? selectedArray.filter(item => item !== option)
                  : [...selectedArray, option];
                handleAnswer(newSelection);
              }}
              disabled={!canSelect && !isSelected}
              className={clsx(
                'option-button',
                isSelected && 'selected',
                !canSelect && !isSelected && 'opacity-50 cursor-not-allowed'
              )}
            >
              <div className="flex items-center justify-between">
                <span>{option}</span>
                {isSelected && (
                  <Check className="w-5 h-5 flex-shrink-0" />
                )}
              </div>
            </motion.button>
          );
        })}
        {question.maxSelections && (
          <p className="text-sm text-tfe-gray-500 mt-2">
            Select up to {question.maxSelections} options
          </p>
        )}
      </div>
    );
  };

  const renderRating = () => {
    const { min = 1, max = 5, labels = {} } = question.ratingScale || {};
    const scale = Array.from({ length: max - min + 1 }, (_, i) => min + i);

    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center flex-wrap gap-2">
          {scale.map((value) => (
            <motion.button
              key={value}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: value * 0.05 }}
              onClick={() => handleAnswer(value)}
              className={clsx(
                'w-12 h-12 rounded-full border-2 font-semibold transition-all duration-200',
                selectedValue === value
                  ? 'bg-tfe-primary border-tfe-primary text-white'
                  : 'border-tfe-gray-300 hover:border-tfe-primary hover:text-tfe-primary'
              )}
            >
              {value}
            </motion.button>
          ))}
        </div>
        {labels && (
          <div className="flex justify-between text-sm text-tfe-gray-600">
            <span>{labels[min]}</span>
            <span>{labels[max]}</span>
          </div>
        )}
      </div>
    );
  };

  const renderText = () => (
    <div>
      {question.validation?.maxLength && question.validation.maxLength > 200 ? (
        <textarea
          value={textValue}
          onChange={(e) => handleTextChange(e.target.value)}
          placeholder="Enter your response..."
          className="w-full p-4 border-2 border-tfe-gray-200 rounded-xl focus:border-tfe-primary focus:outline-none resize-none"
          rows={4}
          maxLength={question.validation.maxLength}
        />
      ) : (
        <input
          type="text"
          value={textValue}
          onChange={(e) => handleTextChange(e.target.value)}
          placeholder="Enter your response..."
          className="w-full p-4 border-2 border-tfe-gray-200 rounded-xl focus:border-tfe-primary focus:outline-none"
          maxLength={question.validation?.maxLength}
        />
      )}
      {question.validation?.maxLength && (
        <p className="text-sm text-tfe-gray-500 mt-2">
          {textValue.length}/{question.validation.maxLength} characters
        </p>
      )}
    </div>
  );

  const renderNumber = () => (
    <input
      type="number"
      value={typeof selectedValue === 'number' ? selectedValue : ''}
      onChange={(e) => handleAnswer(parseInt(e.target.value) || 0)}
      placeholder="Enter number..."
      className="w-full p-4 border-2 border-tfe-gray-200 rounded-xl focus:border-tfe-primary focus:outline-none"
      min={question.validation?.minLength || 0}
    />
  );

  const renderConsent = () => (
    <div className="space-y-4">
      <motion.button
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        onClick={() => handleAnswer('consent-given')}
        className={clsx(
          'option-button text-left',
          selectedValue === 'consent-given' && 'selected'
        )}
      >
        <div className="flex items-center">
          <div className={clsx(
            'w-5 h-5 rounded border-2 mr-3 flex items-center justify-center',
            selectedValue === 'consent-given'
              ? 'bg-white border-white'
              : 'border-tfe-gray-400'
          )}>
            {selectedValue === 'consent-given' && (
              <Check className="w-3 h-3 text-tfe-primary" />
            )}
          </div>
          <span>{question.options?.[0]}</span>
        </div>
      </motion.button>
    </div>
  );

  const renderMatrix = () => {
    if (!question.matrixOptions) return null;
    
    const matrixResponses = (selectedValue as Record<string, string>) || {};
    const { rows, columns } = question.matrixOptions;
    
    return (
      <div className="space-y-6">
        {rows.map((row, rowIndex) => (
          <motion.div
            key={row}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: rowIndex * 0.1 }}
            className="space-y-3"
          >
            <h3 className="font-medium text-tfe-gray-800">{row}</h3>
            <div className="flex flex-wrap gap-2">
              {columns.map((column) => (
                <motion.button
                  key={`${row}-${column}`}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: (rowIndex * columns.length + columns.indexOf(column)) * 0.05 }}
                  onClick={() => {
                    const newResponses = { ...matrixResponses, [row]: column };
                    handleAnswer(newResponses);
                  }}
                  className={clsx(
                    'px-4 py-2 rounded-lg border-2 font-medium transition-all duration-200 text-sm',
                    matrixResponses[row] === column
                      ? 'bg-tfe-primary border-tfe-primary text-white'
                      : 'border-tfe-gray-300 hover:border-tfe-primary hover:text-tfe-primary'
                  )}
                >
                  {column}
                </motion.button>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    );
  };

  const renderQuestionContent = () => {
    switch (question.type) {
      case 'single-choice':
        return renderSingleChoice();
      case 'multiple-choice':
        return renderMultipleChoice();
      case 'rating':
        return renderRating();
      case 'text':
        return renderText();
      case 'number':
        return renderNumber();
      case 'consent':
        return renderConsent();
      case 'matrix':
        return renderMatrix();
      default:
        return null;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
      className="question-card mb-8"
    >
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-tfe-gray-800 mb-3">
          {question.title}
          {question.required && (
            <span className="text-tfe-primary ml-1">*</span>
          )}
        </h2>
        {question.subtitle && (
          <p className="text-tfe-gray-600 whitespace-pre-line">
            {question.subtitle}
          </p>
        )}
      </div>

      {renderQuestionContent()}
    </motion.div>
  );
}
