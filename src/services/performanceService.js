/**
 * Mock service for handling performance data
 * Uses localStorage for persistence to simulate backend API
 */

// Initialize default performance data if none exists
const initializeDefaultData = () => {
  const defaultData = {
    id: '1',
    userId: '1',
    level: 'Intermediate',
    improvement: 12,
    sessionsCompleted: 28,
    sessionsThisMonth: 6,
    videosAnalyzed: 14,
    videosThisMonth: 3,
    practiceHours: 45,
    hoursThisMonth: 8,
    overall: 72,
    skills: {
      forehand: 78,
      backhand: 65,
      serve: 62,
      volley: 58,
      footwork: 70,
      positioning: 74,
      consistency: 68
    },
    history: [
      {
        date: '2023-05-15',
        overall: 60,
        skills: {
          forehand: 65,
          backhand: 55,
          serve: 50,
          volley: 45,
          footwork: 60
        }
      },
      {
        date: '2023-05-22',
        overall: 62,
        skills: {
          forehand: 68,
          backhand: 56,
          serve: 52,
          volley: 46,
          footwork: 61
        }
      },
      {
        date: '2023-05-29',
        overall: 64,
        skills: {
          forehand: 70,
          backhand: 58,
          serve: 53,
          volley: 48,
          footwork: 63
        }
      },
      {
        date: '2023-06-05',
        overall: 65,
        skills: {
          forehand: 72,
          backhand: 59,
          serve: 54,
          volley: 50,
          footwork: 64
        }
      },
      {
        date: '2023-06-12',
        overall: 67,
        skills: {
          forehand: 74,
          backhand: 60,
          serve: 56,
          volley: 52,
          footwork: 66
        }
      },
      {
        date: '2023-06-19',
        overall: 68,
        skills: {
          forehand: 75,
          backhand: 62,
          serve: 58,
          volley: 54,
          footwork: 67
        }
      },
      {
        date: '2023-06-26',
        overall: 70,
        skills: {
          forehand: 76,
          backhand: 63,
          serve: 60,
          volley: 56,
          footwork: 68
        }
      },
      {
        date: '2023-07-03',
        overall: 72,
        skills: {
          forehand: 78,
          backhand: 65,
          serve: 62,
          volley: 58,
          footwork: 70
        }
      }
    ],
    achievements: [
      {
        title: 'Consistency Master',
        description: 'Maintained a 70% accuracy rate in forehand drills',
        date: 'July 2, 2023'
      },
      {
        title: 'Backhand Breakthrough',
        description: 'Improved backhand technique by 10 points',
        date: 'June 15, 2023'
      },
      {
        title: 'Marathon Trainer',
        description: 'Completed 5 training sessions in one week',
        date: 'June 4, 2023'
      }
    ],
    improvements: [
      {
        skill: 'forehand',
        increase: 13,
        percentage: 65
      },
      {
        skill: 'serve',
        increase: 12,
        percentage: 60
      },
      {
        skill: 'footwork',
        increase: 10,
        percentage: 50
      }
    ],
    recentActivity: [
      {
        type: 'training',
        description: 'Completed Intermediate Serve Training',
        date: 'July 3, 2023'
      },
      {
        type: 'video',
        description: 'Uploaded forehand analysis video',
        date: 'July 1, 2023'
      },
      {
        type: 'achievement',
        description: 'Earned Consistency Master badge',
        date: 'July 2, 2023'
      },
      {
        type: 'training',
        description: 'Completed Advanced Footwork Drill',
        date: 'June 28, 2023'
      }
    ],
    insights: [
      {
        type: 'strength',
        title: 'Strong Forehand Development',
        description: 'Your forehand has shown consistent improvement and is now your strongest stroke. Your technique is solid with good follow-through.',
        actionItems: [
          'Consider adding more power by improving hip rotation',
          'Practice varying spin and pace to add versatility'
        ]
      },
      {
        type: 'weakness',
        title: 'Volley Technique Needs Attention',
        description: 'Your volley technique shows room for improvement, particularly in positioning and contact point.',
        actionItems: [
          'Focus on keeping a firm wrist during volleys',
          'Practice approaching the net after deep groundstrokes',
          'Work on blocking volleys rather than swinging'
        ]
      },
      {
        type: 'opportunity',
        title: 'Serve Development Potential',
        description: 'Your serve has the fundamentals in place but could become a major weapon with focused training.',
        actionItems: [
          'Work on ball toss consistency',
          'Practice generating power from leg drive',
          'Develop different serve types (flat, slice, kick)'
        ]
      }
    ],
    recommendedDrills: [
      {
        drillId: '101',
        name: 'Volley Precision Drill',
        description: 'Improve volley accuracy and technique by hitting targets at the net',
        targetSkill: 'volley',
        duration: 20,
        difficulty: 'intermediate'
      },
      {
        drillId: '203',
        name: 'Serve Placement Practice',
        description: 'Focus on placing serves in specific court zones with consistency',
        targetSkill: 'serve',
        duration: 25,
        difficulty: 'intermediate'
      },
      {
        drillId: '154',
        name: 'Split-Step Footwork Drill',
        description: 'Improve court coverage and reaction time with timed split-step exercises',
        targetSkill: 'footwork',
        duration: 15,
        difficulty: 'all levels'
      }
    ],
    improvementAreas: {
      volley: {
        currentLevel: 58,
        targetLevel: 75,
        priority: 'High',
        description: 'Work on firming wrist position and improving net positioning'
      },
      serve: {
        currentLevel: 62,
        targetLevel: 80,
        priority: 'Medium',
        description: 'Develop consistent ball toss and improve second serve reliability'
      },
      backhand: {
        currentLevel: 65,
        targetLevel: 75,
        priority: 'Medium',
        description: 'Focus on follow-through and generating more topspin'
      }
    },
    trainingPlan: {
      description: 'This customized plan focuses on improving your volleying technique and serve consistency while maintaining your strong forehand.',
      schedule: [
        {
          day: 'Monday',
          activities: [
            {
              type: 'drill',
              name: 'Volley Precision Drill',
              duration: 20
            },
            {
              type: 'practice',
              name: 'Backhand Cross-court Practice',
              duration: 30
            }
          ]
        },
        {
          day: 'Tuesday',
          activities: [
            {
              type: 'drill',
              name: 'Serve Placement Practice',
              duration: 25
            },
            {
              type: 'practice',
              name: 'Approach Shot Routine',
              duration: 25
            }
          ]
        },
        {
          day: 'Wednesday',
          activities: []
        },
        {
          day: 'Thursday',
          activities: [
            {
              type: 'drill',
              name: 'Split-Step Footwork Drill',
              duration: 15
            },
            {
              type: 'practice',
              name: 'Volley-to-Overhead Transition',
              duration: 30
            }
          ]
        },
        {
          day: 'Friday',
          activities: [
            {
              type: 'practice',
              name: 'Serve and Return Practice',
              duration: 40
            }
          ]
        },
        {
          day: 'Saturday',
          activities: [
            {
              type: 'match',
              name: 'Practice Match or Hitting Session',
              duration: 60
            }
          ]
        },
        {
          day: 'Sunday',
          activities: []
        }
      ]
    }
  };

  // Save to localStorage
  localStorage.setItem('performanceData', JSON.stringify(defaultData));
  return defaultData;
};

