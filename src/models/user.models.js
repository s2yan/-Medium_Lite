import mongoose, { Schema } from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';


const userSchema = new Schema(
    {
        firsname: {
            type: String,
            required: true,
            trim: true
        },
        username: { 
            type: String,
            required: true,
            unique: true,
            trim: true
        },
        email:{
            type: String,
            required: true,
            unique: true,
            trim: true
        },
        password: {
            type: String,
            required: true
        },
        profileImage: {
            type: String,
            //cloudinary image url
        },
        posts:[
            {
                type: Schema.Types.ObjectId,
                ref: 'Post'
            }
        ],
        comments: [
            {
                type: Schema.Types.ObjectId,
                ref: 'Comment'
            }
        ],
        refreshToken: {
            type: String,
            default: null
        }
    },
    {
        timestamps: true
    }
)

//Hash the password before saving the user
userSchema.pre('save', async function(next){
    if( !this.isModified('password')) return next();

    try{
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();

    }catch(err){
        next(err);
    }
})

//TO-DO
//Add a method to validate the user password with the entered password

//generate refresh and access tokens with JWT
const generateRefreshToken = async function(){
    const refreshToken =  jwt.sign(
        { id: this._id},
        process.env.REPRESHTOKEN_SECRET,
        {expiresIn: process.env.REFRESHTOKEN_EXPIRES_IN}
    )

    return refreshToken;
}

const generateAccessToken = async function(){
    const accessToken =  jwt.sign(
        { id: this._id},
        process.env.ACCESSTOKEN_SECRET,
        {expiresIn: process.env.ACCESSTOKEN_EXPIRES_IN}
    )

    return accessToken;
}


const User = mongoose.model('User', userSchema);
export { User, generateRefreshToken, generateAccessToken };