import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

// Import mock service for performance data
import { getUserPerformance } from '../../services/performanceService';

function PerformanceTracker() {
  const [performance, setPerformance] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    async function loadPerformanceData() {
      try {
        setLoading(true);
        const data = await getUserPerformance('1'); // Using static ID for demo
        setPerformance(data);
      } catch (error) {
        console.error('Error loading performance data:', error);
      } finally {
        setLoading(false);
      }
    }

    loadPerformanceData();
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-10">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
        </div>
      </div>
    );
  }

  if (!performance) {
    return (
      <div className="container mx-auto px-4 py-10">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold text-gray-800">No performance data available</h2>
          <p className="mt-2 text-gray-600">Start tracking your progress by completing training sessions or uploading swing videos.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-2">Performance Dashboard</h1>
      <p className="text-gray-600 mb-6">Track your progress and see how your skills are improving over time.</p>

      {/* Top Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-lg shadow-md p-4 border-l-4 border-green-500">
          <div className="text-sm font-medium text-gray-500">Overall Performance</div>
          <div className="mt-1 flex items-baseline">
            <div className="text-3xl font-semibold text-gray-900">{performance.overall}</div>
            <div className="ml-2 text-sm font-medium text-green-600">
              +{performance.improvement}%
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-4 border-l-4 border-blue-500">
          <div className="text-sm font-medium text-gray-500">Sessions Completed</div>
          <div className="mt-1 flex items-baseline">
            <div className="text-3xl font-semibold text-gray-900">{performance.sessionsCompleted}</div>
            <div className="ml-2 text-sm font-medium text-blue-600">
              {performance.sessionsThisMonth} this month
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-4 border-l-4 border-purple-500">
          <div className="text-sm font-medium text-gray-500">Videos Analyzed</div>
          <div className="mt-1 flex items-baseline">
            <div className="text-3xl font-semibold text-gray-900">{performance.videosAnalyzed}</div>
            <div className="ml-2 text-sm font-medium text-purple-600">
              {performance.videosThisMonth} this month
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-4 border-l-4 border-orange-500">
          <div className="text-sm font-medium text-gray-500">Practice Hours</div>
          <div className="mt-1 flex items-baseline">
            <div className="text-3xl font-semibold text-gray-900">{performance.practiceHours}</div>
            <div className="ml-2 text-sm font-medium text-orange-600">
              {performance.hoursThisMonth} this month
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('overview')}
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'overview'
                ? 'border-green-500 text-green-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('skills')}
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'skills'
                ? 'border-green-500 text-green-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Skills Analysis
          </button>
          <button
            onClick={() => setActiveTab('insights')}
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'insights'
                ? 'border-green-500 text-green-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Insights
          </button>
          <button
            onClick={() => setActiveTab('achievements')}
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'achievements'
                ? 'border-green-500 text-green-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Achievements
          </button>
          <button
            onClick={() => setActiveTab('plan')}
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'plan'
                ? 'border-green-500 text-green-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Training Plan
          </button>
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-800">Progress Over Time</h2>
                <Link to="/performance/progress" className="text-green-600 hover:text-green-800 text-sm font-medium">
                  View details
                </Link>
              </div>
              <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
                {/* We'd put our chart component here */}
                <div className="text-center">
                  <div className="flex items-center justify-center space-x-2 mb-2">
                    {performance.history.map((entry, index) => (
                      <div key={index} className="flex flex-col items-center">
                        <div 
                          className="bg-green-500" 
                          style={{
                            width: '20px', 
                            height: `${entry.overall}px`,
                            maxHeight: '100px',
                            minHeight: '20px'
                          }}
                        ></div>
                        <div className="text-xs mt-1">{entry.date.split('-')[1]}</div>
                      </div>
                    ))}
                  </div>
                  <p className="text-sm text-gray-500">Interactive chart available in full view</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Top Improvements</h2>
              <div className="space-y-4">
                {performance.improvements.map((item, index) => (
                  <div key={index} className="flex items-center">
                    <div className="w-1/3">
                      <div className="text-md font-medium capitalize">{item.skill}</div>
                    </div>
                    <div className="w-2/3">
                      <div className="relative">
                        <div className="overflow-hidden h-4 text-xs flex rounded bg-gray-100">
                          <div
                            style={{ width: `${item.percentage}%` }}
                            className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-green-500"
                          ></div>
                        </div>
                        <div className="text-xs text-gray-600 mt-1">+{item.increase} points</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div>
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Recent Activity</h2>
              <div className="space-y-4">
                {performance.recentActivity.map((activity, index) => (
                  <div key={index} className="border-l-2 border-gray-200 pl-4">
                    <div className="flex items-start">
                      <div className={`
                        flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center
                        ${activity.type === 'training' ? 'bg-blue-100 text-blue-600' : 
                          activity.type === 'video' ? 'bg-purple-100 text-purple-600' : 
                          'bg-green-100 text-green-600'}
                      `}>
                        {activity.type === 'training' ? (
                          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                          </svg>
                        ) : activity.type === 'video' ? (
                          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                          </svg>
                        ) : (
                          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                          </svg>
                        )}
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-gray-900">{activity.description}</p>
                        <p className="text-xs text-gray-500">{activity.date}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Recommended Drills</h2>
              <div className="space-y-4">
                {performance.recommendedDrills.map((drill, index) => (
                  <div key={index} className="border-l-2 border-green-500 pl-4">
                    <h3 className="text-md font-medium">{drill.name}</h3>
                    <p className="text-sm text-gray-600 mb-1">{drill.description}</p>
                    <div className="flex items-center text-xs text-gray-500">
                      <span className="bg-green-100 text-green-800 font-medium px-2 py-0.5 rounded mr-2">
                        {drill.targetSkill}
                      </span>
                      <span>{drill.duration} min</span>
                      <span className="mx-2">•</span>
                      <span className="capitalize">{drill.difficulty}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'skills' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Skill Breakdown</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {Object.entries(performance.skills).map(([skill, value], index) => (
                  <div key={index} className="flex items-center">
                    <div className="w-1/3">
                      <div className="text-sm font-medium capitalize">{skill}</div>
                    </div>
                    <div className="w-2/3">
                      <div className="relative">
                        <div className="overflow-hidden h-4 text-xs flex rounded bg-gray-100">
                          <div
                            style={{ width: `${value}%` }}
                            className={`shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center ${
                              value >= 80 ? 'bg-green-500' :
                              value >= 70 ? 'bg-green-400' :
                              value >= 60 ? 'bg-yellow-500' :
                              'bg-orange-500'
                            }`}
                          ></div>
                        </div>
                        <div className="text-xs text-gray-600 mt-1">{value}/100</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div>
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Priority Areas</h2>
              <div className="space-y-4">
                {Object.entries(performance.improvementAreas).map(([skill, data], index) => (
                  <div key={index} className="border-l-2 border-orange-500 pl-4">
                    <div className="flex justify-between">
                      <h3 className="text-md font-medium capitalize">{skill}</h3>
                      <span className={`text-xs font-medium px-2 py-1 rounded ${
                        data.priority === 'High' ? 'bg-red-100 text-red-800' :
                        data.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>{data.priority}</span>
                    </div>
                    <div className="mt-2 mb-2">
                      <div className="relative">
                        <div className="overflow-hidden h-2 text-xs flex rounded bg-gray-100">
                          <div
                            style={{ width: `${(data.currentLevel / data.targetLevel) * 100}%` }}
                            className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-orange-500"
                          ></div>
                        </div>
                        <div className="flex justify-between text-xs text-gray-600 mt-1">
                          <span>Current: {data.currentLevel}</span>
                          <span>Target: {data.targetLevel}</span>
                        </div>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600">{data.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'insights' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {performance.insights.map((insight, index) => (
            <div 
              key={index} 
              className={`bg-white rounded-lg shadow-md p-6 border-l-4 ${
                insight.type === 'strength' ? 'border-green-500' :
                insight.type === 'weakness' ? 'border-orange-500' :
                'border-blue-500'
              }`}
            >
              <div className="flex items-center mb-3">
                <div className={`
                  flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center
                  ${insight.type === 'strength' ? 'bg-green-100 text-green-600' : 
                    insight.type === 'weakness' ? 'bg-orange-100 text-orange-600' : 
                    'bg-blue-100 text-blue-600'}
                `}>
                  {insight.type === 'strength' ? (
                    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  ) : insight.type === 'weakness' ? (
                    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  ) : (
                    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                  )}
                </div>
                <h3 className="ml-3 text-lg font-semibold text-gray-900">{insight.title}</h3>
              </div>
              <p className="text-gray-600 mb-3">{insight.description}</p>
              <div className="mt-2">
                <h4 className="text-sm font-medium text-gray-900 mb-2">Action Items:</h4>
                <ul className="list-disc pl-5 space-y-1">
                  {insight.actionItems.map((item, i) => (
                    <li key={i} className="text-sm text-gray-600">{item}</li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'achievements' && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-6">Your Achievements</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {performance.achievements.map((achievement, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4 bg-white shadow-sm hover:shadow transition">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-green-100 text-green-600 mb-4 mx-auto">
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 text-center mb-2">{achievement.title}</h3>
                <p className="text-sm text-gray-600 text-center mb-3">{achievement.description}</p>
                <div className="text-xs text-gray-500 text-center">{achievement.date}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'plan' && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Weekly Training Plan</h2>
          <p className="text-gray-600 mb-6">{performance.trainingPlan.description}</p>
          
          <div className="space-y-6">
            {performance.trainingPlan.schedule.map((day, index) => (
              <div key={index} className="border-b border-gray-200 pb-4 last:border-b-0 last:pb-0">
                <h3 className="text-lg font-medium text-gray-900 mb-3">{day.day}</h3>
                {day.activities.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {day.activities.map((activity, i) => (
                      <div key={i} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                        <div className="flex items-center">
                          <div className={`
                            h-10 w-10 rounded-full flex items-center justify-center
                            ${activity.type === 'drill' ? 'bg-green-100 text-green-600' : 
                              activity.type === 'practice' ? 'bg-blue-100 text-blue-600' : 
                              'bg-purple-100 text-purple-600'}
                          `}>
                            {activity.type === 'drill' ? (
                              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                              </svg>
                            ) : activity.type === 'practice' ? (
                              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
                              </svg>
                            ) : (
                              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                              </svg>
                            )}
                          </div>
                          <div className="ml-4">
                            <h4 className="font-medium text-gray-900">{activity.name}</h4>
                            <p className="text-sm text-gray-600">{activity.duration} minutes</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 italic">Rest day</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default PerformanceTracker;