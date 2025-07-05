import mongoose, { Schema } from 'mongoose';


const videoSchema = new Schema(
    {
        url:{
            type: String,
            required: true
        },
        post:{
            type: Schema.Types.ObjectId,
            ref:'Post'
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

const Video = mongoose.model('Video', videoSchema)
export { video }