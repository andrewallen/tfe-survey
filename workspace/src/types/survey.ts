export interface SurveyResponse {
  questionId: string;
  answer: string | string[] | number;
  timestamp: Date;
}

export interface User {
  id: string;
  memberType: 'current' | 'new' | 'previous';
  responses: SurveyResponse[];
  consentGiven: boolean;
  startedAt: Date;
  completedAt?: Date;
}

export interface Question {
  id: string;
  type: 'single-choice' | 'multiple-choice' | 'rating' | 'text' | 'number' | 'consent';
  title: string;
  subtitle?: string;
  options?: string[];
  required: boolean;
  ratingScale?: {
    min: number;
    max: number;
    labels?: { [key: number]: string };
  };
  maxSelections?: number;
  validation?: {
    minLength?: number;
    maxLength?: number;
    pattern?: string;
  };
}

export interface QuestionGroup {
  id: string;
  title: string;
  description?: string;
  questions: Question[];
}

export interface SurveySection {
  id: string;
  title: string;
  groups: QuestionGroup[];
  memberTypes: ('current' | 'new' | 'previous')[];
}
