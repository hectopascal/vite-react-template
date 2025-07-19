// Mock data and functions to simulate training service
// In a real application, these would make API calls to a backend server

// Sample training programs data
const mockPrograms = [
  {
    programId: '1',
    userId: '1',
    creationDate: '2023-03-10T00:00:00.000Z',
    targetSkills: ['forehand', 'footwork'],
    duration: 14, // days
    difficulty: 'intermediate',
    sessions: [
      {
        sessionId: '1-1',
        programId: '1',
        name: 'Forehand Fundamentals',
        description: 'Focus on forehand technique and consistency',
        duration: 45, // minutes
        completionStatus: 'completed',
        scheduledDate: '2023-03-12T00:00:00.000Z',
        drills: [
          {
            drillId: '1-1-1',
            sessionId: '1-1',
            name: 'Forehand Crosscourt Rally',
            description: 'Practice hitting consistent crosscourt forehands',
            targetSkill: 'forehand',
            duration: 15, // minutes
            difficulty: 'intermediate',
            videoUrl: 'https://example.com/drills/forehand-crosscourt.mp4',
            instructions: [
              'Start in ready position at the center baseline',
              'Focus on hitting with topspin',
              'Aim for consistency and depth',
              'Try to maintain a rally of at least 10 shots'
            ]
          },
          {
            drillId: '1-1-2',
            sessionId: '1-1',
            name: 'Forehand Inside-Out',
            description: 'Practice hitting inside-out forehands from the backhand corner',
            targetSkill: 'forehand',
            duration: 15, // minutes
            difficulty: 'intermediate',
            videoUrl: 'https://example.com/drills/inside-out-forehand.mp4',
            instructions: [
              'Start in the backhand corner',
              'Use footwork to get in position',
              'Hit inside-out to the opponent\'s backhand',
              'Focus on racket head acceleration'
            ]
          },
          {
            drillId: '1-1-3',
            sessionId: '1-1',
            name: 'Footwork Ladder Drill',
            description: 'Improve quick feet movement patterns',
            targetSkill: 'footwork',
            duration: 15, // minutes
            difficulty: 'intermediate',
            videoUrl: 'https://example.com/drills/footwork-ladder.mp4',
            instructions: [
              'Set up an agility ladder on the court',
              'Perform various footwork patterns',
              'Focus on quick, precise foot placement',
              'Maintain proper tennis stance throughout'
            ]
          }
        ]
      },
      {
        sessionId: '1-2',
        programId: '1',
        name: 'Footwork Development',
        description: 'Enhance movement efficiency and court coverage',
        duration: 50, // minutes
        completionStatus: 'scheduled',
        scheduledDate: '2023-03-15T00:00:00.000Z',
        drills: [
          {
            drillId: '1-2-1',
            sessionId: '1-2',
            name: 'Split-Step Timing',
            description: 'Practice the proper timing of the split-step',
            targetSkill: 'footwork',
            duration: 20, // minutes
            difficulty: 'intermediate',
            videoUrl: 'https://example.com/drills/split-step.mp4',
            instructions: [
              'Focus on timing the split-step with opponent\'s contact',
              'Ensure you land balanced and ready to move',
              'Practice with a partner feeding balls at different speeds',
              'Gradually increase the pace and unpredictability'
            ]
          },
          {
            drillId: '1-2-2',
            sessionId: '1-2',
            name: 'Forehand Recovery',
            description: 'Work on efficient recovery after hitting a forehand',
            targetSkill: 'footwork',
            duration: 15, // minutes
            difficulty: 'intermediate',
            videoUrl: 'https://example.com/drills/forehand-recovery.mp4',
            instructions: [
              'Hit a forehand and immediately recover to the optimal position',
              'Focus on small adjustment steps after recovery',
              'Practice with alternating shot directions',
              'Minimize wasted movement'
            ]
          },
          {
            drillId: '1-2-3',
            sessionId: '1-2',
            name: 'Court Movement Patterns',
            description: 'Practice common movement patterns in tennis',
            targetSkill: 'footwork',
            duration: 15, // minutes
            difficulty: 'intermediate',
            videoUrl: 'https://example.com/drills/movement-patterns.mp4',
            instructions: [
              'Set up cones in key court positions',
              'Practice moving between positions with proper technique',
              'Focus on changing direction efficiently',
              'Maintain proper body positioning throughout'
            ]
          }
        ]
      }
    ]
  },
  {
    programId: '2',
    userId: '2',
    creationDate: '2023-02-15T00:00:00.000Z',
    targetSkills: ['serve', 'volley'],
    duration: 21, // days
    difficulty: 'advanced',
    sessions: [
      {
        sessionId: '2-1',
        programId: '2',
        name: 'Serve Development',
        description: 'Improve serve power and placement',
        duration: 60, // minutes
        completionStatus: 'completed',
        scheduledDate: '2023-02-16T00:00:00.000Z',
        drills: [
          {
            drillId: '2-1-1',
            sessionId: '2-1',
            name: 'Serve Targeting',
            description: 'Practice serving to specific targets in the service box',
            targetSkill: 'serve',
            duration: 30, // minutes
            difficulty: 'advanced',
            videoUrl: 'https://example.com/drills/serve-targets.mp4',
            instructions: [
              'Place targets in different areas of the service box',
              'Focus on consistent ball toss',
              'Aim for different targets in sets of 10 serves',
              'Track your accuracy percentage'
            ]
          },
          {
            drillId: '2-1-2',
            sessionId: '2-1',
            name: 'Second Serve Development',
            description: 'Work on consistent and effective second serves',
            targetSkill: 'serve',
            duration: 30, // minutes
            difficulty: 'advanced',
            videoUrl: 'https://example.com/drills/second-serve.mp4',
            instructions: [
              'Focus on adding spin for control',
              'Practice different spin combinations',
              'Aim to achieve at least 90% consistency',
              'Gradually increase the pace while maintaining control'
            ]
          }
        ]
      }
    ]
  }
];

