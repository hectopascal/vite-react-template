import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useTraining } from '../../context/TrainingContext';
import * as performanceService from '../../services/performanceService';
import DrillCard from './DrillCard';

function SessionDetail() {
  const { sessionId } = useParams();
  const navigate = useNavigate();
  const { 
    currentSession, 
    currentProgram,
    loading, 
    error, 
    getSessionDetails, 
    getProgramDetails,
    completeSession 
  } = useTraining();
  
  const [currentDrillIndex, setCurrentDrillIndex] = useState(0);
  const [isCompleting, setIsCompleting] = useState(false);
  const [feedback, setFeedback] = useState({
    rating: 4,
    difficulty: 'just right',
    notes: '',
    drills: []
  });
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  
  useEffect(() => {
    if (sessionId) {
      getSessionDetails(sessionId)
        .then(session => {
          if (session && session.programId) {
            getProgramDetails(session.programId);
          }
        })
        .catch(err => console.error("Error fetching session data:", err));
    }
  }, [sessionId, getSessionDetails, getProgramDetails]);
  
  useEffect(() => {
    if (currentSession && currentSession.drills) {
      // Initialize feedback for all drills
      setFeedback(prev => ({
        ...prev,
        drills: currentSession.drills.map(drill => ({
          drillId: drill.drillId,
          skill: drill.targetSkill,
          completed: false,
          rating: 4,
          notes: ''
        }))
      }));
    }
  }, [currentSession]);
  
  const handleDrillCompletion = (drillId, drillData) => {
    setFeedback(prev => ({
      ...prev,
      drills: prev.drills.map(d => 
        d.drillId === drillId 
          ? { ...d, ...drillData, completed: true } 
          : d
      )
    }));
    
    // Move to next drill if not the last one
    if (currentSession && currentDrillIndex < currentSession.drills.length - 1) {
      setCurrentDrillIndex(currentDrillIndex + 1);
    }
  };
  
  const handlePrevDrill = () => {
    if (currentDrillIndex > 0) {
      setCurrentDrillIndex(currentDrillIndex - 1);
    }
  };
  
  const handleNextDrill = () => {
    if (currentSession && currentDrillIndex < currentSession.drills.length - 1) {
      setCurrentDrillIndex(currentDrillIndex + 1);
    }
  };
  
  const handleRatingChange = (value) => {
    setFeedback(prev => ({
      ...prev,
      rating: value
    }));
  };
  
  const handleDifficultyChange = (value) => {
    setFeedback(prev => ({
      ...prev,
      difficulty: value
    }));
  };
  
  const handleNotesChange = (e) => {
    setFeedback(prev => ({
      ...prev,
      notes: e.target.value
    }));
  };
  
  const handleCompleteSession = async () => {
    try {
      setIsCompleting(true);
      
      // Submit session completion
      await completeSession(sessionId, feedback);
      
      // Update performance based on training
      await performanceService.updatePerformanceFromTraining(
        '1', // Replace with actual user ID in a real app
        sessionId,
        feedback
      );
      
      // Close modal and navigate back to program
      setShowFeedbackModal(false);
      
      if (currentProgram) {
        navigate(`/training/${currentProgram.programId}`);
      } else {
        navigate('/training');
      }
    } catch (err) {
      console.error('Error completing session:', err);
    } finally {
      setIsCompleting(false);
    }
  };
  
  const formatDate = (dateString) => {
    const options = { weekday: 'long', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative mb-6">
          {error}
        </div>
        <Link to="/training" className="text-green-600 hover:text-green-700">
          Back to Training Programs
        </Link>
      </div>
    );
  }
  
  if (!currentSession) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white shadow-md rounded-lg p-8 text-center">
          <div className="text-gray-500 mb-4">Session not found</div>
          <Link 
            to="/training" 
            className="inline-block px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
          >
            View All Programs
          </Link>
        </div>
      </div>
    );
  }
  
  const currentDrill = currentSession.drills && currentSession.drills[currentDrillIndex];
  const isSessionCompleted = currentSession.completionStatus === 'completed';
  const allDrillsCompleted = feedback.drills && feedback.drills.every(d => d.completed);
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        {currentProgram && (
          <Link to={`/training/${currentProgram.programId}`} className="text-green-600 hover:text-green-700 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            Back to Program
          </Link>
        )}
      </div>
      
      <div className="bg-white shadow-md rounded-lg p-6 mb-8">
        <div className="flex flex-wrap justify-between items-start">
          <div className="mb-4 md:mb-0">
            <h1 className="text-3xl font-bold mb-2">{currentSession.name}</h1>
            <p className="text-gray-600 mb-2">{currentSession.description}</p>
            <div className="flex items-center text-sm text-gray-500">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              {formatDate(currentSession.scheduledDate)} • {currentSession.duration} minutes
            </div>
          </div>
          
          <div className={`px-4 py-2 rounded-md text-sm font-medium ${
            isSessionCompleted
              ? 'bg-green-100 text-green-800'
              : 'bg-blue-100 text-blue-800'
          }`}>
            {isSessionCompleted ? 'Completed' : 'Scheduled'}
          </div>
        </div>
        
        {currentSession.drills && currentSession.drills.length > 0 && (
          <div className="mt-6">
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-xl font-semibold">Drills Progress</h2>
              <span className="text-sm text-gray-500">
                {feedback.drills.filter(d => d.completed).length} of {currentSession.drills.length} completed
              </span>
            </div>
            <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-green-500 rounded-full transition-all duration-300"
                style={{ width: `${(feedback.drills.filter(d => d.completed).length / currentSession.drills.length) * 100}%` }}
              ></div>
            </div>
          </div>
        )}
      </div>
      
      {currentDrill && (
        <>
          <div className="mb-4 flex justify-between items-center">
            <h2 className="text-2xl font-bold">Current Drill</h2>
            <div className="text-sm text-gray-500">
              {currentDrillIndex + 1} of {currentSession.drills.length}
            </div>
          </div>
          
          <DrillCard 
            drill={currentDrill}
            onComplete={handleDrillCompletion}
            isCompleted={feedback.drills[currentDrillIndex]?.completed}
            isSessionCompleted={isSessionCompleted}
          />
          
          <div className="flex justify-between mt-6">
            <button
              onClick={handlePrevDrill}
              disabled={currentDrillIndex === 0}
              className={`px-4 py-2 border rounded-md ${
                currentDrillIndex === 0
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              Previous Drill
            </button>
            
            <div>
              {!isSessionCompleted && allDrillsCompleted && (
                <button
                  onClick={() => setShowFeedbackModal(true)}
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition"
                >
                  Complete Session
                </button>
              )}
              
              {!allDrillsCompleted && (
                <button
                  onClick={handleNextDrill}
                  disabled={currentDrillIndex === currentSession.drills.length - 1}
                  className={`px-4 py-2 rounded-md ${
                    currentDrillIndex === currentSession.drills.length - 1
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-green-600 text-white hover:bg-green-700'
                  }`}
                >
                  Next Drill
                </button>
              )}
            </div>
          </div>
        </>
      )}
      
      {/* All Drills Section */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-6">All Session Drills</h2>
        
        <div className="space-y-6">
          {currentSession.drills && currentSession.drills.map((drill, index) => (
            <div 
              key={drill.drillId} 
              className={`border rounded-lg p-4 cursor-pointer transition ${
                index === currentDrillIndex
                  ? 'border-green-500 bg-green-50'
                  : 'border-gray-200 hover:border-green-300 hover:bg-green-50'
              }`}
              onClick={() => setCurrentDrillIndex(index)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className={`h-8 w-8 rounded-full flex items-center justify-center text-sm font-medium mr-3 ${
                    feedback.drills[index]?.completed
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-200 text-gray-600'
                  }`}>
                    {feedback.drills[index]?.completed ? (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    ) : (
                      index + 1
                    )}
                  </div>
                  <div>
                    <h3 className="font-medium">{drill.name}</h3>
                    <p className="text-sm text-gray-500">{drill.targetSkill} • {drill.duration} min</p>
                  </div>
                </div>
                
                {feedback.drills[index]?.completed && (
                  <span className="text-green-600 text-sm font-medium">Completed</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Complete Session Modal */}
      {showFeedbackModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h2 className="text-xl font-semibold mb-4">Complete Training Session</h2>
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                How would you rate this session?
              </label>
              <div className="flex space-x-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => handleRatingChange(star)}
                    className={`h-10 w-10 ${
                      feedback.rating >= star ? 'text-yellow-400' : 'text-gray-300'
                    }`}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  </button>
                ))}
              </div>
            </div>
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                How was the difficulty level?
              </label>
              <div className="flex space-x-3">
                <label className={`flex items-center px-3 py-2 border rounded cursor-pointer ${
                  feedback.difficulty === 'too easy' ? 'border-green-500 bg-green-50' : 'border-gray-200'
                }`}>
                  <input
                    type="radio"
                    name="difficulty"
                    checked={feedback.difficulty === 'too easy'}
                    onChange={() => handleDifficultyChange('too easy')}
                    className="sr-only"
                  />
                  <span>Too Easy</span>
                </label>
                <label className={`flex items-center px-3 py-2 border rounded cursor-pointer ${
                  feedback.difficulty === 'just right' ? 'border-green-500 bg-green-50' : 'border-gray-200'
                }`}>
                  <input
                    type="radio"
                    name="difficulty"
                    checked={feedback.difficulty === 'just right'}
                    onChange={() => handleDifficultyChange('just right')}
                    className="sr-only"
                  />
                  <span>Just Right</span>
                </label>
                <label className={`flex items-center px-3 py-2 border rounded cursor-pointer ${
                  feedback.difficulty === 'too hard' ? 'border-green-500 bg-green-50' : 'border-gray-200'
                }`}>
                  <input
                    type="radio"
                    name="difficulty"
                    checked={feedback.difficulty === 'too hard'}
                    onChange={() => handleDifficultyChange('too hard')}
                    className="sr-only"
                  />
                  <span>Too Hard</span>
                </label>
              </div>
            </div>
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Additional Notes (optional)
              </label>
              <textarea
                value={feedback.notes}
                onChange={handleNotesChange}
                rows={3}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Share your thoughts about this training session..."
              ></textarea>
            </div>
            
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowFeedbackModal(false)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleCompleteSession}
                disabled={isCompleting}
                className={`px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition ${
                  isCompleting ? 'opacity-70 cursor-not-allowed' : ''
                }`}
              >
                {isCompleting ? 'Completing...' : 'Complete Session'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default SessionDetail;