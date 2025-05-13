// Tag suggestions
export const TAG_SUGGESTIONS = [
  'Science & Technology',
  'Programming',
  'Health',
  'Finance',
  'Music',
  'Gaming',
  'Education',
  'Cooking',
  'Travel',
  'Sports',
  'Art',
  'Fashion',
  'Politics',
  'Entertainment',
  'News',
];

// Mock Data for API Simulation
export const USERS = [
  {
    _id: 'user1',
    username: 'johnsmith',
    email: 'john@example.com',
    fullname: 'John Smith',
    avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg',
    coverImage: 'https://images.pexels.com/photos/1591056/pexels-photo-1591056.jpeg',
    createdAt: '2023-01-15T10:00:00.000Z',
  },
  {
    _id: 'user2',
    username: 'janedoe',
    email: 'jane@example.com',
    fullname: 'Jane Doe',
    avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg',
    coverImage: 'https://images.pexels.com/photos/3293148/pexels-photo-3293148.jpeg',
    createdAt: '2023-02-22T15:30:00.000Z',
  },
  {
    _id: 'user3',
    username: 'mikeross',
    email: 'mike@example.com',
    fullname: 'Mike Ross',
    avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg',
    createdAt: '2023-03-10T09:15:00.000Z',
  },
];

// Mock videos
export const VIDEOS = [
  {
    _id: 'video1',
    title: 'Introduction to React Hooks',
    description: 'Learn the basics of React Hooks and how they can simplify your React components.',
    videoFile: 'https://example.com/videos/react-hooks.mp4',
    thumbnail: 'https://images.pexels.com/photos/4383298/pexels-photo-4383298.jpeg',
    duration: 585, // 9:45 in seconds
    views: 12500,
    isPublished: true,
    owner: USERS[0],
    tags: ['Programming', 'React', 'JavaScript'],
    createdAt: '2023-05-10T14:30:00.000Z',
    updatedAt: '2023-05-10T14:30:00.000Z',
  },
  {
    _id: 'video2',
    title: 'Building a REST API with Node.js',
    description: 'A comprehensive guide to building RESTful APIs using Node.js, Express, and MongoDB.',
    videoFile: 'https://example.com/videos/node-rest-api.mp4',
    thumbnail: 'https://images.pexels.com/photos/546819/pexels-photo-546819.jpeg',
    duration: 1230, // 20:30 in seconds
    views: 8700,
    isPublished: true,
    owner: USERS[1],
    tags: ['Programming', 'Node.js', 'API'],
    createdAt: '2023-06-15T09:45:00.000Z',
    updatedAt: '2023-06-15T09:45:00.000Z',
  },
  {
    _id: 'video3',
    title: 'Modern CSS Techniques',
    description: 'Explore modern CSS techniques like Grid, Flexbox, and CSS Variables.',
    videoFile: 'https://example.com/videos/modern-css.mp4',
    thumbnail: 'https://images.pexels.com/photos/270373/pexels-photo-270373.jpeg',
    duration: 845, // 14:05 in seconds
    views: 6200,
    isPublished: true,
    owner: USERS[2],
    tags: ['Programming', 'CSS', 'Web Design'],
    createdAt: '2023-07-22T16:15:00.000Z',
    updatedAt: '2023-07-22T16:15:00.000Z',
  },
  {
    _id: 'video4',
    title: '10 Healthy Breakfast Ideas',
    description: 'Start your day right with these 10 healthy and delicious breakfast recipes.',
    videoFile: 'https://example.com/videos/healthy-breakfast.mp4',
    thumbnail: 'https://images.pexels.com/photos/376464/pexels-photo-376464.jpeg',
    duration: 723, // 12:03 in seconds
    views: 15800,
    isPublished: true,
    owner: USERS[1],
    tags: ['Health', 'Cooking', 'Food'],
    createdAt: '2023-08-05T08:20:00.000Z',
    updatedAt: '2023-08-05T08:20:00.000Z',
  },
  {
    _id: 'video5',
    title: 'Investing for Beginners',
    description: 'Learn the basics of investing and how to start building your portfolio.',
    videoFile: 'https://example.com/videos/investing-basics.mp4',
    thumbnail: 'https://images.pexels.com/photos/534216/pexels-photo-534216.jpeg',
    duration: 1562, // 26:02 in seconds
    views: 22400,
    isPublished: true,
    owner: USERS[0],
    tags: ['Finance', 'Investing', 'Money'],
    createdAt: '2023-09-12T11:10:00.000Z',
    updatedAt: '2023-09-12T11:10:00.000Z',
  },
];

// Mock playlists
export const PLAYLISTS = [
  {
    _id: 'playlist1',
    name: 'Web Development',
    description: 'Videos about web development techniques and technologies',
    videos: [VIDEOS[0], VIDEOS[1], VIDEOS[2]],
    owner: USERS[0],
    createdAt: '2023-06-01T10:00:00.000Z',
  },
  {
    _id: 'playlist2',
    name: 'Lifestyle',
    description: 'Videos about health, cooking, and wellness',
    videos: [VIDEOS[3]],
    owner: USERS[1],
    createdAt: '2023-08-15T14:30:00.000Z',
  },
  {
    _id: 'playlist3',
    name: 'Finance Guides',
    description: 'Videos about personal finance and investing',
    videos: [VIDEOS[4]],
    owner: USERS[0],
    createdAt: '2023-09-20T16:45:00.000Z',
  },
];

