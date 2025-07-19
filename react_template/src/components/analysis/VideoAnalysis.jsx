import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useVideo } from '../../context/VideoContext';
import * as performanceService from '../../services/performanceService';

function VideoAnalysis() {
  const { videoId } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedAnnotation, setSelectedAnnotation] = useState(null);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [videoTime, setVideoTime] = useState(0);
  
  const {
    videos,
    currentVideo,
    videoAnalysis,
    loading,
    error,
    fetchUserVideos,
    getVideoDetails,
    getVideoAnalysis,
    deleteVideo
  } = useVideo();

  useEffect(() => {
    // If we don't have videos yet, fetch them
    if (!videos || videos.length === 0) {
      fetchUserVideos();
    }
    
    // If videoId is provided, fetch that specific video and its analysis
    if (videoId) {
      getVideoDetails(videoId)
        .then(() => getVideoAnalysis(videoId))
        .catch(err => console.error("Error fetching video data:", err));
    } else if (videos && videos.length > 0) {
      // If no videoId is provided, show list of videos
      // This code branch handles the /analysis/videos route (without a specific videoId)
    }
  }, [videoId, fetchUserVideos, getVideoDetails, getVideoAnalysis, videos]);

  // Handle video time update to highlight annotations
  const handleTimeUpdate = (e) => {
    setVideoTime(e.target.currentTime);
    
    // If we have annotations and analysis, highlight the current one
    if (videoAnalysis && videoAnalysis.annotations) {
      const currentAnnotation = videoAnalysis.annotations.find(
        a => Math.abs(a.timestamp - e.target.currentTime) < 0.5
      );
      
      if (currentAnnotation && (!selectedAnnotation || currentAnnotation.annotationId !== selectedAnnotation.annotationId)) {
        setSelectedAnnotation(currentAnnotation);
      } else if (!currentAnnotation && selectedAnnotation) {
        setSelectedAnnotation(null);
      }
    }
  };

  // Jump to specific timestamp in the video
  const jumpToTimestamp = (timestamp) => {
    const videoElement = document.getElementById('analysis-video');
    if (videoElement) {
      videoElement.currentTime = timestamp;
      videoElement.play();
    }
  };

  // Format seconds to MM:SS format
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Handle video deletion
  const handleDeleteVideo = async () => {
    if (window.confirm('Are you sure you want to delete this video? This action cannot be undone.')) {
      try {
        await deleteVideo(videoId);
        navigate('/analysis/videos');
      } catch (err) {
        console.error("Error deleting video:", err);
      }
    }
  };

  // Rendering for the videos list page
  if (!videoId || !currentVideo) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">My Videos</h1>
        
        {loading && (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
          </div>
        )}
        
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative mb-6">
            Error loading videos: {error}
          </div>
        )}
        
        {!loading && videos && videos.length === 0 && (
          <div className="bg-white shadow-md rounded-lg p-8 text-center">
            <div className="text-gray-500 mb-4">You haven't uploaded any videos yet</div>
            <Link 
              to="/analysis/upload" 
              className="inline-block px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
            >
              Upload your first video
            </Link>
          </div>
        )}
        
        {!loading && videos && videos.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {videos.map(video => (
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
            
            <Link 
              to="/analysis/upload"
              className="block border-2 border-dashed border-gray-300 rounded-lg h-full min-h-[200px] flex flex-col items-center justify-center p-6 text-center hover:border-green-400 hover:bg-green-50 transition"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              <span className="mt-2 text-gray-500">Upload New Video</span>
            </Link>
          </div>
        )}
      </div>
    );
  }

  // Rendering for video processing status
  if (currentVideo && currentVideo.processingStatus === 'processing') {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <h1 className="text-3xl font-bold mb-6">{currentVideo.title}</h1>
        <div className="bg-white shadow-md rounded-lg p-8">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-green-500 mx-auto mb-6"></div>
            <h2 className="text-xl font-semibold mb-2">Video Analysis in Progress</h2>
            <p className="text-gray-600 max-w-lg mx-auto">
              We're currently analyzing your tennis swing. This may take a few minutes. 
              Our AI is identifying key elements of your technique to provide personalized feedback.
            </p>
            <div className="mt-8">
              <Link 
                to="/analysis/videos" 
                className="inline-block px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition"
              >
                Back to Videos
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Rendering for when analysis failed or isn't available
  if (currentVideo && !videoAnalysis && !loading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <h1 className="text-3xl font-bold mb-6">{currentVideo.title}</h1>
        <div className="bg-white shadow-md rounded-lg p-8">
          <div className="text-center py-12">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-orange-500 mx-auto mb-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <h2 className="text-xl font-semibold mb-2">Analysis Not Available</h2>
            <p className="text-gray-600 max-w-lg mx-auto">
              We couldn't generate an analysis for this video. This may be due to an unclear view of the tennis swing
              or insufficient video quality for our AI to process accurately.
            </p>
            <div className="mt-8 space-x-4">
              <Link 
                to="/analysis/videos" 
                className="inline-block px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition"
              >
                Back to Videos
              </Link>
              <Link 
                to="/analysis/upload" 
                className="inline-block px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
              >
                Upload New Video
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
        </div>
      ) : (
        <>
          <div className="flex flex-wrap items-center justify-between mb-6">
            <h1 className="text-3xl font-bold">{currentVideo?.title}</h1>
            <div className="mt-2 sm:mt-0">
              <button 
                onClick={handleDeleteVideo}
                className="px-3 py-1 border border-red-300 text-red-600 rounded hover:bg-red-50 transition ml-2"
              >
                Delete Video
              </button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Video Player Column */}
            <div className="lg:col-span-2">
              <div className="bg-white shadow-md rounded-lg overflow-hidden">
                <div className="bg-black relative">
                  <video
                    id="analysis-video"
                    src={currentVideo?.fileUrl}
                    controls
                    className="w-full"
                    onTimeUpdate={handleTimeUpdate}
                  />
                  
                  {/* Annotation Overlay */}
                  {selectedAnnotation && (
                    <div 
                      className="absolute" 
                      style={{
                        left: `${selectedAnnotation.coordinates.x * 100}%`,
                        top: `${selectedAnnotation.coordinates.y * 100}%`,
                        transform: 'translate(-50%, -50%)'
                      }}
                    >
                      <div className="animate-ping absolute h-6 w-6 rounded-full bg-green-400 opacity-75"></div>
                      <div className="relative rounded-full h-6 w-6 bg-green-500 flex items-center justify-center">
                        <span className="text-white text-xs font-bold">{selectedAnnotation.annotationId.split('-')[1]}</span>
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="p-4">
                  <div className="flex items-center text-sm text-gray-500 mb-4">
                    <span className="mr-4">
                      <strong>Stroke Type:</strong> {videoAnalysis?.strokeType}
                    </span>
                    <span>
                      <strong>Uploaded:</strong> {new Date(currentVideo?.uploadDate).toLocaleDateString()}
                    </span>
                  </div>
                  
                  <p className="text-gray-700">{currentVideo?.description}</p>
                </div>
              </div>
              
              {/* Tabs Navigation */}
              <div className="mt-6 border-b border-gray-200">
                <nav className="flex -mb-px">
                  <button
                    onClick={() => setActiveTab('overview')}
                    className={`mr-8 py-4 px-1 border-b-2 font-medium text-sm ${
                      activeTab === 'overview'
                        ? 'border-green-500 text-green-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    Overview
                  </button>
                  <button
                    onClick={() => setActiveTab('annotations')}
                    className={`mr-8 py-4 px-1 border-b-2 font-medium text-sm ${
                      activeTab === 'annotations'
                        ? 'border-green-500 text-green-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    Annotations
                  </button>
                  <button
                    onClick={() => setActiveTab('feedback')}
                    className={`py-4 px-1 border-b-2 font-medium text-sm ${
                      activeTab === 'feedback'
                        ? 'border-green-500 text-green-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    Feedback & Drills
                  </button>
                </nav>
              </div>
              
              {/* Tab Content */}
              <div className="mt-6">
                {activeTab === 'overview' && videoAnalysis && (
                  <div className="bg-white shadow-md rounded-lg p-6">
                    <h2 className="text-xl font-semibold mb-4">Technical Analysis</h2>
                    
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {Object.entries(videoAnalysis.technicalMetrics).map(([key, value]) => (
                        <div key={key} className="bg-gray-50 p-3 rounded-md">
                          <div className="text-xs text-gray-500 uppercase">{key.replace(/([A-Z])/g, ' $1').trim()}</div>
                          <div className="font-semibold">
                            {typeof value === 'number' ? `${value}%` : value}
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <div className="mt-6">
                      <div className="flex justify-between items-center mb-2">
                        <h3 className="font-medium">Analysis Confidence</h3>
                        <span className="text-sm text-gray-500">{Math.round(videoAnalysis.confidenceScore * 100)}%</span>
                      </div>
                      <div className="h-2 w-full bg-gray-200 rounded-full">
                        <div 
                          className="h-full bg-green-500 rounded-full"
                          style={{ width: `${videoAnalysis.confidenceScore * 100}%` }}
                        ></div>
                      </div>
                      <p className="mt-2 text-sm text-gray-500">
                        This indicates how confident our AI is in the analysis results.
                      </p>
                    </div>
                  </div>
                )}
                
                {activeTab === 'annotations' && videoAnalysis && (
                  <div className="bg-white shadow-md rounded-lg p-6">
                    <h2 className="text-xl font-semibold mb-4">Video Annotations</h2>
                    
                    {videoAnalysis.annotations.length === 0 ? (
                      <p className="text-gray-500">No annotations were found for this video.</p>
                    ) : (
                      <div className="space-y-4">
                        {videoAnalysis.annotations.map((annotation) => (
                          <div 
                            key={annotation.annotationId}
                            className={`p-4 border rounded-md cursor-pointer transition ${
                              selectedAnnotation && selectedAnnotation.annotationId === annotation.annotationId
                                ? 'border-green-500 bg-green-50'
                                : 'border-gray-200 hover:bg-gray-50'
                            }`}
                            onClick={() => {
                              setSelectedAnnotation(annotation);
                              jumpToTimestamp(annotation.timestamp);
                            }}
                          >
                            <div className="flex justify-between">
                              <span className="font-medium text-sm">
                                {annotation.type.charAt(0).toUpperCase() + annotation.type.slice(1)} Annotation
                              </span>
                              <span className="text-sm text-gray-500">
                                {formatTime(annotation.timestamp)}
                              </span>
                            </div>
                            <p className="mt-2 text-gray-700">{annotation.description}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
                
                {activeTab === 'feedback' && videoAnalysis && (
                  <div className="bg-white shadow-md rounded-lg p-6">
                    <h2 className="text-xl font-semibold mb-4">Feedback & Recommendations</h2>
                    
                    {videoAnalysis.feedback.length === 0 ? (
                      <p className="text-gray-500">No specific feedback was generated for this video.</p>
                    ) : (
                      <div className="space-y-6">
                        {videoAnalysis.feedback.map((item) => (
                          <div 
                            key={item.feedbackId}
                            className={`p-4 rounded-md ${
                              item.type === 'improvement'
                                ? 'bg-blue-50 border-l-4 border-blue-400'
                                : 'bg-green-50 border-l-4 border-green-400'
                            }`}
                          >
                            <div className="flex justify-between items-start">
                              <h3 className="font-medium">
                                {item.type === 'improvement' ? 'Area for Improvement' : 'Positive Feedback'}
                              </h3>
                              {item.type === 'improvement' && (
                                <div className={`text-xs font-medium px-2 py-1 rounded-full ${
                                  item.severity === 'high' 
                                    ? 'bg-red-100 text-red-800'
                                    : item.severity === 'medium'
                                      ? 'bg-yellow-100 text-yellow-800'
                                      : 'bg-blue-100 text-blue-800'
                                }`}>
                                  {item.severity.charAt(0).toUpperCase() + item.severity.slice(1)} Priority
                                </div>
                              )}
                            </div>
                            
                            <p className="mt-2 text-gray-700">{item.description}</p>
                            
                            {item.actionableSteps && item.actionableSteps.length > 0 && (
                              <div className="mt-4">
                                <h4 className="text-sm font-medium mb-2">Action Steps:</h4>
                                <ul className="list-disc list-inside space-y-1 text-gray-600 text-sm pl-2">
                                  {item.actionableSteps.map((step, index) => (
                                    <li key={index}>{step}</li>
                                  ))}
                                </ul>
                              </div>
                            )}
                            
                            {item.relatedResources && item.relatedResources.length > 0 && (
                              <div className="mt-4">
                                <h4 className="text-sm font-medium mb-2">Recommended Drills:</h4>
                                <div className="space-y-2">
                                  {item.relatedResources.map((resource, index) => (
                                    <div key={index} className="flex items-center">
                                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                      </svg>
                                      <Link 
                                        to={`/training?drill=${resource.resourceId}`}
                                        className="text-sm text-green-600 hover:underline"
                                      >
                                        {resource.name}
                                      </Link>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
            
            {/* Sidebar Column */}
            <div>
              <div className="bg-white shadow-md rounded-lg p-6 mb-6">
                <h2 className="text-xl font-semibold mb-4">Performance Impact</h2>
                
                <p className="text-gray-600 mb-4">
                  This analysis will help improve the following areas of your tennis performance:
                </p>
                
                {videoAnalysis && (
                  <div className="space-y-4">
                    {videoAnalysis.strokeType === 'forehand' && (
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm font-medium">Forehand Technique</span>
                          <span className="text-xs text-gray-500">+3 points</span>
                        </div>
                        <div className="h-2 w-full bg-gray-200 rounded-full">
                          <div className="h-full bg-green-500 rounded-full" style={{ width: '75%' }}></div>
                        </div>
                      </div>
                    )}
                    
                    {videoAnalysis.strokeType === 'backhand' && (
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm font-medium">Backhand Technique</span>
                          <span className="text-xs text-gray-500">+2 points</span>
                        </div>
                        <div className="h-2 w-full bg-gray-200 rounded-full">
                          <div className="h-full bg-green-500 rounded-full" style={{ width: '60%' }}></div>
                        </div>
                      </div>
                    )}
                    
                    {videoAnalysis.strokeType === 'serve' && (
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm font-medium">Serve Technique</span>
                          <span className="text-xs text-gray-500">+4 points</span>
                        </div>
                        <div className="h-2 w-full bg-gray-200 rounded-full">
                          <div className="h-full bg-green-500 rounded-full" style={{ width: '70%' }}></div>
                        </div>
                      </div>
                    )}
                    
                    {videoAnalysis.strokeType === 'volley' && (
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm font-medium">Volley Technique</span>
                          <span className="text-xs text-gray-500">+3 points</span>
                        </div>
                        <div className="h-2 w-full bg-gray-200 rounded-full">
                          <div className="h-full bg-green-500 rounded-full" style={{ width: '65%' }}></div>
                        </div>
                      </div>
                    )}
                    
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm font-medium">Overall Technique</span>
                        <span className="text-xs text-gray-500">+2 points</span>
                      </div>
                      <div className="h-2 w-full bg-gray-200 rounded-full">
                        <div className="h-full bg-green-500 rounded-full" style={{ width: '68%' }}></div>
                      </div>
                    </div>
                  </div>
                )}
                
                <div className="mt-6">
                  <button 
                    onClick={() => performanceService.updatePerformanceFromAnalysis(
                      '1', 
                      { strokeType: videoAnalysis?.strokeType }
                    )}
                    className="w-full py-2 px-4 bg-green-600 text-white rounded hover:bg-green-700 transition"
                  >
                    Update Performance Profile
                  </button>
                </div>
              </div>
              
              <div className="bg-white shadow-md rounded-lg p-6">
                <h2 className="text-xl font-semibold mb-4">Next Steps</h2>
                
                <div className="space-y-4">
                  <Link 
                    to="/training"
                    className="flex items-center p-3 border border-gray-200 rounded-md hover:bg-gray-50 transition"
                  >
                    <div className="rounded-full bg-green-100 p-2 mr-3">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <div>
                      <div className="font-medium">Training Program</div>
                      <div className="text-sm text-gray-500">Get personalized training</div>
                    </div>
                  </Link>
                  
                  <Link 
                    to="/analysis/upload"
                    className="flex items-center p-3 border border-gray-200 rounded-md hover:bg-gray-50 transition"
                  >
                    <div className="rounded-full bg-blue-100 p-2 mr-3">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                      </svg>
                    </div>
                    <div>
                      <div className="font-medium">Upload Another Video</div>
                      <div className="text-sm text-gray-500">Continue improving</div>
                    </div>
                  </Link>
                  
                  <Link 
                    to="/performance"
                    className="flex items-center p-3 border border-gray-200 rounded-md hover:bg-gray-50 transition"
                  >
                    <div className="rounded-full bg-purple-100 p-2 mr-3">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                    </div>
                    <div>
                      <div className="font-medium">Track Progress</div>
                      <div className="text-sm text-gray-500">View performance metrics</div>
                    </div>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default VideoAnalysis;