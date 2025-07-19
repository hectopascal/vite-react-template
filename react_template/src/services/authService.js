// Mock data and functions to simulate authentication service
// In a real application, these would make API calls to a backend server

// Sample user data
const mockUsers = [
  {
    userId: '1',
    name: 'John Doe',
    email: 'john@example.com',
    passwordHash: 'password123', // In a real app, this would be hashed
    skillLevel: 'intermediate',
    subscriptionTier: 'basic',
    registrationDate: '2023-01-15T00:00:00.000Z',
    lastLoginDate: '2023-04-22T00:00:00.000Z',
  },
  {
    userId: '2',
    name: 'Jane Smith',
    email: 'jane@example.com',
    passwordHash: 'password456',
    skillLevel: 'advanced',
    subscriptionTier: 'premium',
    registrationDate: '2023-02-20T00:00:00.000Z',
    lastLoginDate: '2023-04-20T00:00:00.000Z',
  }
];

/**
 * Simulate user login
 * @param {string} email - User email
 * @param {string} password - User password
 * @returns {Promise<Object>} - User data and token
 */
export const login = async (email, password) => {
  // Simulate API request delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Find user by email
  const user = mockUsers.find(user => user.email === email);
  
  // Check if user exists and password is correct
  if (!user || user.passwordHash !== password) {
    throw new Error('Invalid email or password');
  }
  
  // Generate a mock token
  const token = `mock-jwt-token-${Date.now()}`;
  
  // Update last login date
  user.lastLoginDate = new Date().toISOString();
  
  // Return user data (excluding password) and token
  return {
    user: {
      userId: user.userId,
      name: user.name,
      email: user.email,
      skillLevel: user.skillLevel,
      subscriptionTier: user.subscriptionTier,
    },
    token,
  };
};

/**
 * Simulate user registration
 * @param {string} email - User email
 * @param {string} password - User password
 * @param {string} name - User name
 * @param {string} skillLevel - User skill level
 * @returns {Promise<Object>} - User data and token
 */
export const register = async (email, password, name, skillLevel) => {
  // Simulate API request delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // Check if email is already in use
  if (mockUsers.some(user => user.email === email)) {
    throw new Error('Email already in use');
  }
  
  // Create a new user
  const newUser = {
    userId: `${mockUsers.length + 1}`,
    name,
    email,
    passwordHash: password, // In a real app, this would be hashed
    skillLevel: skillLevel || 'beginner',
    subscriptionTier: 'basic',
    registrationDate: new Date().toISOString(),
    lastLoginDate: new Date().toISOString(),
  };
  
  // Add to mock users
  mockUsers.push(newUser);
  
  // Generate a mock token
  const token = `mock-jwt-token-${Date.now()}`;
  
  // Return user data (excluding password) and token
  return {
    user: {
      userId: newUser.userId,
      name: newUser.name,
      email: newUser.email,
      skillLevel: newUser.skillLevel,
      subscriptionTier: newUser.subscriptionTier,
    },
    token,
  };
};

/**
 * Simulate user logout
 * @returns {Promise<boolean>} - Success status
 */
export const logout = async () => {
  // Simulate API request delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  // In a real app, this would invalidate the token on the server
  return true;
};

/**
 * Simulate updating user profile
 * @param {Object} profileData - Updated profile data
 * @returns {Promise<Object>} - Updated user data
 */
export const updateProfile = async (profileData) => {
  // Simulate API request delay
  await new Promise(resolve => setTimeout(resolve, 600));
  
  // Get current user data from local storage
  const userData = localStorage.getItem('user');
  if (!userData) {
    throw new Error('User not found');
  }
  
  const user = JSON.parse(userData);
  
  // Find user in mock data
  const mockUser = mockUsers.find(u => u.userId === user.userId);
  if (!mockUser) {
    throw new Error('User not found in database');
  }
  
  // Update user data
  Object.assign(mockUser, profileData);
  
  // Return updated user data
  return {
    userId: mockUser.userId,
    name: mockUser.name,
    email: mockUser.email,
    skillLevel: mockUser.skillLevel,
    subscriptionTier: mockUser.subscriptionTier,
  };
};