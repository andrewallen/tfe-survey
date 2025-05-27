import { useSurvey } from '../contexts/SurveyContext';
import { motion } from 'framer-motion';

export default function ProgressBar() {
  const { getProgress, state } = useSurvey();
  const progress = getProgress();

  if (!state.user) return null;

  return (
    <div className="mt-4">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm text-tfe-gray-600">Progress</span>
        <span className="text-sm font-medium text-tfe-gray-800">
          {Math.round(progress)}%
        </span>
      </div>
      <div className="progress-bar">
        <motion.div
          className="progress-fill"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        />
      </div>
    </div>
  );
}
