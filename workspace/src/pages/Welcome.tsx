import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Play, Shield, Clock, Award } from 'lucide-react';
import { useTfeTheme } from '../hooks/useTfeTheme';

export default function Welcome() {
  const navigate = useNavigate();
  const theme = useTfeTheme();

  const handleStartSurvey = () => {
    navigate('/survey');
  };
  
  const goToDemo = () => {
    navigate('/gym-theme-demo');
  };

  return (
    <div className="max-w-2xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-8"
      >
        <div className="w-20 h-20 bg-gradient-to-r from-tfe-primary to-tfe-accent rounded-full flex items-center justify-center mx-auto mb-6">
          <Award className="w-10 h-10 text-white" />
        </div>
        <h1 className="text-4xl font-bold text-tfe-gray-800 mb-4">
          Welcome to the TFE Member Survey
        </h1>
        <p className="text-xl text-tfe-gray-600">
          Help us make TFE even better for you and future members
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="question-card mb-8"
      >
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="text-center">
            <div className="w-16 h-16 rounded-full mx-auto mb-3" style={{ ...theme.utils.iconContainerStyle('primary') }}>
              <Clock className="w-8 h-8" />
            </div>
            <h3 className="font-semibold text-tfe-gray-800 mb-2">5-7 Minutes</h3>
            <p className="text-sm text-tfe-gray-600">Quick and easy to complete</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 rounded-full mx-auto mb-3" style={{ ...theme.utils.iconContainerStyle('accent') }}>
              <Shield className="w-8 h-8" />
            </div>
            <h3 className="font-semibold text-tfe-gray-800 mb-2">Anonymous</h3>
            <p className="text-sm text-tfe-gray-600">GDPR compliant & secure</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 rounded-full mx-auto mb-3" style={{ ...theme.utils.iconContainerStyle('secondary') }}>
              <Award className="w-8 h-8" />
            </div>
            <h3 className="font-semibold text-tfe-gray-800 mb-2">Prize Draw</h3>
            <p className="text-sm text-tfe-gray-600">Win TFE merchandise</p>
          </div>
        </div>

        <div className="rounded-xl p-6 mb-6" style={{ backgroundColor: 'var(--tfe-gray-50)' }}>
          <h3 className="font-semibold text-tfe-gray-800 mb-3">Why this matters:</h3>
          <ul className="space-y-2 text-tfe-gray-700">
            <li className="flex items-start">
              <span style={{ ...theme.utils.bulletPointStyle }}></span>
              Leadership will use your answers to make concrete decisions
            </li>
            <li className="flex items-start">
              <span className="w-2 h-2 rounded-full mt-2 mr-3 flex-shrink-0" style={{ backgroundColor: 'var(--tfe-primary)' }}></span>
              Help improve class timetables, facilities, and pricing
            </li>
            <li className="flex items-start">
              <span className="w-2 h-2 rounded-full mt-2 mr-3 flex-shrink-0" style={{ backgroundColor: 'var(--tfe-primary)' }}></span>
              Results will be shared with the community in July
            </li>
          </ul>
        </div>

        <div className="text-center space-y-4">
          <motion.button
            onClick={handleStartSurvey}
            className="inline-flex items-center px-8 py-4 transition-all duration-200 transform hover:scale-105"
            style={{ ...theme.utils.buttonStyle }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Play className="w-5 h-5 mr-2" />
            Start Survey
          </motion.button>
          
          <div className="flex justify-center pt-2">
            <motion.button
              onClick={goToDemo}
              className="text-tfe-gray-600 hover:text-tfe-primary text-sm underline flex items-center"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              View Component Demos
            </motion.button>
          </div>
          
          <p className="text-sm text-tfe-gray-500 mt-4">
            No right or wrong answers—please be completely candid
          </p>
        </div>
      </motion.div>
    </div>
  );
}
