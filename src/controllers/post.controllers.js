import { AsyncHandler } from '../utils/AsyncHandler.js';
import { ApiErrorResponse } from '../utils/ApiErrorResponse.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { Post } from '../models/post.models.js';
import { User } from '../models/user.models.js';
import { uploadToCloudinary } from '../utils/cloudinary.js';


const createPost = AsyncHandler( async(req, res) => {
    const { title, content, isPrivate } = req.body;

    if( [ title, content ].some( field => field === "")){
        throw new ApiErrorResponse(401, "Title and content both fields are required")
    }

    try{

        const user = await User.findById({ _id: req.user._id }).select("-password -refreshToken")


        const post = await Post.create({
            title: title,
            content: content,
            isPrivate: isPrivate,
            owner: user
        })

        return res
            .status(201)
            .json(new ApiResponse(201, "Post added successfully", post))

    }catch(error){
        console.log(error);
        throw new ApiErrorResponse(500, "Something went wrong while creating the user")
    }


})



export { createPost }