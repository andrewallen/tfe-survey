import { useState, useEffect } from 'react';
import { useSurvey } from '../contexts/SurveyContext';
import { useNavigate } from 'react-router-dom';
import { commonShellQuestions } from '../data/surveyQuestions';
import { Question } from '../types/survey';
import QuestionRenderer from '../components/QuestionRenderer';
import NavigationButtons from '../components/NavigationButtons';

export default function Survey() {
  const { state, startSurvey, getResponse, nextQuestion: contextNextQuestion } = useSurvey(); // Add getResponse and rename nextQuestion
  const navigate = useNavigate();
  const [allQuestions, setAllQuestions] = useState<Question[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);

  useEffect(() => {
    let questions = commonShellQuestions.groups.flatMap(group => group.questions);
    
    if (state.user?.memberType) {
      const memberType = state.user.memberType;
      if (memberType === 'previous') {
        questions = questions.filter(q => q.id !== 'membership-length');
      }
    }
    
    setAllQuestions(questions);
    
    if (!state.user) {
      startSurvey('current', questions.length);
    }
  }, [state.user?.memberType, startSurvey]);

  useEffect(() => {
    if (allQuestions.length > 0) {
      let questionIndex = state.currentQuestionIndex;
      let questionToShow: Question | null = allQuestions[questionIndex];

      // Loop to find the next valid question to show
      while (questionToShow && !shouldShowQuestion(questionToShow, getResponse)) {
        // If the current question shouldn't be shown, try to advance the index in context
        // This relies on QuestionRenderer also having logic to auto-advance if it gets a question it shouldn't show.
        // A more robust solution might involve a dedicated function in SurveyContext to find the next valid question index.
        if (questionIndex < allQuestions.length - 1) {
          questionIndex++;
          questionToShow = allQuestions[questionIndex];
        } else {
          questionToShow = null; // No more questions to show
          break;
        }
      }
      
      // Update the current question in the local state
      setCurrentQuestion(questionToShow);

      if (!questionToShow && state.currentQuestionIndex < allQuestions.length) {
        // If no question to show and we are not at the end of all potential questions, navigate to thank you
        navigate('/thank-you');
      } else if (!questionToShow && state.currentQuestionIndex >= allQuestions.length -1) {
        // If no question to show and we are at or past the end, navigate to thank you
        navigate('/thank-you');
      }
    }
  }, [state.currentQuestionIndex, allQuestions, navigate, getResponse, contextNextQuestion]);

  // Helper function to determine if a question should be shown
  const shouldShowQuestion = (question: Question, getResponseFunc: (id: string) => any) => {
    if (question.id === 'gender-self-describe') {
      const genderResponse = getResponseFunc('gender');
      return genderResponse?.answer === 'Self‑describe';
    }
    if (question.id === 'barriers-other') {
      const barriersResponse = getResponseFunc('barriers');
      return Array.isArray(barriersResponse?.answer) && barriersResponse.answer.includes('Other');
    }
    if (question.id === 'email-address') {
      const prizeDrawResponse = getResponseFunc('prize-draw-consent');
      return prizeDrawResponse?.answer === 'Yes, enter me in the prize draw';
    }
    return true;
  };

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
      <NavigationButtons currentQuestion={currentQuestion} /> 
    </div>
  );
}
