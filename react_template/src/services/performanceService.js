// Mock data and functions to simulate performance tracking service
// In a real application, these would make API calls to a backend server

// Sample performance data
const mockPerformanceData = [
  {
    performanceId: '1',
    userId: '1',
    metrics: {
      forehand: {
        technique: 75,
        consistency: 68,
        power: 82,
        placement: 71,
        overall: 74
      },
      backhand: {
        technique: 65,
        consistency: 72,
        power: 60,
        placement: 68,
        overall: 66
      },
      serve: {
        technique: 70,
        consistency: 65,
        power: 78,
        placement: 62,
        overall: 69
      },
      volley: {
        technique: 60,
        consistency: 58,
        power: 62,
        placement: 64,
        overall: 61
      },
      footwork: {
        speed: 72,
        agility: 68,
        balance: 75,
        recovery: 70,
        overall: 71
      },
      overall: 68
    },
    creationDate: '2023-03-01T00:00:00.000Z',
    strengthAreas: ['forehand', 'footwork'],
    improvementAreas: ['volley', 'backhand'],
    progress: {
      lastMonth: 5,
      lastThreeMonths: 8
    }
  },
  {
    performanceId: '2',
    userId: '2',
    metrics: {
      forehand: {
        technique: 82,
        consistency: 80,
        power: 85,
        placement: 78,
        overall: 81
      },
      backhand: {
        technique: 84,
        consistency: 82,
        power: 78,
        placement: 80,
        overall: 81
      },
      serve: {
        technique: 88,
        consistency: 75,
        power: 90,
        placement: 78,
        overall: 83
      },
      volley: {
        technique: 80,
        consistency: 75,
        power: 72,
        placement: 78,
        overall: 76
      },
      footwork: {
        speed: 80,
        agility: 82,
        balance: 85,
        recovery: 78,
        overall: 81
      },
      overall: 80
    },
    creationDate: '2023-02-15T00:00:00.000Z',
    strengthAreas: ['serve', 'backhand', 'forehand'],
    improvementAreas: ['volley'],
    progress: {
      lastMonth: 3,
      lastThreeMonths: 7
    }
  }
];

// Sample historical performance data for tracking progress
const mockHistoricalData = {
  '1': [
    {
      date: '2022-12-01T00:00:00.000Z',
      overall: 60,
      forehand: 65,
      backhand: 58,
      serve: 62,
      volley: 52,
      footwork: 63
    },
    {
      date: '2023-01-01T00:00:00.000Z',
      overall: 63,
      forehand: 70,
      backhand: 60,
      serve: 65,
      volley: 55,
      footwork: 65
    },
    {
      date: '2023-02-01T00:00:00.000Z',
      overall: 66,
      forehand: 72,
      backhand: 63,
      serve: 67,
      volley: 58,
      footwork: 68
    },
    {
      date: '2023-03-01T00:00:00.000Z',
      overall: 68,
      forehand: 74,
      backhand: 66,
      serve: 69,
      volley: 61,
      footwork: 71
    }
  ],
  '2': [
    {
      date: '2022-11-15T00:00:00.000Z',
      overall: 73,
      forehand: 75,
      backhand: 76,
      serve: 78,
      volley: 68,
      footwork: 72
    },
    {
      date: '2022-12-15T00:00:00.000Z',
      overall: 75,
      forehand: 77,
      backhand: 78,
      serve: 80,
      volley: 70,
      footwork: 74
    },
    {
      date: '2023-01-15T00:00:00.000Z',
      overall: 78,
      forehand: 79,
      backhand: 80,
      serve: 82,
      volley: 73,
      footwork: 78
    },
    {
      date: '2023-02-15T00:00:00.000Z',
      overall: 80,
      forehand: 81,
      backhand: 81,
      serve: 83,
      volley: 76,
      footwork: 81
    }
  ]
};

// Sample benchmark data for comparison
const mockBenchmarks = {
  beginner: {
    overall: 40,
    forehand: 40,
    backhand: 38,
    serve: 35,
    volley: 30,
    footwork: 42
  },
  intermediate: {
    overall: 65,
    forehand: 65,
    backhand: 63,
    serve: 62,
    volley: 60,
    footwork: 68
  },
  advanced: {
    overall: 80,
    forehand: 82,
    backhand: 80,
    serve: 78,
    volley: 75,
    footwork: 83
  },
  expert: {
    overall: 90,
    forehand: 92,
    backhand: 90,
    serve: 88,
    volley: 86,
    footwork: 93
  }
};

