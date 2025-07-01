import { User } from '../models/user.models.js';
import { ApiErrorResponse } from '../utils/ApiErrorResponse.js';
import { ApiResponse} from '../utils/ApiErrorResponse.js';
import jwt from 'jsonwebtoken';

const jwtVerify = async function(req, res){
    const accessToken = req.cookies.accessToken

    if( !accessToken ){
        throw new ApiErrorResponse(401, "Invalid access token");
    }

    const decodedToken = jwt.verify(accessToken, process.env.ACCESSTOKEN_SECRET)
    if( !decodedToken ){
        throw new ApiErrorResponse(500, "Something went wrong while decoding the accesstoken")
    }


    //find a user with decoded token ID
    const user = await User.findById({
        _id: decodedToken._id
    })

    if( !user ){
        return new ApiErrorResponse(404, "No user found with the decoded accesToken Id")
    }

    req.user = user

}