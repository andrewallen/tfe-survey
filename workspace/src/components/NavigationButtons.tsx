import { useSurvey } from '../contexts/SurveyContext';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Question } from '../types/survey'; // Import Question type
import clsx from 'clsx';

export default function NavigationButtons({ currentQuestion }: { currentQuestion: Question | null }) { // Add currentQuestion prop
  const { state, nextQuestion, previousQuestion, completeSurvey, getResponse } = useSurvey(); // Add getResponse
  const navigate = useNavigate();

  const isFirstQuestion = state.currentQuestionIndex === 0;
  const isLastQuestion = state.currentQuestionIndex === state.totalQuestions - 1;

  // Check if the current question is answered if it's required
  const isCurrentQuestionAnswered = () => {
    if (!currentQuestion || !currentQuestion.required) {
      return true; // Not required or no current question, so allow proceeding
    }
    const response = getResponse(currentQuestion.id);
    if (!response || response.answer === '' || (Array.isArray(response.answer) && response.answer.length === 0)) {
      return false; // Required but not answered
    }
    return true;
  };

  const handleNext = () => {
    if (!isCurrentQuestionAnswered()) {
      // Optionally, show a message to the user
      alert('Please answer the current question to proceed.');
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
        disabled={!isCurrentQuestionAnswered()} // Disable button if not answered
        className={clsx(
          'inline-flex items-center px-8 py-3 bg-gradient-to-r from-tfe-primary to-tfe-accent text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200',
          !isCurrentQuestionAnswered() && 'opacity-50 cursor-not-allowed' // Style for disabled state
        )}
        whileHover={{ scale: isCurrentQuestionAnswered() ? 1.05 : 1 }} // Only apply hover effect if enabled
        whileTap={{ scale: isCurrentQuestionAnswered() ? 0.95 : 1 }} // Only apply tap effect if enabled
      >
        {isLastQuestion ? 'Complete Survey' : 'Next'}
        {!isLastQuestion && <ChevronRight className="w-5 h-5 ml-1" />}
      </motion.button>
    </div>
  );
}
