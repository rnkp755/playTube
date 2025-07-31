import React from "react";

const Loader: React.FC<{ size?: "sm" | "md" | "lg" }> = ({ size = "md" }) => {
	const sizeClasses = {
		sm: "w-5 h-5 border-2",
		md: "w-8 h-8 border-3",
		lg: "w-12 h-12 border-4",
	};

	return (
		<div className="flex justify-center items-center p-4 h-full z-50">
			<div
				className={`${sizeClasses[size]} rounded-full border-t-cyan-400 border-r-cyan-400 border-b-gray-700 border-l-gray-700 animate-spin`}
			></div>
		</div>
	);
};

export default Loader;
