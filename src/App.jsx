import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState, useEffect } from 'react';

// Layout Components
import Navbar from './components/layout/Navbar';
import Sidebar from './components/layout/Sidebar';
import Footer from './components/layout/Footer';

// Context Providers
import { AuthProvider } from './context/AuthContext';
import { VideoProvider } from './context/VideoContext';
import { TrainingProvider } from './context/TrainingContext';

// Performance Component
import PerformanceTracker from './components/performance/PerformanceTracker';
import ProgressChart from './components/performance/ProgressChart';

// Mock auth state for demo
const mockAuth = {
  isAuthenticated: true,
  currentUser: {
    id: '1',
    name: 'John Smith',
    email: 'john@example.com',
    level: 'Intermediate',
    profileImage: '/assets/images/default-avatar.png'
  }
};

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  // Initialize localStorage with mock data if needed
  useEffect(() => {
    if (!localStorage.getItem('performanceData')) {
      // The service will initialize the data when first called
      import('./services/performanceService').then(module => {
        module.getUserPerformance('1'); // This will create the default data
      });
    }
  }, []);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <Router>
      <AuthProvider initialState={mockAuth}>
        <VideoProvider>
          <TrainingProvider>
            <div className="flex flex-col min-h-screen bg-gray-50">
              <Navbar toggleSidebar={toggleSidebar} />
              
              <div className="flex flex-1">
                <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
                
                <main className="flex-1 px-4 py-8 overflow-y-auto">
                  <Routes>
                    <Route path="/" element={<div className="container mx-auto">
                      <h1 className="text-3xl font-bold mb-8">AI Tennis Coach Dashboard</h1>
                      <p className="text-xl mb-6">Welcome to your personalized tennis training experience!</p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition">
                          <h2 className="text-xl font-semibold mb-2">Video Analysis</h2>
                          <p className="text-gray-600 mb-4">Upload videos of your tennis swing for AI-powered analysis and receive personalized feedback.</p>
                          <a href="/analysis" className="text-green-600 font-medium hover:text-green-700">Analyze your swing →</a>
                        </div>
                        
                        <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition">
                          <h2 className="text-xl font-semibold mb-2">Training Programs</h2>
                          <p className="text-gray-600 mb-4">Follow structured training programs designed to improve specific aspects of your tennis game.</p>
                          <a href="/training" className="text-green-600 font-medium hover:text-green-700">View your programs →</a>
                        </div>
                        
                        <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition">
                          <h2 className="text-xl font-semibold mb-2">Performance Tracking</h2>
                          <p className="text-gray-600 mb-4">Monitor your progress and improvements over time with detailed performance metrics.</p>
                          <a href="/performance" className="text-green-600 font-medium hover:text-green-700">Check your progress →</a>
                        </div>
                      </div>
                    </div>} />
                    
                    {/* Performance Routes */}
                    <Route path="/performance" element={<PerformanceTracker />} />
                    <Route path="/performance/progress" element={
                      <div className="container mx-auto px-4 py-8">
                        <h1 className="text-3xl font-bold mb-6">Skill Progress</h1>
                        <div className="bg-white shadow-md rounded-lg p-6">
                          <ProgressChart 
                            data={[60, 62, 65, 68, 72, 75, 78]} 
                            labels={['May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov']}
                            metric="Overall Performance"
                            color="green"
                            showAverage={true}
                          />
                        </div>
                      </div>
                    } />

                    {/* Placeholder routes for other sections */}
                    <Route path="/analysis" element={<div className="p-8 text-xl">Video Analysis Interface (Coming Soon)</div>} />
                    <Route path="/training" element={<div className="p-8 text-xl">Training Programs Interface (Coming Soon)</div>} />
                    <Route path="/profile" element={<div className="p-8 text-xl">User Profile (Coming Soon)</div>} />
                  </Routes>
                </main>
              </div>
              
              <Footer />
            </div>
          </TrainingProvider>
        </VideoProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;