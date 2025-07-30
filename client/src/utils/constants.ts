// Tag suggestions
export const SERVER_URL = "http://localhost:8000/api/v1";
// export const SERVER_URL = "https://playtube-server.onrender.com/api/v1";
export const TAG_SUGGESTIONS = [
	"Science & Technology",
	"Programming",
	"Health",
	"Finance",
	"Music",
	"Gaming",
	"Education",
	"Cooking",
	"Travel",
	"Sports",
	"Art",
	"Fashion",
	"Politics",
	"Entertainment",
	"News",
];

// Mock Data for API Simulation
export const USERS = [
	{
		_id: "user1",
		username: "johnsmith",
		email: "john@example.com",
		fullname: "John Smith",
		avatar: "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg",
		coverImage:
			"https://images.pexels.com/photos/1591056/pexels-photo-1591056.jpeg",
		createdAt: "2023-01-15T10:00:00.000Z",
	},
	{
		_id: "user2",
		username: "janedoe",
		email: "jane@example.com",
		fullname: "Jane Doe",
		avatar: "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg",
		coverImage:
			"https://images.pexels.com/photos/3293148/pexels-photo-3293148.jpeg",
		createdAt: "2023-02-22T15:30:00.000Z",
	},
	{
		_id: "user3",
		username: "mikeross",
		email: "mike@example.com",
		fullname: "Mike Ross",
		avatar: "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg",
		createdAt: "2023-03-10T09:15:00.000Z",
	},
];

// Mock videos
export const VIDEOS = [
	{
		_id: "video1",
		title: "ETH Beginner Project for Metacrafters Course 👨‍💻",
		description:
			"Hi viewers, in this video, I walk you through my project for the eth beginner course. I explain the code I've written, including the subversioning, the smart contract named Metacrafters, the variables, and the mapping data structure. I also demonstrate the mint and burn functions and show how the balances and total supply are updated. Please watch the video to get a clear understanding of the project. Action requested: Watch the video to review and provide feedback.",
		videofile:
			"https://www.loom.com/embed/9f159044711b42d5b2e0f4bc7c03d373?sid=f720fd2e-807b-4aa4-8e57-d856f3478a80",
		thumbnail:
			"https://cdn.loom.com/sessions/thumbnails/9f159044711b42d5b2e0f4bc7c03d373-with-play.gif",
		duration: 268, // 4:28 in seconds
		views: 0,
		isPublished: true,
		owner: USERS[0],
		tags: ["Programming", "Solidity"],
		createdAt: "2023-05-10T14:30:00.000Z",
		updatedAt: "2023-05-10T14:30:00.000Z",
	},
	{
		_id: "video2",
		title: "Project Presentation for ETH-Avax Intermediate Course 👨‍💻",
		description:
			"Hi viewers, I'm Raushan Kumar presenting my project for module 1 of ETH avax intermediate course. I've created a map data structure to manage addresses and balances, with functions for account, deposit, and balance retrieval. The deposit function validates inputs and ensures the minimum deposit amount. Watch to see how the contract handles transactions and validations. Action: Review the project and provide feedback.",
		videofile:
			"https://www.loom.com/embed/19eb49e645524192b64eeed738b3d5ab?sid=e733f547-384c-4235-b4f3-efbae7c996ec",
		thumbnail:
			"https://cdn.loom.com/sessions/thumbnails/19eb49e645524192b64eeed738b3d5ab-with-play.gif",
		duration: 210, // 3:30 in seconds
		views: 8700,
		isPublished: true,
		owner: USERS[1],
		tags: ["Programming", "Solidity"],
		createdAt: "2023-06-15T09:45:00.000Z",
		updatedAt: "2023-06-15T09:45:00.000Z",
	},
	{
		_id: "video3",
		title: "Modern CSS Techniques",
		description:
			"Explore modern CSS techniques like Grid, Flexbox, and CSS Variables.",
		videofile: "https://example.com/videos/modern-css.mp4",
		thumbnail:
			"https://images.pexels.com/photos/270373/pexels-photo-270373.jpeg",
		duration: 845, // 14:05 in seconds
		views: 6200,
		isPublished: true,
		owner: USERS[2],
		tags: ["Programming", "CSS", "Web Design"],
		createdAt: "2023-07-22T16:15:00.000Z",
		updatedAt: "2023-07-22T16:15:00.000Z",
	},
	{
		_id: "video4",
		title: "10 Healthy Breakfast Ideas",
		description:
			"Start your day right with these 10 healthy and delicious breakfast recipes.",
		videofile: "https://example.com/videos/healthy-breakfast.mp4",
		thumbnail:
			"https://images.pexels.com/photos/376464/pexels-photo-376464.jpeg",
		duration: 723, // 12:03 in seconds
		views: 15800,
		isPublished: true,
		owner: USERS[1],
		tags: ["Health", "Cooking", "Food"],
		createdAt: "2023-08-05T08:20:00.000Z",
		updatedAt: "2023-08-05T08:20:00.000Z",
	},
	{
		_id: "video5",
		title: "Investing for Beginners",
		description:
			"Learn the basics of investing and how to start building your portfolio.",
		videofile: "https://example.com/videos/investing-basics.mp4",
		thumbnail:
			"https://images.pexels.com/photos/534216/pexels-photo-534216.jpeg",
		duration: 1562, // 26:02 in seconds
		views: 22400,
		isPublished: true,
		owner: USERS[0],
		tags: ["Finance", "Investing", "Money"],
		createdAt: "2023-09-12T11:10:00.000Z",
		updatedAt: "2023-09-12T11:10:00.000Z",
	},
];

