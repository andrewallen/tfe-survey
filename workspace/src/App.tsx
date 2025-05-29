import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { SurveyProvider } from './contexts/SurveyContext';
import Welcome from './pages/Welcome';
import Survey from './pages/Survey';
import ThankYou from './pages/ThankYou';
import GymThemeDemo from './pages/GymThemeDemo';
import WeightStackDemo from './pages/WeightStackDemo';

function App() {
  return (
    <SurveyProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Welcome />} />
          <Route path="/survey" element={<Survey />} />
          <Route path="/thank-you" element={<ThankYou />} />
          <Route path="/gym-theme-demo" element={<GymThemeDemo />} />
          <Route path="/weight-stack-demo" element={<WeightStackDemo />} />
        </Routes>
      </Router>
    </SurveyProvider>
  );
}

export default App;
