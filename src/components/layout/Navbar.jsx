import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

function Navbar({ toggleSidebar }) {
  const { currentUser } = useAuth();
  const location = useLocation();

  return (
    <nav className="bg-white border-b border-gray-200 fixed w-full z-30">
      <div className="px-3 py-3 lg:px-5 lg:pl-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center justify-start">
            <button
              onClick={toggleSidebar}
              aria-expanded="true"
              aria-controls="sidebar"
              className="lg:hidden mr-2 text-gray-600 hover:text-gray-900 cursor-pointer p-2 hover:bg-gray-100 focus:bg-gray-100 focus:ring-2 focus:ring-gray-100 rounded"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd"></path>
              </svg>
            </button>
            <Link to="/" className="text-xl font-bold flex items-center lg:ml-2.5">
              <svg className="w-8 h-8 mr-2 text-green-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
              </svg>
              <span className="self-center whitespace-nowrap">AI Tennis Coach</span>
            </Link>
          </div>
          <div className="flex items-center">
            {/* Path indicator */}
            <div className="hidden md:flex px-5">
              <span className="text-sm text-gray-600 font-medium">
                {location.pathname === '/' ? 'Dashboard' : 
                  location.pathname.charAt(1).toUpperCase() + location.pathname.slice(2).replace(/\/\w/g, match => ' / ' + match.charAt(1).toUpperCase() + match.slice(2))}
              </span>
            </div>
            
            {/* User menu */}
            <div className="flex items-center">
              <div className="hidden sm:flex sm:items-center sm:ml-6">
                <Link to="/profile" className="text-sm font-medium text-gray-700 hover:text-gray-800 mr-4">
                  {currentUser?.name || 'User'}
                </Link>
              </div>
              <Link to="/profile" className="flex items-center">
                <div className="relative w-8 h-8 rounded-full border-2 border-green-500 overflow-hidden">
                  {currentUser?.profileImage ? (
                    <img
                      className="w-full h-full object-cover"
                      src={currentUser.profileImage}
                      alt="User avatar"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-600">
                      {currentUser?.name?.charAt(0) || 'U'}
                    </div>
                  )}
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;