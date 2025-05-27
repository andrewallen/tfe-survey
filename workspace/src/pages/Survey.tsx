import { useState, useEffect } from 'react';
import { useSurvey } from '../contexts/SurveyContext';
import { useNavigate } from 'react-router-dom';
import { commonShellQuestions } from '../data/surveyQuestions';
import { Question } from '../types/survey';
import QuestionRenderer from '../components/QuestionRenderer';
import NavigationButtons from '../components/NavigationButtons';

export default function Survey() {
  const { state, startSurvey } = useSurvey();
  const navigate = useNavigate();
  const [allQuestions, setAllQuestions] = useState<Question[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);

  useEffect(() => {
    // Flatten all questions from all groups
    let questions = commonShellQuestions.groups.flatMap(group => group.questions);
    
    // Filter questions based on member type if known
    if (state.user?.memberType) {
      const memberType = state.user.memberType;
      
      // Remove membership length question for previous members
      if (memberType === 'previous') {
        questions = questions.filter(q => q.id !== 'membership-length');
      }
    }
    
    setAllQuestions(questions);
    
    if (!state.user) {
      // Start survey with default member type - will be updated when user answers the screener
      startSurvey('current', questions.length);
    }
  }, [state.user?.memberType]);

  useEffect(() => {
    if (allQuestions.length > 0 && state.currentQuestionIndex < allQuestions.length) {
      setCurrentQuestion(allQuestions[state.currentQuestionIndex]);
    } else if (state.currentQuestionIndex >= allQuestions.length) {
      // Survey completed
      navigate('/thank-you');
    }
  }, [state.currentQuestionIndex, allQuestions, navigate]);

  if (!state.user || !currentQuestion) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-tfe-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-tfe-gray-600">Loading survey...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm text-tfe-gray-500">
            Question {state.currentQuestionIndex + 1} of {state.totalQuestions}
          </span>
          <span className="text-sm font-medium text-tfe-primary">
            {Math.round((state.currentQuestionIndex / state.totalQuestions) * 100)}% Complete
          </span>
        </div>
      </div>

      <QuestionRenderer question={currentQuestion} />
      <NavigationButtons />
    </div>
  );
}
