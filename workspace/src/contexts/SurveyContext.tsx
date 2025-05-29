import { createContext, useContext, useReducer, ReactNode } from 'react';
import { User, SurveyResponse, Question } from '../types/survey';

interface SurveyState {
  user: User | null;
  memberType: 'intro' | 'current' | 'new' | 'previous' | null;
  responses: SurveyResponse[];
  currentQuestionIndex: number;
  totalQuestions: number;
  answeredQuestionsCount: number;
  isLoading: boolean;
  error: string | null;
  showConfetti: boolean;
}

type SurveyAction =
  | { type: 'START_SURVEY'; payload: { user: User; totalQuestions: number } }
  | { type: 'ANSWER_QUESTION'; payload: SurveyResponse }
  | { type: 'SET_MEMBER_TYPE'; payload: 'intro' | 'current' | 'new' | 'previous' }
  | { type: 'SET_TOTAL_QUESTIONS'; payload: number }
  | { type: 'UPDATE_ANSWERED_COUNT'; payload: number }
  | { type: 'NEXT_QUESTION' }
  | { type: 'PREVIOUS_QUESTION' }
  | { type: 'RESET_INDEX'; payload?: number }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'COMPLETE_SURVEY' };

const initialState: SurveyState = {
  user: null,
  memberType: null,
  responses: [],
  currentQuestionIndex: 0,
  totalQuestions: 0,
  answeredQuestionsCount: 0,
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
        answeredQuestionsCount: 0,
        isLoading: false,
        error: null,
      };
    case 'ANSWER_QUESTION':
      const updatedResponses = [
        ...state.responses.filter(r => r.questionId !== action.payload.questionId),
        action.payload,
      ];
      return {
        ...state,
        responses: updatedResponses,
      };
    case 'SET_MEMBER_TYPE':
      return {
        ...state,
        memberType: action.payload,
        user: state.user ? { ...state.user, memberType: action.payload } : state.user,
      };
    case 'SET_TOTAL_QUESTIONS':
      return {
        ...state,
        totalQuestions: action.payload,
      };
    case 'UPDATE_ANSWERED_COUNT':
      return {
        ...state,
        answeredQuestionsCount: action.payload,
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
    case 'RESET_INDEX':
      return {
        ...state,
        currentQuestionIndex: action.payload ?? 0,
        answeredQuestionsCount: 0,
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
  startSurvey: (totalQuestions: number) => void;
  answerQuestion: (questionId: string, answer: string | string[] | number | Record<string, string>) => void;
  setTotalQuestions: (total: number) => void;
  updateAnsweredCount: (count: number) => void;
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

  const startSurvey = (totalQuestions: number) => {
    const user: User = {
      id: crypto.randomUUID(),
      memberType: 'current', // This will be updated later when the member-type question is answered
      responses: [],
      consentGiven: false,
      startedAt: new Date(),
    };
    // Start with 'intro' type to show intro questions first
    dispatch({ type: 'SET_MEMBER_TYPE', payload: 'intro' });
    dispatch({ type: 'START_SURVEY', payload: { user, totalQuestions } });
  };

  const setTotalQuestions = (total: number) => {
    dispatch({ type: 'SET_TOTAL_QUESTIONS', payload: total });
  };

  const updateAnsweredCount = (count: number) => {
    dispatch({ type: 'UPDATE_ANSWERED_COUNT', payload: count });
  };

  const answerQuestion = (questionId: string, answer: string | string[] | number | Record<string, string>) => {
    const response: SurveyResponse = {
      questionId,
      answer,
      timestamp: new Date(),
    };
    dispatch({ type: 'ANSWER_QUESTION', payload: response });

    // Update member type in state when the screener question is answered
    if (questionId === 'member-type' && typeof answer === 'string') {
      let memberType: 'current' | 'new' | 'previous' | null = null;
      if (answer.startsWith('Current')) memberType = 'current';
      else if (answer.startsWith('New')) memberType = 'new';
      else if (answer.startsWith('Previous')) memberType = 'previous';

      if (memberType) {
        dispatch({ type: 'SET_MEMBER_TYPE', payload: memberType });
        dispatch({ type: 'RESET_INDEX' });
      }
    }
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
    return state.responses.find(r => r.questionId === questionId);
  };

  const getProgress = () => {
    // Don't show progress for intro questions
    if (state.memberType === 'intro' || state.totalQuestions === 0) {
      return 0;
    }

    // Use the answered questions count if available, otherwise fall back to current index
    if (state.answeredQuestionsCount > 0) {
      return Math.min((state.answeredQuestionsCount / state.totalQuestions) * 100, 100);
    }

    // Fallback to index-based calculation
    return Math.min(((state.currentQuestionIndex + 1) / state.totalQuestions) * 100, 100);
  };

  // Helper function to determine if a question should be shown based on previous answers
  const shouldShowQuestion = (question: Question) => {
    // Check if question has memberType restrictions
    if (question.memberTypes && question.memberTypes.length > 0) {
      if (!state.memberType || !question.memberTypes.includes(state.memberType)) {
        return false;
      }
    }

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

    // Show new member friction points "Other" text field only if "Other" was selected
    if (question.id === 'new-member-friction-other') {
      const frictionResponse = getResponse('new-member-friction');
      return Array.isArray(frictionResponse?.answer) && 
             frictionResponse.answer.includes('Other');
    }

    // Show new member motivation barriers "Other" text field only if "Other" was selected
    if (question.id === 'new-member-motivation-barriers-other') {
      const barriersResponse = getResponse('new-member-motivation-barriers');
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
        setTotalQuestions,
        updateAnsweredCount,
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
