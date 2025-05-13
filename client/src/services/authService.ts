import { User } from '../types';
import { API_ENDPOINTS, USERS } from '../utils/constants';

// Simulate API responses with a delay
const simulateApiCall = <T>(data: T, delay = 500): Promise<T> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(data);
    }, delay);
  });
};

// Generate a fake JWT token
const generateToken = (userId: string, expiresIn = '1h'): string => {
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const now = Math.floor(Date.now() / 1000);
  const expiryTime = now + (expiresIn === '1h' ? 3600 : 7 * 24 * 3600); // 1 hour or 7 days
  
  const payload = btoa(JSON.stringify({
    sub: userId,
    iat: now,
    exp: expiryTime
  }));
  
  // In a real app, this would be signed properly
  const signature = btoa('fakesignature');
  
  return `${header}.${payload}.${signature}`;
};

export const authService = {
  // Login user
  async login(email: string, password: string) {
    // In a real app, this would validate credentials against the backend
    const user = USERS.find(u => u.email === email);
    
    if (!user) {
      return simulateApiCall(Promise.reject(new Error('Invalid credentials')));
    }
    
    const accessToken = generateToken(user._id, '1h');
    const refreshToken = generateToken(user._id, '7d');
    
    return simulateApiCall({
      user,
      accessToken,
      refreshToken
    });
  },
  
  // Register new user
  async signup(userData: any) {
    // In a real app, this would create a new user in the backend
    const existingUser = USERS.find(u => u.email === userData.email || u.username === userData.username);
    
    if (existingUser) {
      return simulateApiCall(Promise.reject(new Error('User already exists')));
    }
    
    const newUser: User = {
      _id: `user${USERS.length + 1}`,
      username: userData.username,
      email: userData.email,
      fullname: userData.fullname,
      avatar: userData.avatar || 'https://images.pexels.com/photos/771742/pexels-photo-771742.jpeg',
      coverImage: userData.coverImage,
      createdAt: new Date().toISOString()
    };
    
    // In a real app, this would be saved to the database
    USERS.push(newUser);
    
    const accessToken = generateToken(newUser._id, '1h');
    const refreshToken = generateToken(newUser._id, '7d');
    
    return simulateApiCall({
      user: newUser,
      accessToken,
      refreshToken
    });
  },
  
  // Get current user based on token
  async getCurrentUser() {
    const accessToken = localStorage.getItem('accessToken');
    
    if (!accessToken) {
      return simulateApiCall(Promise.reject(new Error('No token found')));
    }
    
    try {
      // Decode token (in a real app, this would be verified on the server)
      const payload = JSON.parse(atob(accessToken.split('.')[1]));
      const userId = payload.sub;
      
      const user = USERS.find(u => u._id === userId);
      
      if (!user) {
        return simulateApiCall(Promise.reject(new Error('User not found')));
      }
      
      return simulateApiCall(user);
    } catch (error) {
      return simulateApiCall(Promise.reject(new Error('Invalid token')));
    }
  },
  
  // Refresh access token using refresh token
  async refreshToken(refreshToken: string) {
    // In a real app, this would verify the refresh token and issue a new access token
    try {
      const payload = JSON.parse(atob(refreshToken.split('.')[1]));
      const userId = payload.sub;
      
      // Check if user exists
      const userExists = USERS.some(u => u._id === userId);
      
      if (!userExists) {
        return simulateApiCall(Promise.reject(new Error('Invalid refresh token')));
      }
      
      const newAccessToken = generateToken(userId, '1h');
      const newRefreshToken = generateToken(userId, '7d');
      
      return simulateApiCall({
        accessToken: newAccessToken,
        refreshToken: newRefreshToken
      });
    } catch (error) {
      return simulateApiCall(Promise.reject(new Error('Invalid refresh token')));
    }
  }
};