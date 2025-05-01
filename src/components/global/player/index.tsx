import { Button } from "antd";
import Hls from "hls.js";
import Plyr from "plyr";
import { useCallback, useEffect, useRef, useState } from "react";
import "plyr/dist/plyr.css";

const Player: React.FC<{
	hslUrl: string;
	thumbnailsUrl?: string;
	posterUrl?: string;
	videoId: string;
}> = ({ hslUrl, thumbnailsUrl, posterUrl, videoId }) => {
	const videoRef = useRef<HTMLVideoElement>(null);
	const playerRef = useRef<Plyr | null>(null);
	const hlsRef = useRef<Hls | null>(null);
	const [error, setError] = useState<string | null>(null);

	const initializePlayer = useCallback(() => {
		const video = videoRef.current;
		if (!video) return;

		if (hlsRef.current) hlsRef.current.destroy();
		if (playerRef.current) playerRef.current.destroy();

		if (Hls.isSupported()) {
			hlsRef.current = new Hls({ debug: true });
			hlsRef.current.loadSource(hslUrl);
			hlsRef.current.attachMedia(video);

			hlsRef.current.on(Hls.Events.MANIFEST_PARSED, () => {
				setError(null);
				const levels =
					hlsRef.current?.levels.map((level) => level.height) || [];

				playerRef.current = new Plyr(video, {
					controls: [
						"play-large",
						"play",
						"progress",
						"current-time",
						"duration",
						"mute",
						"volume",
						"settings",
						"fullscreen",
					],
					settings: ["quality"],
					quality: {
						default: "auto",
						options: ["auto", ...levels],
						forced: true,
						onChange: (quality: string | number) => {
							if (hlsRef.current) {
								if (quality === "auto") {
									hlsRef.current.currentLevel = -1;
								} else {
									const levelIndex = levels.indexOf(quality as number);
									if (levelIndex !== -1)
										hlsRef.current.currentLevel = levelIndex;
								}
							}
						},
					},
					previewThumbnails: thumbnailsUrl
						? { enabled: true, src: thumbnailsUrl }
						: { enabled: false },
				});

				video.currentTime = 0;
				video.play().catch(() => console.log("Autoplay blocked"));
			});

			hlsRef.current.on(Hls.Events.ERROR, (event, data) => {
				console.error("HLS Error:", data);
				setError(`Stream Error: ${data.type} - ${data.details}`);
				if (data.fatal) {
					hlsRef.current?.startLoad();
				}
			});
		} else if (video.canPlayType("application/vnd.apple.mpegurl")) {
			video.src = hslUrl;
			playerRef.current = new Plyr(video, {
				controls: [
					"play-large",
					"play",
					"progress",
					"current-time",
					"duration",
					"mute",
					"volume",
					"settings",
					"fullscreen",
				],
			});
			video.currentTime = 0;
			video.play().catch(() => console.log("Autoplay blocked"));
		}
	}, [hslUrl, thumbnailsUrl, videoId]);

	useEffect(() => {
		initializePlayer();
		return () => {
			if (hlsRef.current) hlsRef.current.destroy();
			if (playerRef.current) playerRef.current.destroy();
		};
	}, [initializePlayer]);

	return (
		<div className="plyr-react plyr relative">
			<video
				ref={videoRef}
				controls
				playsInline
				poster={posterUrl}
				className="w-full"
			/>
			{error && (
				<div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 z-10">
					<div className="text-white text-center">
						<p>{error}</p>
						<Button
							onClick={() => {
								setError(null);
								initializePlayer();
							}}
							className="mt-2 px-4 py-2 bg-blue-600 rounded hover:bg-blue-700"
						>
							Retry
						</Button>
					</div>
				</div>
			)}
		</div>
	);
};

export default Player;
