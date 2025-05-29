export interface SurveyResponse {
  questionId: string;
  answer: string | string[] | number | Record<string, string>;
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
  type: 'single-choice' | 'multiple-choice' | 'rating' | 'text' | 'number' | 'consent' | 'matrix';
  title: string;
  subtitle?: string;
  options?: string[];
  required: boolean;
  memberTypes?: ('intro' | 'current' | 'new' | 'previous')[];
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
  matrixOptions?: {
    rows: string[];
    columns: string[];
  };
}

export interface QuestionGroup {
  id: string;
  title: string;
  description?: string;
  memberTypes?: ('intro' | 'current' | 'new' | 'previous')[];
  questions: Question[];
}

export interface SurveySection {
  id: string;
  title: string;
  groups: QuestionGroup[];
  memberTypes: ('intro' | 'current' | 'new' | 'previous')[];
}
