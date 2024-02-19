import asyncHandler from '../utils/asyncHandler.js'
import { APIError } from '../utils/apiError.js'
import { APIResponse } from '../utils/APIResponse.js'
import { uploadOnCloudinary } from '../utils/Cloudinary.js'
import { User } from '../models/user.model.js'

const getAllVideosOfUser = asyncHandler(async (req, res) => {
      const { page = 1, limit = 10, query, sortBy, sortType, userId } = req.query
})