import { User } from '../models/user.models.js';
import { AsyncHandler } from '../utils/AsyncHandler.js';
import { ApiErrorResponse } from '../utils/ApiErrorResponse.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { uploadToCloudinary, deleteFromCloudinary } from '../utils/cloudinary.js';
import { upload } from '../middlewares/muter.middlewares.js';

const gernerateRefreshAndAccessToken = async function(userId){
    const user = await User.findById({_id: userId})

    if( !user ){
        throw new ApiErrorResponse(404, "Invalid email Id")
    }

    const refreshToken = await user.generateRefreshToken()
    const accessToken = await user.generateAccessToken()

    user.refreshToken = refreshToken
    user.save({ validateBeforeSave: false})
    return { refreshToken, accessToken}
    
}

const isPasswordStrong = (password) => {
    //logic for strong password validation
    if( password.length < 8 ){
        throw new ApiErrorResponse(401, "Password must be at least 8 characters long");
    }

    if( password.length > 16 ){
        throw new ApiErrorResponse(401, "Password must not be more than 16 characters long");
    }

    let hasUpperCase = false;
    let hasLowerCase = false;
    let hasDigit = false;
    let hasSpecialChar = false;

    for( const char of password ){
        if( char >= 'A' && char <= 'Z' ){
            hasUpperCase = true;
        }
        else if( char >= 'a' && char <= 'z'){
            hasLowerCase = true;
        }
        else if( char >= '0' && char <= '9'){
            hasDigit = true
        }
        else if( /[^A-Za-z0-9]/.test(char)){
            hasSpecialChar = true;
        }
    }

    if(  !(hasUpperCase && hasLowerCase && hasDigit && hasSpecialChar) ){
        throw new ApiErrorResponse(401, "Password must contain at least one uppercase letter, one lowercase letter, one digit, and one special character");
    }
    return true;
}

const registerUser = AsyncHandler( async ( req, res ) => {
    const { firstname, username, email, password } = req.body;
    
    if( [firstname , username, email, password].some(field => field === "")){
        throw new ApiErrorResponse(401, "All fields are required");
    }

    //Check if the password is valid or not
    isPasswordStrong(password);
    //Check whether any user with the same email or username exists in the database
    try{
        const existingUser = await User.findOne({
            $or: [
                {email: email},
                {username: username}
            ]
        })
        //If not, create a new user.
        if( existingUser ){
            throw new ApiErrorResponse(401, "User with the same email or username already exists");
        }

        //Fetch the local file path of the profile image from the request file/files and uplaod it to the Cloudinary
        const profileImagePath = req?.file?.path;
        if( !profileImagePath ){
            throw new ApiErrorResponse( 401, "Profile image is required");
        }

        const profileImage = await uploadToCloudinary(profileImagePath);

        //Check if the user is created successfully or else throw a server side error
        const newUser = await User.create({
            firstname,
            username,
            email,
            password,
            profileImage: profileImage
        })

        const dbUser = await User.findById(newUser._id).select("-refreshToken");
        if( !dbUser ){
            throw new ApiErrorResponse(500, "Failed to create user");
        }


        return res
            .status(201)
            .json(
                new ApiResponse(201, "User registered successfully", {dbUser})
            )
    }catch(error){
        console.log("Error registering user:", error);
        throw new ApiErrorResponse(500, "Internal server error");
    }

})

const loginUser = AsyncHandler( async( req, res) =>{
    const { email, password } = req.body

    if( [email, password].some(field => field === "")){
        throw new ApiErrorResponse(401, "Both email and password is required for user login")
    }

    //check if email exists in the database
    try{

        const user = await User.findOne({
            email: email
            })

        if( !user ){
            throw new ApiErrorResponse(404, "Please enter a valid email Id")
        }

        //check if password are mathcing
        const passwordMatched = user.isPasswordMatching(password)
        if( !passwordMatched ){
            throw new ApiErrorResponse(401, "Enter a valid password")
        }

        //generate Refresh and access Token
        const { refreshToken, accessToken } = await gernerateRefreshAndAccessToken(user._id)
        const options = {
            httpOnly: true,
            secure: true
        }

        return res
            .status(201)
            .cookie("refreshToken", refreshToken, options)
            .cookie("accessToken", accessToken, options)
            .json(
                new ApiResponse(201, "User loggedin successfully", {refreshToken, accessToken})
            )

    }catch(error){
        console.log("Error loggin in user: ", error)
        throw new ApiErrorResponse(500, "Something went wrong while logging in user")
    }

})

const logoutUser = AsyncHandler( async (req, res) => {
    const user = req.user


    try{

    
    if( !user ){
        throw new ApiErrorResponse(404, "User not found / Invalid accessToken");
    }

    await User.findByIdAndUpdate(
        user._id,
        {
            $set: { refreshToken: null }
        }
    );


    const options = {
        httpOnly: true,
        secure: true
    }

    return res  
        .status(201)
        .clearCookie("refreshToken", options)
        .clearCookie("accessToken", options)
        .json(new ApiResponse(201, "User logged out successfully"))
    }catch(error){
        console.log("Logout Error : " + error)
        throw new ApiErrorResponse(500, "Something went wrong while user logout")
    }
})

const deleteProfileImage = AsyncHandler( async (req, res) => {
    try{
       
        let [ , publicIdWithExtension] = req.user.profileImage.split('upload/')
        console.log(publicIdWithExtension)
        let publicId = publicIdWithExtension.split('/')[1].split('.')[0]
        deleteFromCloudinary(publicId)
        console.log(publicId)

        return res
            .status(201)
            .json(new ApiResponse(201, "Successfull", publicId))

    }catch(error){
        console.log("Something went wrong while deleting the profile Image", error)
    }
})

const updateProfileImage = AsyncHandler( async(req, res) => {
    const newProfileImagePath = req?.file?.path

    if( !newProfileImagePath ){
        throw new ApiErrorResponse(404, "New profile image path is reqruired")
    }

    try{

        const res = uploadToCloudinary(newProfileImagePath)

        const [, publicIdwithExtension ] = req.user.profileImage.split('upload/')
        const publicId = publicIdwithExtension.split('/')[1].split('.')[0]
        deleteFromCloudinary(publicId)

        const user = await User.findByIdAndUpdate(
            req.user._id,
            {
                $set: {
                    profileImage: res.url
                }
            }
        )

        user.save({ validateBeforeSave: true })
        
        return res
            .status(201)
            .json(new ApiResponse(201, "ProfileImage updated successfully", res.url))

    }catch(error){
        console.log(error)
        throw new ApiErrorResponse(201, "Something went wrong while updaing the profile photo", error)
    }
})

const updateProfileDetails = AsyncHandler( async (req, res) =>{
    const { firstname, email } = req.body

    if( !firstname ){
        throw new ApiErrorResponse(401, "Firstname is required")
    }

    if( !email ){
        throw new ApiErrorResponse(401, "Email is required")
    }


    try{

    
    const user = await User.findByIdAndUpdate(
        req.user._id,
        {
            $set: {
                firstname: firstname,
                email: email
            }
        }
    ) 

    user.save({validateBeforeSave: false})
    return res  
        .status(201)
        .json( new ApiResponse(201, "User details updated successfully"))

    }catch(error){
        console.log(error)
        throw new ApiErrorResponse(500, "Something went wrong while updating user details")
    }
})

const getUser = AsyncHandler( async( req, res) => {
    return res
        .status(201)
        .json(201, "User fecthed successfully", req.user)
})


export { registerUser, loginUser, logoutUser, deleteProfileImage, updateProfileImage, updateProfileDetails, getUser };