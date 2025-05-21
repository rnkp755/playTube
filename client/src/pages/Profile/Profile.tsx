import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { User, Video, Playlist, Tweet } from "../../types";
import { videoService } from "../../services/videoService";
import { playlistService } from "../../services/playlistService";
import { tweetService } from "../../services/tweetService";
import { useAuth } from "../../contexts/AuthContext";
import VideoCard from "../../components/Video/VideoCard";
import TweetCard from "../../components/Tweet/TweetCard";
import Loader from "../../components/Common/Loader";
import { Edit, Settings, Grid, ListVideo, MessageSquare } from "lucide-react";

interface PlaylistCardProps {
	playlist: Playlist;
}

const PlaylistCard: React.FC<PlaylistCardProps> = ({ playlist }) => {
	return (
		<Link to={`/playlist/${playlist._id}`} className="card card-hover">
			<div className="relative">
				{playlist.videos.length > 0 ? (
					<img
						src={
							typeof playlist.videos[0] === "object"
								? playlist.videos[0].thumbnail
								: "https://images.pexels.com/photos/1092671/pexels-photo-1092671.jpeg"
						}
						alt={playlist.name}
						className="w-full h-40 object-cover"
					/>
				) : (
					<div className="w-full h-40 bg-card-hover flex items-center justify-center">
						<ListVideo className="w-10 h-10 text-muted" />
					</div>
				)}
				<div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-3">
					<div>
						<h3 className="text-white font-medium">
							{playlist.name}
						</h3>
						<p className="text-white/80 text-sm">
							{playlist.videos.length} videos
						</p>
					</div>
				</div>
			</div>
		</Link>
	);
};