/**
 * Get performance data for a user
 * @param {string} userId - The user ID to fetch performance data for
 * @returns {Promise<object>} - The user's performance data
 */
export const getUserPerformance = async (userId) => {
  return new Promise((resolve) => {
    // Simulate API latency
    setTimeout(() => {
      // Check if we have data in localStorage
      const storedData = localStorage.getItem('performanceData');
      
      if (storedData) {
        resolve(JSON.parse(storedData));
      } else {
        // If no data exists, create default data
        resolve(initializeDefaultData());
      }
    }, 800); // Simulate network delay
  });
};

/**
 * Update specific performance metrics
 * @param {string} userId - The user ID to update performance for
 * @param {object} metricsUpdate - Object containing metrics to update
 * @returns {Promise<object>} - The updated performance data
 */
export const updatePerformanceMetrics = async (userId, metricsUpdate) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Get current data
      const storedData = localStorage.getItem('performanceData');
      let performanceData = storedData ? JSON.parse(storedData) : initializeDefaultData();
      
      // Update with new metrics
      performanceData = {
        ...performanceData,
        ...metricsUpdate,
        // If updating skills, merge rather than replace
        skills: metricsUpdate.skills 
          ? { ...performanceData.skills, ...metricsUpdate.skills }
          : performanceData.skills
      };
      
      // Save updated data
      localStorage.setItem('performanceData', JSON.stringify(performanceData));
      
      resolve(performanceData);
    }, 500);
  });
};

