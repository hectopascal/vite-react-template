import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';

// Create the video context
const VideoContext = createContext(null);

// Custom hook to use the video context
export const useVideo = () => {
  const context = useContext(VideoContext);
  if (context === null) {
    throw new Error('useVideo must be used within a VideoProvider');
  }
  return context;
};

// Video provider component
export const VideoProvider = ({ children }) => {
  const { currentUser } = useAuth();
  const [videos, setVideos] = useState([]);
  const [currentVideo, setCurrentVideo] = useState(null);
  const [analysisResults, setAnalysisResults] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Load saved videos from localStorage
  useEffect(() => {
    if (currentUser?.id) {
      loadVideos(currentUser.id);
    }
  }, [currentUser]);

  // Load videos for a user
  const loadVideos = useCallback((userId) => {
    try {
      setLoading(true);
      const storedVideos = localStorage.getItem(`videos_${userId}`);
      
      if (storedVideos) {
        setVideos(JSON.parse(storedVideos));
      } else {
        // Initialize with empty array if no videos exist
        setVideos([]);
        localStorage.setItem(`videos_${userId}`, JSON.stringify([]));
      }
    } catch (err) {
      console.error('Error loading videos:', err);
      setError('Failed to load videos');
    } finally {
      setLoading(false);
    }
  }, []);

  // Upload a new video
  const uploadVideo = useCallback(async (videoFile, metadata) => {
    try {
      if (!currentUser?.id) throw new Error('User not authenticated');
      
      setLoading(true);
      setError('');
      
      // In a real app, this would upload to a server
      // For demo, we'll store metadata and a fake URL locally
      
      // Generate a unique ID
      const videoId = `video_${Date.now()}`;
      
      // Create a blob URL for the file (this is temporary and will be lost on page refresh)
      // In a real app, you would upload the file to a server
      const videoUrl = URL.createObjectURL(videoFile);
      
      const newVideo = {
        id: videoId,
        userId: currentUser.id,
        title: metadata.title || 'Untitled Video',
        description: metadata.description || '',
        type: metadata.type || 'forehand',
        date: new Date().toISOString(),
        url: videoUrl,
        thumbnail: '', // Would be generated on a server
        duration: metadata.duration || '00:00',
        analyzed: false
      };
      
      // Update state and localStorage
      const updatedVideos = [...videos, newVideo];
      setVideos(updatedVideos);
      localStorage.setItem(`videos_${currentUser.id}`, JSON.stringify(updatedVideos));
      
      return newVideo;
    } catch (err) {
      console.error('Video upload error:', err);
      setError(err.message || 'Failed to upload video');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [currentUser, videos]);

  // Analyze a video
  const analyzeVideo = useCallback(async (videoId) => {
    try {
      if (!currentUser?.id) throw new Error('User not authenticated');
      
      setLoading(true);
      setError('');
      
      const videoToAnalyze = videos.find(v => v.id === videoId);
      if (!videoToAnalyze) throw new Error('Video not found');
      
      // In a real app, this would call an AI analysis service
      // For demo, we'll generate mock analysis results after a delay
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const mockAnalysisResult = generateMockAnalysisResult(videoToAnalyze.type);
      
      // Update video to mark as analyzed
      const updatedVideos = videos.map(v => {
        if (v.id === videoId) {
          return { ...v, analyzed: true };
        }
        return v;
      });
      
      // Store analysis results
      const updatedResults = {
        ...analysisResults,
        [videoId]: mockAnalysisResult
      };
      
      // Update state
      setVideos(updatedVideos);
      setAnalysisResults(updatedResults);
      
      // Update localStorage
      localStorage.setItem(`videos_${currentUser.id}`, JSON.stringify(updatedVideos));
      localStorage.setItem(`analysis_${currentUser.id}`, JSON.stringify(updatedResults));
      
      return mockAnalysisResult;
    } catch (err) {
      console.error('Video analysis error:', err);
      setError(err.message || 'Failed to analyze video');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [currentUser, videos, analysisResults]);

  // Get analysis results for a video
  const getAnalysisResult = useCallback((videoId) => {
    return analysisResults[videoId] || null;
  }, [analysisResults]);

  // Delete a video
  const deleteVideo = useCallback((videoId) => {
    try {
      if (!currentUser?.id) throw new Error('User not authenticated');
      
      // Remove from videos array
      const updatedVideos = videos.filter(v => v.id !== videoId);
      setVideos(updatedVideos);
      
      // Remove from analysis results
      const updatedResults = { ...analysisResults };
      delete updatedResults[videoId];
      setAnalysisResults(updatedResults);
      
      // Update localStorage
      localStorage.setItem(`videos_${currentUser.id}`, JSON.stringify(updatedVideos));
      localStorage.setItem(`analysis_${currentUser.id}`, JSON.stringify(updatedResults));
      
      return true;
    } catch (err) {
      console.error('Video delete error:', err);
      setError(err.message || 'Failed to delete video');
      throw err;
    }
  }, [currentUser, videos, analysisResults]);

  // Helper function to generate mock analysis results
  const generateMockAnalysisResult = (strokeType) => {
    // Random score between 60-95
    const overallScore = Math.floor(Math.random() * 36) + 60;
    
    // Generate feedback based on stroke type
    let feedback, recommendations;
    
    switch (strokeType) {
      case 'forehand':
        feedback = [
          'Good follow-through on your forehand stroke',
          'Your grip appears to be continental, consider adjusting to semi-western for more topspin',
          'Hip rotation is adequate but could be improved for more power'
        ];
        recommendations = [
          'Focus on keeping your wrist firm through contact',
          'Practice stepping into the ball more aggressively',
          'Work on generating more topspin by brushing up on the ball'
        ];
        break;
      case 'backhand':
        feedback = [
          'Your two-handed backhand has a stable base',
          'Follow-through is stopping short of the optimal position',
          'Weight transfer is happening but timing could be improved'
        ];
        recommendations = [
          'Complete your follow-through by finishing over your shoulder',
          'Focus on transferring weight from back foot to front foot',
          'Practice taking the racket back earlier in your preparation'
        ];
        break;
      case 'serve':
        feedback = [
          'Ball toss is consistent and well-positioned',
          'Knee bend could be deeper to generate more upward force',
          'Racket path shows good pronation through contact'
        ];
        recommendations = [
          'Work on explosive leg drive to add power to your serve',
          'Practice the trophy position with proper shoulder alignment',
          'Focus on full extension to maximize your reach'
        ];
        break;
      case 'volley':
        feedback = [
          'Good stable platform when hitting volleys',
          'Wrist appears to be too loose during contact',
          'Positioning relative to the net needs adjustment'
        ];
        recommendations = [
          'Keep your wrist firm for more controlled volleys',
          'Work on split-step timing as the ball crosses the net',
          'Practice punch volleys rather than swinging volleys'
        ];
        break;
      default:
        feedback = [
          'Your technique shows consistent form',
          'Body positioning could be improved for better balance',
          'Racket preparation is timely but could be more precise'
        ];
        recommendations = [
          'Focus on footwork to improve positioning before each shot',
          'Work on maintaining balance throughout your stroke',
          'Practice consistency drills to improve shot reliability'
        ];
    }
    
    // Create metrics based on stroke type
    const metrics = {
      technique: Math.floor(Math.random() * 36) + 60,
      power: Math.floor(Math.random() * 36) + 60,
      accuracy: Math.floor(Math.random() * 36) + 60,
      footwork: Math.floor(Math.random() * 36) + 60,
      balance: Math.floor(Math.random() * 36) + 60,
    };
    
    // Add stroke-specific metrics
    if (strokeType === 'serve') {
      metrics.ballToss = Math.floor(Math.random() * 36) + 60;
      metrics.pronation = Math.floor(Math.random() * 36) + 60;
    } else if (strokeType === 'forehand' || strokeType === 'backhand') {
      metrics.followThrough = Math.floor(Math.random() * 36) + 60;
      metrics.preparation = Math.floor(Math.random() * 36) + 60;
    }
    
    return {
      date: new Date().toISOString(),
      overallScore,
      strokeType,
      feedback,
      recommendations,
      metrics,
      keyFrames: [
        { timeCode: '00:03', description: 'Preparation phase', score: Math.floor(Math.random() * 36) + 60 },
        { timeCode: '00:05', description: 'Backswing position', score: Math.floor(Math.random() * 36) + 60 },
        { timeCode: '00:07', description: 'Contact point', score: Math.floor(Math.random() * 36) + 60 },
        { timeCode: '00:09', description: 'Follow-through', score: Math.floor(Math.random() * 36) + 60 }
      ]
    };
  };

  const value = {
    videos,
    currentVideo,
    setCurrentVideo,
    loading,
    error,
    uploadVideo,
    analyzeVideo,
    getAnalysisResult,
    deleteVideo
  };

  return <VideoContext.Provider value={value}>{children}</VideoContext.Provider>;
};