import { useState, useEffect } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Sidebar from './components/layout/Sidebar';
import Footer from './components/layout/Footer';
import AppRoutes from './routes';
import { AuthProvider } from './context/AuthContext';
import { VideoProvider } from './context/VideoContext';
import { TrainingProvider } from './context/TrainingContext';

function App() {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (!mobile && !sidebarOpen) {
        setSidebarOpen(true);
      }
      if (mobile && sidebarOpen) {
        setSidebarOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [sidebarOpen]);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <Router>
      <AuthProvider>
        <VideoProvider>
          <TrainingProvider>
            <div className="min-h-screen flex flex-col bg-gray-50">
              <Navbar toggleSidebar={toggleSidebar} />
              <div className="flex flex-1">
                {sidebarOpen && <Sidebar />}
                <main className="flex-1 p-4 overflow-auto">
                  <AppRoutes />
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