import React, {
	useState,
	useRef,
	useEffect,
	forwardRef,
	useImperativeHandle,
} from "react";
import {
	Play,
	Pause,
	Volume2,
	VolumeX,
	Maximize,
	SkipBack,
	SkipForward,
} from "lucide-react";

interface VideoPlayerProps {
	videoUrl: string;
	onTimeUpdate?: (currentTime: number) => void;
	initialTime?: number;
}

export interface VideoPlayerRef {
	seekTo: (seconds: number) => void;
	play: () => void;
	pause: () => void;
}

const VideoPlayer = forwardRef<VideoPlayerRef, VideoPlayerProps>(
	({ videoUrl, onTimeUpdate, initialTime = 0 }, ref) => {
		const [isPlaying, setIsPlaying] = useState(false);
		const [currentTime, setCurrentTime] = useState(0);
		const [duration, setDuration] = useState(0);
		const [volume, setVolume] = useState(1);
		const [isMuted, setIsMuted] = useState(false);
		const [isFullscreen, setIsFullscreen] = useState(false);
		const videoRef = useRef<HTMLVideoElement>(null);
		const playerRef = useRef<HTMLDivElement>(null);

		// Set initial time if provided
		useEffect(() => {
			if (videoRef.current && initialTime > 0) {
				videoRef.current.currentTime = initialTime;
			}
		}, [initialTime]);

		// Expose methods to parent component
		useImperativeHandle(ref, () => ({
			seekTo: (seconds: number) => {
				if (videoRef.current) {
					videoRef.current.currentTime = seconds;
					videoRef.current.play();
					setIsPlaying(true);
				}
			},
			play: () => {
				if (videoRef.current) {
					videoRef.current.play();
					setIsPlaying(true);
				}
			},
			pause: () => {
				if (videoRef.current) {
					videoRef.current.pause();
					setIsPlaying(false);
				}
			},
		}));

		// Handle play/pause
		const togglePlay = () => {
			if (videoRef.current) {
				if (isPlaying) {
					videoRef.current.pause();
				} else {
					videoRef.current.play();
				}
				setIsPlaying(!isPlaying);
			}
		};

		// Handle volume change
		const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
			const newVolume = parseFloat(e.target.value);
			setVolume(newVolume);
			if (videoRef.current) {
				videoRef.current.volume = newVolume;
			}
			setIsMuted(newVolume === 0);
		};

		// Toggle mute
		const toggleMute = () => {
			if (videoRef.current) {
				if (isMuted) {
					videoRef.current.volume = volume || 0.5;
					setIsMuted(false);
				} else {
					videoRef.current.volume = 0;
					setIsMuted(true);
				}
			}
		};

		// Format time (seconds to MM:SS)
		const formatTime = (time: number) => {
			const minutes = Math.floor(time / 60);
			const seconds = Math.floor(time % 60);
			return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
		};

		// Handle seeking
		const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
			const seekTime = parseFloat(e.target.value);
			setCurrentTime(seekTime);
			if (videoRef.current) {
				videoRef.current.currentTime = seekTime;
			}
		};

		// Toggle fullscreen
		const toggleFullscreen = () => {
			if (!playerRef.current) return;

			if (!isFullscreen) {
				if (playerRef.current.requestFullscreen) {
					playerRef.current.requestFullscreen();
				}
			} else {
				if (document.exitFullscreen) {
					document.exitFullscreen();
				}
			}
		};

		// Skip forward/backward
		const skip = (seconds: number) => {
			if (videoRef.current) {
				videoRef.current.currentTime += seconds;
			}
		};

		// Update time
		const handleTimeUpdate = () => {
			if (videoRef.current) {
				const time = videoRef.current.currentTime;
				setCurrentTime(time);
				onTimeUpdate?.(time);
			}
		};

		// Handle video metadata loaded
		const handleLoadedMetadata = () => {
			if (videoRef.current) {
				setDuration(videoRef.current.duration);
			}
		};

		// Handle fullscreen change
		useEffect(() => {
			const handleFullscreenChange = () => {
				setIsFullscreen(!!document.fullscreenElement);
			};

			document.addEventListener(
				"fullscreenchange",
				handleFullscreenChange
			);
			return () => {
				document.removeEventListener(
					"fullscreenchange",
					handleFullscreenChange
				);
			};
		}, []);

		return (
			<div
				ref={playerRef}
				className="video-container relative w-full bg-black rounded-lg overflow-hidden"
			>
				{videoUrl.startsWith("https://www.loom.com/embed/") ? (
					<div
						style={{
							position: "relative",
							paddingBottom: "56.25%",
							height: 0,
						}}
					>
						<iframe
							src={videoUrl}
							allowFullScreen
							style={{
								position: "absolute",
								top: 0,
								left: 0,
								width: "100%",
								height: "100%",
							}}
						></iframe>
					</div>
				) : (
					<>
						<video
							ref={videoRef}
							src={videoUrl}
							className="w-full h-full"
							onClick={togglePlay}
							onTimeUpdate={handleTimeUpdate}
							onLoadedMetadata={handleLoadedMetadata}
							onPlay={() => setIsPlaying(true)}
							onPause={() => setIsPlaying(false)}
						/>

						<div className="video-controls">
							{/* Progress bar */}
							<div className="progress-container mb-2">
								<input
									type="range"
									min={0}
									max={duration || 0}
									value={currentTime}
									onChange={handleSeek}
									className="w-full absolute inset-0 opacity-0 cursor-pointer z-10"
								/>
								<div
									className="progress-bar"
									style={{
										width: `${
											(currentTime / (duration || 1)) *
											100
										}%`,
									}}
								>
									<div className="progress-handle"></div>
								</div>
							</div>

							{/* Controls row */}
							<div className="flex items-center justify-between">
								<div className="flex items-center gap-2">
									{/* Play/Pause button */}
									<button
										onClick={togglePlay}
										className="p-1 hover:text-primary"
										aria-label={
											isPlaying ? "Pause" : "Play"
										}
									>
										{isPlaying ? (
											<Pause className="w-5 h-5" />
										) : (
											<Play className="w-5 h-5" />
										)}
									</button>

									{/* Skip buttons */}
									<button
										onClick={() => skip(-10)}
										className="p-1 hover:text-primary"
										aria-label="Skip 10 seconds back"
									>
										<SkipBack className="w-4 h-4" />
									</button>

									<button
										onClick={() => skip(10)}
										className="p-1 hover:text-primary"
										aria-label="Skip 10 seconds forward"
									>
										<SkipForward className="w-4 h-4" />
									</button>

									{/* Time display */}
									<div className="text-xs text-white ml-1">
										{formatTime(currentTime)} /{" "}
										{formatTime(duration)}
									</div>
								</div>

								<div className="flex items-center gap-2">
									{/* Volume control */}
									<div className="hidden sm:flex items-center">
										<button
											onClick={toggleMute}
											className="p-1 hover:text-primary"
											aria-label={
												isMuted ? "Unmute" : "Mute"
											}
										>
											{isMuted ? (
												<VolumeX className="w-5 h-5" />
											) : (
												<Volume2 className="w-5 h-5" />
											)}
										</button>
										<input
											type="range"
											min={0}
											max={1}
											step={0.1}
											value={isMuted ? 0 : volume}
											onChange={handleVolumeChange}
											className="w-16 accent-primary"
										/>
									</div>

									{/* Fullscreen button */}
									<button
										onClick={toggleFullscreen}
										className="p-1 hover:text-primary"
										aria-label={
											isFullscreen
												? "Exit Fullscreen"
												: "Enter Fullscreen"
										}
									>
										<Maximize className="w-5 h-5" />
									</button>
								</div>
							</div>
						</div>
					</>
				)}
			</div>
		);
	}
);

VideoPlayer.displayName = "VideoPlayer";

export default VideoPlayer;