// Mock comments
export const COMMENTS = [
  {
    _id: 'comment1',
    content: 'Great tutorial! This really helped me understand hooks better.',
    video: 'video1',
    owner: USERS[1],
    createdAt: '2023-05-11T09:30:00.000Z',
    updatedAt: '2023-05-11T09:30:00.000Z',
  },
  {
    _id: 'comment2',
    content: 'Could you make a follow-up video on custom hooks?',
    video: 'video1',
    owner: USERS[2],
    createdAt: '2023-05-12T14:15:00.000Z',
    updatedAt: '2023-05-12T14:15:00.000Z',
  },
  {
    _id: 'comment3',
    content: 'I tried implementing this API pattern and it works great!',
    video: 'video2',
    owner: USERS[0],
    createdAt: '2023-06-16T11:45:00.000Z',
    updatedAt: '2023-06-16T11:45:00.000Z',
  },
];

// Mock tweets/community posts
export const TWEETS = [
  {
    _id: 'tweet1',
    title: 'Just launched a new course!',
    description: 'Check out my new course on advanced React patterns. Link in bio!',
    tags: ['Programming', 'React', 'Education'],
    owner: USERS[0],
    createdAt: '2023-07-05T08:30:00.000Z',
    updatedAt: '2023-07-05T08:30:00.000Z',
  },
  {
    _id: 'tweet2',
    title: 'Looking for collaborators',
    description: 'I\'m working on a new project about health and wellness. Looking for nutrition experts to collaborate!',
    tags: ['Health', 'Collaboration', 'Project'],
    owner: USERS[1],
    createdAt: '2023-08-12T15:45:00.000Z',
    updatedAt: '2023-08-12T15:45:00.000Z',
  },
  {
    _id: 'tweet3',
    title: 'Tech Conference Highlights',
    description: 'Just got back from TechCon 2023. Here are my top 3 takeaways: 1) AI is changing everything, 2) WebAssembly is gaining traction, 3) Performance optimization is more important than ever.',
    tags: ['Technology', 'Conference', 'Networking'],
    owner: USERS[2],
    createdAt: '2023-09-22T10:20:00.000Z',
    updatedAt: '2023-09-22T10:20:00.000Z',
  },
];

// Sample chat responses for video content
export const AI_CHAT_RESPONSES = {
  'video1': [
    {
      question: 'What are React Hooks?',
      answer: 'React Hooks are functions that let you "hook into" React state and lifecycle features from function components. They were introduced in React 16.8 as a way to use state and other React features without writing a class component.',
      timestamp: { text: '1:05', seconds: 65 }
    },
    {
      question: 'What is useState?',
      answer: 'useState is a Hook that lets you add React state to function components. It returns a stateful value and a function to update it. During initial render, the returned state is the same as the value passed as the first argument.',
      timestamp: { text: '3:22', seconds: 202 }
    },
    {
      question: 'What is useEffect?',
      answer: 'useEffect is a Hook that lets you perform side effects in function components. It serves the same purpose as componentDidMount, componentDidUpdate, and componentWillUnmount in React classes, but unified into a single API.',
      timestamp: { text: '5:47', seconds: 347 }
    }
  ],
  'video2': [
    {
      question: 'What is REST?',
      answer: 'REST (Representational State Transfer) is an architectural style for designing networked applications. It relies on a stateless, client-server communication protocol, almost always HTTP.',
      timestamp: { text: '2:15', seconds: 135 }
    },
    {
      question: 'How do you set up Express?',
      answer: 'To set up Express, first install it with npm: `npm install express`. Then import it in your file with `const express = require("express")` and initialize your app with `const app = express()`.',
      timestamp: { text: '6:30', seconds: 390 }
    }
  ]
};

// API Endpoints (for reference when simulating API calls)
export const API_ENDPOINTS = {
  // Auth
  LOGIN: '/api/auth/login',
  SIGNUP: '/api/auth/signup',
  LOGOUT: '/api/auth/logout',
  REFRESH_TOKEN: '/api/auth/refresh-token',
  CURRENT_USER: '/api/auth/current-user',
  
  // Videos
  VIDEOS: '/api/videos',
  VIDEO_BY_ID: (id: string) => `/api/videos/${id}`,
  VIDEO_COMMENTS: (id: string) => `/api/videos/${id}/comments`,
  
  // Playlists
  PLAYLISTS: '/api/playlists',
  PLAYLIST_BY_ID: (id: string) => `/api/playlists/${id}`,
  USER_PLAYLISTS: (userId: string) => `/api/users/${userId}/playlists`,
  
  // Tweets
  TWEETS: '/api/tweets',
  TWEET_BY_ID: (id: string) => `/api/tweets/${id}`,
  USER_TWEETS: (userId: string) => `/api/users/${userId}/tweets`,
  
  // Users
  USERS: '/api/users',
  USER_BY_ID: (id: string) => `/api/users/${id}`,
  USER_VIDEOS: (userId: string) => `/api/users/${userId}/videos`,
};

// Common utility constants
export const VIDEO_CACHE_DURATION = 2 * 60 * 1000; // 2 minutes in milliseconds