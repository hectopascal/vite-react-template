import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import * as performanceService from '../../services/performanceService';

function PerformanceTracker() {
  const { currentUser } = useAuth();
  const [performanceData, setPerformanceData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedMetric, setSelectedMetric] = useState('overall');
  const [timeRange, setTimeRange] = useState('month');
  const [error, setError] = useState('');
  
  // Mock chart data - in a real app this would come from an actual charting library
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: []
  });

  useEffect(() => {
    const fetchPerformanceData = async () => {
      try {
        setLoading(true);
        const data = await performanceService.getUserPerformance('1'); // Using a fixed ID for demo
        setPerformanceData(data);
        generateChartData(data, selectedMetric, timeRange);
      } catch (err) {
        console.error("Error fetching performance data:", err);
        setError('Failed to load performance data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchPerformanceData();
  }, []);

  // Generate chart data based on performance data and selected options
  const generateChartData = (data, metricKey, range) => {
    if (!data || !data.history) return;
    
    // Filter data based on time range
    const now = new Date();
    const filteredData = data.history.filter(entry => {
      const entryDate = new Date(entry.date);
      if (range === 'week') {
        return entryDate >= new Date(now.setDate(now.getDate() - 7));
      } else if (range === 'month') {
        return entryDate >= new Date(now.setMonth(now.getMonth() - 1));
      } else if (range === 'year') {
        return entryDate >= new Date(now.setFullYear(now.getFullYear() - 1));
      }
      return true;
    });
    
    // Sort by date
    filteredData.sort((a, b) => new Date(a.date) - new Date(b.date));
    
    // Format dates for display
    const labels = filteredData.map(entry => {
      const date = new Date(entry.date);
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    });
    
    // Get values for the selected metric
    let values = [];
    if (metricKey === 'overall') {
      values = filteredData.map(entry => entry.overall);
    } else {
      // Extract specific stroke metrics
      values = filteredData.map(entry => {
        if (entry.skills && entry.skills[metricKey]) {
          return entry.skills[metricKey];
        }
        return null;
      }).filter(val => val !== null);
    }
    
    setChartData({
      labels,
      datasets: [{
        label: `${metricKey.charAt(0).toUpperCase() + metricKey.slice(1)} Progress`,
        data: values,
        backgroundColor: 'rgba(34, 197, 94, 0.2)',
        borderColor: 'rgb(34, 197, 94)',
        tension: 0.4
      }]
    });
  };

  // Handle metric change
  const handleMetricChange = (metric) => {
    setSelectedMetric(metric);
    if (performanceData) {
      generateChartData(performanceData, metric, timeRange);
    }
  };
  
  // Handle time range change
  const handleTimeRangeChange = (range) => {
    setTimeRange(range);
    if (performanceData) {
      generateChartData(performanceData, selectedMetric, range);
    }
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
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Performance Dashboard</h1>
      
      {!performanceData ? (
        <div className="bg-white shadow-md rounded-lg p-8 text-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          <h2 className="text-xl font-semibold mb-2">No performance data yet</h2>
          <p className="text-gray-500 mb-6">
            Complete training sessions and video analyses to start tracking your progress
          </p>
        </div>
      ) : (
        <>
          {/* Performance Summary */}
          <div className="bg-white shadow-md rounded-lg p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4">Overall Performance</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
              <div className="bg-green-50 rounded-lg p-4">
                <div className="text-sm text-gray-500 mb-1">Player Level</div>
                <div className="text-2xl font-bold">{performanceData.level}</div>
                <div className="text-sm text-green-600 mt-1">
                  {performanceData.improvement > 0 ? `+${performanceData.improvement} points this month` : 'Maintaining level'}
                </div>
              </div>
              
              <div className="bg-blue-50 rounded-lg p-4">
                <div className="text-sm text-gray-500 mb-1">Sessions Completed</div>
                <div className="text-2xl font-bold">{performanceData.sessionsCompleted}</div>
                <div className="text-sm text-blue-600 mt-1">
                  {performanceData.sessionsThisMonth} this month
                </div>
              </div>
              
              <div className="bg-purple-50 rounded-lg p-4">
                <div className="text-sm text-gray-500 mb-1">Videos Analyzed</div>
                <div className="text-2xl font-bold">{performanceData.videosAnalyzed}</div>
                <div className="text-sm text-purple-600 mt-1">
                  {performanceData.videosThisMonth} this month
                </div>
              </div>
              
              <div className="bg-yellow-50 rounded-lg p-4">
                <div className="text-sm text-gray-500 mb-1">Practice Hours</div>
                <div className="text-2xl font-bold">{performanceData.practiceHours}</div>
                <div className="text-sm text-yellow-600 mt-1">
                  {performanceData.hoursThisMonth} hours this month
                </div>
              </div>
            </div>
            
            <h3 className="font-medium mb-3">Skill Breakdown</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {performanceData.skills && Object.entries(performanceData.skills).map(([skill, value]) => (
                <div key={skill} className="flex flex-col">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm capitalize">{skill}</span>
                    <span className="text-sm font-medium">{value}/100</span>
                  </div>
                  <div className="h-2 w-full bg-gray-200 rounded-full">
                    <div 
                      className={`h-full rounded-full ${
                        value >= 80 ? 'bg-green-500' : 
                        value >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${value}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Tabs Navigation */}
          <div className="border-b border-gray-200 mb-6">
            <nav className="flex -mb-px">
              <button
                onClick={() => setActiveTab('overview')}
                className={`mr-8 py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'overview'
                    ? 'border-green-500 text-green-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Progress Overview
              </button>
              <button
                onClick={() => setActiveTab('insights')}
                className={`mr-8 py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'insights'
                    ? 'border-green-500 text-green-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Insights & Recommendations
              </button>
            </nav>
          </div>
          
          {/* Tab Content */}
          {activeTab === 'overview' && (
            <div>
              <div className="bg-white shadow-md rounded-lg p-6 mb-8">
                <div className="flex flex-wrap justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold mb-2 md:mb-0">Progress Tracking</h2>
                  
                  <div className="flex space-x-2">
                    <select
                      value={selectedMetric}
                      onChange={(e) => handleMetricChange(e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                    >
                      <option value="overall">Overall</option>
                      <option value="forehand">Forehand</option>
                      <option value="backhand">Backhand</option>
                      <option value="serve">Serve</option>
                      <option value="volley">Volley</option>
                      <option value="footwork">Footwork</option>
                    </select>
                    
                    <select
                      value={timeRange}
                      onChange={(e) => handleTimeRangeChange(e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                    >
                      <option value="week">Past Week</option>
                      <option value="month">Past Month</option>
                      <option value="year">Past Year</option>
                      <option value="all">All Time</option>
                    </select>
                  </div>
                </div>
                
                {/* Chart Placeholder - In a real app, this would be a real chart component */}
                <div className="bg-white border border-gray-200 rounded-lg p-4 h-64 flex items-center justify-center">
                  <div className="w-full h-full relative">
                    {/* Mock chart - would use a real chart library in production */}
                    <div className="absolute inset-0 flex items-end">
                      {chartData.labels.map((label, index) => {
                        const height = (chartData.datasets[0]?.data[index] / 100) * 80; // Scale to 80% of container height
                        return (
                          <div key={index} className="flex flex-col items-center flex-1">
                            <div 
                              className="w-4/5 bg-green-500 rounded-t-sm" 
                              style={{ height: `${height}%` }}
                            ></div>
                            <div className="text-xs mt-1 text-gray-500">{label}</div>
                          </div>
                        );
                      })}
                    </div>
                    
                    {/* Y-axis labels */}
                    <div className="absolute left-0 top-0 bottom-0 w-10 flex flex-col justify-between text-xs text-gray-500">
                      <div>100</div>
                      <div>75</div>
                      <div>50</div>
                      <div>25</div>
                      <div>0</div>
                    </div>
                  </div>
                </div>
                
                <div className="mt-4 text-sm text-gray-500 text-center">
                  Showing {selectedMetric} progress over the {timeRange === 'all' ? 'entire period' : `past ${timeRange}`}
                </div>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="bg-white shadow-md rounded-lg p-6">
                  <h3 className="font-semibold mb-4">Recent Achievements</h3>
                  
                  {performanceData.achievements && performanceData.achievements.length > 0 ? (
                    <div className="space-y-4">
                      {performanceData.achievements.slice(0, 3).map((achievement, index) => (
                        <div key={index} className="border-l-4 border-green-500 pl-4 py-1">
                          <div className="font-medium">{achievement.title}</div>
                          <div className="text-sm text-gray-500">{achievement.date}</div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-sm">No achievements yet. Complete more training sessions to unlock achievements.</p>
                  )}
                </div>
                
                <div className="bg-white shadow-md rounded-lg p-6">
                  <h3 className="font-semibold mb-4">Most Improved Skills</h3>
                  
                  {performanceData.improvements && performanceData.improvements.length > 0 ? (
                    <div className="space-y-4">
                      {performanceData.improvements.map((improvement, index) => (
                        <div key={index}>
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-sm capitalize">{improvement.skill}</span>
                            <span className="text-sm font-medium text-green-600">+{improvement.increase} pts</span>
                          </div>
                          <div className="h-2 w-full bg-gray-200 rounded-full">
                            <div 
                              className="h-full bg-green-500 rounded-full"
                              style={{ width: `${improvement.percentage}%` }}
                            ></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-sm">No significant improvements recorded yet. Keep practicing!</p>
                  )}
                </div>
                
                <div className="bg-white shadow-md rounded-lg p-6">
                  <h3 className="font-semibold mb-4">Recent Activity</h3>
                  
                  {performanceData.recentActivity && performanceData.recentActivity.length > 0 ? (
                    <div className="divide-y divide-gray-100">
                      {performanceData.recentActivity.map((activity, index) => (
                        <div key={index} className="py-3 flex items-start">
                          <div className={`rounded-full p-2 mr-3 ${
                            activity.type === 'training' ? 'bg-blue-100 text-blue-600' : 
                            activity.type === 'video' ? 'bg-purple-100 text-purple-600' :
                            'bg-green-100 text-green-600'
                          }`}>
                            {activity.type === 'training' ? (
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
                              </svg>
                            ) : activity.type === 'video' ? (
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
                              </svg>
                            ) : (
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                              </svg>
                            )}
                          </div>
                          <div>
                            <div className="text-sm">{activity.description}</div>
                            <div className="text-xs text-gray-500">{activity.date}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-sm">No recent activity. Start training or upload videos for analysis.</p>
                  )}
                </div>
              </div>
            </div>
          )}
          
          {activeTab === 'insights' && (
            <div>
              <div className="bg-white shadow-md rounded-lg p-6 mb-8">
                <h2 className="text-xl font-semibold mb-4">Personalized Insights</h2>
                
                <div className="space-y-6">
                  {performanceData.insights && performanceData.insights.map((insight, index) => (
                    <div key={index} className={`p-4 rounded-md border-l-4 ${
                      insight.type === 'strength' 
                        ? 'bg-green-50 border-green-500' 
                        : insight.type === 'weakness'
                        ? 'bg-orange-50 border-orange-500'
                        : 'bg-blue-50 border-blue-500'
                    }`}>
                      <h3 className="font-medium mb-2">{insight.title}</h3>
                      <p className="text-gray-700 mb-3">{insight.description}</p>
                      
                      {insight.actionItems && insight.actionItems.length > 0 && (
                        <div className="mt-3">
                          <h4 className="text-sm font-medium mb-2">Recommended Actions:</h4>
                          <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
                            {insight.actionItems.map((item, i) => (
                              <li key={i}>{item}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                <div className="bg-white shadow-md rounded-lg p-6">
                  <h2 className="text-xl font-semibold mb-4">Recommended Drills</h2>
                  
                  {performanceData.recommendedDrills && performanceData.recommendedDrills.length > 0 ? (
                    <div className="space-y-4">
                      {performanceData.recommendedDrills.map((drill, index) => (
                        <div key={index} className="border border-gray-200 rounded-lg p-4 hover:border-green-300 transition">
                          <div className="flex items-start justify-between">
                            <div>
                              <h3 className="font-medium">{drill.name}</h3>
                              <p className="text-sm text-gray-600 mt-1">{drill.description}</p>
                            </div>
                            <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 capitalize">
                              {drill.targetSkill}
                            </span>
                          </div>
                          
                          <div className="flex justify-between items-center mt-3 text-sm">
                            <span className="text-gray-500">{drill.duration} min • {drill.difficulty} level</span>
                            <a href={`/training/drill/${drill.drillId}`} className="text-green-600 hover:text-green-700 font-medium">
                              View Drill
                            </a>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500">No recommended drills at this time.</p>
                  )}
                </div>
                
                <div className="bg-white shadow-md rounded-lg p-6">
                  <h2 className="text-xl font-semibold mb-4">Areas for Improvement</h2>
                  
                  {performanceData.improvementAreas && (
                    <div className="space-y-6">
                      {Object.entries(performanceData.improvementAreas).map(([area, details]) => (
                        <div key={area}>
                          <div className="flex justify-between items-center mb-2">
                            <h3 className="font-medium capitalize">{area}</h3>
                            <div className="px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                              Priority: {details.priority}
                            </div>
                          </div>
                          
                          <p className="text-sm text-gray-600 mb-3">{details.description}</p>
                          
                          <div className="flex justify-between items-center">
                            <div className="flex items-center">
                              <div className="text-sm font-medium mr-2">Current:</div>
                              <div className="h-2 w-20 bg-gray-200 rounded-full">
                                <div 
                                  className="h-full bg-orange-500 rounded-full"
                                  style={{ width: `${details.currentLevel}%` }}
                                ></div>
                              </div>
                            </div>
                            
                            <a href={`/training/focus/${area}`} className="text-green-600 hover:text-green-700 text-sm font-medium">
                              Focus Training
                            </a>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              
              <div className="bg-white shadow-md rounded-lg p-6">
                <h2 className="text-xl font-semibold mb-4">Custom Training Plan</h2>
                
                {performanceData.trainingPlan ? (
                  <div>
                    <p className="text-gray-700 mb-4">{performanceData.trainingPlan.description}</p>
                    
                    <div className="border-t border-gray-200 pt-4 mt-4">
                      <h3 className="font-medium mb-3">Weekly Schedule</h3>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {performanceData.trainingPlan.schedule.map((day, index) => (
                          <div key={index} className="border rounded-lg p-3">
                            <div className="font-medium mb-2">{day.day}</div>
                            
                            {day.activities.map((activity, i) => (
                              <div key={i} className="mb-2 text-sm">
                                <div className="flex items-start">
                                  <div className={`rounded-full h-4 w-4 mt-0.5 mr-2 flex-shrink-0 ${
                                    activity.type === 'practice' ? 'bg-green-200' :
                                    activity.type === 'drill' ? 'bg-blue-200' :
                                    activity.type === 'rest' ? 'bg-gray-200' : 'bg-purple-200'
                                  }`}></div>
                                  <div>
                                    <div>{activity.name}</div>
                                    <div className="text-xs text-gray-500">{activity.duration} min</div>
                                  </div>
                                </div>
                              </div>
                            ))}
                            
                            {day.activities.length === 0 && (
                              <div className="text-sm text-gray-500">Rest day</div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="flex justify-center mt-6">
                      <button className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition">
                        Start This Week's Plan
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    <h3 className="font-medium mb-2">No Custom Plan Yet</h3>
                    <p className="text-gray-500 mb-4">Complete more training sessions and video analyses to receive a personalized training plan</p>
                    <button className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition">
                      Create Custom Plan
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default PerformanceTracker;