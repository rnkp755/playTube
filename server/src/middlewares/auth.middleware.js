import { User } from "../models/user.model.js";
import { APIError } from "../utils/apiError.js";
import asyncHandler from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";

export const generateAccessAndRefreshTokens = async (userId) => {
    try {
        console.log("Generating new Access and Refresh Tokens");
        const user = await User.findById(userId);
        const newAccessToken = await user.generateAccessToken();
        const newRefreshToken = await user.generateRefreshToken();

        user.refreshToken = newRefreshToken;
        await user.save({ validateBeforeSave: false });

        return { newAccessToken, newRefreshToken };
    } catch (error) {
        throw new APIError(500, "Something went wrong while generating Tokens");
    }
};

export const verifyAccessToken = asyncHandler(async (req, res, next) => {
    try {
        console.log("Cookies: ", req.cookies);
        const accessToken =
            req.cookies?.accessToken ||
            req.header("Authorization")?.replace("Bearer ", "");

        if (accessToken === undefined || accessToken.trim() === "")
            throw new APIError(401, "Couldn't find Accesstoken");

        const decodedToken = jwt.verify(
            accessToken,
            process.env.ACCESS_TOKEN_SECRET
        );

        if (!decodedToken) throw new APIError(401, "Invalid Access Token");

        const user = await User.findById(decodedToken._id).select(
            "-password -refreshToken -__v -createdAt -updatedAt"
        );

        if (!user) throw new APIError(401, "Invalid Access Token");

        req.user = user;
        next();
    } catch (error) {
        return verifyRefreshToken(req, res, next);
    }
});

export const verifyRefreshToken = asyncHandler(async (req, res, next) => {
    try {
        console.log("Verifying Refresh Token");
        const incomingRefreshToken =
            req.cookies.refreshToken || req.body.refreshToken;

        if (!incomingRefreshToken)
            throw new APIError(401, "Unauthorized Access");

        const decodedToken = jwt.verify(
            incomingRefreshToken,
            process.env.REFRESH_TOKEN_SECRET
        );

        if (!decodedToken || !decodedToken["_id"])
            throw new APIError(401, "Unauthorized Access");

        const user = await User.findById(decodedToken._id);

        if (!user) throw new APIError(401, "Invalid refresh token");

        if (incomingRefreshToken !== user?.refreshToken)
            throw new APIError(401, "Refresh Token Invalid or Expired");

        const { newAccessToken, newRefreshToken } =
            await generateAccessAndRefreshTokens(user._id);

        const accessTokenOptions = {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: 24 * 60 * 60 * 1000, // 1 day
        };

        const refreshTokenOptions = {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: 10 * 24 * 60 * 60 * 1000, // 10 days
        };

        res.cookie("accessToken", newAccessToken, accessTokenOptions).cookie(
            "refreshToken",
            newRefreshToken,
            refreshTokenOptions
        );

        req.user = user;
        next();
    } catch (error) {
        throw new APIError(401, error?.message || "Authentication failed");
    }
});
