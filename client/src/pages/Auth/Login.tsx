import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { Eye, EyeOff, LogIn } from "lucide-react";

const Login: React.FC = () => {
	const { login } = useAuth();
	const navigate = useNavigate();

	const [formData, setFormData] = useState({
		email: "",
		password: "",
	});

	const [errors, setErrors] = useState<Record<string, string>>({});
	const [showPassword, setShowPassword] = useState(false);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [loginError, setLoginError] = useState("");

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

		// Clear login error
		if (loginError) {
			setLoginError("");
		}
	};

	// Validate form
	const validateForm = (): boolean => {
		const newErrors: Record<string, string> = {};

		// Email validation
		if (!formData.email.trim()) {
			newErrors.email = "Email is required";
		} else if (!/\S+@\S+\.\S+/.test(formData.email)) {
			newErrors.email = "Email is invalid";
		}

		// Password validation
		if (!formData.password) {
			newErrors.password = "Password is required";
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
		setLoginError("");

		try {
			console.log("Logging in with:", formData);
			await login(formData.email, formData.password);
			navigate("/");
		} catch (error) {
			setLoginError("Invalid email or password. Please try again.");
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
						Sign in to your account
					</h1>
				</div>

				{loginError && (
					<div className="bg-error/10 text-error p-3 rounded-md mb-4">
						{loginError}
					</div>
				)}

				<form onSubmit={handleSubmit}>
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

					{/* Password */}
					<div className="mb-6">
						<div className="flex items-center justify-between mb-1">
							<label
								htmlFor="password"
								className="block text-sm font-medium"
							>
								Password
							</label>
							<Link
								to="/forgot-password"
								className="text-sm text-primary hover:underline"
							>
								Forgot password?
							</Link>
						</div>
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
						<p
							className="my-4 cursor-pointer text-center text-sm text-primary"
							onClick={() => {
								setFormData({
									email: "vidshare@raushan.info",
									password: "Password@123",
								});
							}}
						>
							Continue with a sample account
						</p>
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
								<span className="ml-2">Signing in...</span>
							</>
						) : (
							<>
								<LogIn className="h-4 w-4" />
								<span>Sign in</span>
							</>
						)}
					</button>
				</form>

				<p className="text-center mt-6">
					Don't have an account?{" "}
					<Link to="/signup" className="text-primary hover:underline">
						Sign up
					</Link>
				</p>
			</div>
		</div>
	);
};

export default Login;