/**
 * Get training programs for a specific user
 * @param {string} userId - User ID
 * @returns {Promise<Array>} - List of training programs
 */
export const getUserPrograms = async (userId) => {
  // Simulate API request delay
  await new Promise(resolve => setTimeout(resolve, 600));
  
  // Filter programs by user ID
  return mockPrograms.filter(program => program.userId === userId);
};

/**
 * Get program details by ID
 * @param {string} programId - Program ID
 * @returns {Promise<Object>} - Program details
 */
export const getProgramById = async (programId) => {
  // Simulate API request delay
  await new Promise(resolve => setTimeout(resolve, 400));
  
  // Find program by ID
  const program = mockPrograms.find(p => p.programId === programId);
  
  if (!program) {
    throw new Error('Training program not found');
  }
  
  return program;
};

/**
 * Get session details by ID
 * @param {string} sessionId - Session ID
 * @returns {Promise<Object>} - Session details
 */
export const getSessionById = async (sessionId) => {
  // Simulate API request delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  // Find session in all programs
  let session;
  for (const program of mockPrograms) {
    session = program.sessions.find(s => s.sessionId === sessionId);
    if (session) break;
  }
  
  if (!session) {
    throw new Error('Training session not found');
  }
  
  return session;
};

/**
 * Create a new training program
 * @param {string} userId - User ID
 * @param {Array} goals - Training goals
 * @returns {Promise<Object>} - New program details
 */
export const createProgram = async (userId, goals) => {
  // Simulate API request delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  const targetSkills = goals.map(goal => goal.skill.toLowerCase());
  
  // Create a new program object
  const newProgram = {
    programId: `${mockPrograms.length + 1}`,
    userId,
    creationDate: new Date().toISOString(),
    targetSkills,
    duration: goals.length * 7, // 7 days per goal
    difficulty: goals[0].level || 'intermediate',
    sessions: [],
  };
  
  // Generate initial sessions for the first week
  const initialSessions = generateSessionsForProgram(newProgram, goals);
  newProgram.sessions = initialSessions;
  
  // Add to mock programs
  mockPrograms.push(newProgram);
  
  return newProgram;
};

/**
 * Helper function to generate sessions for a program
 * @param {Object} program - Program object
 * @param {Array} goals - Training goals
 * @returns {Array} - Generated sessions
 */
const generateSessionsForProgram = (program, goals) => {
  const sessions = [];
  const currentDate = new Date();
  
  // Generate 3 sessions per week for the first week
  for (let i = 0; i < 3; i++) {
    const scheduleDate = new Date(currentDate);
    scheduleDate.setDate(currentDate.getDate() + (i + 1) * 2); // Every other day
    
    const session = {
      sessionId: `${program.programId}-${i + 1}`,
      programId: program.programId,
      name: getSessionName(goals, i),
      description: getSessionDescription(goals, i),
      duration: 45 + (i * 5), // 45-55 minutes
      completionStatus: 'scheduled',
      scheduledDate: scheduleDate.toISOString(),
      drills: generateDrillsForSession(`${program.programId}-${i + 1}`, goals, i),
    };
    
    sessions.push(session);
  }
  
  return sessions;
};

/**
 * Helper function to generate session name
 * @param {Array} goals - Training goals
 * @param {number} index - Session index
 * @returns {string} - Session name
 */
