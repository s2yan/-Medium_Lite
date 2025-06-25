import mongoose, { Schema } from 'mongoose';

const postSchema = new Schema(
    {
        title:{
            type: String,
            required: true,
            trim: true
        },
        content: {
            type: String,
            required: true,
        },
        isPrivate:{
            type: Boolean,
            default: false
        },
        image: {
            type: String,
            //cloudinary image url
        },
        video:{
            type: String,
            //cloudinary video url
        },
        owner:{
            type: Schema.Types.ObjectId,
            ref: 'User',
        },
        likes: [
            {
                type: Schema.Types.ObjectId,
                ref: 'User'
            }
        ]
    },
    {
        timestamps: true
    }
)

const Post = mongoose.model('Post', postSchema);
export { Post };