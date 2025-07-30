import { GoogleGenAI } from "@google/genai";
import { Embedding } from "../models/ai.model.js";
import asyncHandler from "../utils/asyncHandler.js";
import { APIError } from "../utils/apiError.js";
import { APIResponse } from "../utils/APIResponse.js";
import mongoose from "mongoose";

const ai = new GoogleGenAI({});

const SYSTEM_PROMPT = `You are a helpful AI assistant that helps users with their video content. You can answer questions about the video, provide summaries, and help users find specific segments based on their queries. Your responses should be concise, relevant, and directly address the user's query. Always ensure that the information you provide is accurate and based on the content of the video. Do give at most one most relevant timestamp that is most relevant to the query. 
<Strict Constraints>
You must follow the response format strictly:
Example Response Format:
{
    "answer": "Your answer here",
    "timestamp": "00:01:23", // Optional, if relevant
}
</Strict Constraints>
`;

const performSimilaritySearch = async (query, videoId) => {
    const response = await ai.models.embedContent({
        model: "gemini-embedding-001",
        contents: query,
    });

    const queryEmbeddings = response.embeddings[0].values;

    const results = await Embedding.aggregate([
        {
            $vectorSearch: {
                index: "vector_index",
                path: "embedding",
                queryVector: queryEmbeddings,
                limit: 3,
                numCandidates: 100,
                filter: {
                    video: { $eq: new mongoose.Types.ObjectId(videoId) },
                },
            },
        },
    ]);

    const cleanedResults = results.map((result) => {
        const { end, embedding, video, ...cleaned } = result;
        return cleaned;
    });

    return cleanedResults;
};

const askToGemini = async (query) => {
    const response = await ai.models.generateContent({
        model: "gemini-1.5-pro",
        contents: query,
        config: {
            systemInstruction: SYSTEM_PROMPT,
            maxOutputTokens: 1200,
            responseMimeType: "application/json",
        },
    });

    if (response.text) {
        return response.text;
    } else {
        throw new APIError(500, "No response from AI model");
    }
};

const answerQuery = asyncHandler(async (req, res) => {
    const { query, videoId } = req.body;

    if (!query) {
        throw new APIError(400, "Query is required");
    }

    const results = await performSimilaritySearch(query, videoId);
    if (results.length === 0) {
        throw new APIError(404, "No relevant segments found for the query");
    }

    const queryForGemini = `${SYSTEM_PROMPT}\n\nUser Query: ${query}\n\nRelevant Segments:\n${results.map((seg) => `- ${seg.start} ${seg.text}`).join("\n")}`;

    const answer = await askToGemini(queryForGemini);
    return res
        .status(201)
        .json(
            new APIResponse(
                201,
                answer,
                "Response from AI model successfully generated"
            )
        );
});

export { answerQuery };
