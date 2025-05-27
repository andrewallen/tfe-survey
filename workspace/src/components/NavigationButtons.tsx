import { useSurvey } from '../contexts/SurveyContext';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function NavigationButtons() {
  const { state, nextQuestion, previousQuestion, completeSurvey } = useSurvey();
  const navigate = useNavigate();

  const isFirstQuestion = state.currentQuestionIndex === 0;
  const isLastQuestion = state.currentQuestionIndex === state.totalQuestions - 1;

  const handleNext = () => {
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
        className="inline-flex items-center px-8 py-3 bg-gradient-to-r from-tfe-primary to-tfe-accent text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {isLastQuestion ? 'Complete Survey' : 'Next'}
        {!isLastQuestion && <ChevronRight className="w-5 h-5 ml-1" />}
      </motion.button>
    </div>
  );
}
