// User related types
export interface User {
	username: string;
	email: string;
	fullname: string;
	avatar: File | string;
	coverImage: File | string;
}

// Video related types
export interface Video {
	_id: string;
	title: string;
	description: string;
	videoFile: string;
	thumbnail: string;
	duration: number;
	views: number;
	isPublished: boolean;
	videoOwner: User;
	tags: string[];
	playlist?: Playlist;
	createdAt: string;
	updatedAt: string;
}

// Playlist related types
export interface Playlist {
	_id: string;
	name: string;
	description?: string;
	videos: Video[] | string[];
	owner: User | string;
	createdAt: string;
}

// Comment related types
export interface Comment {
	_id: string;
	content: string;
	video: string;
	owner: User;
	createdAt: string;
	updatedAt: string;
}

// Community Post / Tweet types
export interface Tweet {
	_id: string;
	title: string;
	description: string;
	tags: string[];
	owner: User;
	createdAt: string;
	updatedAt: string;
}

// Video suggestion types
export interface VideoSuggestion {
	_id: string;
	title: string;
	thumbnail: string;
	duration: number;
	views: number;
	owner: {
		username: string;
		avatar?: string;
	};
	createdAt: string;
}

// AI Chat types
export interface ChatMessage {
	id: string;
	role: "user" | "assistant";
	content: string;
	timestamp?: {
		text: string;
		seconds: number;
	};
}

// Form data types
export interface VideoFormData {
	title: string;
	description: string;
	tags: string[];
	videoFile: File | null;
	thumbnail: File | null;
	playlist: string | null;
	isPublished: boolean;
}

export interface TweetFormData {
	title: string;
	description: string;
	tags: string[];
}