/**
 * Add a new performance record point
 * @param {string} userId - The user ID to add performance for
 * @param {object} record - Performance record with date, overall score, and skill breakdown
 * @returns {Promise<object>} - The updated performance data with new history entry
 */
export const addPerformanceRecord = async (userId, record) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Get current data
      const storedData = localStorage.getItem('performanceData');
      let performanceData = storedData ? JSON.parse(storedData) : initializeDefaultData();
      
      // Add new record to history
      performanceData.history.push({
        date: record.date || new Date().toISOString().split('T')[0],
        overall: record.overall,
        skills: record.skills || {}
      });
      
      // Update current skills and overall score
      if (record.skills) {
        performanceData.skills = {
          ...performanceData.skills,
          ...record.skills
        };
      }
      
      if (record.overall) {
        performanceData.overall = record.overall;
      }
      
      // Sort history by date
      performanceData.history.sort((a, b) => new Date(a.date) - new Date(b.date));
      
      // Save updated data
      localStorage.setItem('performanceData', JSON.stringify(performanceData));
      
      resolve(performanceData);
    }, 500);
  });
};

/**
 * Add a new achievement
 * @param {string} userId - The user ID 
 * @param {object} achievement - Achievement object with title, description, and optional date
 * @returns {Promise<object>} - The updated performance data with new achievement
 */
export const addAchievement = async (userId, achievement) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Get current data
      const storedData = localStorage.getItem('performanceData');
      let performanceData = storedData ? JSON.parse(storedData) : initializeDefaultData();
      
      // Add new achievement
      performanceData.achievements.unshift({
        title: achievement.title,
        description: achievement.description,
        date: achievement.date || new Date().toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        })
      });
      
      // Save updated data
      localStorage.setItem('performanceData', JSON.stringify(performanceData));
      
      resolve(performanceData);
    }, 500);
  });
};

/**
 * Add activity to recent activity list
 * @param {string} userId - The user ID
 * @param {object} activity - Activity object with type, description, and optional date
 * @returns {Promise<object>} - The updated performance data with new activity
 */
export const addActivity = async (userId, activity) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Get current data
      const storedData = localStorage.getItem('performanceData');
      let performanceData = storedData ? JSON.parse(storedData) : initializeDefaultData();
      
      // Add new activity to the beginning of the list
      performanceData.recentActivity.unshift({
        type: activity.type,
        description: activity.description,
        date: activity.date || new Date().toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        })
      });
      
      // Keep only the most recent activities
      if (performanceData.recentActivity.length > 10) {
        performanceData.recentActivity = performanceData.recentActivity.slice(0, 10);
      }
      
      // Save updated data
      localStorage.setItem('performanceData', JSON.stringify(performanceData));
      
      resolve(performanceData);
    }, 500);
  });
};

/**
 * Reset performance data to default (for testing purposes)
 * @returns {Promise<object>} - The default performance data
 */
export const resetPerformanceData = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const defaultData = initializeDefaultData();
      resolve(defaultData);
    }, 300);
  });
};