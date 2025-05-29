import React, { useState } from 'react';
import WeightStackRating from '../components/GymTheme/WeightStackRating';
import Layout from '../components/Layout';

const WeightStackDemo: React.FC = () => {
  const [rating, setRating] = useState(3);
  
  const ratingLabels = {
    1: 'Poor',
    2: 'Fair',
    3: 'Good',
    4: 'Great',
    5: 'Excellent'
  };

  return (
    <Layout>
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-8 text-center">Weight Stack Rating Demo</h1>
        
        <div className="max-w-3xl mx-auto bg-white p-6 rounded-lg shadow-lg">
          <WeightStackRating 
            min={1} 
            max={5} 
            value={rating} 
            onChange={setRating} 
            labels={ratingLabels}
          />
        </div>
        
        <div className="mt-8 text-center text-tfe-gray-700">
          <p>You selected: <span className="font-bold">{rating} - {ratingLabels[rating as keyof typeof ratingLabels]}</span></p>
        </div>
      </div>
    </Layout>
  );
};

export default WeightStackDemo;
