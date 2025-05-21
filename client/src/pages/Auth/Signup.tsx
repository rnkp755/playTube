import React, { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { Eye, EyeOff, UserPlus, Upload, Image } from "lucide-react";

const Signup: React.FC = () => {
	const { signup } = useAuth();
	const navigate = useNavigate();

	const [formData, setFormData] = useState({
		username: "",
		email: "",
		fullName: "",
		password: "",
		confirmPassword: "",
		avatar: null as File | null,
		coverImage: null as File | null,
	});

	const [errors, setErrors] = useState<Record<string, string>>({});
	const [showPassword, setShowPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [signupError, setSignupError] = useState("");
	const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
	const [coverPreview, setCoverPreview] = useState<string | null>(null);

	const avatarInputRef = useRef<HTMLInputElement>(null);
	const coverInputRef = useRef<HTMLInputElement>(null);

	// Handle input change
	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;

		setFormData((prev) => ({
			...prev,
			[name]: value,
		}));

		// Clear errors
		if (errors[name]) {
			setErrors((prev) => ({ ...prev, [name]: "" }));
		}

		// Clear signup error
		if (signupError) {
			setSignupError("");
		}
	};

	// Handle avatar selection
	const handleAvatarSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file) {
			// Check file type and size
			if (!file.type.startsWith("image/")) {
				setErrors((prev) => ({
					...prev,
					avatar: "Please select a valid image file",
				}));
				return;
			}

			if (file.size > 5 * 1024 * 1024) {
				// 5MB limit
				setErrors((prev) => ({
					...prev,
					avatar: "Image file size must be less than 5MB",
				}));
				return;
			}

			setFormData((prev) => ({ ...prev, avatar: file }));
			setAvatarPreview(URL.createObjectURL(file));
			setErrors((prev) => ({ ...prev, avatar: "" }));
		}
	};

	// Handle cover image selection
	const handleCoverSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file) {
			// Check file type and size
			if (!file.type.startsWith("image/")) {
				setErrors((prev) => ({
					...prev,
					coverImage: "Please select a valid image file",
				}));
				return;
			}

			if (file.size > 5 * 1024 * 1024) {
				// 5MB limit
				setErrors((prev) => ({
					...prev,
					coverImage: "Image file size must be less than 5MB",
				}));
				return;
			}

			setFormData((prev) => ({ ...prev, coverImage: file }));
			setCoverPreview(URL.createObjectURL(file));
			setErrors((prev) => ({ ...prev, coverImage: "" }));
		}
	};

	// Validate form
	const validateForm = (): boolean => {
		const newErrors: Record<string, string> = {};

		// Username validation
		if (!formData.username.trim()) {
			newErrors.username = "Username is required";
		} else if (formData.username.length < 3) {
			newErrors.username = "Username must be at least 3 characters";
		} else if (!/^[a-zA-Z0-9_]+$/.test(formData.username)) {
			newErrors.username =
				"Username can only contain letters, numbers, and underscores";
		}

		// Email validation
		if (!formData.email.trim()) {
			newErrors.email = "Email is required";
		} else if (!/\S+@\S+\.\S+/.test(formData.email)) {
			newErrors.email = "Email is invalid";
		}

		// Full name validation
		if (!formData.fullName.trim()) {
			newErrors.fullName = "Full name is required";
		}

		// Password validation
		if (!formData.password) {
			newErrors.password = "Password is required";
		} else if (formData.password.length < 8) {
			newErrors.password = "Password must be at least 8 characters";
		}

		// Confirm password
		if (formData.password !== formData.confirmPassword) {
			newErrors.confirmPassword = "Passwords do not match";
		}

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	// Handle form submission
	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!validateForm()) {
			return;
		}

		setIsSubmitting(true);
		setSignupError("");

		try {
			// In a real app, would upload images to server/storage
			const userData = {
				username: formData.username,
				email: formData.email,
				fullName: formData.fullName,
				password: formData.password,
				avatar: formData.avatar,
				coverImage: formData.coverImage,
			};

			await signup(userData);
			navigate("/");
		} catch (error) {
			setSignupError(
				"An error occurred during signup. Please try again."
			);
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<div className="min-h-screen flex items-center justify-center p-4 bg-bg">
			<div className="card w-full max-w-md p-6">
				<div className="text-center mb-8">
					<Link
						to="/"
						className="inline-flex items-center gap-2 font-bold text-2xl"
					>
						<svg
							className="h-8 w-8 text-primary"
							viewBox="0 0 24 24"
							fill="currentColor"
						>
							<path d="M23 7l-9-5-9 5v10l9 5 9-5V7z M12 18l-6-3V9l6 3l6-3v6l-6 3z" />
						</svg>
						<span>VidShare</span>
					</Link>
					<h1 className="text-2xl font-bold mt-6">
						Create your account
					</h1>
				</div>

				{signupError && (
					<div className="bg-error/10 text-error p-3 rounded-md mb-4">
						{signupError}
					</div>
				)}

				<form onSubmit={handleSubmit}>
					{/* Username */}
					<div className="mb-4">
						<label
							htmlFor="username"
							className="block text-sm font-medium mb-1"
						>
							Username
						</label>
						<input
							type="text"
							id="username"
							name="username"
							value={formData.username}
							onChange={handleChange}
							className={`input ${
								errors.username ? "border-error" : ""
							}`}
							placeholder="johndoe"
						/>
						{errors.username && (
							<p className="mt-1 text-sm text-error">
								{errors.username}
							</p>
						)}
					</div>

					{/* Email */}
					<div className="mb-4">
						<label
							htmlFor="email"
							className="block text-sm font-medium mb-1"
						>
							Email Address
						</label>
						<input
							type="email"
							id="email"
							name="email"
							value={formData.email}
							onChange={handleChange}
							className={`input ${
								errors.email ? "border-error" : ""
							}`}
							placeholder="your@email.com"
						/>
						{errors.email && (
							<p className="mt-1 text-sm text-error">
								{errors.email}
							</p>
						)}
					</div>

					{/* Full Name */}
					<div className="mb-4">
						<label
							htmlFor="fullName"
							className="block text-sm font-medium mb-1"
						>
							Full Name
						</label>
						<input
							type="text"
							id="fullName"
							name="fullName"
							value={formData.fullName}
							onChange={handleChange}
							className={`input ${
								errors.fullName ? "border-error" : ""
							}`}
							placeholder="John Doe"
						/>
						{errors.fullName && (
							<p className="mt-1 text-sm text-error">
								{errors.fullName}
							</p>
						)}
					</div>

					{/* Password */}
					<div className="mb-4">
						<label
							htmlFor="password"
							className="block text-sm font-medium mb-1"
						>
							Password
						</label>
						<div className="relative">
							<input
								type={showPassword ? "text" : "password"}
								id="password"
								name="password"
								value={formData.password}
								onChange={handleChange}
								className={`input pr-10 ${
									errors.password ? "border-error" : ""
								}`}
								placeholder="••••••••"
							/>
							<button
								type="button"
								className="absolute inset-y-0 right-0 pr-3 flex items-center"
								onClick={() => setShowPassword(!showPassword)}
							>
								{showPassword ? (
									<EyeOff className="h-5 w-5 text-muted" />
								) : (
									<Eye className="h-5 w-5 text-muted" />
								)}
							</button>
						</div>
						{errors.password && (
							<p className="mt-1 text-sm text-error">
								{errors.password}
							</p>
						)}
					</div>

					{/* Confirm Password */}
					<div className="mb-6">
						<label
							htmlFor="confirmPassword"
							className="block text-sm font-medium mb-1"
						>
							Confirm Password
						</label>
						<div className="relative">
							<input
								type={showConfirmPassword ? "text" : "password"}
								id="confirmPassword"
								name="confirmPassword"
								value={formData.confirmPassword}
								onChange={handleChange}
								className={`input pr-10 ${
									errors.confirmPassword ? "border-error" : ""
								}`}
								placeholder="••••••••"
							/>
							<button
								type="button"
								className="absolute inset-y-0 right-0 pr-3 flex items-center"
								onClick={() =>
									setShowConfirmPassword(!showConfirmPassword)
								}
							>
								{showConfirmPassword ? (
									<EyeOff className="h-5 w-5 text-muted" />
								) : (
									<Eye className="h-5 w-5 text-muted" />
								)}
							</button>
						</div>
						{errors.confirmPassword && (
							<p className="mt-1 text-sm text-error">
								{errors.confirmPassword}
							</p>
						)}
					</div>

					{/* Avatar */}
					<div className="mb-4">
						<label className="block text-sm font-medium mb-1">
							Profile Picture
						</label>
						<div className="flex items-center space-x-3">
							<div className="w-16 h-16 rounded-full overflow-hidden bg-card-hover flex items-center justify-center">
								{avatarPreview ? (
									<img
										src={avatarPreview}
										alt="Avatar preview"
										className="w-full h-full object-cover"
									/>
								) : (
									<Upload className="h-6 w-6 text-muted" />
								)}
							</div>
							<button
								type="button"
								onClick={() => avatarInputRef.current?.click()}
								className="btn btn-outline"
							>
								{avatarPreview ? "Change" : "Upload"}
							</button>
							{avatarPreview && (
								<button
									type="button"
									onClick={() => {
										setAvatarPreview(null);
										setFormData((prev) => ({
											...prev,
											avatar: null,
										}));
									}}
									className="btn btn-outline text-error"
								>
									Remove
								</button>
							)}
							<input
								ref={avatarInputRef}
								type="file"
								accept="image/*"
								onChange={handleAvatarSelect}
								className="hidden"
							/>
						</div>
						{errors.avatar && (
							<p className="mt-1 text-sm text-error">
								{errors.avatar}
							</p>
						)}
					</div>

					{/* Cover Image */}
					<div className="mb-6">
						<label className="block text-sm font-medium mb-1">
							Cover Image (Optional)
						</label>
						<div className="rounded-lg overflow-hidden bg-card-hover h-32">
							{coverPreview ? (
								<img
									src={coverPreview}
									alt="Cover preview"
									className="w-full h-full object-cover"
								/>
							) : (
								<div className="w-full h-full flex items-center justify-center">
									<Image className="h-8 w-8 text-muted" />
								</div>
							)}
						</div>
						<div className="flex mt-2 space-x-2">
							<button
								type="button"
								onClick={() => coverInputRef.current?.click()}
								className="btn btn-outline text-sm"
							>
								{coverPreview ? "Change" : "Upload"}
							</button>
							{coverPreview && (
								<button
									type="button"
									onClick={() => {
										setCoverPreview(null);
										setFormData((prev) => ({
											...prev,
											coverImage: null,
										}));
									}}
									className="btn btn-outline text-sm text-error"
								>
									Remove
								</button>
							)}
							<input
								ref={coverInputRef}
								type="file"
								accept="image/*"
								onChange={handleCoverSelect}
								className="hidden"
							/>
						</div>
						{errors.coverImage && (
							<p className="mt-1 text-sm text-error">
								{errors.coverImage}
							</p>
						)}
					</div>

					{/* Submit button */}
					<button
						type="submit"
						disabled={isSubmitting}
						className={`btn btn-primary w-full ${
							isSubmitting ? "opacity-70 cursor-not-allowed" : ""
						}`}
					>
						{isSubmitting ? (
							<>
								<span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
								<span className="ml-2">
									Creating account...
								</span>
							</>
						) : (
							<>
								<UserPlus className="h-4 w-4" />
								<span>Create Account</span>
							</>
						)}
					</button>
				</form>

				<p className="text-center mt-6">
					Already have an account?{" "}
					<Link to="/login" className="text-primary hover:underline">
						Sign in
					</Link>
				</p>
			</div>
		</div>
	);
};

export default Signup;
