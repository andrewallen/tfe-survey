import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import ProgressBar from './ProgressBar';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-tfe-gray-50 to-tfe-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-tfe-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div 
                className="w-10 h-10 rounded-lg flex items-center justify-center" 
                style={{ background: 'var(--tfe-gradient-primary)' }}
              >
                <span className="text-white font-bold text-sm">TFE</span>
              </div>
              <h1 className="text-xl font-semibold text-tfe-gray-800">Member Survey</h1>
            </div>
          </div>
          <ProgressBar />
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {children}
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="mt-16 py-8 text-center text-sm">
        <p className="text-tfe-gray-500">© 2025 The Fitness Experts. All responses are anonymous and GDPR compliant.</p>
        <div className="mt-4 flex justify-center space-x-4">
          <a href="https://www.thefitnessexperts.co.uk" target="_blank" rel="noopener noreferrer" className="text-tfe-primary hover:text-tfe-primary-dark transition-colors">
            Website
          </a>
          <a href="https://www.instagram.com/the_fitness_experts" target="_blank" rel="noopener noreferrer" className="text-tfe-primary hover:text-tfe-primary-dark transition-colors">
            Instagram
          </a>
        </div>
      </footer>
    </div>
  );
}
