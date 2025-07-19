import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTraining } from '../../context/TrainingContext';
import DrillCard from './DrillCard';

function TrainingProgram() {
  const { programId } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { 
    programs, 
    currentProgram, 
    loading, 
    error, 
    fetchUserPrograms, 
    createProgram, 
    getProgramDetails,
    generateNextSession
  } = useTraining();
  
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createLoading, setCreateLoading] = useState(false);
  const [newProgramGoals, setNewProgramGoals] = useState([
    { skill: 'forehand', level: 'intermediate' }
  ]);
  const [creationError, setCreationError] = useState('');
  
  useEffect(() => {
    fetchUserPrograms();
  }, [fetchUserPrograms]);
  
  useEffect(() => {
    if (programId) {
      getProgramDetails(programId);
    }
  }, [programId, getProgramDetails]);
  
  const handleAddGoal = () => {
    if (newProgramGoals.length < 3) {
      setNewProgramGoals([...newProgramGoals, { skill: 'backhand', level: 'intermediate' }]);
    }
  };
  
  const handleRemoveGoal = (index) => {
    if (newProgramGoals.length > 1) {
      const updatedGoals = [...newProgramGoals];
      updatedGoals.splice(index, 1);
      setNewProgramGoals(updatedGoals);
    }
  };
  
  const handleGoalChange = (index, field, value) => {
    const updatedGoals = [...newProgramGoals];
    updatedGoals[index] = { ...updatedGoals[index], [field]: value };
    setNewProgramGoals(updatedGoals);
  };
  
  const handleCreateProgram = async () => {
    try {
      setCreateLoading(true);
      setCreationError('');
      
      const newProgram = await createProgram(newProgramGoals);
      setShowCreateModal(false);
      navigate(`/training/${newProgram.programId}`);
    } catch (err) {
      setCreationError('Failed to create training program. Please try again.');
      console.error(err);
    } finally {
      setCreateLoading(false);
    }
  };
  
  const handleGenerateNextSession = async () => {
    if (!currentProgram) return;
    
    try {
      await generateNextSession(currentProgram.programId);
    } catch (err) {
      console.error('Failed to generate next session:', err);
    }
  };
  
  const formatDate = (dateString) => {
    const options = { weekday: 'short', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  // Render programs list view
  if (!programId) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Training Programs</h1>
          <button 
            onClick={() => setShowCreateModal(true)}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition"
          >
            Create New Program
          </button>
        </div>
        
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative mb-6">
            {error}
          </div>
        ) : programs && programs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {programs.map(program => (
              <Link 
                key={program.programId} 
                to={`/training/${program.programId}`}
                className="block bg-white shadow-md rounded-lg overflow-hidden hover:shadow-lg transition"
              >
                <div className="p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <h2 className="text-xl font-semibold mb-2">
                        {program.targetSkills.join(', ')} Training
                      </h2>
                      <p className="text-gray-500 mb-4">
                        {program.duration} day program • {program.difficulty} level
                      </p>
                      
                      <div className="flex items-center text-sm text-gray-500 mb-4">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        Started {new Date(program.creationDate).toLocaleDateString()}
                      </div>
                    </div>
                    
                    <div className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                      {program.sessions.filter(s => s.completionStatus === 'completed').length} / {program.sessions.length} completed
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-green-500 rounded-full"
                        style={{ width: `${(program.sessions.filter(s => s.completionStatus === 'completed').length / program.sessions.length) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div className="mt-6 flex justify-between items-center">
                    <div className="flex -space-x-2">
                      {program.targetSkills.slice(0, 3).map((skill, i) => (
                        <div 
                          key={i} 
                          className="h-8 w-8 rounded-full bg-green-600 flex items-center justify-center text-white text-xs border-2 border-white"
                          title={skill}
                        >
                          {skill.charAt(0).toUpperCase()}
                        </div>
                      ))}
                    </div>
                    <span className="text-sm font-medium text-green-600">View Program</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="bg-white shadow-md rounded-lg p-8 text-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <h2 className="text-xl font-semibold mb-2">No training programs yet</h2>
            <p className="text-gray-500 mb-6">Create your first personalized training program to improve your tennis skills</p>
            <button 
              onClick={() => setShowCreateModal(true)}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition"
            >
              Create Your First Program
            </button>
          </div>
        )}
        
        {/* Create Program Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-md w-full p-6">
              <h2 className="text-xl font-semibold mb-4">Create Training Program</h2>
              
              {creationError && (
                <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded text-sm">
                  {creationError}
                </div>
              )}
              
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  What skills do you want to improve?
                </label>
                
                <div className="space-y-4">
                  {newProgramGoals.map((goal, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <div className="flex-grow">
                        <select
                          value={goal.skill}
                          onChange={(e) => handleGoalChange(index, 'skill', e.target.value)}
                          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                        >
                          <option value="forehand">Forehand</option>
                          <option value="backhand">Backhand</option>
                          <option value="serve">Serve</option>
                          <option value="volley">Volley</option>
                          <option value="footwork">Footwork</option>
                        </select>
                      </div>
                      <div className="flex-grow">
                        <select
                          value={goal.level}
                          onChange={(e) => handleGoalChange(index, 'level', e.target.value)}
                          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                        >
                          <option value="beginner">Beginner</option>
                          <option value="intermediate">Intermediate</option>
                          <option value="advanced">Advanced</option>
                        </select>
                      </div>
                      {newProgramGoals.length > 1 && (
                        <button
                          onClick={() => handleRemoveGoal(index)}
                          type="button"
                          className="text-red-500 hover:text-red-700"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 000 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                          </svg>
                        </button>
                      )}
                    </div>
                  ))}
                </div>
                
                {newProgramGoals.length < 3 && (
                  <button
                    onClick={handleAddGoal}
                    type="button"
                    className="mt-3 inline-flex items-center text-sm text-green-600 hover:text-green-700"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
                    </svg>
                    Add another skill (max 3)
                  </button>
                )}
              </div>
              
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateProgram}
                  disabled={createLoading}
                  className={`px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition ${
                    createLoading ? 'opacity-70 cursor-not-allowed' : ''
                  }`}
                >
                  {createLoading ? 'Creating...' : 'Create Program'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
  
  // Render program detail view
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link to="/training" className="text-green-600 hover:text-green-700 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
          Back to Programs
        </Link>
      </div>
      
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative mb-6">
          {error}
        </div>
      ) : currentProgram ? (
        <div>
          <div className="bg-white shadow-md rounded-lg p-6 mb-8">
            <div className="flex flex-wrap justify-between items-start">
              <div className="mb-4 md:mb-0">
                <h1 className="text-3xl font-bold mb-2">
                  {currentProgram.targetSkills.join(', ')} Training
                </h1>
                <p className="text-gray-500">
                  {currentProgram.difficulty.charAt(0).toUpperCase() + currentProgram.difficulty.slice(1)} level • 
                  {currentProgram.duration} day program • 
                  Started {new Date(currentProgram.creationDate).toLocaleDateString()}
                </p>
              </div>
              
              <div className="bg-green-50 rounded-lg p-3">
                <div className="text-sm text-gray-500 mb-1">Program Progress</div>
                <div className="text-3xl font-bold text-green-600">
                  {Math.round((currentProgram.sessions.filter(s => s.completionStatus === 'completed').length / currentProgram.sessions.length) * 100)}%
                </div>
              </div>
            </div>
            
            <div className="mt-6">
              <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-green-500 rounded-full"
                  style={{ width: `${(currentProgram.sessions.filter(s => s.completionStatus === 'completed').length / currentProgram.sessions.length) * 100}%` }}
                ></div>
              </div>
            </div>
            
            <div className="mt-6">
              <h3 className="font-medium mb-2">Focus Areas</h3>
              <div className="flex flex-wrap gap-2">
                {currentProgram.targetSkills.map((skill, i) => (
                  <span 
                    key={i} 
                    className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full"
                  >
                    {skill.charAt(0).toUpperCase() + skill.slice(1)}
                  </span>
                ))}
              </div>
            </div>
          </div>
          
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4">Training Sessions</h2>
            
            <div className="space-y-4">
              {currentProgram.sessions.sort((a, b) => new Date(a.scheduledDate) - new Date(b.scheduledDate)).map(session => (
                <Link 
                  key={session.sessionId} 
                  to={`/training/session/${session.sessionId}`}
                  className="block bg-white shadow-md rounded-lg p-6 hover:shadow-lg transition"
                >
                  <div className="flex flex-wrap justify-between">
                    <div className="mb-2 sm:mb-0">
                      <h3 className="text-xl font-medium">{session.name}</h3>
                      <p className="text-gray-600 mt-1">{session.description}</p>
                      
                      <div className="flex items-center text-sm text-gray-500 mt-3">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {session.duration} minutes • {session.drills.length} drills
                      </div>
                    </div>
                    
                    <div className="flex flex-col items-end">
                      <div className={`px-3 py-1 rounded-full text-sm font-medium mb-2 ${
                        session.completionStatus === 'completed' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        {session.completionStatus === 'completed' ? 'Completed' : 'Scheduled'}
                      </div>
                      <div className="text-sm text-gray-500">{formatDate(session.scheduledDate)}</div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
            
            <div className="mt-6">
              <button
                onClick={handleGenerateNextSession}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition"
              >
                Generate Next Session
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white shadow-md rounded-lg p-8 text-center">
          <div className="text-gray-500 mb-4">Program not found</div>
          <Link 
            to="/training" 
            className="inline-block px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
          >
            View All Programs
          </Link>
        </div>
      )}
    </div>
  );
}

export default TrainingProgram;