const Profile: React.FC = () => {
	const { username } = useParams<{ username: string }>();
	const { user: currentUser } = useAuth();

	const [user, setUser] = useState<User | null>(null);
	const [videos, setVideos] = useState<Video[]>([]);
	const [playlists, setPlaylists] = useState<Playlist[]>([]);
	const [tweets, setTweets] = useState<Tweet[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [activeTab, setActiveTab] = useState<
		"videos" | "playlists" | "community"
	>("videos");

	const isOwner = currentUser?.username === username;

	// Mock fetching user data (in a real app, would call API)
	useEffect(() => {
		const fetchUserData = async () => {
			setIsLoading(true);
			setError(null);

			try {
				// In a real app, this would be an API call
				// For demo, use first user from mocked data
				const userData = {
					_id: "user1",
					username: username || "user",
					email: "user@example.com",
					fullname: username
						? `${username.charAt(0).toUpperCase()}${username.slice(
								1
						  )}`
						: "User",
					avatar: "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg",
					coverImage:
						"https://images.pexels.com/photos/1591056/pexels-photo-1591056.jpeg",
					createdAt: new Date().toISOString(),
				};

				setUser(userData);

				// Fetch videos (simulated)
				if (isOwner) {
					// For owner, show all videos including unpublished
					const userVideos = await videoService.getVideos();
					setVideos(
						userVideos.filter((v) => v.owner.username === username)
					);
				} else {
					// For non-owner, show only published videos
					const userVideos = await videoService.getVideos();
					setVideos(
						userVideos.filter(
							(v) =>
								v.owner.username === username && v.isPublished
						)
					);
				}

				// Fetch playlists (simulated)
				if (currentUser) {
					const userPlaylists =
						await playlistService.getUserPlaylists(currentUser._id);
					setPlaylists(userPlaylists);
				}

				// Fetch tweets (simulated)
				if (currentUser) {
					const userTweets = await tweetService.getUserTweets(
						currentUser._id
					);
					setTweets(userTweets);
				}
			} catch (error) {
				console.error("Error fetching user data:", error);
				setError(
					"Failed to load user profile. Please try again later."
				);
			} finally {
				setIsLoading(false);
			}
		};

		if (username) {
			fetchUserData();
		}
	}, [username, currentUser, isOwner]);

	if (isLoading) {
		return (
			<div className="flex justify-center items-center h-60">
				<Loader size="lg" />
			</div>
		);
	}

	if (error || !user) {
		return (
			<div className="text-center py-10">
				<h2 className="text-xl font-semibold mb-2">User Not Found</h2>
				<p className="mb-4">
					{error || `The user ${username} doesn't exist.`}
				</p>
				<Link to="/" className="btn btn-primary">
					Go Home
				</Link>
			</div>
		);
	}

	return (
		<div>
			{/* Cover image */}
			<div className="relative h-48 sm:h-64 rounded-lg overflow-hidden">
				{user.coverImage ? (
					<img
						src={
							typeof user.coverImage === "string"
								? user.coverImage
								: ""
						}
						alt={`${user.username}'s cover`}
						className="w-full h-full object-cover"
					/>
				) : (
					<div className="w-full h-full bg-card-hover"></div>
				)}

				{isOwner && (
					<Link
						to="/settings/profile"
						className="absolute top-4 right-4 btn btn-outline bg-card/80 hover:bg-card"
					>
						<Edit className="h-4 w-4 mr-1" />
						Edit Profile
					</Link>
				)}
			</div>

			{/* Profile info */}
			<div className="relative px-4 sm:px-6">
				<div className="flex flex-col sm:flex-row items-center sm:items-end gap-4 -mt-16 sm:-mt-12 mb-6">
					<img
						src={
							user.avatar ||
							"https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg"
						}
						alt={user.username}
						className="w-24 h-24 sm:w-32 sm:h-32 rounded-full border-4 border-bg object-cover"
					/>
					<div className="flex-1 text-center sm:text-left">
						<h1 className="text-2xl font-bold">{user.fullname}</h1>
						<p className="text-muted">@{user.username}</p>
						<div className="mt-2 flex flex-wrap justify-center sm:justify-start gap-3">
							<div>
								<span className="font-semibold">
									{videos.length}
								</span>
								<span className="text-muted ml-1">videos</span>
							</div>
							<div>
								<span className="font-semibold">
									{playlists.length}
								</span>
								<span className="text-muted ml-1">
									playlists
								</span>
							</div>
							<div>
								<span className="font-semibold">1.2K</span>
								<span className="text-muted ml-1">
									subscribers
								</span>
							</div>
						</div>
					</div>

					{isOwner ? (
						<Link to="/settings" className="btn btn-outline">
							<Settings className="h-4 w-4 mr-1" />
							Settings
						</Link>
					) : (
						<button className="btn btn-primary">Subscribe</button>
					)}
				</div>
			</div>

			{/* Tabs */}
			<div className="border-b border-border">
				<div className="flex overflow-x-auto">
					<button
						className={`px-4 py-2 font-medium whitespace-nowrap ${
							activeTab === "videos"
								? "border-b-2 border-primary"
								: "text-muted hover:text-fg"
						}`}
						onClick={() => setActiveTab("videos")}
					>
						<Grid className="w-4 h-4 inline mr-1" />
						Videos
					</button>
					<button
						className={`px-4 py-2 font-medium whitespace-nowrap ${
							activeTab === "playlists"
								? "border-b-2 border-primary"
								: "text-muted hover:text-fg"
						}`}
						onClick={() => setActiveTab("playlists")}
					>
						<ListVideo className="w-4 h-4 inline mr-1" />
						Playlists
					</button>
					<button
						className={`px-4 py-2 font-medium whitespace-nowrap ${
							activeTab === "community"
								? "border-b-2 border-primary"
								: "text-muted hover:text-fg"
						}`}
						onClick={() => setActiveTab("community")}
					>
						<MessageSquare className="w-4 h-4 inline mr-1" />
						Community
					</button>
				</div>
			</div>

			{/* Tab content */}
			<div className="mt-6 px-4 sm:px-6">
				{activeTab === "videos" && (
					<div>
						{videos.length === 0 ? (
							<div className="text-center py-10 bg-card rounded-lg">
								<p className="text-lg mb-4">
									No videos uploaded yet.
								</p>
								{isOwner && (
									<Link
										to="/upload"
										className="btn btn-primary"
									>
										Upload Your First Video
									</Link>
								)}
							</div>
						) : (
							<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
								{videos.map((video) => (
									<VideoCard key={video._id} video={video} />
								))}
							</div>
						)}
					</div>
				)}

				{activeTab === "playlists" && (
					<div>
						{playlists.length === 0 ? (
							<div className="text-center py-10 bg-card rounded-lg">
								<p className="text-lg mb-4">
									No playlists created yet.
								</p>
								{isOwner && (
									<Link
										to="/upload"
										className="btn btn-primary"
									>
										Create Your First Playlist
									</Link>
								)}
							</div>
						) : (
							<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
								{playlists.map((playlist) => (
									<PlaylistCard
										key={playlist._id}
										playlist={playlist}
									/>
								))}
							</div>
						)}
					</div>
				)}

				{activeTab === "community" && (
					<div>
						{tweets.length === 0 ? (
							<div className="text-center py-10 bg-card rounded-lg">
								<p className="text-lg mb-4">
									No community posts yet.
								</p>
								{isOwner && (
									<Link
										to="/community"
										className="btn btn-primary"
									>
										Create Your First Post
									</Link>
								)}
							</div>
						) : (
							<div className="space-y-4 max-w-2xl mx-auto">
								{tweets.map((tweet) => (
									<TweetCard key={tweet._id} tweet={tweet} />
								))}
							</div>
						)}
					</div>
				)}
			</div>
		</div>
	);
};

export default Profile;
