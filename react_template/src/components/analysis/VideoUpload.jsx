import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useVideo } from '../../context/VideoContext';

function VideoUpload() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [videoPreview, setVideoPreview] = useState(null);
  const [strokeType, setStrokeType] = useState('forehand');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);
  const videoRef = useRef(null);
  
  const { uploadVideo } = useVideo();
  const navigate = useNavigate();
  
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    processFile(file);
  };
  
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };
  
  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      processFile(file);
    }
  };
  
  const processFile = (file) => {
    if (file) {
      // Check if file is a video
      if (!file.type.startsWith('video/')) {
        setError('Please select a valid video file');
        setSelectedFile(null);
        setVideoPreview(null);
        return;
      }
      
      // Check file size (limit to 100MB)
      if (file.size > 100 * 1024 * 1024) {
        setError('File size exceeds 100MB limit');
        setSelectedFile(null);
        setVideoPreview(null);
        return;
      }
      
      setError('');
      setSelectedFile(file);
      setTitle(file.name.split('.')[0]); // Set default title from filename
      
      // Create video preview
      const objectUrl = URL.createObjectURL(file);
      setVideoPreview(objectUrl);
      
      return () => URL.revokeObjectURL(objectUrl);
    }
  };
  
  const handleUpload = async (e) => {
    e.preventDefault();
    
    if (!selectedFile) {
      setError('Please select a video file to upload');
      return;
    }
    
    if (!title.trim()) {
      setError('Please enter a title for the video');
      return;
    }
    
    try {
      setUploading(true);
      setUploadProgress(0);
      
      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          const newProgress = prev + Math.random() * 15;
          return newProgress >= 90 ? 90 : newProgress;
        });
      }, 500);
      
      // Upload the video
      const metadata = {
        title,
        description,
        strokeType
      };
      
      const result = await uploadVideo(selectedFile, metadata);
      
      clearInterval(progressInterval);
      setUploadProgress(100);
      
      // Navigate to the analysis page for the uploaded video
      setTimeout(() => {
        navigate(`/analysis/videos/${result.videoId}`);
      }, 1500);
      
    } catch (err) {
      console.error('Upload failed:', err);
      setError('Failed to upload video. Please try again.');
      setUploading(false);
    }
  };
  
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">Upload Video</h1>
      
      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative">
          {error}
        </div>
      )}
      
      <div className="bg-white shadow-md rounded-lg p-6">
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Select Video</h2>
          
          {!videoPreview ? (
            <div 
              className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition 
                ${dragActive ? 'border-green-500 bg-green-50' : 'border-gray-300 hover:border-green-400'}`}
              onClick={() => fileInputRef.current.click()}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-12 w-12 mx-auto text-gray-400" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" 
                />
              </svg>
              <p className="mt-4 text-gray-500">
                Drag and drop your video here, or click to select
              </p>
              <p className="mt-2 text-sm text-gray-400">
                Maximum file size: 100MB
              </p>
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileChange} 
                accept="video/*" 
                className="hidden" 
              />
            </div>
          ) : (
            <div className="relative rounded-lg overflow-hidden bg-black">
              <video 
                ref={videoRef}
                src={videoPreview} 
                controls 
                className="w-full max-h-96 mx-auto"
              />
              <button 
                onClick={() => {
                  setSelectedFile(null);
                  setVideoPreview(null);
                  setTitle('');
                }} 
                className="absolute top-4 right-4 bg-black bg-opacity-70 p-2 rounded-full text-white hover:bg-opacity-90 transition"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          )}
        </div>
        
        <form onSubmit={handleUpload}>
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-4">Video Information</h2>
            
            <div className="mb-4">
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                Title
              </label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Enter video title"
                disabled={uploading}
                required
              />
            </div>
            
            <div className="mb-4">
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Description (optional)
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows="3"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Describe what you're working on in this video"
                disabled={uploading}
              ></textarea>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Stroke Type
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {['forehand', 'backhand', 'serve', 'volley'].map((stroke) => (
                  <label 
                    key={stroke} 
                    className={`
                      flex items-center px-4 py-3 rounded-md border cursor-pointer transition
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
                      disabled={uploading}
                    />
                    <span className="capitalize">{stroke}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
          
          <div>
            {uploading && (
              <div className="mb-6">
                <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-green-600 rounded-full transition-all duration-300" 
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
                <p className="mt-2 text-sm text-center text-gray-600">
                  {uploadProgress < 100 
                    ? `Uploading video... ${Math.round(uploadProgress)}%` 
                    : 'Upload complete! Redirecting to analysis...'}
                </p>
              </div>
            )}
            
            <button
              type="submit"
              disabled={uploading || !selectedFile}
              className={`
                w-full py-3 px-4 rounded-md text-white font-medium transition
                ${(uploading || !selectedFile) 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-green-600 hover:bg-green-700'}
              `}
            >
              {uploading ? 'Uploading...' : 'Upload and Analyze'}
            </button>
          </div>
        </form>
      </div>
      
      <div className="mt-8 bg-blue-50 p-6 rounded-lg border border-blue-100">
        <h2 className="text-xl font-semibold mb-2 text-blue-800">Tips for Better Analysis</h2>
        <ul className="list-disc list-inside space-y-2 text-blue-700">
          <li>Record your swing from the side view for best results</li>
          <li>Ensure good lighting to improve analysis accuracy</li>
          <li>Capture your full body in the frame</li>
          <li>Record at least 3-5 repetitions of the same stroke</li>
          <li>Try to have a plain background if possible</li>
        </ul>
      </div>
    </div>
  );
}

export default VideoUpload;