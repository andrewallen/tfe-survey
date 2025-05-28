import { createContext, useContext, useReducer, ReactNode } from 'react';
import { User, SurveyResponse, Question } from '../types/survey';

interface SurveyState {
  user: User | null;
  currentQuestionIndex: number;
  totalQuestions: number;
  isLoading: boolean;
  error: string | null;
  showConfetti: boolean;
}

type SurveyAction =
  | { type: 'START_SURVEY'; payload: { user: User; totalQuestions: number } }
  | { type: 'ANSWER_QUESTION'; payload: SurveyResponse }
  | { type: 'NEXT_QUESTION' }
  | { type: 'PREVIOUS_QUESTION' }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'COMPLETE_SURVEY' };

const initialState: SurveyState = {
  user: null,
  currentQuestionIndex: 0,
  totalQuestions: 0,
  isLoading: false,
  error: null,
  showConfetti: false,
};

function surveyReducer(state: SurveyState, action: SurveyAction): SurveyState {
  switch (action.type) {
    case 'START_SURVEY':
      return {
        ...state,
        user: action.payload.user,
        totalQuestions: action.payload.totalQuestions,
        currentQuestionIndex: 0,
        isLoading: false,
        error: null,
      };
    case 'ANSWER_QUESTION':
      if (!state.user) return state;
      const updatedResponses = [
        ...state.user.responses.filter(r => r.questionId !== action.payload.questionId),
        action.payload,
      ];
      return {
        ...state,
        user: {
          ...state.user,
          responses: updatedResponses,
        },
      };
    case 'NEXT_QUESTION':
      return {
        ...state,
        currentQuestionIndex: Math.min(state.currentQuestionIndex + 1, state.totalQuestions - 1),
      };
    case 'PREVIOUS_QUESTION':
      return {
        ...state,
        currentQuestionIndex: Math.max(state.currentQuestionIndex - 1, 0),
      };
    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload,
      };
    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload,
      };
    case 'COMPLETE_SURVEY':
      if (!state.user) return state;
      return {
        ...state,
        user: {
          ...state.user,
          completedAt: new Date(),
        },
      };
    default:
      return state;
  }
}

interface SurveyContextType {
  state: SurveyState;
  startSurvey: (memberType: 'current' | 'new' | 'previous', totalQuestions: number) => void;
  answerQuestion: (questionId: string, answer: string | string[] | number) => void;
  nextQuestion: () => void;
  previousQuestion: () => void;
  completeSurvey: () => void;
  getResponse: (questionId: string) => SurveyResponse | undefined;
  getProgress: () => number;
  shouldShowQuestion: (question: Question) => boolean;
}

const SurveyContext = createContext<SurveyContextType | undefined>(undefined);

export function SurveyProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(surveyReducer, initialState);

  const startSurvey = (memberType: 'current' | 'new' | 'previous', totalQuestions: number) => {
    const user: User = {
      id: crypto.randomUUID(),
      memberType,
      responses: [],
      consentGiven: false,
      startedAt: new Date(),
    };
    dispatch({ type: 'START_SURVEY', payload: { user, totalQuestions } });
  };

  const answerQuestion = (questionId: string, answer: string | string[] | number) => {
    const response: SurveyResponse = {
      questionId,
      answer,
      timestamp: new Date(),
    };
    dispatch({ type: 'ANSWER_QUESTION', payload: response });
  };

  const nextQuestion = () => {
    dispatch({ type: 'NEXT_QUESTION' });
  };

  const previousQuestion = () => {
    dispatch({ type: 'PREVIOUS_QUESTION' });
  };

  const completeSurvey = () => {
    dispatch({ type: 'COMPLETE_SURVEY' });
  };

  const getResponse = (questionId: string) => {
    return state.user?.responses.find(r => r.questionId === questionId);
  };

  const getProgress = () => {
    if (state.totalQuestions === 0) return 0;

    // If we have responses, calculate progress based on answered questions and current position
    if (state.user && state.user.responses.length > 0) {
      // We should only consider the current question index as a representation of progress
      // This accounts for conditional questions being skipped
      const currentProgress = ((state.currentQuestionIndex + 1) / state.totalQuestions) * 100;
      
      // Cap at 100% to prevent exceeding 100%
      return Math.min(currentProgress, 100);
    }

    // Default to index-based calculation with +1 to account for the current question
    return ((state.currentQuestionIndex + 1) / state.totalQuestions) * 100;
  };

  // Helper function to determine if a question should be shown based on previous answers
  const shouldShowQuestion = (question: Question) => {
    // Show gender self-describe only if "Self‑describe" was selected for gender
    if (question.id === 'gender-self-describe') {
      const genderResponse = getResponse('gender');
      return genderResponse?.answer === 'Self‑describe';
    }
    
    // Show barriers "Other" text field only if "Other" was selected
    if (question.id === 'barriers-other') {
      const barriersResponse = getResponse('barriers');
      return Array.isArray(barriersResponse?.answer) && 
             barriersResponse.answer.includes('Other');
    }
    
    // Show email field only if prize draw consent is "Yes"
    if (question.id === 'email-address') {
      const prizeDrawResponse = getResponse('prize-draw-consent');
      return prizeDrawResponse?.answer === 'Yes, enter me in the prize draw';
    }
    
    // All other questions should be shown by default
    return true;
  };

  return (
    <SurveyContext.Provider
      value={{
        state,
        startSurvey,
        answerQuestion,
        nextQuestion,
        previousQuestion,
        completeSurvey,
        getResponse,
        getProgress,
        shouldShowQuestion,
      }}
    >
      {children}
    </SurveyContext.Provider>
  );
}

export function useSurvey() {
  const context = useContext(SurveyContext);
  if (context === undefined) {
    throw new Error('useSurvey must be used within a SurveyProvider');
  }
  return context;
}
