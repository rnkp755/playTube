import React from "react";
import { Link } from "react-router-dom";
import { Video } from "../../types";

interface VideoCardProps {
	video: Video;
	horizontal?: boolean;
}

const VideoCard: React.FC<VideoCardProps> = ({ video, horizontal = false }) => {
	// Format view count
	const formatViewCount = (views: number): string => {
		if (views >= 1000000) {
			return `${(views / 1000000).toFixed(1)}M views`;
		} else if (views >= 1000) {
			return `${(views / 1000).toFixed(1)}K views`;
		} else {
			return `${views} views`;
		}
	};

	// Format duration
	const formatDuration = (seconds: number): string => {
		const hours = Math.floor(seconds / 3600);
		const minutes = Math.floor((seconds % 3600) / 60);
		const remainingSeconds = seconds % 60;

		if (hours > 0) {
			return `${hours}:${minutes
				.toString()
				.padStart(2, "0")}:${remainingSeconds
				.toString()
				.padStart(2, "0")}`;
		} else {
			return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
		}
	};

	// Format date
	const formatDate = (dateString: string): string => {
		const now = new Date();
		const date = new Date(dateString);
		const diffInMs = now.getTime() - date.getTime();
		const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

		if (diffInDays === 0) {
			return "Today";
		} else if (diffInDays === 1) {
			return "Yesterday";
		} else if (diffInDays < 7) {
			return `${diffInDays} days ago`;
		} else if (diffInDays < 30) {
			return `${Math.floor(diffInDays / 7)} weeks ago`;
		} else if (diffInDays < 365) {
			return `${Math.floor(diffInDays / 30)} months ago`;
		} else {
			return `${Math.floor(diffInDays / 365)} years ago`;
		}
	};

	return (
		<div className={`card card-hover ${horizontal ? "flex" : ""}`}>
			<Link
				to={`/video/${video._id}`}
				className={`block relative ${
					horizontal ? "w-40 sm:w-48" : "w-full"
				}`}
			>
				<img
					src={video.thumbnail}
					alt={video.title}
					className={`w-full object-cover ${
						horizontal ? "h-24 sm:h-28" : "h-40 sm:h-48"
					}`}
					loading="lazy"
				/>
				<span className="duration-badge">
					{formatDuration(video.duration)}
				</span>
			</Link>

			<div className={`p-3 ${horizontal ? "flex-1" : ""}`}>
				<div
					className={`flex ${horizontal ? "" : "items-start gap-3"}`}
				>
					{!horizontal && (
						<Link
							to={`/profile/${video.videoOwner.username}`}
							className="flex-shrink-0"
						>
							<img
								src={video.videoOwner.avatar}
								alt={video.videoOwner.username}
								className="w-9 h-9 rounded-full object-cover"
								loading="lazy"
							/>
						</Link>
					)}

					<div className="flex-1 min-w-0">
						<Link to={`/video/${video._id}`} className="block">
							<h3
								className={`font-medium line-clamp-2 ${
									horizontal ? "text-sm" : ""
								}`}
							>
								{video.title}
							</h3>
						</Link>

						<Link
							to={`/profile/${video.videoOwner.username}`}
							className="block text-sm text-muted mt-1 hover:text-fg"
						>
							{video.videoOwner.username}
						</Link>

						<div className="flex items-center text-xs text-muted mt-1">
							<span>{formatViewCount(video.views)}</span>
							<span className="mx-1">•</span>
							<span>{formatDate(video.createdAt)}</span>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default VideoCard;