const getSessionName = (goals, index) => {
  const primaryGoal = goals[index % goals.length];
  const skill = primaryGoal.skill;
  
  const sessionNames = {
    forehand: ['Forehand Fundamentals', 'Forehand Power & Precision', 'Advanced Forehand Techniques'],
    backhand: ['Backhand Basics', 'Backhand Development', 'Advanced Backhand Strategies'],
    serve: ['Serve Mechanics', 'Serve Placement', 'Advanced Serving Skills'],
    volley: ['Volley Fundamentals', 'Net Game Development', 'Advanced Volley Techniques'],
    footwork: ['Movement Fundamentals', 'Court Coverage Training', 'Advanced Footwork Patterns'],
    default: ['Skill Development', 'Technique Refinement', 'Performance Enhancement']
  };
  
  const names = sessionNames[skill.toLowerCase()] || sessionNames.default;
  return names[index % names.length];
};

/**
 * Helper function to generate session description
 * @param {Array} goals - Training goals
 * @param {number} index - Session index
 * @returns {string} - Session description
 */
const getSessionDescription = (goals, index) => {
  const primaryGoal = goals[index % goals.length];
  const skill = primaryGoal.skill;
  
  const descriptions = {
    forehand: 'Focus on developing forehand technique and consistency',
    backhand: 'Improve backhand stroke mechanics and shot selection',
    serve: 'Enhance serving power, placement, and consistency',
    volley: 'Develop net game skills and volley technique',
    footwork: 'Improve court movement, positioning, and recovery',
    default: 'Comprehensive training to improve overall tennis skills'
  };
  
  return descriptions[skill.toLowerCase()] || descriptions.default;
};

/**
 * Helper function to generate drills for a session
 * @param {string} sessionId - Session ID
 * @param {Array} goals - Training goals
 * @param {number} index - Session index
 * @returns {Array} - Generated drills
 */
const generateDrillsForSession = (sessionId, goals, index) => {
  const drills = [];
  const primaryGoal = goals[index % goals.length];
  const primarySkill = primaryGoal.skill.toLowerCase();
  
  // Add 2-3 drills per session
  const numDrills = Math.floor(Math.random() * 2) + 2; // 2-3 drills
  
  for (let i = 0; i < numDrills; i++) {
    const skill = i === 0 ? primarySkill : getComplementarySkill(primarySkill);
    
    const drill = {
      drillId: `${sessionId}-${i + 1}`,
      sessionId,
      name: getDrillName(skill, i),
      description: getDrillDescription(skill, i),
      targetSkill: skill,
      duration: 15 + (i * 5), // 15-25 minutes
      difficulty: primaryGoal.level || 'intermediate',
      videoUrl: `https://example.com/drills/${skill}-drill-${i + 1}.mp4`,
      instructions: getDrillInstructions(skill, i),
    };
    
    drills.push(drill);
  }
  
  return drills;
};

/**
 * Helper function to get a complementary skill
 * @param {string} primarySkill - Primary skill
 * @returns {string} - Complementary skill
 */
const getComplementarySkill = (primarySkill) => {
  const complementarySkills = {
    forehand: ['footwork', 'volley'],
    backhand: ['footwork', 'volley'],
    serve: ['footwork', 'volley'],
    volley: ['footwork', 'serve'],
    footwork: ['forehand', 'backhand']
  };
  
  const options = complementarySkills[primarySkill] || ['forehand', 'backhand', 'footwork'];
  return options[Math.floor(Math.random() * options.length)];
};

/**
 * Helper function to generate drill name
 * @param {string} skill - Target skill
 * @param {number} index - Drill index
 * @returns {string} - Drill name
 */
const getDrillName = (skill, index) => {
  const drillNames = {
    forehand: [
      'Forehand Crosscourt Rally', 
      'Forehand Down the Line', 
      'Inside-Out Forehand',
      'Forehand Approach Shots'
    ],
    backhand: [
      'Backhand Crosscourt Consistency', 
      'Backhand Down the Line', 
      'Backhand Slice Practice',
      'Two-Handed Backhand Drive'
    ],
    serve: [
      'First Serve Power', 
      'Serve Placement Accuracy', 
      'Second Serve Spin',
      'Serve and Volley Transition'
    ],
    volley: [
      'Volley Technique Basics', 
      'Punch Volley Practice', 
      'Drop Volley Control',
      'Overhead Smash Drill'
    ],
    footwork: [
      'Split-Step Timing', 
      'Recovery Movement', 
      'Lateral Quickness Drill',
      'Multi-Directional Movement'
    ],
  };
  
  const options = drillNames[skill] || drillNames.forehand;
  return options[index % options.length];
};

/**
 * Helper function to generate drill description
 * @param {string} skill - Target skill
 * @param {number} index - Drill index
 * @returns {string} - Drill description
 */
const getDrillDescription = (skill, index) => {
  const descriptions = {
    forehand: 'Develop consistency, power, and placement of your forehand shots',
    backhand: 'Improve technique, accuracy, and confidence in your backhand shots',
    serve: 'Enhance power, placement, and consistency in your serves',
    volley: 'Develop proper technique, timing, and touch for effective volleys',
    footwork: 'Improve movement efficiency, balance, and court positioning',
  };
  
  return descriptions[skill] || 'Improve your overall tennis skills through focused practice';
};

