import React, { useState } from 'react';

function DrillCard({ drill, onComplete, isCompleted, isSessionCompleted }) {
  const [showVideo, setShowVideo] = useState(false);
  const [userNotes, setUserNotes] = useState('');
  const [difficulty, setDifficulty] = useState('just right');
  const [rating, setRating] = useState(4);
  
  const handleComplete = () => {
    onComplete(drill.drillId, {
      rating,
      difficulty,
      notes: userNotes,
      skill: drill.targetSkill
    });
  };
  
  const getInstructionList = () => {
    if (!drill || !drill.instructions) return [];
    return drill.instructions;
  };
  
  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden">
      <div className="p-6">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-xl font-semibold mb-1">{drill.name}</h3>
            <div className="flex items-center mb-4">
              <span className="bg-green-100 text-green-800 text-xs font-semibold px-2.5 py-0.5 rounded capitalize">
                {drill.targetSkill}
              </span>
              <span className="mx-2 text-gray-400">•</span>
              <span className="text-sm text-gray-500">
                {drill.duration} minutes
              </span>
              <span className="mx-2 text-gray-400">•</span>
              <span className="text-sm text-gray-500 capitalize">
                {drill.difficulty} difficulty
              </span>
            </div>
          </div>
          
          {isCompleted && (
            <div className="bg-green-100 text-green-800 text-sm font-medium px-3 py-1 rounded-full">
              Completed
            </div>
          )}
        </div>
        
        <p className="text-gray-600 mb-6">{drill.description}</p>
        
        <div className="mb-6">
          <h4 className="font-medium mb-3">Instructions</h4>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            {getInstructionList().map((instruction, i) => (
              <li key={i}>{instruction}</li>
            ))}
          </ul>
        </div>
        
        {drill.videoUrl && (
          <div>
            <button
              onClick={() => setShowVideo(!showVideo)}
              className="flex items-center text-green-600 hover:text-green-700 font-medium"
            >
              {showVideo ? 'Hide Demo Video' : 'Show Demo Video'}
              <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 ml-1 transition-transform ${showVideo ? 'transform rotate-180' : ''}`} viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
            
            {showVideo && (
              <div className="mt-4 rounded-lg overflow-hidden bg-black">
                <video 
                  src={drill.videoUrl} 
                  controls
                  className="w-full h-auto"
                  poster={drill.thumbnailUrl}
                >
                  Your browser does not support the video tag.
                </video>
              </div>
            )}
          </div>
        )}
      </div>
      
      {!isCompleted && !isSessionCompleted && (
        <div className="border-t border-gray-200 p-6 bg-gray-50">
          <h4 className="font-medium mb-4">Complete Drill</h4>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Difficulty Level
            </label>
            <div className="flex space-x-3">
              <label className={`flex items-center px-3 py-2 border rounded text-sm cursor-pointer ${
                difficulty === 'too easy' ? 'border-green-500 bg-green-50' : 'border-gray-200'
              }`}>
                <input
                  type="radio"
                  name="difficulty"
                  checked={difficulty === 'too easy'}
                  onChange={() => setDifficulty('too easy')}
                  className="sr-only"
                />
                <span>Too Easy</span>
              </label>
              <label className={`flex items-center px-3 py-2 border rounded text-sm cursor-pointer ${
                difficulty === 'just right' ? 'border-green-500 bg-green-50' : 'border-gray-200'
              }`}>
                <input
                  type="radio"
                  name="difficulty"
                  checked={difficulty === 'just right'}
                  onChange={() => setDifficulty('just right')}
                  className="sr-only"
                />
                <span>Just Right</span>
              </label>
              <label className={`flex items-center px-3 py-2 border rounded text-sm cursor-pointer ${
                difficulty === 'too hard' ? 'border-green-500 bg-green-50' : 'border-gray-200'
              }`}>
                <input
                  type="radio"
                  name="difficulty"
                  checked={difficulty === 'too hard'}
                  onChange={() => setDifficulty('too hard')}
                  className="sr-only"
                />
                <span>Too Hard</span>
              </label>
            </div>
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Rate This Drill
            </label>
            <div className="flex space-x-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className={`h-8 w-8 ${
                    rating >= star ? 'text-yellow-400' : 'text-gray-300'
                  }`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                </button>
              ))}
            </div>
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Notes (optional)
            </label>
            <textarea
              value={userNotes}
              onChange={(e) => setUserNotes(e.target.value)}
              rows={2}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Any thoughts on this drill?"
            ></textarea>
          </div>
          
          <button
            onClick={handleComplete}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition"
          >
            Complete Drill
          </button>
        </div>
      )}
    </div>
  );
}

export default DrillCard;