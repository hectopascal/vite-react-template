import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';

// Create the training context
const TrainingContext = createContext(null);

// Custom hook to use the training context
export const useTraining = () => {
  const context = useContext(TrainingContext);
  if (context === null) {
    throw new Error('useTraining must be used within a TrainingProvider');
  }
  return context;
};

// Training provider component
export const TrainingProvider = ({ children }) => {
  const { currentUser } = useAuth();
  const [programs, setPrograms] = useState([]);
  const [userProgress, setUserProgress] = useState({});
  const [currentProgram, setCurrentProgram] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Load training data from localStorage when user changes
  useEffect(() => {
    if (currentUser?.id) {
      loadTrainingData(currentUser.id);
    }
  }, [currentUser]);

  // Load training programs and user progress
  const loadTrainingData = useCallback((userId) => {
    try {
      setLoading(true);
      
      // Load programs
      const storedPrograms = localStorage.getItem('training_programs');
      if (storedPrograms) {
        setPrograms(JSON.parse(storedPrograms));
      } else {
        // Initialize with default training programs
        const defaultPrograms = getDefaultTrainingPrograms();
        setPrograms(defaultPrograms);
        localStorage.setItem('training_programs', JSON.stringify(defaultPrograms));
      }
      
      // Load user progress
      const storedProgress = localStorage.getItem(`progress_${userId}`);
      if (storedProgress) {
        setUserProgress(JSON.parse(storedProgress));
      } else {
        // Initialize with empty progress object
        setUserProgress({});
        localStorage.setItem(`progress_${userId}`, JSON.stringify({}));
      }
    } catch (err) {
      console.error('Error loading training data:', err);
      setError('Failed to load training data');
    } finally {
      setLoading(false);
    }
  }, []);

  // Get a specific program by ID
  const getProgram = useCallback((programId) => {
    return programs.find(program => program.id === programId) || null;
  }, [programs]);

  // Enroll user in a training program
  const enrollInProgram = useCallback((programId) => {
    try {
      if (!currentUser?.id) throw new Error('User not authenticated');
      
      const program = programs.find(p => p.id === programId);
      if (!program) throw new Error('Program not found');
      
      // Create progress entry for this program
      const newProgress = {
        ...userProgress,
        [programId]: {
          enrolled: new Date().toISOString(),
          lastActivity: new Date().toISOString(),
          completedSessions: [],
          currentSessionId: program.sessions[0]?.id || null,
          sessionsProgress: {},
          overallProgress: 0
        }
      };
      
      setUserProgress(newProgress);
      localStorage.setItem(`progress_${currentUser.id}`, JSON.stringify(newProgress));
      
      return true;
    } catch (err) {
      console.error('Enrollment error:', err);
      setError(err.message || 'Failed to enroll in program');
      throw err;
    }
  }, [currentUser, programs, userProgress]);

  // Complete a training session
  const completeSession = useCallback((programId, sessionId, performance = {}) => {
    try {
      if (!currentUser?.id) throw new Error('User not authenticated');
      
      const program = programs.find(p => p.id === programId);
      if (!program) throw new Error('Program not found');
      
      // Get current progress
      const programProgress = userProgress[programId] || {
        enrolled: new Date().toISOString(),
        lastActivity: new Date().toISOString(),
        completedSessions: [],
        currentSessionId: program.sessions[0]?.id,
        sessionsProgress: {},
        overallProgress: 0
      };
      
      // Add to completed sessions if not already complete
      if (!programProgress.completedSessions.includes(sessionId)) {
        programProgress.completedSessions.push(sessionId);
      }
      
      // Update session progress
      programProgress.sessionsProgress[sessionId] = {
        completed: new Date().toISOString(),
        performance: performance
      };
      
      // Update last activity
      programProgress.lastActivity = new Date().toISOString();
      
      // Calculate overall progress
      programProgress.overallProgress = Math.round(
        (programProgress.completedSessions.length / program.sessions.length) * 100
      );
      
      // Determine next session
      const currentSessionIndex = program.sessions.findIndex(s => s.id === sessionId);
      if (currentSessionIndex < program.sessions.length - 1) {
        programProgress.currentSessionId = program.sessions[currentSessionIndex + 1].id;
      } else {
        // Program completed
        programProgress.currentSessionId = null;
      }
      
      // Update progress
      const newProgress = {
        ...userProgress,
        [programId]: programProgress
      };
      
      setUserProgress(newProgress);
      localStorage.setItem(`progress_${currentUser.id}`, JSON.stringify(newProgress));
      
      // Update performance tracking
      updatePerformanceTracking(programId, sessionId, performance);
      
      return true;
    } catch (err) {
      console.error('Session completion error:', err);
      setError(err.message || 'Failed to complete session');
      throw err;
    }
  }, [currentUser, programs, userProgress]);

  // Get user progress for a specific program
  const getProgramProgress = useCallback((programId) => {
    if (!programId || !userProgress[programId]) return null;
    return userProgress[programId];
  }, [userProgress]);

  // Check if user is enrolled in a program
  const isEnrolled = useCallback((programId) => {
    return Boolean(userProgress[programId]);
  }, [userProgress]);

  // Get recommended programs based on user level and progress
  const getRecommendedPrograms = useCallback(() => {
    try {
      if (!currentUser) return [];
      
      const userLevel = currentUser.level || 'Beginner';
      
      // Filter programs for user's level or one level above
      let levelPrograms = programs.filter(program => {
        if (userLevel === 'Beginner') {
          return ['Beginner', 'Intermediate'].includes(program.level);
        } else if (userLevel === 'Intermediate') {
          return ['Intermediate', 'Advanced'].includes(program.level);
        } else {
          return program.level === 'Advanced';
        }
      });
      
      // Filter out completed programs
      levelPrograms = levelPrograms.filter(program => {
        const progress = userProgress[program.id];
        return !progress || progress.overallProgress < 100;
      });
      
      // Sort by relevance (enrolled but incomplete first, then by match to user level)
      levelPrograms.sort((a, b) => {
        const aEnrolled = Boolean(userProgress[a.id]);
        const bEnrolled = Boolean(userProgress[b.id]);
        
        if (aEnrolled && !bEnrolled) return -1;
        if (!aEnrolled && bEnrolled) return 1;
        
        if (a.level === userLevel && b.level !== userLevel) return -1;
        if (a.level !== userLevel && b.level === userLevel) return 1;
        
        return 0;
      });
      
      return levelPrograms.slice(0, 3); // Return top 3 recommendations
    } catch (err) {
      console.error('Error getting recommendations:', err);
      return [];
    }
  }, [currentUser, programs, userProgress]);

  // Update performance tracking when completing a session
  const updatePerformanceTracking = useCallback((programId, sessionId, performance) => {
    try {
      if (!currentUser?.id) return;
      
      // In a real app, this would call a performance tracking service
      // For our demo, we'll update a simple counter in localStorage
      
      const program = programs.find(p => p.id === programId);
      if (!program) return;
      
      const session = program.sessions.find(s => s.id === sessionId);
      if (!session) return;
      
      // Update sessions completed count
      const performanceData = localStorage.getItem('performanceData');
      if (performanceData) {
        const parsedData = JSON.parse(performanceData);
        
        // Update sessions completed
        parsedData.sessionsCompleted = (parsedData.sessionsCompleted || 0) + 1;
        parsedData.sessionsThisMonth = (parsedData.sessionsThisMonth || 0) + 1;
        
        // Add activity entry
        if (parsedData.recentActivity) {
          parsedData.recentActivity.unshift({
            type: 'training',
            description: `Completed ${session.title} session`,
            date: new Date().toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })
          });
          
          // Keep only most recent activities
          if (parsedData.recentActivity.length > 10) {
            parsedData.recentActivity = parsedData.recentActivity.slice(0, 10);
          }
        }
        
        // Update skills if performance data is provided
        if (performance && performance.skills) {
          parsedData.skills = {
            ...parsedData.skills,
            ...performance.skills
          };
          
          // Add performance record
          if (parsedData.history) {
            parsedData.history.push({
              date: new Date().toISOString().split('T')[0],
              overall: performance.overall || parsedData.overall,
              skills: performance.skills
            });
            
            // Sort history by date
            parsedData.history.sort((a, b) => new Date(a.date) - new Date(b.date));
          }
        }
        
        // Save updated data
        localStorage.setItem('performanceData', JSON.stringify(parsedData));
      }
    } catch (err) {
      console.error('Error updating performance tracking:', err);
    }
  }, [currentUser, programs]);

  // Helper function to generate default training programs
  const getDefaultTrainingPrograms = () => {
    return [
      {
        id: 'tp_001',
        title: 'Beginner Fundamentals',
        description: 'Master the basic tennis strokes and movements to build a solid foundation',
        level: 'Beginner',
        duration: '4 weeks',
        focus: ['Forehand', 'Backhand', 'Serve', 'Footwork'],
        thumbnail: '/assets/images/beginner-program.jpg',
        sessions: [
          {
            id: 'ts_001',
            title: 'Grip and Stance Fundamentals',
            description: 'Learn the proper grips and stance for different tennis strokes',
            duration: 45,
            focusArea: 'Technique',
            drills: [
              {
                id: 'td_001',
                title: 'Grip Transition Drill',
                description: 'Practice changing between continental, eastern, and semi-western grips',
                duration: 15
              },
              {
                id: 'td_002',
                title: 'Ready Position Practice',
                description: 'Master the athletic stance and split-step timing',
                duration: 15
              },
              {
                id: 'td_003',
                title: 'Shadow Swings',
                description: 'Practice forehand and backhand swings without a ball',
                duration: 15
              }
            ]
          },
          {
            id: 'ts_002',
            title: 'Forehand Fundamentals',
            description: 'Develop a reliable forehand groundstroke',
            duration: 60,
            focusArea: 'Forehand',
            drills: [
              {
                id: 'td_004',
                title: 'Forehand Contact Point Drill',
                description: 'Practice hitting the ball at the ideal contact point',
                duration: 20
              },
              {
                id: 'td_005',
                title: 'Forehand Cross-Court Rally',
                description: 'Hit consistent forehand cross-court shots',
                duration: 20
              },
              {
                id: 'td_006',
                title: 'Forehand Down the Line',
                description: 'Practice directing forehands down the line',
                duration: 20
              }
            ]
          },
          {
            id: 'ts_003',
            title: 'Backhand Basics',
            description: 'Establish a solid two-handed backhand technique',
            duration: 60,
            focusArea: 'Backhand',
            drills: [
              {
                id: 'td_007',
                title: 'Backhand Grip and Stance',
                description: 'Master the proper two-handed backhand grip and stance',
                duration: 15
              },
              {
                id: 'td_008',
                title: 'Backhand Contact Point',
                description: 'Practice consistent contact point for backhand shots',
                duration: 15
              },
              {
                id: 'td_009',
                title: 'Backhand Cross-Court Consistency',
                description: 'Develop a reliable cross-court backhand',
                duration: 30
              }
            ]
          },
          {
            id: 'ts_004',
            title: 'Serve Introduction',
            description: 'Learn the basic serving motion and placement',
            duration: 45,
            focusArea: 'Serve',
            drills: [
              {
                id: 'td_010',
                title: 'Ball Toss Practice',
                description: 'Master a consistent ball toss',
                duration: 15
              },
              {
                id: 'td_011',
                title: 'Trophy Pose Drill',
                description: 'Perfect the trophy pose position',
                duration: 15
              },
              {
                id: 'td_012',
                title: 'Serve and Volley Practice',
                description: 'Practice serving and moving forward to the net',
                duration: 15
              }
            ]
          }
        ]
      },
      {
        id: 'tp_002',
        title: 'Intermediate Stroke Development',
        description: 'Refine your groundstrokes and develop more advanced techniques',
        level: 'Intermediate',
        duration: '6 weeks',
        focus: ['Topspin', 'Backhand', 'Serve Variation', 'Net Game'],
        thumbnail: '/assets/images/intermediate-program.jpg',
        sessions: [
          {
            id: 'ts_101',
            title: 'Topspin Forehand',
            description: 'Develop a heavy topspin forehand for better control and consistency',
            duration: 60,
            focusArea: 'Forehand',
            drills: [
              {
                id: 'td_101',
                title: 'Low to High Swing Path',
                description: 'Practice the correct swing path for generating topspin',
                duration: 20
              },
              {
                id: 'td_102',
                title: 'Heavy Topspin Rally',
                description: 'Maintain a cross-court rally with increased topspin',
                duration: 20
              },
              {
                id: 'td_103',
                title: 'Inside-Out Forehand',
                description: 'Master the inside-out forehand to attack opponent\'s backhand',
                duration: 20
              }
            ]
          },
          {
            id: 'ts_102',
            title: 'One-Handed Backhand',
            description: 'Learn the fundamentals of a one-handed backhand',
            duration: 60,
            focusArea: 'Backhand',
            drills: [
              {
                id: 'td_104',
                title: 'One-Handed Grip and Stance',
                description: 'Master the proper grip and stance for one-handed backhand',
                duration: 15
              },
              {
                id: 'td_105',
                title: 'One-Handed Backhand Contact Point',
                description: 'Find the optimal contact point for the one-handed backhand',
                duration: 15
              },
              {
                id: 'td_106',
                title: 'Slice Backhand',
                description: 'Develop a reliable slice backhand',
                duration: 30
              }
            ]
          },
          {
            id: 'ts_103',
            title: 'Advanced Serving',
            description: 'Develop different serve types and improve placement',
            duration: 60,
            focusArea: 'Serve',
            drills: [
              {
                id: 'td_107',
                title: 'Flat Serve Technique',
                description: 'Master the flat serve for maximum pace',
                duration: 20
              },
              {
                id: 'td_108',
                title: 'Slice Serve Technique',
                description: 'Develop a wide-slicing serve',
                duration: 20
              },
              {
                id: 'td_109',
                title: 'Serve Placement Drill',
                description: 'Practice serving to specific targets in the service box',
                duration: 20
              }
            ]
          },
          {
            id: 'ts_104',
            title: 'Volley Techniques',
            description: 'Improve your net play with solid volley technique',
            duration: 60,
            focusArea: 'Net Game',
            drills: [
              {
                id: 'td_110',
                title: 'Forehand Volley',
                description: 'Master the fundamentals of the forehand volley',
                duration: 20
              },
              {
                id: 'td_111',
                title: 'Backhand Volley',
                description: 'Develop a consistent backhand volley',
                duration: 20
              },
              {
                id: 'td_112',
                title: 'Approach and Volley',
                description: 'Practice approaching the net and hitting effective volleys',
                duration: 20
              }
            ]
          }
        ]
      },
      {
        id: 'tp_003',
        title: 'Advanced Match Strategy',
        description: 'Develop strategic thinking and match tactics for competitive play',
        level: 'Advanced',
        duration: '8 weeks',
        focus: ['Match Tactics', 'Footwork', 'Shot Selection', 'Mental Game'],
        thumbnail: '/assets/images/advanced-program.jpg',
        sessions: [
          {
            id: 'ts_201',
            title: 'Serve Strategy',
            description: 'Master strategic serving patterns and placement',
            duration: 90,
            focusArea: 'Serve',
            drills: [
              {
                id: 'td_201',
                title: 'First Serve Percentage',
                description: 'Improve your first serve percentage with targeted practice',
                duration: 30
              },
              {
                id: 'td_202',
                title: 'Second Serve Reliability',
                description: 'Develop a dependable second serve with appropriate spin',
                duration: 30
              },
              {
                id: 'td_203',
                title: 'Serving Patterns',
                description: 'Practice serving patterns based on game situations',
                duration: 30
              }
            ]
          },
          {
            id: 'ts_202',
            title: 'Return of Serve Tactics',
            description: 'Improve your return game with strategic positioning and shot selection',
            duration: 60,
            focusArea: 'Return',
            drills: [
              {
                id: 'td_204',
                title: 'First Serve Return Position',
                description: 'Practice different return positions against first serves',
                duration: 20
              },
              {
                id: 'td_205',
                title: 'Second Serve Attack',
                description: 'Learn to aggressively attack second serves',
                duration: 20
              },
              {
                id: 'td_206',
                title: 'Return Direction Control',
                description: 'Master controlling the direction of your returns',
                duration: 20
              }
            ]
          },
          {
            id: 'ts_203',
            title: 'Point Construction',
            description: 'Learn to build points strategically',
            duration: 90,
            focusArea: 'Strategy',
            drills: [
              {
                id: 'td_207',
                title: 'Opening the Court',
                description: 'Practice creating and exploiting court openings',
                duration: 30
              },
              {
                id: 'td_208',
                title: 'Playing to Patterns',
                description: 'Master common patterns of play for different situations',
                duration: 30
              },
              {
                id: 'td_209',
                title: 'Defensive to Offensive Transition',
                description: 'Learn to transition from defensive to offensive positions',
                duration: 30
              }
            ]
          },
          {
            id: 'ts_204',
            title: 'Mental Toughness',
            description: 'Develop mental strength for high-pressure situations',
            duration: 60,
            focusArea: 'Mental Game',
            drills: [
              {
                id: 'td_210',
                title: 'Pressure Point Practice',
                description: 'Simulate pressure points to build mental resilience',
                duration: 20
              },
              {
                id: 'td_211',
                title: 'Comeback Scenarios',
                description: 'Practice playing from behind and managing comebacks',
                duration: 20
              },
              {
                id: 'td_212',
                title: 'Closing Out Matches',
                description: 'Master the mental aspects of closing out tight matches',
                duration: 20
              }
            ]
          }
        ]
      }
    ];
  };

  const value = {
    programs,
    userProgress,
    currentProgram,
    setCurrentProgram,
    loading,
    error,
    getProgram,
    enrollInProgram,
    completeSession,
    getProgramProgress,
    isEnrolled,
    getRecommendedPrograms
  };

  return <TrainingContext.Provider value={value}>{children}</TrainingContext.Provider>;
};