/**
 * Helper function to generate drill instructions
 * @param {string} skill - Target skill
 * @param {number} index - Drill index
 * @returns {Array} - Drill instructions
 */
const getDrillInstructions = (skill, index) => {
  const instructionSets = {
    forehand: [
      [
        'Start in ready position at the center baseline',
        'Hit consistent crosscourt forehands with a partner or coach',
        'Focus on depth and maintaining a comfortable rally',
        'Gradually increase the pace while maintaining control',
      ],
      [
        'Practice hitting forehands down the line from the deuce court',
        'Focus on proper follow-through toward the target',
        'Maintain good balance throughout the stroke',
        'Aim for the alley near the baseline for optimal depth',
      ],
    ],
    backhand: [
      [
        'Set up on the backhand side of the court',
        'Exchange consistent crosscourt backhands with a partner',
        'Focus on proper grip and preparation',
        'Maintain a stable head position throughout the stroke',
      ],
      [
        'Practice hitting backhand down the line shots',
        'Focus on full extension toward the target',
        'Step into the shot for additional power',
        'Control the depth by adjusting your follow-through',
      ],
    ],
    serve: [
      [
        'Focus on consistent ball toss slightly in front of you',
        'Practice trophy position with proper shoulder alignment',
        'Use leg drive to generate upward force',
        'Follow through completely to maximize power',
      ],
      [
        'Place targets in different areas of the service box',
        'Focus on hitting specific targets rather than power',
        'Maintain consistent toss and technique',
        'Track your accuracy percentage for feedback',
      ],
    ],
    volley: [
      [
        'Position yourself at the net in ready stance',
        'Keep racquet head above your wrist',
        'Use a short backswing with firm wrist',
        'Step towards the ball with your opposite foot',
      ],
      [
        'Practice punch volleys with a partner feeding balls',
        'Focus on directing the ball with racquet angle',
        'Keep movements compact and efficient',
        'Aim for deep volleys to push opponent back',
      ],
    ],
    footwork: [
      [
        'Practice proper split-step timing on opponent contact',
        'Ensure balanced weight distribution',
        'Position feet shoulder-width apart',
        'Land softly on the balls of your feet',
      ],
      [
        'Set up cones in key court positions',
        'Practice moving between positions with proper technique',
        'Focus on efficient directional changes',
        'Maintain proper ready position after each movement',
      ],
    ],
  };
  
  const options = instructionSets[skill] || instructionSets.forehand;
  return options[index % options.length];
};

/**
 * Mark a session as complete
 * @param {string} sessionId - Session ID
 * @param {Object} feedback - Session feedback
 * @returns {Promise<Object>} - Updated session
 */
export const completeSession = async (sessionId, feedback) => {
  // Simulate API request delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Find the session
  let session;
  let program;
  for (const p of mockPrograms) {
    const s = p.sessions.find(s => s.sessionId === sessionId);
    if (s) {
      session = s;
      program = p;
      break;
    }
  }
  
  if (!session) {
    throw new Error('Session not found');
  }
  
  // Update session status
  session.completionStatus = 'completed';
  session.feedback = feedback;
  
  return session;
};

/**
 * Generate the next session in a training program
 * @param {string} programId - Program ID
 * @returns {Promise<Object>} - New session
 */
export const generateNextSession = async (programId) => {
  // Simulate API request delay
  await new Promise(resolve => setTimeout(resolve, 900));
  
  // Find the program
  const program = mockPrograms.find(p => p.programId === programId);
  if (!program) {
    throw new Error('Program not found');
  }
  
  // Generate a new session
  const sessionIndex = program.sessions.length;
  const lastSession = program.sessions[sessionIndex - 1];
  
  // Calculate new schedule date (2 days after the last session)
  const lastDate = new Date(lastSession.scheduledDate);
  const newDate = new Date(lastDate);
  newDate.setDate(lastDate.getDate() + 2);
  
  // Create session ID
  const sessionId = `${programId}-${sessionIndex + 1}`;
  
  // Extract goals from program
  const goals = program.targetSkills.map(skill => ({
    skill,
    level: program.difficulty
  }));
  
  // Create new session
  const newSession = {
    sessionId,
    programId,
    name: getSessionName(goals, sessionIndex),
    description: getSessionDescription(goals, sessionIndex),
    duration: 45 + (sessionIndex % 3) * 5, // 45-55 minutes
    completionStatus: 'scheduled',
    scheduledDate: newDate.toISOString(),
    drills: generateDrillsForSession(sessionId, goals, sessionIndex),
  };
  
  // Add to program
  program.sessions.push(newSession);
  
  return newSession;
};