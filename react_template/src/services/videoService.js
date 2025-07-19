// Mock data and functions to simulate video service
// In a real application, these would make API calls to a backend server

// Sample videos data
const mockVideos = [
  {
    videoId: '1',
    userId: '1',
    title: 'Forehand Practice',
    description: 'Working on my forehand technique',
    uploadDate: '2023-03-15T00:00:00.000Z',
    duration: 63, // seconds
    fileSize: 24500000, // bytes
    fileUrl: 'https://example.com/videos/forehand.mp4',
    thumbnailUrl: 'https://example.com/thumbnails/forehand.jpg',
    processingStatus: 'completed',
  },
  {
    videoId: '2',
    userId: '1',
    title: 'Backhand Analysis',
    description: 'Need feedback on my backhand',
    uploadDate: '2023-03-20T00:00:00.000Z',
    duration: 45, // seconds
    fileSize: 18200000, // bytes
    fileUrl: 'https://example.com/videos/backhand.mp4',
    thumbnailUrl: 'https://example.com/thumbnails/backhand.jpg',
    processingStatus: 'completed',
  },
  {
    videoId: '3',
    userId: '2',
    title: 'Serve Practice',
    description: 'Improving my serve',
    uploadDate: '2023-03-18T00:00:00.000Z',
    duration: 75, // seconds
    fileSize: 30800000, // bytes
    fileUrl: 'https://example.com/videos/serve.mp4',
    thumbnailUrl: 'https://example.com/thumbnails/serve.jpg',
    processingStatus: 'completed',
  }
];

// Sample analysis data
const mockAnalyses = [
  {
    analysisId: '1',
    videoId: '1',
    completionDate: '2023-03-15T00:10:00.000Z',
    strokeType: 'forehand',
    technicalMetrics: {
      swingSpeed: 85, // km/h
      impactPoint: 'optimal',
      followThrough: 'good',
      footworkScore: 75,
      racketAngle: 'slightly open',
      swingPath: 'inside-out',
    },
    annotations: [
      {
        annotationId: '1-1',
        analysisId: '1',
        timestamp: 12.5,
        frameNumber: 375,
        type: 'technique',
        coordinates: { x: 0.65, y: 0.45 },
        description: 'Racket face is too open at contact',
      },
      {
        annotationId: '1-2',
        analysisId: '1',
        timestamp: 23.2,
        frameNumber: 696,
        type: 'footwork',
        coordinates: { x: 0.3, y: 0.8 },
        description: 'Not enough weight transfer to front foot',
      }
    ],
    feedback: [
      {
        feedbackId: '1-1',
        analysisId: '1',
        type: 'improvement',
        severity: 'medium',
        description: 'Your racket face is slightly open at contact point',
        actionableSteps: [
          'Focus on closing the racket face slightly at contact',
          'Practice with a continental grip to improve control'
        ],
        relatedResources: [{ resourceId: '1', type: 'drill', name: 'Forehand Contact Point Drill' }]
      },
      {
        feedbackId: '1-2',
        analysisId: '1',
        type: 'positive',
        severity: 'low',
        description: 'Good follow-through on your swing',
        actionableSteps: ['Continue to focus on complete follow-through'],
        relatedResources: []
      }
    ],
    confidenceScore: 0.85,
  },
  {
    analysisId: '2',
    videoId: '2',
    completionDate: '2023-03-20T00:08:00.000Z',
    strokeType: 'backhand',
    technicalMetrics: {
      swingSpeed: 72, // km/h
      impactPoint: 'late',
      followThrough: 'incomplete',
      footworkScore: 65,
      racketAngle: 'closed',
      swingPath: 'straight',
    },
    annotations: [
      {
        annotationId: '2-1',
        analysisId: '2',
        timestamp: 15.3,
        frameNumber: 459,
        type: 'technique',
        coordinates: { x: 0.55, y: 0.45 },
        description: 'Contact point is too late',
      }
    ],
    feedback: [
      {
        feedbackId: '2-1',
        analysisId: '2',
        type: 'improvement',
        severity: 'high',
        description: 'You\'re making contact with the ball too late',
        actionableSteps: [
          'Step into the ball earlier',
          'Begin your backswing sooner to prepare for the shot'
        ],
        relatedResources: [{ resourceId: '2', type: 'drill', name: 'Backhand Timing Drill' }]
      }
    ],
    confidenceScore: 0.78,
  }
];

/**
 * Get videos for a specific user
 * @param {string} userId - User ID
 * @returns {Promise<Array>} - List of videos
 */
