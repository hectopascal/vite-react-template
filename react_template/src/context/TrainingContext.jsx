import { createContext, useState, useContext, useEffect } from 'react';
import * as trainingService from '../services/trainingService';
import { useAuth } from './AuthContext';

const TrainingContext = createContext();

export const useTraining = () => {
  return useContext(TrainingContext);
};

export const TrainingProvider = ({ children }) => {
  const [programs, setPrograms] = useState([]);
  const [currentProgram, setCurrentProgram] = useState(null);
  const [currentSession, setCurrentSession] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { currentUser } = useAuth();

  useEffect(() => {
    if (currentUser) {
      fetchUserPrograms();
    }
  }, [currentUser]);

  const fetchUserPrograms = async () => {
    if (!currentUser) return;
    
    try {
      setLoading(true);
      setError(null);
      const fetchedPrograms = await trainingService.getUserPrograms(currentUser.userId);
      setPrograms(fetchedPrograms);
    } catch (err) {
      setError('Failed to fetch training programs');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const createProgram = async (goals) => {
    if (!currentUser) return;
    
    try {
      setLoading(true);
      setError(null);
      const newProgram = await trainingService.createProgram(currentUser.userId, goals);
      setPrograms((prevPrograms) => [...prevPrograms, newProgram]);
      return newProgram;
    } catch (err) {
      setError('Failed to create training program');
      console.error(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getProgramDetails = async (programId) => {
    try {
      setLoading(true);
      setError(null);
      const program = await trainingService.getProgramById(programId);
      setCurrentProgram(program);
      return program;
    } catch (err) {
      setError('Failed to fetch program details');
      console.error(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getSessionDetails = async (sessionId) => {
    try {
      setLoading(true);
      setError(null);
      const session = await trainingService.getSessionById(sessionId);
      setCurrentSession(session);
      return session;
    } catch (err) {
      setError('Failed to fetch session details');
      console.error(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const completeSession = async (sessionId, feedback) => {
    try {
      setLoading(true);
      setError(null);
      const updatedSession = await trainingService.completeSession(sessionId, feedback);
      
      // Update the current session
      if (currentSession && currentSession.sessionId === sessionId) {
        setCurrentSession(updatedSession);
      }
      
      // Update the current program sessions
      if (currentProgram) {
        setCurrentProgram({
          ...currentProgram,
          sessions: currentProgram.sessions.map(session => 
            session.sessionId === sessionId ? updatedSession : session
          )
        });
      }
      
      return updatedSession;
    } catch (err) {
      setError('Failed to complete session');
      console.error(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const generateNextSession = async (programId) => {
    try {
      setLoading(true);
      setError(null);
      const newSession = await trainingService.generateNextSession(programId);
      
      // Update current program if it's the one we're adding to
      if (currentProgram && currentProgram.programId === programId) {
        setCurrentProgram({
          ...currentProgram,
          sessions: [...currentProgram.sessions, newSession]
        });
      }
      
      return newSession;
    } catch (err) {
      setError('Failed to generate next session');
      console.error(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const value = {
    programs,
    currentProgram,
    currentSession,
    loading,
    error,
    fetchUserPrograms,
    createProgram,
    getProgramDetails,
    getSessionDetails,
    completeSession,
    generateNextSession,
    setCurrentProgram,
    setCurrentSession,
  };

  return (
    <TrainingContext.Provider value={value}>
      {children}
    </TrainingContext.Provider>
  );
};