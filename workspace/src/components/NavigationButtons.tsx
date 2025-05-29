import { useSurvey } from '../contexts/SurveyContext';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Question } from '../types/survey';
import clsx from 'clsx';

export default function NavigationButtons({ currentQuestion }: { currentQuestion: Question | null }) {
  const { 
    state, 
    nextQuestion, 
    previousQuestion, 
    completeSurvey, 
    getResponse, 
    shouldShowQuestion 
  } = useSurvey();
  const navigate = useNavigate();

  const isFirstQuestion = state.currentQuestionIndex === 0;
  const isLastQuestion = state.currentQuestionIndex === state.totalQuestions - 1;

  // Check if the current question is answered if it's required
  const isCurrentQuestionAnswered = () => {
    if (!currentQuestion) {
      return true; // No question to answer, so allow proceeding
    }
    
    // Skip validation for conditional questions that shouldn't be shown
    // Use the centralized shouldShowQuestion function
    if (!shouldShowQuestion(currentQuestion)) {
      return true; // This question should be skipped, so don't require an answer
    }
    
    // If the question is not required, allow proceeding
    if (!currentQuestion.required) {
      return true;
    }
    
    // Check if the question has been answered
    const response = getResponse(currentQuestion.id);
    if (!response || response.answer === '' || 
        (Array.isArray(response.answer) && response.answer.length === 0)) {
      return false; // Required but not answered
    }
    
    return true;
  };

  const handleNext = () => {
    if (!isCurrentQuestionAnswered()) {
      // Show a more informative message
      alert(`Please answer the required question: "${currentQuestion?.title}"`);
      return;
    }
    
    if (isLastQuestion) {
      completeSurvey();
      navigate('/thank-you');
    } else {
      nextQuestion();
    }
  };

  const handlePrevious = () => {
    if (isFirstQuestion) {
      navigate('/');
    } else {
      previousQuestion();
    }
  };

  return (
    <div className="flex justify-between items-center">
      <motion.button
        onClick={handlePrevious}
        className="inline-flex items-center px-6 py-3 text-tfe-gray-600 hover:text-tfe-gray-800 transition-colors duration-200"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <ChevronLeft className="w-5 h-5 mr-1" />
        {isFirstQuestion ? 'Back to Welcome' : 'Previous'}
      </motion.button>

      <motion.button
        onClick={handleNext}
        disabled={!isCurrentQuestionAnswered()}
        className={clsx(
          'inline-flex items-center px-8 py-3 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200',
          !isCurrentQuestionAnswered() && 'opacity-50 cursor-not-allowed'
        )}
        style={{ background: 'var(--tfe-gradient-primary)' }}
        whileHover={{ scale: isCurrentQuestionAnswered() ? 1.05 : 1 }}
        whileTap={{ scale: isCurrentQuestionAnswered() ? 0.95 : 1 }}
      >
        {isLastQuestion ? 'Complete Survey' : 'Next'}
        {!isLastQuestion && <ChevronRight className="w-5 h-5 ml-1" />}
      </motion.button>
    </div>
  );
}
