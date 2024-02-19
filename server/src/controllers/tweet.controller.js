import asyncHandler from '../utils/asyncHandler.js'
import { APIError } from '../utils/apiError.js'
import { APIResponse } from '../utils/APIResponse.js'
import { User } from '../models/user.model.js'
import { Tweet } from '../models/tweet.model.js'

const postTweet = asyncHandler(async (req, res) => {
      const { title, description, tags } = req.body
      const userId = await req.user?._id
      console.log(userId);

      if (!userId) throw new APIError(401, 'Unauthorized request')

      if (!title || !description) throw new APIError(400, 'Title and description are required')

      const user = await User.findById(userId)
      if (!user) throw new APIError(401, 'Unauthorized request')

      const tweet = new Tweet({
            title,
            description,
            tags: tags.split(',').map(tag => tag.trim().toLowerCase()),
            owner: userId
      })

      await tweet.save()

      const thisTweet = await Tweet.findById(tweet._id).select(
            "-__v -updatedAt -createdAt -owner"
      )

      if (!thisTweet) throw new APIError(500, 'Tweet could not be Posted. Please try again.')

      return res.status(201).json(new APIResponse(201, thisTweet, 'Tweet Posted successfully'))
})

const getUserTweets = asyncHandler(async (req, res) => {
      const { username } = req.params
      const user = await User.findOne({ username })

      if (!user) throw new APIError(404, "User doesn't exist")

      const tweets = await Tweet.find({ owner: user._id }).select(
            "-__v -updatedAt -createdAt -owner"
      )

      if (tweets.length === 0) throw new APIError(400, "No Tweets found")

      return res.status(200).json(new APIResponse(200, tweets, 'User Tweets fetched successfully'))
})

const updateTweet = asyncHandler(async (req, res) => {
      const { title, description, tags, tweetId } = req.body
      const userId = await req.user?._id
      if (!userId) throw new APIError(401, "Unauthorized access")

      const updateFields = {};
      if (title) updateFields.title = title;
      if (description) updateFields.description = description;
      if (tags) updateFields.tags = tags.split(',').map(tag => tag.trim().toLowerCase());

      const tweet = await Tweet.findById(tweetId);
      console.log("tweet", tweet);
      if (!tweet) throw new APIError(400, "Tweet doesn't exist");
      else if (!tweet.owner.equals(userId)) throw new APIError(401, "Unauthorized access")

      const newTweet = await Tweet.findByIdAndUpdate(
            tweetId,
            { $set: updateFields },
            { new: true }
      ).select("-__v -updatedAt -createdAt -owner")

      if (!newTweet) throw new APIError(501, "Tweet couldn't be updated. Please try again");

      return res.status(201).json(new APIResponse(201, newTweet, "Tweet updated Successfully"))
})

const deleteTweet = asyncHandler(async (req, res) => {
      const { tweetId } = req.body;
      const userId = await req.user?._id;

      if (!userId) throw new APIError(401, "Unauthorized access")

      const tweet = await Tweet.findById(tweetId);

      if (!tweet) throw new APIError(400, "Tweet doesn't exist");
      else if (!tweet.owner.equals(userId)) throw new APIError(401, "Unauthorized request");

      const deletedTweet = await Tweet.findByIdAndDelete(tweetId);

      if (!deletedTweet) throw new APIError(501, "Tweet couldn't be deleted. Please try again");

      return res.status(200).json(new APIResponse(200, deletedTweet, "Tweet deleted Successfully"))

})

export {
      postTweet,
      getUserTweets,
      updateTweet,
      deleteTweet
}