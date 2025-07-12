import { AsyncHandler } from "../utils/AsyncHandler.js";
import { ApiErrorResponse } from "../utils/ApiErrorResponse.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Post } from "../models/post.models.js";
import { User } from "../models/user.models.js";
import { uploadToCloudinary } from "../utils/cloudinary.js";

const createPost = AsyncHandler(async (req, res) => {
  const { title, content, isPrivate } = req.body;

  if ([title, content].some((field) => field === "")) {
    throw new ApiErrorResponse(
      401,
      "Title and content both fields are required",
    );
  }

  try {
    const user = await User.findById({ _id: req.user._id }).select(
      "-password -refreshToken",
    );

    const post = await Post.create({
      title: title,
      content: content,
      isPrivate: isPrivate,
      owner: user._id,
    });

    if (!post) {
      throw new ApiErrorResponse(401, "Post not created successfully");
    }

    user.posts.push(post._id);
    await user.save({ validateBeforeSave: false });

    return res
      .status(201)
      .json(new ApiResponse(201, "Post added successfully", post));
  } catch (error) {
    console.log(error);
    throw new ApiErrorResponse(
      500,
      "Something went wrong while creating the post",
    );
  }
});

const getAllUserPosts = AsyncHandler(async (req, res) => {
  try {
    const posts = await Post.aggregate([
      {
        $match: { owner: req.user._id },
      },
    ]);

    return res
      .status(201)
      .json(new ApiResponse(201, "User posts fetched successfully", posts));
  } catch (error) {
    console.log(error);
    throw new ApiErrorResponse(
      500,
      "Something went wrong while fetching the user posts",
    );
  }
});

const updatePostDetails = AsyncHandler(async (req, res) => {
  const { title, content } = req.body;
  let { isPrivate } = req.body;
  const { postId } = req.params;

  if (!isPrivate) {
    isPrivate = false;
  }

  if ([title, content, isPrivate].some((field) => field === "")) {
    throw new ApiErrorResponse(
      401,
      "All the fields are required and cannot be empty",
    );
  }

  try {
    const post = await Post.findByIdAndUpdate(
      postId,
      {
        $set: {
          title: title,
          content: content,
          isPrivate: isPrivate ? true : false,
        },
      },
      { new: true },
    );

    //console.log("Post Id:" + postId);

    const newUserPosts = req.user.posts.filter((id) => {
     // console.log("id: " + id);
      id.toString() !== postId.toString();
    });
    newUserPosts.push(post._id);

    await User.findByIdAndUpdate(req.user._id, {
      $set: {
        posts: newUserPosts,
      },
    });

    return res
      .status(201)
      .json(new ApiResponse(201, "Post udpated successfully", post));
  } catch (error) {
    console.log(error);
    throw new ApiErrorResponse(
      500,
      "Something went wrong while updating the post",
    );
  }
});

const deletePost = AsyncHandler(async (req, res) => {
  const { postId } = req.params;
  const user = req.user;

  if (!postId) {
    throw new ApiErrorResponse(401, "Post Id is required to delete the post");
  }

  try {
    const postToDelete = await Post.findById(postId);
    if (!postToDelete) {
      throw new ApiErrorResponse(401, `No post found with the Id : ${postId}`);
    }

    //check if the current user is having any post with the same Id

    const userPostExists = user.posts.find(
      (id) => id.toString() === postId.toString(),
    );
    if (!userPostExists) {
      throw new ApiErrorResponse(
        404,
        "Current user is not having any posts with the entered Id",
      );
    }

    user.posts = user.posts.filter((id) => id.toString() !== postId.toString());

    const deletedPost = await Post.findByIdAndDelete(postId);

    return res
      .status(201)
      .json(new ApiResponse(201, "Post deleted succesfully", deletedPost));
  } catch (error) {
    console.log("Error deleting post: " + error);
    throw new ApiErrorResponse(
      500,
      "Something went wrong while deleting the post",
    );
  }
});


export { createPost, getAllUserPosts, deletePost, updatePostDetails };
