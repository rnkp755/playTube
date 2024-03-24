import express from "express"
import cookieparser from "cookie-parser"
import cors from "cors"

const app = express();

app.use(cors({
      origin: process.env.CROSS_ORIGIN,
      Credentials: true
}))

app.use(express.json({ limit: "16kb" }))
app.use(express.urlencoded({
      extended: true,
      limit: "16kb"
}))
app.use(express.static("public"))
app.use(cookieparser())


//Routers
import userRouter from "./routes/user.routes.js"
import tweetRouter from "./routes/tweet.routes.js"
import videoRouter from "./routes/video.routes.js"

app.use('/api/v1/users', userRouter)
app.use('/api/v1/tweets', tweetRouter)
app.use('/api/v1/videos', videoRouter)

export default app;