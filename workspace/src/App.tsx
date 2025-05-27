import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { SurveyProvider } from './contexts/SurveyContext';
import Layout from './components/Layout';
import Welcome from './pages/Welcome';
import Survey from './pages/Survey';
import ThankYou from './pages/ThankYou';

function App() {
  return (
    <SurveyProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Welcome />} />
            <Route path="/survey" element={<Survey />} />
            <Route path="/thank-you" element={<ThankYou />} />
          </Routes>
        </Layout>
      </Router>
    </SurveyProvider>
  );
}

export default App;
