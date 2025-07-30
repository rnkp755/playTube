import React, { useState, useEffect } from "react";
import { Video } from "../../types";
import { videoService } from "../../services/videoService";
import VideoCard from "../../components/Video/VideoCard";
import Loader from "../../components/Common/Loader";
import API from "../../utils/axios";
import { SERVER_URL } from "../../utils/constants";

const Home: React.FC = () => {
	const query =
		new URLSearchParams(window.location.search).get("query") || "";
	const [videos, setVideos] = useState<Video[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const fetchVideos = async () => {
			setIsLoading(true);
			setError(null);

			try {
				console.log("Fetching videos with query:", query);
				const response = await API.get(
					`/videos${query ? `?query=${query}` : ""}`
				);
				console.log("Fetched videos:", response.data);
				const videos = response.data?.data?.videos as Video[];
				if (Array.isArray(videos)) {
					setVideos(videos);
				}
			} catch (error) {
				console.error("Error fetching videos:", error);
				setError("Failed to load videos. Please try again later.");
			} finally {
				setIsLoading(false);
			}
		};

		fetchVideos();
	}, [query]);

	return (
		<div>
			<h1 className="text-2xl font-bold mb-6">Recommended</h1>

			{isLoading ? (
				<div className="flex justify-center items-center h-60">
					<Loader size="lg" />
				</div>
			) : error ? (
				<div className="p-4 bg-error/10 rounded-lg text-center">
					<p className="text-error">{error}</p>
					<button
						onClick={() => window.location.reload()}
						className="btn btn-outline mt-2"
					>
						Try Again
					</button>
				</div>
			) : (
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
					{videos.map((video) => (
						<VideoCard key={video._id} video={video} />
					))}
				</div>
			)}
		</div>
	);
};

export default Home;
