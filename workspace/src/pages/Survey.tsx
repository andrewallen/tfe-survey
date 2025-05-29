import { useState, useEffect } from 'react';
import { useSurvey } from '../contexts/SurveyContext';
import { useNavigate } from 'react-router-dom';
import { Question, SurveySection } from '../types/survey';
import QuestionRenderer from '../components/QuestionRenderer';
import NavigationButtons from '../components/NavigationButtons';

export default function Survey() {
  const { 
    state, 
    startSurvey,
    getResponse,
    setTotalQuestions,
    nextQuestion: contextNextQuestion,
    previousQuestion: contextPreviousQuestion,
    shouldShowQuestion
  } = useSurvey();
  const navigate = useNavigate();
  const [allQuestions, setAllQuestions] = useState<Question[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [questionSection, setQuestionSection] = useState<SurveySection | null>(null);

  useEffect(() => {
    fetch('/surveyQuestions.json')
      .then(res => res.json())
      .then((data: SurveySection) => setQuestionSection(data))
      .catch(err => console.error('Failed to load survey questions', err));
  }, []);

  useEffect(() => {
    if (!questionSection) return;

    // Filter groups by memberType first, then flatten questions
    const filteredGroups = questionSection.groups.filter(group => {
      // If group has memberTypes restriction, check if current memberType is included
      if (group.memberTypes && group.memberTypes.length > 0) {
        return state.memberType && group.memberTypes.includes(state.memberType);
      }
      return true; // Show group if no memberType restriction
    });

    let questions = filteredGroups.flatMap(group => group.questions);

    // Additional individual question filtering
    if (state.memberType) {
      const memberType = state.memberType;
      if (memberType === 'previous') {
        questions = questions.filter(q => q.id !== 'membership-length');
      }
    }

    setAllQuestions(questions);

    // Calculate total questions excluding intro questions (GDPR consent and member-type screener)
    const nonIntroQuestions = questions.filter(q => 
      !q.memberTypes || !q.memberTypes.includes('intro')
    );

    if (!state.user) {
      startSurvey(nonIntroQuestions.length);
    } else if (state.memberType && state.memberType !== 'intro') {
      setTotalQuestions(nonIntroQuestions.length);
    }
  }, [questionSection, state.memberType, startSurvey, setTotalQuestions]);

  // Custom function to find the next valid question to show
  const findNextValidQuestion = (startIndex: number) => {
    let index = startIndex;
    let question = allQuestions[index];
    
    // Loop until a valid question is found or we run out of questions
    while (question && !shouldShowQuestion(question)) {
      if (index < allQuestions.length - 1) {
        index++;
        question = allQuestions[index];
      } else {
        return null; // No more valid questions
      }
    }
    
    return { index, question };
  };

  useEffect(() => {
    if (allQuestions.length > 0) {
      let questionIndex = state.currentQuestionIndex;
      let questionToShow: Question | null = allQuestions[questionIndex];
      let needsToUpdateIndex = false;
      
      // First check if the current question should be shown
      if (questionToShow && !shouldShowQuestion(questionToShow)) {
        // Find the next valid question
        const nextValid = findNextValidQuestion(questionIndex);
        
        if (nextValid) {
          questionIndex = nextValid.index;
          questionToShow = nextValid.question;
          needsToUpdateIndex = true;
        } else {
          questionToShow = null; // No more questions to show
        }
      }
      // If the index has changed, we need to update the context's state
      if (needsToUpdateIndex) {
        // Calculate the difference between where we are and where we should be
        const diff = questionIndex - state.currentQuestionIndex;
        
        if (diff !== 0) {
          // Use setTimeout to avoid infinite rendering loops
          setTimeout(() => {
            // Update the context's question index to match our calculated index
            if (diff > 0) {
              // If we need to move forward
              for (let i = 0; i < diff; i++) {
                contextNextQuestion();
              }
            } else {
              // If we need to move backward
              for (let i = 0; i < Math.abs(diff); i++) {
                contextPreviousQuestion();
              }
            }
          }, 0);
          return; // Return early to avoid setting currentQuestion before context is updated
        }
      }
      
      // Update the current question in the local state
      setCurrentQuestion(questionToShow);

      if (!questionToShow) {
        // If there's no valid question to show, navigate to thank you
        navigate('/thank-you');
      }
    }
  }, [state.currentQuestionIndex, allQuestions, navigate, getResponse, contextNextQuestion, contextPreviousQuestion]);

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

  // Check if current question is an intro question
  const isIntroQuestion = currentQuestion?.memberTypes?.includes('intro') || false;
  
  // Calculate progress for non-intro questions only
  const calculateNonIntroProgress = () => {
    if (isIntroQuestion || state.totalQuestions === 0) return 0;
    
    // Count how many non-intro questions we've passed (including current)
    const nonIntroQuestionsPassed = allQuestions
      .slice(0, state.currentQuestionIndex + 1)
      .filter(q => !q.memberTypes || !q.memberTypes.includes('intro'))
      .length;
    
    return Math.round((nonIntroQuestionsPassed / state.totalQuestions) * 100);
  };

  return (
    <div className="max-w-2xl mx-auto">
      {/* Only show progress counter for non-intro questions */}
      {!isIntroQuestion && (
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm text-tfe-gray-500">
              Question {allQuestions.slice(0, state.currentQuestionIndex + 1)
                .filter(q => !q.memberTypes || !q.memberTypes.includes('intro'))
                .length} of {state.totalQuestions}
            </span>
            <span className="text-sm font-medium text-tfe-primary">
              {calculateNonIntroProgress()}% Complete
            </span>
          </div>
        </div>
      )}

      <QuestionRenderer question={currentQuestion} />
      <NavigationButtons currentQuestion={currentQuestion} /> 
    </div>
  );
}
