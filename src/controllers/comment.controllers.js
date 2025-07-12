import { AsyncHandler } from "../utils/AsyncHandler.js";
import { ApiErrorResponse } from "../utils/ApiErrorResponse.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Post } from "../models/post.models.js";
import { Comment } from "../models/comment.models.js";
import { User } from "../models/user.models.js";

// add a comment

const addComment = AsyncHandler(async (req, res) => {
  const { content } = req.body;

  if (!content || content.trim() === "") {
    throw new ApiErrorResponse(401, "Comment cannot be empty");
  }

  const user = req.user;
  const { postId } = req.params;

  if (!postId) {
    throw new ApiErrorResponse(401, "Please add a post Id"); //This is not that important as this will be handled by frontend
  }
  try {
    const comment = await Comment.create({
      content: content,
      postId: postId,
      commentOwner: user._id,
    });
    
    const userComments = user.comments
    userComments.push( comment._id )

    await User.findByIdAndUpdate(
	    user._id,
	    { $set : { comments : userComments }}, { new : true })

    return res
      .status(201)
      .json(new ApiResponse(201, "Comment added successfully", comment));
  } catch (error) {
    console.log(error);
    throw new ApiErrorResponse(
      500,
      "Something went wrong while creating the comment",
    );
  }
});

//Update a comment

const updateComment = AsyncHandler(async (req, res) => {
  const { newContent } = req.body;
  const { commentId } = req.params;

  if (!newContent) {
    throw new ApiErrorResponse(401, "Comment cannot be emplty");
  }
  
  const commentToUpdate = await Comment.findById( commentIdcommnetId  )

    if( !commentToUpdate || commentToUpdate === null) {
	throw new ApiErrorResponse(404, "Commnet Id is not valid") //altough this should not be required as the commnetId will come from the frontend but I think thsi is a good practice.
    }
    
  try  {

    await Comment.findByIdAndUpdate(
      commentId,
      {
        $set: {
          content: newContent,
        },
      },
      { new: true },
    );
    
    const updatedComment = await Comment.findById( commentId )

    return res
      .status(201)
      .json(
        new ApiErrorResponse(201, "Comment updated successfully",updatedComment ),
      );
  } catch (error) {
    console.log(error);
    throw new ApiErrorResponse(
      500,
      "Something went wrong while updating the comment",
    );
  }
});

//delete a comment

const deleteComment = AsyncHandler(async (req, res) => {
  const { commentId } = req.params;

  if (!commentId) {
    throw new ApiErrorResponse(401, "Commnet Id is reqiued");
  }

  const comment = await Comment.findById(commentId);
  if (!comment) {
    throw new ApiErrorResponse(
      404,
      "Something went wrong while fethcing the comment",
    );
  }

  const postId = comment.postId;
  const commentOwnerId = comment.commentOwner;
  const user = await User.findById(commentOwnerId);

  try {
    const deletedComment = await Comment.findByIdAndDelete(commentId);
    if (deletedComment) {
      const excludedCommnets = user.comments.filter(
        (id) => id.toString() !== commentId.toString(),
      );
      await User.findByIdAndUpdate(
        commentOwnerId,
        {
          $set: {
            comments: excludedCommnets,
          },
        },
        { new: true },
      );
    }

    return res
      .status(201)
      .json(
        new ApiResponse(201, "Comment deleted successfully", deletedComment),
      );
  } catch (error) {
    console.log(error);
    throw new ApiErrorResponse(
      500,
      "Something went wrong while deleting the comment",
    );
  }
});

// get all user comments, ,maybe not required but I am still gonna add this.

const getUserComments = AsyncHandler( async ( req, res ) => {
    const user = req.user
    
    try{
	const userComments = user.comments

	if( userComments.length === 0 ){
	    return res
		.status(201)
		.json( new ApiResponse(201, "Current user has no comments", []))

		}
	
	return res
	    .status(201)
	    .json(new ApiResponse(201, "User commets fetched successfully", userComments))

	}catch(error){
	    console.log(error)
	    throw new ApiErrorResponse(500, "Something went wrong while fetching the user comments")

	}

    })


		



export { addComment, updateComment , deleteComment , getUserComments };
