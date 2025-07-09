import { uploadToCloudinary } from "../utils/cloudinary.js";
import { AsyncHandler } from "../utils/AsyncHandler.js";
import { ApiErrorResponse } from "../utils/ApiErrorResponse.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import fs from "fs";

const uploadPostController = AsyncHandler(async (req, res) => {
  const results = {
    images: [],
    videos: [],
  };
  try {
    //upload images
    if (req.files.images) {
      for (const imagePath of req.file.images) {
        const res = await uploadToCloudinary(imagePath);
        results.images.push(res.url);
        fs.unlinkSync(imagePath);
      }
    }

    //upload videos
    if (req.files.videos) {
      for (const videoPath of req.files.videos) {
        const res = await uploadToCloudinary(videoPath);
        results.videos.push(res.url);
        fs.unlinkSync(videoPath);
      }
    }

    return res
      .status(201)
      .json(new ApiResponse(201, "Media files uploaded successfully", results));
  } catch (error) {
    console.log(error);
    throw new ApiErrorResponse(
      500,
      "Something went wrong while uploading the media file",
    );
  }
});

export { uploadPostController };
