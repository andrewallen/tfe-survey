import { motion } from 'framer-motion';
import { CheckCircle, Award, Calendar } from 'lucide-react';

export default function ThankYou() {
  return (
    <div className="max-w-2xl mx-auto text-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="mb-8"
      >
        <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6" style={{ background: 'var(--tfe-gradient-primary)' }}>
          <CheckCircle className="w-10 h-10 text-white" />
        </div>
        <h1 className="text-4xl font-bold text-tfe-gray-800 mb-4">
          Thank You!
        </h1>
        <p className="text-xl text-tfe-gray-600">
          Your feedback has been submitted successfully
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="question-card mb-8"
      >
        <div className="grid md:grid-cols-2 gap-6">
          <div className="text-center">
            <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3" style={{ backgroundColor: 'var(--tfe-primary-light)' }}>
              <Award className="w-8 h-8" style={{ color: 'var(--tfe-primary)' }} />
            </div>
            <h3 className="font-semibold text-tfe-gray-800 mb-2">Prize Draw</h3>
            <p className="text-sm text-tfe-gray-600">
              If you opted in, you'll be contacted if you win TFE merchandise
            </p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3" style={{ backgroundColor: 'var(--tfe-accent-light)' }}>
              <Calendar className="w-8 h-8" style={{ color: 'var(--tfe-accent)' }} />
            </div>
            <h3 className="font-semibold text-tfe-gray-800 mb-2">Results</h3>
            <p className="text-sm text-tfe-gray-600">
              Aggregated results will be shared with the community in July
            </p>
          </div>
        </div>

        <div className="mt-8 p-6 rounded-xl" style={{ backgroundColor: 'var(--tfe-gray-50)' }}>
          <h3 className="font-semibold text-tfe-gray-800 mb-3">What happens next?</h3>
          <ul className="space-y-2 text-tfe-gray-700 text-left">
            <li className="flex items-start">
              <span className="w-2 h-2 rounded-full mt-2 mr-3 flex-shrink-0" style={{ backgroundColor: 'var(--tfe-primary)' }}></span>
              Leadership will analyze all responses to identify key insights
            </li>
            <li className="flex items-start">
              <span className="w-2 h-2 rounded-full mt-2 mr-3 flex-shrink-0" style={{ backgroundColor: 'var(--tfe-primary)' }}></span>
              Concrete improvements will be made based on your feedback
            </li>
            <li className="flex items-start">
              <span className="w-2 h-2 rounded-full mt-2 mr-3 flex-shrink-0" style={{ backgroundColor: 'var(--tfe-primary)' }}></span>
              A summary report will be shared with all members
            </li>
          </ul>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="text-center"
      >
        <p className="text-tfe-gray-500">
          Thank you for helping us make TFE an even better place to train!
        </p>
      </motion.div>
    </div>
  );
}
