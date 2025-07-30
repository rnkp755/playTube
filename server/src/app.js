import express from "express";
import cookieparser from "cookie-parser";
import cors from "cors";
import { APIError } from "./utils/apiError.js";

const app = express();

app.use(
    cors({
        origin: ["http://localhost:5173", "https://vidshare.raushan.info"],
        credentials: true,
    })
);

app.use(express.json({ limit: "16kb" }));
app.use(
    express.urlencoded({
        extended: true,
        limit: "16kb",
    })
);
app.use(express.static("public"));
app.use(cookieparser());

//Routers
import userRouter from "./routes/user.routes.js";
import tweetRouter from "./routes/tweet.routes.js";
import videoRouter from "./routes/video.routes.js";
import aiRouter from "./routes/ai.routes.js";

app.use("/api/v1/users", userRouter);
app.use("/api/v1/tweets", tweetRouter);
app.use("/api/v1/videos", videoRouter);
app.use("/api/v1/ai", aiRouter);

app.get("/api/v1/health", (req, res) => {
    res.status(200).json({
        success: true,
        message: "Server is running",
    });
});

app.get("/", (req, res) => {
    res.status(200).json({
        success: true,
        message: "Welcome to VidShare API",
    });
});

// Global error handling middleware
app.use((err, req, res, next) => {
    console.error("Error caught by global handler:", err);

    // If it's our custom APIError
    if (err instanceof APIError) {
        return res.status(err.statusCode).json({
            success: false,
            message: err.message,
            errors: err.errors,
        });
    }

    // For JWT errors
    if (err.name === "JsonWebTokenError") {
        return res.status(401).json({
            success: false,
            message: "Invalid token",
        });
    }

    if (err.name === "TokenExpiredError") {
        return res.status(401).json({
            success: false,
            message: "Token expired",
        });
    }

    // For any other error
    return res.status(500).json({
        success: false,
        message: "Internal server error",
    });
});

export default app;
