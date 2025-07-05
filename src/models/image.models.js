import mongoose, { Schema } from 'mongoose';

const imageSchema = new Schema(
    {
        url:{
            type: String, //cloudinary url
            required: true
        },
        alt:{
           type: String, 
        },
        post:{
            type: Schema.Types.ObjectId,
            ref: 'Post'
        },
        uploadedBy:{
            type: Schema.Types.ObjectId,
            ref: 'User'
        }

    },
    {
        timestamps: true
    }
)


const Image = mongoose.model('Image', imageSchema);
export { Image }