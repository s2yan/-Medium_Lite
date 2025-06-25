import { v2 as  cloudinary } from 'cloudinary';
import dotenv from 'dotenv';
import fs from 'fs';
import { ApiErrorResponse } from '../utils/ApiErrorResponse.js';

dotenv.config({ path : './src/.env'});

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})

const uploadToCloudinary = async ( localFilePath ) => {
    try{
        if( !localFilePath ){
            throw new ApiErrorResponse( 400, "No file path provided for upload");
        }
        const cloudinaryInstance = await cloudinary.uploader.upload(localFilePath,{
            resource_type: 'auto',
        })
        fs.unlinkSync(localFilePath);
        return cloudinaryInstance.url;

    }catch(error){
        console.log("Error uploading to Cloudinary:", error);
        throw new ApiErrorResponse(500, "Failed to upload image to Cloudinary");
    }
}

export { uploadToCloudinary }