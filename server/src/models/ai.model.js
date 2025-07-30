import mongoose, { Schema } from "mongoose";

const embeddingSchema = new Schema({
    start: {
        type: String,
        required: true,
    },
    end: {
        type: String,
    },
    text: {
        type: String,
        required: true,
    },
    embedding: {
        type: [Number],
        required: true,
    },
    video: {
        type: Schema.Types.ObjectId,
        ref: "Video",
        required: true,
    },
});

export const Embedding = mongoose.model("Embedding", embeddingSchema);
