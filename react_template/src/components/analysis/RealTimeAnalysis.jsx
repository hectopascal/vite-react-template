import React, { useRef, useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import * as performanceService from '../../services/performanceService';
import * as poseDetection from '../../utils/poseDetection';

function RealTimeAnalysis() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [cameraStarted, setCameraStarted] = useState(false);
  const [feedback, setFeedback] = useState([]);
  const [detectedStroke, setDetectedStroke] = useState(null);
  const [strokeQuality, setStrokeQuality] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');
  const [strokeType, setStrokeType] = useState('forehand');
  const { currentUser } = useAuth();
  
  const feedbackTimeoutRef = useRef(null);
  const animationFrameRef = useRef(null);

  // Start camera feed
  const startCamera = async () => {
    try {
      setError('');
      const constraints = {
        video: {
          width: { ideal: 640 },
          height: { ideal: 480 },
          facingMode: 'user'
        }
      };
      
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
        setCameraStarted(true);
      }
    } catch (err) {
      console.error('Error starting camera:', err);
      setError('Failed to access camera. Please make sure you have granted camera permissions.');
    }
  };

  // Stop camera feed
  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = videoRef.current.srcObject.getTracks();
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
      setCameraStarted(false);
    }
  };

  // Toggle streaming state
  const toggleStreaming = () => {
    if (isStreaming) {
      setIsStreaming(false);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
    } else {
      setIsStreaming(true);
      setFeedback([]);
      setDetectedStroke(null);
      setStrokeQuality(null);
    }
  };

  // Clean up on component unmount
  useEffect(() => {
    return () => {
      stopCamera();
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (feedbackTimeoutRef.current) {
        clearTimeout(feedbackTimeoutRef.current);
      }
    };
  }, []);

  // Main analysis loop when streaming is active
  useEffect(() => {
    if (!isStreaming || !cameraStarted || !videoRef.current) return;

    let frameCount = 0;
    const framesPerAnalysis = 15; // Analyze every 15 frames (approx. 0.5 seconds at 30fps)
    const poses = []; // Store recent poses for analysis

    const analyzePose = async () => {
      try {
        if (!canvasRef.current || !videoRef.current) return;
        
        const ctx = canvasRef.current.getContext('2d');
        const video = videoRef.current;
        
        // Ensure canvas dimensions match the video
        canvasRef.current.width = video.videoWidth;
        canvasRef.current.height = video.videoHeight;
        
        // Draw video frame to canvas
        ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
        ctx.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
        
        frameCount++;
        
        // Only run pose detection every few frames to improve performance
        if (frameCount % framesPerAnalysis === 0) {
          setProcessing(true);
          
          // In a real implementation, this would call an actual pose detection model
          // For this demo, we're simulating pose detection
          const detectedPose = await simulatePoseDetection(video);
          
          // Store recent poses for analysis (keep last 5)
          poses.push(detectedPose);
          if (poses.length > 5) poses.shift();
          
          // Analyze the stroke if we have enough pose data
          if (poses.length >= 3) {
            const strokeData = analyzeStroke(poses, strokeType);
            
            if (strokeData.isStrokeDetected) {
              setDetectedStroke(strokeType);
              setStrokeQuality(strokeData.quality);
              
              // Add feedback based on analysis
              const newFeedback = generateFeedback(strokeData, strokeType);
              setFeedback(prev => [...prev, newFeedback]);
              
              // Clear oldest feedback after 10 seconds
              feedbackTimeoutRef.current = setTimeout(() => {
                setFeedback(prev => prev.slice(1));
              }, 10000);
            }
          }
          
          // Draw pose keypoints on canvas
          drawPoseKeypoints(ctx, detectedPose);
          setProcessing(false);
        }
        
        // Continue the animation loop
        animationFrameRef.current = requestAnimationFrame(analyzePose);
      } catch (error) {
        console.error('Error in pose analysis:', error);
        setIsStreaming(false);
        setError('An error occurred during analysis. Please try again.');
      }
    };

    analyzePose();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
    };
  }, [isStreaming, cameraStarted, strokeType]);

  // Simulate pose detection (in real app would use TensorFlow.js or similar)
  const simulatePoseDetection = async (videoElement) => {
    // This is a simplified simulation
    // In a real app, this would use TensorFlow.js PoseNet or MoveNet
    
    return {
      keypoints: [
        { name: 'nose', position: { x: Math.random() * videoElement.videoWidth, y: Math.random() * videoElement.videoHeight }, score: 0.9 },
        { name: 'leftShoulder', position: { x: videoElement.videoWidth * 0.3, y: videoElement.videoHeight * 0.3 }, score: 0.85 },
        { name: 'rightShoulder', position: { x: videoElement.videoWidth * 0.7, y: videoElement.videoHeight * 0.3 }, score: 0.87 },
        { name: 'leftElbow', position: { x: videoElement.videoWidth * 0.25, y: videoElement.videoHeight * 0.5 }, score: 0.8 },
        { name: 'rightElbow', position: { x: videoElement.videoWidth * 0.75, y: videoElement.videoHeight * 0.5 }, score: 0.82 },
        { name: 'leftWrist', position: { x: videoElement.videoWidth * 0.2, y: videoElement.videoHeight * 0.65 }, score: 0.75 },
        { name: 'rightWrist', position: { x: videoElement.videoWidth * 0.8, y: videoElement.videoHeight * 0.65 }, score: 0.78 },
        { name: 'leftHip', position: { x: videoElement.videoWidth * 0.4, y: videoElement.videoHeight * 0.7 }, score: 0.7 },
        { name: 'rightHip', position: { x: videoElement.videoWidth * 0.6, y: videoElement.videoHeight * 0.7 }, score: 0.72 },
        { name: 'leftKnee', position: { x: videoElement.videoWidth * 0.4, y: videoElement.videoHeight * 0.8 }, score: 0.65 },
        { name: 'rightKnee', position: { x: videoElement.videoWidth * 0.6, y: videoElement.videoHeight * 0.8 }, score: 0.67 },
        { name: 'leftAnkle', position: { x: videoElement.videoWidth * 0.4, y: videoElement.videoHeight * 0.95 }, score: 0.6 },
        { name: 'rightAnkle', position: { x: videoElement.videoWidth * 0.6, y: videoElement.videoHeight * 0.95 }, score: 0.62 },
      ]
    };
  };

  // Draw pose keypoints and connections on canvas
  const drawPoseKeypoints = (ctx, pose) => {
    if (!pose || !pose.keypoints) return;
    
    // Draw keypoints
    pose.keypoints.forEach(keypoint => {
      if (keypoint.score > 0.5) {
        ctx.beginPath();
        ctx.arc(keypoint.position.x, keypoint.position.y, 5, 0, 2 * Math.PI);
        ctx.fillStyle = 'red';
        ctx.fill();
      }
    });
    
    // Draw connections (simplified)
    const connections = [
      ['leftShoulder', 'rightShoulder'],
      ['leftShoulder', 'leftElbow'],
      ['leftElbow', 'leftWrist'],
      ['rightShoulder', 'rightElbow'],
      ['rightElbow', 'rightWrist'],
      ['leftShoulder', 'leftHip'],
      ['rightShoulder', 'rightHip'],
      ['leftHip', 'rightHip'],
      ['leftHip', 'leftKnee'],
      ['leftKnee', 'leftAnkle'],
      ['rightHip', 'rightKnee'],
      ['rightKnee', 'rightAnkle']
    ];
    
    ctx.strokeStyle = 'green';
    ctx.lineWidth = 2;
    
    connections.forEach(([p1, p2]) => {
      const point1 = pose.keypoints.find(kp => kp.name === p1);
      const point2 = pose.keypoints.find(kp => kp.name === p2);
      
      if (point1 && point2 && point1.score > 0.5 && point2.score > 0.5) {
        ctx.beginPath();
        ctx.moveTo(point1.position.x, point1.position.y);
        ctx.lineTo(point2.position.x, point2.position.y);
        ctx.stroke();
      }
    });
  };

  // Analyze stroke based on pose data
  const analyzeStroke = (poses, strokeType) => {
    // In a real app, this would use sophisticated analysis of the pose sequence
    // For the demo, we'll use a simplified approach with randomness
    const isStrokeDetected = Math.random() > 0.7; // 30% chance of detecting a stroke
    
    if (!isStrokeDetected) {
      return { isStrokeDetected: false };
    }
    
    const quality = {
      technique: Math.floor(Math.random() * 40) + 60, // 60-99
      timing: Math.floor(Math.random() * 40) + 60,    // 60-99
      balance: Math.floor(Math.random() * 40) + 60,   // 60-99
      followThrough: Math.floor(Math.random() * 40) + 60, // 60-99
      overall: Math.floor(Math.random() * 30) + 70    // 70-99
    };
    
    const issues = [];
    
    // Generate some random issues based on the quality
    if (quality.technique < 75) {
      issues.push({
        area: 'technique',
        description: strokeType === 'forehand' ? 
          'Your racket face is too open at contact' : 
          strokeType === 'backhand' ? 
          'Keep your wrist firmer through contact' : 
          'Extend your arm more fully'
      });
    }
    
    if (quality.balance < 70) {
      issues.push({
        area: 'balance',
        description: 'Maintain better weight distribution through the swing'
      });
    }
    
    if (quality.followThrough < 80) {
      issues.push({
        area: 'followThrough',
        description: 'Complete your follow-through for better power and control'
      });
    }
    
    return {
      isStrokeDetected: true,
      quality,
      issues
    };
  };

  // Generate feedback based on stroke analysis
  const generateFeedback = (strokeData, strokeType) => {
    if (!strokeData.issues || strokeData.issues.length === 0) {
      return {
        id: Date.now(),
        type: 'positive',
        message: `Good ${strokeType}! Nice technique and follow-through.`,
        timestamp: new Date().toISOString()
      };
    }
    
    // Get a random issue to provide feedback on
    const issue = strokeData.issues[Math.floor(Math.random() * strokeData.issues.length)];
    
    return {
      id: Date.now(),
      type: 'improvement',
      message: issue.description,
      area: issue.area,
      timestamp: new Date().toISOString()
    };
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <h1 className="text-3xl font-bold mb-6">Real-Time Swing Analysis</h1>
      
      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative">
          {error}
        </div>
      )}
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Video and Canvas Column */}
        <div className="lg:col-span-2">
          <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <div className="relative bg-black">
              <video 
                ref={videoRef}
                className="w-full"
                playsInline
                muted
                style={{ display: cameraStarted ? 'block' : 'none' }}
              />
              
              <canvas 
                ref={canvasRef}
                className="absolute top-0 left-0 w-full h-full"
                style={{ display: cameraStarted ? 'block' : 'none' }}
              />
              
              {!cameraStarted ? (
                <div className="w-full h-64 md:h-96 flex flex-col items-center justify-center bg-gray-900">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mb-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  <button
                    onClick={startCamera}
                    className="px-6 py-3 bg-green-600 text-white rounded-md hover:bg-green-500"
                  >
                    Start Camera
                  </button>
                </div>
              ) : null}
              
              {processing && (
                <div className="absolute top-4 right-4">
                  <div className="animate-pulse flex items-center bg-black bg-opacity-50 rounded-full px-3 py-1">
                    <div className="animate-spin rounded-full h-3 w-3 border-t-2 border-b-2 border-white mr-2"></div>
                    <span className="text-white text-xs">Analyzing</span>
                  </div>
                </div>
              )}
            </div>
            
            <div className="p-4">
              <div className="flex flex-wrap gap-3 mb-4">
                <button
                  onClick={toggleStreaming}
                  disabled={!cameraStarted}
                  className={`px-4 py-2 rounded-md ${
                    isStreaming 
                      ? 'bg-red-600 hover:bg-red-700 text-white' 
                      : 'bg-green-600 hover:bg-green-700 text-white'
                  } ${!cameraStarted ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {isStreaming ? 'Stop Analysis' : 'Start Analysis'}
                </button>
                
                {cameraStarted && (
                  <button
                    onClick={stopCamera}
                    className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
                  >
                    Turn Off Camera
                  </button>
                )}
              </div>
              
              <div className="flex flex-wrap gap-3">
                {['forehand', 'backhand', 'serve', 'volley'].map((stroke) => (
                  <label 
                    key={stroke} 
                    className={`
                      flex items-center px-4 py-2 rounded-md border cursor-pointer transition
                      ${strokeType === stroke 
                        ? 'border-green-600 bg-green-50 text-green-800' 
                        : 'border-gray-300 hover:bg-gray-50'}
                    `}
                  >
                    <input 
                      type="radio" 
                      name="strokeType" 
                      value={stroke} 
                      checked={strokeType === stroke}
                      onChange={() => setStrokeType(stroke)}
                      className="sr-only"
                    />
                    <span className="capitalize">{stroke}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
          
          {/* Feedback Section */}
          <div className="mt-6 bg-white shadow-md rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Live Feedback</h2>
            
            {isStreaming ? (
              feedback.length > 0 ? (
                <div className="space-y-4">
                  {feedback.map((item) => (
                    <div 
                      key={item.id}
                      className={`p-3 rounded-md ${
                        item.type === 'improvement' 
                          ? 'bg-blue-50 border-l-4 border-blue-400' 
                          : 'bg-green-50 border-l-4 border-green-400'
                      }`}
                    >
                      <p className="text-gray-700">{item.message}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">
                  Perform a {strokeType} swing to receive feedback. Make sure your full body is visible in the frame.
                </p>
              )
            ) : (
              <p className="text-gray-500">
                Press "Start Analysis" to begin receiving real-time feedback on your swing.
              </p>
            )}
          </div>
        </div>
        
        {/* Stats and Info Column */}
        <div>
          {/* Current Stroke Stats */}
          <div className="bg-white shadow-md rounded-lg p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Current Swing</h2>
            
            {detectedStroke && strokeQuality ? (
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <div className="h-10 w-10 rounded-full bg-green-600 flex items-center justify-center text-white font-bold">
                    {strokeQuality.overall}
                  </div>
                  <div>
                    <div className="font-medium">Overall Quality</div>
                    <div className="text-sm text-gray-500 capitalize">{detectedStroke} Technique</div>
                  </div>
                </div>
                
                <div className="space-y-3">
                  {Object.entries(strokeQuality).map(([key, value]) => {
                    if (key === 'overall') return null;
                    
                    return (
                      <div key={key}>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm capitalize">{key}</span>
                          <span className="text-sm font-medium">{value}/100</span>
                        </div>
                        <div className="h-2 w-full bg-gray-200 rounded-full">
                          <div 
                            className={`h-full rounded-full ${
                              value >= 80 ? 'bg-green-500' : 
                              value >= 70 ? 'bg-green-400' : 
                              value >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                            }`}
                            style={{ width: `${value}%` }}
                          ></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                No swing detected yet. Try performing a {strokeType} swing.
              </div>
            )}
          </div>
          
          {/* Tips Section */}
          <div className="bg-white shadow-md rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Tips for Better Analysis</h2>
            <ul className="space-y-2 text-gray-600">
              <li className="flex items-start">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Make sure your full body is visible in the frame
              </li>
              <li className="flex items-start">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Face the camera from the side for optimal analysis
              </li>
              <li className="flex items-start">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Ensure good lighting for better detection accuracy
              </li>
              <li className="flex items-start">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Perform full swings at a moderate speed
              </li>
              <li className="flex items-start">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Allow enough space around you for the full swing
              </li>
            </ul>
            
            <div className="mt-6 p-4 bg-blue-50 rounded-md border border-blue-100">
              <h3 className="font-medium text-blue-800 mb-2">How it works</h3>
              <p className="text-blue-700 text-sm">
                Our AI uses computer vision to analyze your body positioning and movement throughout your tennis swing.
                It compares your technique against proper form to provide real-time feedback for improvement.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RealTimeAnalysis;