/**
 * Get performance data for a specific user
 * @param {string} userId - User ID
 * @returns {Promise<Object>} - Performance data
 */
export const getUserPerformance = async (userId) => {
  // Simulate API request delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Find performance by user ID
  const performance = mockPerformanceData.find(p => p.userId === userId);
  
  if (!performance) {
    // If no performance data exists, create default data
    return createDefaultPerformance(userId);
  }
  
  return performance;
};

/**
 * Create default performance data for new users
 * @param {string} userId - User ID
 * @returns {Object} - Default performance data
 */
const createDefaultPerformance = (userId) => {
  const now = new Date().toISOString();
  const defaultData = {
    performanceId: `${mockPerformanceData.length + 1}`,
    userId,
    metrics: {
      forehand: {
        technique: 50,
        consistency: 50,
        power: 50,
        placement: 50,
        overall: 50
      },
      backhand: {
        technique: 50,
        consistency: 50,
        power: 50,
        placement: 50,
        overall: 50
      },
      serve: {
        technique: 50,
        consistency: 50,
        power: 50,
        placement: 50,
        overall: 50
      },
      volley: {
        technique: 50,
        consistency: 50,
        power: 50,
        placement: 50,
        overall: 50
      },
      footwork: {
        speed: 50,
        agility: 50,
        balance: 50,
        recovery: 50,
        overall: 50
      },
      overall: 50
    },
    creationDate: now,
    strengthAreas: [],
    improvementAreas: [],
    progress: {
      lastMonth: 0,
      lastThreeMonths: 0
    }
  };
  
  mockPerformanceData.push(defaultData);
  mockHistoricalData[userId] = [{
    date: now,
    overall: 50,
    forehand: 50,
    backhand: 50,
    serve: 50,
    volley: 50,
    footwork: 50
  }];
  
  return defaultData;
};

/**
 * Get historical performance data for a user
 * @param {string} userId - User ID
 * @param {number} months - Number of months to retrieve
 * @returns {Promise<Array>} - Historical data points
 */
export const getHistoricalPerformance = async (userId, months = 3) => {
  // Simulate API request delay
  await new Promise(resolve => setTimeout(resolve, 600));
  
  // Get historical data for user
  const history = mockHistoricalData[userId];
  
  if (!history) {
    return [];
  }
  
  // Filter data based on date range
  const now = new Date();
  const startDate = new Date(now.setMonth(now.getMonth() - months));
  
  return history.filter(item => new Date(item.date) >= startDate);
};

/**
 * Update performance metrics after video analysis
 * @param {string} userId - User ID
 * @param {Object} metrics - Performance metrics from analysis
 * @returns {Promise<Object>} - Updated performance data
 */
