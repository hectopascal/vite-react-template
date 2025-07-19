import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useVideo } from '../../context/VideoContext';
import { useTraining } from '../../context/TrainingContext';
import * as performanceService from '../../services/performanceService';

function Dashboard() {
  const { currentUser } = useAuth();
  const { videos, fetchUserVideos } = useVideo();
  const { programs, fetchUserPrograms } = useTraining();
  const [performance, setPerformance] = useState(null);
  const [insights, setInsights] = useState([]);
  const [upcomingSessions, setUpcomingSessions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        // Fetch videos, training programs, and performance data
        await fetchUserVideos();
        await fetchUserPrograms();
        
        if (currentUser) {
          const userPerformance = await performanceService.getUserPerformance(currentUser.userId);
          setPerformance(userPerformance);
          
          const userInsights = await performanceService.generateInsights(currentUser.userId);
          setInsights(userInsights);
        }
        
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [currentUser, fetchUserVideos, fetchUserPrograms]);

  useEffect(() => {
    if (programs && programs.length > 0) {
      // Find upcoming sessions
      const now = new Date();
      const upcoming = [];
      
      programs.forEach(program => {
        program.sessions.forEach(session => {
          if (session.completionStatus === 'scheduled') {
            const sessionDate = new Date(session.scheduledDate);
            if (sessionDate >= now) {
              upcoming.push({
                ...session,
                programName: program.name || `Training Program ${program.programId}`
              });
            }
          }
        });
      });
      
      // Sort by date
      upcoming.sort((a, b) => new Date(a.scheduledDate) - new Date(b.scheduledDate));
      
      setUpcomingSessions(upcoming.slice(0, 3)); // Get nearest 3 sessions
    }
  }, [programs]);

  const formatDate = (dateString) => {
    const options = { weekday: 'short', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Welcome, {currentUser?.name || 'Tennis Player'}</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Performance Summary */}
        <div className="bg-white shadow-md rounded-lg p-6 col-span-2">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Performance Summary</h2>
            <Link to="/performance" className="text-green-600 text-sm hover:text-green-800">
              View Details
            </Link>
          </div>
          
          {performance ? (
            <div className="space-y-6">
              <div className="flex items-center justify-center mb-4">
                <div className="relative w-32 h-32">
                  <svg viewBox="0 0 36 36" className="w-32 h-32 transform -rotate-90">
                    <path
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="#E5E7EB"
                      strokeWidth="3"
                    />
                    <path
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="#10B981"
                      strokeWidth="3"
                      strokeDasharray={`${performance.metrics.overall}, 100`}
                    />
                  </svg>
                  <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-3xl font-bold">{performance.metrics.overall}</div>
                      <div className="text-xs text-gray-500">OVERALL</div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                {Object.keys(performance.metrics).filter(key => key !== 'overall').map(skill => (
                  <div key={skill} className="bg-gray-50 rounded-lg p-3 text-center">
                    <div className="text-lg font-semibold">{performance.metrics[skill].overall}</div>
                    <div className="text-xs text-gray-500 uppercase">{skill}</div>
                  </div>
                ))}
              </div>
              
              {insights.length > 0 && (
                <div className="border-t border-gray-200 pt-4 mt-4">
                  <h3 className="text-md font-medium mb-3">Insights</h3>
                  <div className="space-y-3">
                    {insights.map((insight, index) => (
                      <div key={index} className={`p-3 rounded-lg ${
                        insight.type === 'strength' ? 'bg-green-50 border-l-4 border-green-400' : 
                        insight.type === 'improvement' ? 'bg-blue-50 border-l-4 border-blue-400' :
                        insight.type === 'progress' ? 'bg-purple-50 border-l-4 border-purple-400' :
                        'bg-yellow-50 border-l-4 border-yellow-400'
                      }`}>
                        <div className="font-medium">{insight.title}</div>
                        <div className="text-sm text-gray-600">{insight.description}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              No performance data available yet. Upload videos for analysis to start tracking your progress.
            </div>
          )}
        </div>

        {/* Upcoming Training Sessions */}
        <div className="bg-white shadow-md rounded-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Upcoming Sessions</h2>
            <Link to="/training" className="text-green-600 text-sm hover:text-green-800">
              View All
            </Link>
          </div>
          
          {upcomingSessions.length > 0 ? (
            <div className="space-y-4">
              {upcomingSessions.map(session => (
                <Link 
                  key={session.sessionId}
                  to={`/training/session/${session.sessionId}`}
                  className="block bg-gray-50 p-4 rounded-lg hover:bg-gray-100 transition"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium">{session.name}</h3>
                      <p className="text-sm text-gray-600">{session.description}</p>
                      <div className="flex items-center mt-1 text-sm">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {session.duration} min
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="bg-green-100 px-2 py-1 rounded text-xs text-green-800 font-medium">
                        {formatDate(session.scheduledDate)}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
              
              <Link to="/training" className="block text-center text-green-600 hover:text-green-800 mt-4">
                Schedule more sessions
              </Link>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              No upcoming sessions. 
              <Link to="/training" className="block text-green-600 hover:text-green-800 mt-2">
                Create a training program
              </Link>
            </div>
          )}
        </div>
      </div>
      
      {/* Recent Videos Section */}
      <div className="mt-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Recent Videos</h2>
          <Link to="/analysis/upload" className="text-green-600 text-sm hover:text-green-800">
            Upload New
          </Link>
        </div>
        
        {videos && videos.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {videos.slice(0, 3).map(video => (
              <Link 
                key={video.videoId} 
                to={`/analysis/videos/${video.videoId}`}
                className="block bg-white shadow-md rounded-lg overflow-hidden hover:shadow-lg transition"
              >
                <div className="bg-gray-200 h-48 relative">
                  {video.processingStatus === 'processing' && (
                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center text-white">
                      <div className="text-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-white inline-block mb-2"></div>
                        <div>Processing...</div>
                      </div>
                    </div>
                  )}
                  {video.thumbnailUrl && (
                    <img 
                      src={video.thumbnailUrl} 
                      alt={video.title} 
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-medium line-clamp-1">{video.title}</h3>
                  <p className="text-sm text-gray-500 line-clamp-2 mt-1">{video.description}</p>
                  <div className="flex justify-between items-center mt-2 text-xs text-gray-500">
                    <span>{new Date(video.uploadDate).toLocaleDateString()}</span>
                    <span>{Math.floor(video.duration / 60)}:{String(video.duration % 60).padStart(2, '0')}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="bg-white shadow-md rounded-lg p-8 text-center">
            <div className="text-gray-500 mb-4">No videos uploaded yet</div>
            <Link 
              to="/analysis/upload" 
              className="inline-block px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
            >
              Upload your first video
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;