import express from "express";
import cookieparser from "cookie-parser";
import cors from "cors";

const app = express();

app.use(
    cors({
        origin: ["http://localhost:5173", "https://vidshare.raushan.info/"],
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

app.use("/api/v1/users", userRouter);
app.use("/api/v1/tweets", tweetRouter);
app.use("/api/v1/videos", videoRouter);

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

export default app;
