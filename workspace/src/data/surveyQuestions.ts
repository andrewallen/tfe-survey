import { Question, QuestionGroup, SurveySection } from '../types/survey';

export const commonShellQuestions: SurveySection = {
  id: 'common-shell',
  title: 'TFE Member Survey',
  memberTypes: ['current', 'new', 'previous'],
  groups: [
    {
      id: 'consent',
      title: 'Welcome + GDPR Consent',
      questions: [
        {
          id: 'gdpr-consent',
          type: 'consent',
          title: 'Thank you for being part of the TFE community.',
          subtitle: 'Your feedback helps us fine-tune our class timetable, facilities, pricing, and member services so they work better for you and future members.\n\nThis survey takes about 5-7 minutes and contains both required and optional questions.\n\nWhy this matters: Leadership will use your answers to make concrete decisions, and we\'ll publish the aggregated results to the community in July so you can see the impact.\n\nAll responses are anonymous and handled under GDPR. There are no right or wrong answers—please be completely candid.',
          required: true,
          options: ['I consent to my data being processed'],
        },
      ],
    },
    {
      id: 'member-type',
      title: 'Member Type Screener',
      questions: [
        {
          id: 'member-type',
          type: 'single-choice',
          title: 'Which best describes your current relationship with TFE?',
          subtitle: 'Choose one',
          required: true,
          options: [
            'Current member (joined 3+ months ago)',
            'New member (joined within the last 3 months)',
            'Previous member (paused or cancelled membership)',
          ],
        },
      ],
    },
    {
      id: 'basic-profile',
      title: 'Basic Profile',
      questions: [
        {
          id: 'age-group',
          type: 'single-choice',
          title: 'What is your age group?',
          subtitle: 'Choose one',
          required: true,
          options: ['16–24', '25–34', '35–44', '45–54', '55–64', '65+'],
        },
        {
          id: 'gender',
          type: 'single-choice',
          title: 'What is your gender?',
          subtitle: 'Choose one',
          required: true,
          options: [
            'Man',
            'Woman',
            'Non‑binary',
            'Prefer not to say',
            'Self‑describe',
          ],
        },
        {
          id: 'gender-self-describe',
          type: 'text',
          title: 'Please specify your gender',
          required: false,
          validation: {
            maxLength: 100,
          },
        },
        {
          id: 'membership-length',
          type: 'single-choice',
          title: 'How long have you been a TFE member?',
          subtitle: 'Current and new members only',
          required: true,
          options: [
            'Less than 1 month',
            '1–3 months',
            '4–11 months',
            '1–2 years',
            '3–5 years',
            '6–7 years',
            '8+ years (Founding Member)',
          ],
        },
      ],
    },
    {
      id: 'core-pulse',
      title: 'Core Pulse Questions',
      questions: [
        {
          id: 'nps-score',
          type: 'rating',
          title: 'How likely are you to recommend TFE to friends or family?',
          required: true,
          ratingScale: {
            min: 0,
            max: 10,
            labels: {
              0: 'Not at all likely',
              10: 'Extremely likely',
            },
          },
        },
        {
          id: 'sessions-attended',
          type: 'number',
          title: 'How many TFE sessions have you attended in the last 4 weeks?',
          subtitle: 'Enter number',
          required: true,
          validation: {
            minLength: 0,
          },
        },
        {
          id: 'barriers',
          type: 'multiple-choice',
          title: 'What are the main things that sometimes keep or kept you from getting to TFE?',
          subtitle: 'Select up to three',
          required: true,
          maxSelections: 3,
          options: [
            'Child-care responsibilities',
            'Classes often fully booked',
            'Confidence about ability or fitness level',
            'Cost',
            'Health issues or injury',
            'Parking availability',
            'Transport / travel time',
            'Weather / daylight hours',
            'Work hours / shift patterns',
            'Other commitments took priority',
            'None of the above',
            'Other',
          ],
        },
        {
          id: 'barriers-other',
          type: 'text',
          title: 'Please specify other barriers',
          required: false,
          validation: {
            maxLength: 200,
          },
        },
        {
          id: 'biggest-barrier',
          type: 'text',
          title: 'If you selected more than one barrier above, which is your single biggest barrier?',
          subtitle: 'If nothing specific comes to mind, feel free to leave blank.',
          required: false,
          validation: {
            maxLength: 200,
          },
        },
        {
          id: 'pricing-fairness',
          type: 'rating',
          title: 'How fair do you feel TFE\'s current pricing is for what you receive?',
          required: true,
          ratingScale: {
            min: 1,
            max: 5,
            labels: {
              1: 'Very Unfair',
              3: 'Neutral',
              5: 'Very Fair',
            },
          },
        },
        {
          id: 'sense-of-belonging',
          type: 'rating',
          title: 'I feel a strong sense of belonging at TFE.',
          required: true,
          ratingScale: {
            min: 1,
            max: 5,
            labels: {
              1: 'Strongly disagree',
              3: 'Neutral',
              5: 'Strongly agree',
            },
          },
        },
      ],
    },
    {
      id: 'open-comments',
      title: 'Open Comments',
      questions: [
        {
          id: 'additional-feedback',
          type: 'text',
          title: 'Is there anything else you\'d like to share about your TFE experience?',
          subtitle: 'Optional - feel free to leave blank if nothing comes to mind',
          required: false,
          validation: {
            maxLength: 1000,
          },
        },
      ],
    },
    {
      id: 'follow-up',
      title: 'Follow-up & Prize Draw',
      questions: [
        {
          id: 'prize-draw-consent',
          type: 'single-choice',
          title: 'Would you like to be entered into a prize draw for TFE merchandise?',
          subtitle: 'If yes, please provide your email address below. This will only be used for the prize draw and optional follow-up questions.',
          required: true,
          options: [
            'Yes, enter me in the prize draw',
            'No thanks',
          ],
        },
        {
          id: 'email-address',
          type: 'text',
          title: 'Email address',
          required: false,
          validation: {
            pattern: '^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$',
          },
        },
      ],
    },
  ],
};