export const getUserVideos = async (userId) => {
  // Simulate API request delay
  await new Promise(resolve => setTimeout(resolve, 700));
  
  // Filter videos by user ID
  return mockVideos.filter(video => video.userId === userId);
};

/**
 * Get video details by ID
 * @param {string} videoId - Video ID
 * @returns {Promise<Object>} - Video details
 */
export const getVideoById = async (videoId) => {
  // Simulate API request delay
  await new Promise(resolve => setTimeout(resolve, 400));
  
  // Find video by ID
  const video = mockVideos.find(v => v.videoId === videoId);
  
  if (!video) {
    throw new Error('Video not found');
  }
  
  return video;
};

/**
 * Upload a new video
 * @param {File} file - Video file
 * @param {Object} metadata - Video metadata
 * @returns {Promise<Object>} - Uploaded video details
 */
export const uploadVideo = async (file, metadata) => {
  // Simulate API request delay
  await new Promise(resolve => setTimeout(resolve, 1200));
  
  // Create a new video object
  const newVideo = {
    videoId: `${mockVideos.length + 1}`,
    userId: metadata.userId,
    title: metadata.title || 'Untitled Video',
    description: metadata.description || '',
    uploadDate: new Date().toISOString(),
    duration: Math.floor(Math.random() * 60) + 30, // Random between 30-90 seconds
    fileSize: file.size || Math.floor(Math.random() * 30000000) + 10000000, // Random file size if not provided
    fileUrl: URL.createObjectURL(file) || `https://example.com/videos/video${mockVideos.length + 1}.mp4`,
    thumbnailUrl: `https://example.com/thumbnails/thumbnail${mockVideos.length + 1}.jpg`,
    processingStatus: 'processing',
  };
  
  // Add to mock videos
  mockVideos.push(newVideo);
  
  // Simulate processing completion after some time
  setTimeout(() => {
    const index = mockVideos.findIndex(v => v.videoId === newVideo.videoId);
    if (index !== -1) {
      mockVideos[index].processingStatus = 'completed';
      
      // Generate mock analysis
      const newAnalysis = {
        analysisId: `${mockAnalyses.length + 1}`,
        videoId: newVideo.videoId,
        completionDate: new Date().toISOString(),
        strokeType: metadata.strokeType || ['forehand', 'backhand', 'serve', 'volley'][Math.floor(Math.random() * 4)],
        technicalMetrics: {
          swingSpeed: Math.floor(Math.random() * 30) + 60, // 60-90 km/h
          impactPoint: ['early', 'optimal', 'late'][Math.floor(Math.random() * 3)],
          followThrough: ['incomplete', 'good', 'excellent'][Math.floor(Math.random() * 3)],
          footworkScore: Math.floor(Math.random() * 40) + 60, // 60-100
          racketAngle: ['open', 'neutral', 'closed'][Math.floor(Math.random() * 3)],
          swingPath: ['inside-out', 'straight', 'inside-in'][Math.floor(Math.random() * 3)],
        },
        annotations: [],
        feedback: [],
        confidenceScore: Math.random() * 0.3 + 0.7, // 0.7-1.0
      };
      
      mockAnalyses.push(newAnalysis);
    }
  }, 3000);
  
  return newVideo;
};

/**
 * Get video analysis
 * @param {string} videoId - Video ID
 * @returns {Promise<Object>} - Analysis details
 */
export const getVideoAnalysis = async (videoId) => {
  // Simulate API request delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Check video status first
  const video = mockVideos.find(v => v.videoId === videoId);
  
  if (!video) {
    throw new Error('Video not found');
  }
  
  if (video.processingStatus !== 'completed') {
    throw new Error('Video analysis is not yet complete');
  }
  
  // Find analysis for the video
  const analysis = mockAnalyses.find(a => a.videoId === videoId);
  
  if (!analysis) {
    throw new Error('Analysis not found for this video');
  }
  
  return analysis;
};

/**
 * Delete a video
 * @param {string} videoId - Video ID
 * @returns {Promise<boolean>} - Success status
 */
export const deleteVideo = async (videoId) => {
  // Simulate API request delay
  await new Promise(resolve => setTimeout(resolve, 600));
  
  // Find video index
  const index = mockVideos.findIndex(v => v.videoId === videoId);
  
  if (index === -1) {
    throw new Error('Video not found');
  }
  
  // Remove video
  mockVideos.splice(index, 1);
  
  // Remove associated analysis
  const analysisIndex = mockAnalyses.findIndex(a => a.videoId === videoId);
  if (analysisIndex !== -1) {
    mockAnalyses.splice(analysisIndex, 1);
  }
  
  return true;
};