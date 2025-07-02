import { User } from '../models/user.models.js';
import { ApiErrorResponse } from '../utils/ApiErrorResponse.js';
import jwt from 'jsonwebtoken';

const jwtVerify = async function(req, res, next){
    const accessToken = req.cookies.accessToken

    try{

        if( !accessToken ){
            throw new ApiErrorResponse(401, "Invalid access token");
        }

        const decodedToken = jwt.verify(accessToken, process.env.ACCESSTOKEN_SECRET)
        if( !decodedToken ){
            throw new ApiErrorResponse(500, "Something went wrong while decoding the accesstoken")
        }

        console.log(decodedToken)
        //find a user with decoded token ID
        const user = await User.findById({
            _id: decodedToken.id
        })

        if( !user ){
            return new ApiErrorResponse(404, "No user found with the decoded accesToken Id")
        }

        req.user = user
        next()
    }catch(error){
        console.log(error)
        throw new ApiErrorResponse(500, "Something went wrong while verifying the accessToken")
    }
}

export { jwtVerify }