export const updatePerformanceFromAnalysis = async (userId, metrics) => {
  // Simulate API request delay
  await new Promise(resolve => setTimeout(resolve, 700));
  
  let performance = mockPerformanceData.find(p => p.userId === userId);
  
  if (!performance) {
    performance = createDefaultPerformance(userId);
  }
  
  // Update metrics based on analysis
  const strokeType = metrics.strokeType;
  if (strokeType && performance.metrics[strokeType]) {
    // Update specific stroke metrics
    Object.keys(metrics).forEach(key => {
      if (performance.metrics[strokeType][key] !== undefined) {
        // Blend new metrics with existing (30% new, 70% existing for stability)
        performance.metrics[strokeType][key] = Math.round(
          performance.metrics[strokeType][key] * 0.7 + metrics[key] * 0.3
        );
      }
    });
    
    // Recalculate overall stroke score
    const strokeMetrics = performance.metrics[strokeType];
    const sum = Object.keys(strokeMetrics).reduce((total, key) => {
      return key !== 'overall' ? total + strokeMetrics[key] : total;
    }, 0);
    
    const count = Object.keys(strokeMetrics).length - 1; // Exclude 'overall'
    performance.metrics[strokeType].overall = Math.round(sum / count);
  }
  
  // Recalculate overall performance
  const overallSum = Object.keys(performance.metrics).reduce((total, key) => {
    return key !== 'overall' && typeof performance.metrics[key] === 'object'
      ? total + performance.metrics[key].overall
      : total;
  }, 0);
  
  const overallCount = Object.keys(performance.metrics).filter(
    key => key !== 'overall' && typeof performance.metrics[key] === 'object'
  ).length;
  
  performance.metrics.overall = Math.round(overallSum / overallCount);
  
  // Update strengths and improvement areas
  const areas = Object.keys(performance.metrics).filter(
    key => key !== 'overall' && typeof performance.metrics[key] === 'object'
  );
  
  const sortedAreas = [...areas].sort(
    (a, b) => performance.metrics[b].overall - performance.metrics[a].overall
  );
  
  performance.strengthAreas = sortedAreas.slice(0, 2);
  performance.improvementAreas = sortedAreas.slice(-2);
  
  // Update historical data
  const now = new Date();
  const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-01T00:00:00.000Z`;
  
  if (!mockHistoricalData[userId]) {
    mockHistoricalData[userId] = [];
  }
  
  const historyIndex = mockHistoricalData[userId].findIndex(
    h => h.date.substring(0, 7) === currentMonth.substring(0, 7)
  );
  
  const historyUpdate = {
    date: currentMonth,
    overall: performance.metrics.overall,
    forehand: performance.metrics.forehand.overall,
    backhand: performance.metrics.backhand.overall,
    serve: performance.metrics.serve.overall,
    volley: performance.metrics.volley.overall,
    footwork: performance.metrics.footwork.overall
  };
  
  if (historyIndex === -1) {
    mockHistoricalData[userId].push(historyUpdate);
  } else {
    mockHistoricalData[userId][historyIndex] = historyUpdate;
  }
  
  // Calculate progress
  if (mockHistoricalData[userId].length >= 2) {
    const sortedHistory = [...mockHistoricalData[userId]].sort(
      (a, b) => new Date(b.date) - new Date(a.date)
    );
    
    const current = sortedHistory[0].overall;
    const oneMonthAgo = sortedHistory.find(h => {
      const date = new Date(h.date);
      const monthsAgo = (now.getFullYear() - date.getFullYear()) * 12 + 
                        now.getMonth() - date.getMonth();
      return monthsAgo >= 1;
    });
    
    const threeMonthsAgo = sortedHistory.find(h => {
      const date = new Date(h.date);
      const monthsAgo = (now.getFullYear() - date.getFullYear()) * 12 + 
                        now.getMonth() - date.getMonth();
      return monthsAgo >= 3;
    });
    
    performance.progress = {
      lastMonth: oneMonthAgo ? current - oneMonthAgo.overall : 0,
      lastThreeMonths: threeMonthsAgo ? current - threeMonthsAgo.overall : 0
    };
  }
  
  return performance;
};

/**
 * Update performance after completing a training session
 * @param {string} userId - User ID
 * @param {string} sessionId - Session ID
 * @param {Object} feedback - Session feedback
 * @returns {Promise<Object>} - Updated performance data
 */
export const updatePerformanceFromTraining = async (userId, sessionId, feedback) => {
  // Simulate API request delay
  await new Promise(resolve => setTimeout(resolve, 600));
  
  let performance = mockPerformanceData.find(p => p.userId === userId);
  
  if (!performance) {
    performance = createDefaultPerformance(userId);
  }
  
  // Simulate performance improvements based on training
  // In a real app, this would be more sophisticated
  const improvements = {};
  
  // Find all unique skill areas in the feedback
  const skillAreas = feedback.drills.map(drill => drill.skill);
  
  // Apply small improvements to each practiced skill
  skillAreas.forEach(skill => {
    if (performance.metrics[skill]) {
      // 1-2 point improvement for each skill worked on
      const improvement = Math.floor(Math.random() * 2) + 1;
      improvements[skill] = improvement;
      
      // Apply improvement to all aspects of the skill
      Object.keys(performance.metrics[skill]).forEach(aspect => {
        if (aspect !== 'overall') {
          const currentValue = performance.metrics[skill][aspect];
          const newValue = Math.min(100, currentValue + improvement);
          performance.metrics[skill][aspect] = newValue;
        }
      });
      
      // Recalculate overall skill score
      const skillMetrics = performance.metrics[skill];
      const sum = Object.keys(skillMetrics).reduce((total, key) => {
        return key !== 'overall' ? total + skillMetrics[key] : total;
      }, 0);
      
      const count = Object.keys(skillMetrics).length - 1; // Exclude 'overall'
      performance.metrics[skill].overall = Math.round(sum / count);
    }
  });
  
  // Recalculate overall performance
  const overallSum = Object.keys(performance.metrics).reduce((total, key) => {
    return key !== 'overall' && typeof performance.metrics[key] === 'object'
      ? total + performance.metrics[key].overall
      : total;
  }, 0);
  
  const overallCount = Object.keys(performance.metrics).filter(
    key => key !== 'overall' && typeof performance.metrics[key] === 'object'
  ).length;
  
  performance.metrics.overall = Math.round(overallSum / overallCount);
  
  // Update strengths and improvement areas
  const areas = Object.keys(performance.metrics).filter(
    key => key !== 'overall' && typeof performance.metrics[key] === 'object'
  );
  
  const sortedAreas = [...areas].sort(
    (a, b) => performance.metrics[b].overall - performance.metrics[a].overall
  );
  
  performance.strengthAreas = sortedAreas.slice(0, 2);
  performance.improvementAreas = sortedAreas.slice(-2);
  
  // Update historical data
  // Similar logic as updatePerformanceFromAnalysis
  
  return {
    performance,
    improvements
  };
};

/**
 * Get benchmark data for comparison
 * @param {string} skillLevel - User skill level
 * @returns {Promise<Object>} - Benchmark data
 */
export const getBenchmarks = async (skillLevel) => {
  // Simulate API request delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  // Return benchmarks for the requested skill level
  return mockBenchmarks[skillLevel.toLowerCase()] || mockBenchmarks.intermediate;
};

/**
 * Generate insights based on performance data
 * @param {string} userId - User ID
 * @returns {Promise<Array>} - Array of insights
 */
export const generateInsights = async (userId) => {
  // Simulate API request delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  const performance = await getUserPerformance(userId);
  const history = await getHistoricalPerformance(userId, 3);
  
  const insights = [];
  
  // Generate insights based on strengths
  if (performance.strengthAreas.length > 0) {
    const topStrength = performance.strengthAreas[0];
    insights.push({
      type: 'strength',
      title: `Your ${topStrength} is your strongest skill`,
      description: `Your ${topStrength} technique is solid. Keep developing it as a weapon in your game.`,
      metric: performance.metrics[topStrength].overall,
      action: `Consider working on adding variations to your ${topStrength} to make it even more effective.`
    });
  }
  
  // Generate insights based on areas for improvement
  if (performance.improvementAreas.length > 0) {
    const topImprovement = performance.improvementAreas[0];
    insights.push({
      type: 'improvement',
      title: `Your ${topImprovement} needs attention`,
      description: `Focusing on improving your ${topImprovement} technique will have the biggest impact on your overall game.`,
      metric: performance.metrics[topImprovement].overall,
      action: `Schedule training sessions focused specifically on ${topImprovement} technique and consistency.`
    });
  }
  
  // Generate progress insights
  if (history.length >= 2) {
    const oldestRecord = history[0];
    const latestRecord = history[history.length - 1];
    const overallChange = latestRecord.overall - oldestRecord.overall;
    
    if (overallChange > 0) {
      insights.push({
        type: 'progress',
        title: `You've improved by ${overallChange} points in the last ${history.length - 1} months`,
        description: `Your consistent training is paying off with measurable improvement in your overall technique.`,
        metric: overallChange,
        action: 'Keep up the good work and consider increasing training frequency for even faster improvement.'
      });
    } else if (overallChange < 0) {
      insights.push({
        type: 'warning',
        title: `Your performance has decreased by ${Math.abs(overallChange)} points`,
        description: `You may need to reassess your training approach or consistency.`,
        metric: overallChange,
        action: 'Try increasing your practice frequency or focusing on fundamental techniques.'
      });
    }
    
    // Find most improved skill
    const skillChanges = {};
    Object.keys(oldestRecord).forEach(key => {
      if (key !== 'date' && key !== 'overall') {
        skillChanges[key] = latestRecord[key] - oldestRecord[key];
      }
    });
    
    const mostImprovedSkill = Object.keys(skillChanges).reduce((a, b) => 
      skillChanges[a] > skillChanges[b] ? a : b
    );
    
    if (skillChanges[mostImprovedSkill] > 0) {
      insights.push({
        type: 'improvement',
        title: `Your ${mostImprovedSkill} has improved the most`,
        description: `You've gained ${skillChanges[mostImprovedSkill]} points in your ${mostImprovedSkill} over the last ${history.length - 1} months.`,
        metric: skillChanges[mostImprovedSkill],
        action: `Continue to build on this momentum with focused ${mostImprovedSkill} training.`
      });
    }
  }
  
  return insights;
};
