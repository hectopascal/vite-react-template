import { createContext, useState, useContext } from 'react';
import * as videoService from '../services/videoService';
import { useAuth } from './AuthContext';

const VideoContext = createContext();

export const useVideo = () => {
  return useContext(VideoContext);
};

export const VideoProvider = ({ children }) => {
  const [videos, setVideos] = useState([]);
  const [currentVideo, setCurrentVideo] = useState(null);
  const [videoAnalysis, setVideoAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { currentUser } = useAuth();

  const fetchUserVideos = async () => {
    if (!currentUser) return;
    
    try {
      setLoading(true);
      setError(null);
      const fetchedVideos = await videoService.getUserVideos(currentUser.userId);
      setVideos(fetchedVideos);
    } catch (err) {
      setError('Failed to fetch videos');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const uploadVideo = async (file, metadata) => {
    if (!currentUser) return;
    
    try {
      setLoading(true);
      setError(null);
      const newVideo = await videoService.uploadVideo(file, {
        ...metadata,
        userId: currentUser.userId
      });
      setVideos((prevVideos) => [...prevVideos, newVideo]);
      return newVideo;
    } catch (err) {
      setError('Failed to upload video');
      console.error(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getVideoDetails = async (videoId) => {
    try {
      setLoading(true);
      setError(null);
      const video = await videoService.getVideoById(videoId);
      setCurrentVideo(video);
      return video;
    } catch (err) {
      setError('Failed to fetch video details');
      console.error(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getVideoAnalysis = async (videoId) => {
    try {
      setLoading(true);
      setError(null);
      const analysis = await videoService.getVideoAnalysis(videoId);
      setVideoAnalysis(analysis);
      return analysis;
    } catch (err) {
      setError('Failed to fetch video analysis');
      console.error(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteVideo = async (videoId) => {
    try {
      setLoading(true);
      setError(null);
      await videoService.deleteVideo(videoId);
      setVideos((prevVideos) => prevVideos.filter(video => video.videoId !== videoId));
      if (currentVideo && currentVideo.videoId === videoId) {
        setCurrentVideo(null);
        setVideoAnalysis(null);
      }
    } catch (err) {
      setError('Failed to delete video');
      console.error(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const value = {
    videos,
    currentVideo,
    videoAnalysis,
    loading,
    error,
    fetchUserVideos,
    uploadVideo,
    getVideoDetails,
    getVideoAnalysis,
    deleteVideo,
    setCurrentVideo,
    setVideoAnalysis,
  };

  return (
    <VideoContext.Provider value={value}>
      {children}
    </VideoContext.Provider>
  );
};