import mongoose, { Schema } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const tweetSchema = new Schema({
      title: {
            type: String,
            required: true,
            minLength: [5, "Title must be at least 5 characters long"],
      },
      description: {
            type: String,
            required: true,
            minLength: [20, "Description must be at least 20 characters long"],
      },
      tags: [
            {
                  type: String,
                  default: "General",
                  lowercase: true,
            },
      ],
      owner: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true
      }
}, { timestamps: true });

tweetSchema.plugin(mongooseAggregatePaginate);
export const Tweet = mongoose.model("Tweet", tweetSchema); 