// Mock playlists
export const PLAYLISTS = [
	{
		_id: "playlist1",
		name: "Web Development",
		description: "Videos about web development techniques and technologies",
		videos: [VIDEOS[0], VIDEOS[1], VIDEOS[2]],
		owner: USERS[0],
		createdAt: "2023-06-01T10:00:00.000Z",
	},
	{
		_id: "playlist2",
		name: "Lifestyle",
		description: "Videos about health, cooking, and wellness",
		videos: [VIDEOS[3]],
		owner: USERS[1],
		createdAt: "2023-08-15T14:30:00.000Z",
	},
	{
		_id: "playlist3",
		name: "Finance Guides",
		description: "Videos about personal finance and investing",
		videos: [VIDEOS[4]],
		owner: USERS[0],
		createdAt: "2023-09-20T16:45:00.000Z",
	},
];

// Mock comments
export const COMMENTS = [
	{
		_id: "comment1",
		content:
			"Great tutorial! This really helped me understand hooks better.",
		video: "video1",
		owner: USERS[1],
		createdAt: "2023-05-11T09:30:00.000Z",
		updatedAt: "2023-05-11T09:30:00.000Z",
	},
	{
		_id: "comment2",
		content: "Could you make a follow-up video on custom hooks?",
		video: "video1",
		owner: USERS[2],
		createdAt: "2023-05-12T14:15:00.000Z",
		updatedAt: "2023-05-12T14:15:00.000Z",
	},
	{
		_id: "comment3",
		content: "I tried implementing this API pattern and it works great!",
		video: "video2",
		owner: USERS[0],
		createdAt: "2023-06-16T11:45:00.000Z",
		updatedAt: "2023-06-16T11:45:00.000Z",
	},
];

// Mock tweets/community posts
export const TWEETS = [
	{
		_id: "tweet1",
		title: "Just launched a new course!",
		description:
			"Check out my new course on advanced React patterns. Link in bio!",
		tags: ["Programming", "React", "Education"],
		owner: USERS[0],
		createdAt: "2023-07-05T08:30:00.000Z",
		updatedAt: "2023-07-05T08:30:00.000Z",
	},
	{
		_id: "tweet2",
		title: "Looking for collaborators",
		description:
			"I'm working on a new project about health and wellness. Looking for nutrition experts to collaborate!",
		tags: ["Health", "Collaboration", "Project"],
		owner: USERS[1],
		createdAt: "2023-08-12T15:45:00.000Z",
		updatedAt: "2023-08-12T15:45:00.000Z",
	},
	{
		_id: "tweet3",
		title: "Tech Conference Highlights",
		description:
			"Just got back from TechCon 2023. Here are my top 3 takeaways: 1) AI is changing everything, 2) WebAssembly is gaining traction, 3) Performance optimization is more important than ever.",
		tags: ["Technology", "Conference", "Networking"],
		owner: USERS[2],
		createdAt: "2023-09-22T10:20:00.000Z",
		updatedAt: "2023-09-22T10:20:00.000Z",
	},
];

// Sample chat responses for video content
export const AI_CHAT_RESPONSES = {
	video1: [
		{
			question: "What are React Hooks?",
			answer: 'React Hooks are functions that let you "hook into" React state and lifecycle features from function components. They were introduced in React 16.8 as a way to use state and other React features without writing a class component.',
			timestamp: { text: "1:05", seconds: 65 },
		},
		{
			question: "What is useState?",
			answer: "useState is a Hook that lets you add React state to function components. It returns a stateful value and a function to update it. During initial render, the returned state is the same as the value passed as the first argument.",
			timestamp: { text: "3:22", seconds: 202 },
		},
		{
			question: "What is useEffect?",
			answer: "useEffect is a Hook that lets you perform side effects in function components. It serves the same purpose as componentDidMount, componentDidUpdate, and componentWillUnmount in React classes, but unified into a single API.",
			timestamp: { text: "5:47", seconds: 347 },
		},
	],
	video2: [
		{
			question: "What is REST?",
			answer: "REST (Representational State Transfer) is an architectural style for designing networked applications. It relies on a stateless, client-server communication protocol, almost always HTTP.",
			timestamp: { text: "2:15", seconds: 135 },
		},
		{
			question: "How do you set up Express?",
			answer: 'To set up Express, first install it with npm: `npm install express`. Then import it in your file with `const express = require("express")` and initialize your app with `const app = express()`.',
			timestamp: { text: "6:30", seconds: 390 },
		},
	],
};

// API Endpoints (for reference when simulating API calls)
export const API_ENDPOINTS = {
	// Auth
	LOGIN: "/api/auth/login",
	SIGNUP: "/api/auth/signup",
	LOGOUT: "/api/auth/logout",
	REFRESH_TOKEN: "/api/auth/refresh-token",
	CURRENT_USER: "/api/auth/current-user",

	// Videos
	VIDEOS: "/api/videos",
	VIDEO_BY_ID: (id: string) => `/api/videos/${id}`,
	VIDEO_COMMENTS: (id: string) => `/api/videos/${id}/comments`,

	// Playlists
	PLAYLISTS: "/api/playlists",
	PLAYLIST_BY_ID: (id: string) => `/api/playlists/${id}`,
	USER_PLAYLISTS: (userId: string) => `/api/users/${userId}/playlists`,

	// Tweets
	TWEETS: "/api/tweets",
	TWEET_BY_ID: (id: string) => `/api/tweets/${id}`,
	USER_TWEETS: (userId: string) => `/api/users/${userId}/tweets`,

	// Users
	USERS: "/api/users",
	USER_BY_ID: (id: string) => `/api/users/${id}`,
	USER_VIDEOS: (userId: string) => `/api/users/${userId}/videos`,
};

// Common utility constants
export const VIDEO_CACHE_DURATION = 2 * 60 * 1000; // 2 minutes in milliseconds
