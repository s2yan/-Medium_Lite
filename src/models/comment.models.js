import mongoose, { Schema } from 'mongoose';

const commentSchema = new Schema(
    {
	postId:{
	    type: Schema.Types.ObjectId,
	    ref: 'Post'
	},
        content:{
            type: String,
            required: true,
            trim: true
        },

        likes: [
            {
            type: Schema.Types.ObjectId,
            ref: 'User'
            }
        ]
    },
    { timestamps: true}
)

const Comment = mongoose.model('Comment', commentSchema);
export { Comment };
