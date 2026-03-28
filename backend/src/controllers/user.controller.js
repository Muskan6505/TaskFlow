import {User} from '../models/user.model.js';
import {asyncHandler} from '../utils/AsyncHandler.js'
import {ApiError} from '../utils/ApiError.js';
import {ApiResponse} from '../utils/ApiResponse.js';
import jwt from 'jsonwebtoken';
import { Task } from '../models/task.model.js';

const options = {
    httpOnly: true,
    secure:true
}

const registerUser = asyncHandler(async(req, res) => {
    const {name, email, role, password} = req.body;

    if(
        [name, email, password].some((field) => field?.trim === "")
    ){
        throw new ApiError(400, "All fields are required")
    }

    const existeduser = await User.findOne({email: email});
    if(existeduser) {
        throw new ApiError(400, "User with this email already exists");
    }

    const user = await User.create({
        name,
        email, 
        role,
        password
    });

    
    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )
    
    if(!createdUser){
        throw new ApiError(500, "Something went wrong");
    }
    
    const {accessToken, refreshToken} = await generateAccessAndRefreshToken(user._id);

    return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
        new ApiResponse(
            200,
            createdUser
        ),
        "User Registered Successfully"
    );

});


const generateAccessAndRefreshToken = async(userId) => {

    try{
        const user = await User.findById(userId)
        const accessToken =  user.generateAccessToken()
        const refreshToken =  user.generateRefreshToken()

        user.refreshToken = refreshToken
        user.save({validateBeforeSave: false})
        return {accessToken, refreshToken}

    }catch(error){
        throw new ApiError(500, "Somethong went wrong while generating refresh and access token")
    }
}

const loginUser = asyncHandler(async(req, res) => {
    const {email, role, password} = req.body;
    if(!email || !password) {
        throw new ApiError(400, "Both fields are required");
    }

    const user = await User.findOne({email});

    if(!user){
        throw new ApiError(404, "User does not exists");
    }

    const isPasswordValid = await user.isPasswordCorrect(password);

    if(!isPasswordValid) {
        throw new ApiError(401, "Invalid User credentials")
    }

    const isRoleValid = role === user.role;

    if(!isRoleValid) {
        throw new ApiError(401, "Invalid User credentials")
    }

    const {accessToken, refreshToken} = await generateAccessAndRefreshToken(user._id);

    return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
        new ApiResponse(
            200, 
            user
        ),
        "User Logged in Successfully"
    )
})

const logoutUser = asyncHandler(async(req, res) =>{

    await User.findByIdAndUpdate(
        req.user._id,
        {
            $set:{
                refreshToken: undefined
            }
        },
        {
            returnDocument: 'after'
        }
    )

    return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(
        new ApiResponse(
            200,
            {},
            "User Logged out Successfully"
        )
    )

})

const refreshAccessToken = asyncHandler(async(req, res) => {
    try {
        const {refreshToken} = req.cookies;
        if(!refreshToken) {
            throw new ApiError(401, "Unauthorized, Please login again");
        }
    
        const decodedToken = jwt.verify(
            refreshToken,
            process.env.REFRESH_TOKEN_SECRET
        )
    
        let user = await User.findById(decodedToken._id)
    
        if(!user || user.refreshToken !== refreshToken) {
            throw new ApiError(401, "Unauthorized, Please login again");
        }
    
        const {accessToken, refreshToken: newRefreshToken} = await generateAccessAndRefreshToken(user._id);
        user = await User.findByIdAndUpdate(
            user._id,
            {
                $set: {
                    refreshToken: newRefreshToken
                }
            },
            {
                returnDocument: 'after'
            }
        );
    
        return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", newRefreshToken, options)
        .json(
            new ApiResponse(
                200,
                user,
                "Access Token refreshed successfully"
            )
        )
    } catch (error) {
        throw new ApiError(500, error?.message || "Invalid refresh token, please login again");
    }
});

const getCurrentUser = asyncHandler(async(req, res) => {
    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            req.user,
            "Current user fetched Successfully"
        )
    )
});

const updateAccountDetails = asyncHandler(async(req, res) => {
    const {name, email} = req.body
    if(!name || !email){
        throw new ApiError(400, "All fields are required")
    }

    const user = await User.findByIdAndUpdate(
        req.user?._id, 
        {
            $set:{
                name: name,
                email:email
            }
        },
        {returnDocument: 'after'}
    ).select(" -password ")

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            user,
            "Account details updated successfully"
        )
    )
})

const getUserTasks = asyncHandler(async(req, res) => {
    const userId = req.user?._id;
    
    if(!userId) {
        throw new ApiError(401, "User not authenticated");
    }

    const tasks = await Task.find({assignedTo: userId})
        .populate('assignedTo', 'name email')
        .populate('createdBy', 'name email');

    if(!tasks) {
        throw new ApiError(500, "Something went wrong while fetching tasks");
    }

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                tasks,
                "Tasks assigned to user fetched successfully"
            )
        )
});

const getAdminTasks = asyncHandler(async(req, res) => {
    const adminId = req.user?._id;
    const role = req.user?.role;
    
    if(!adminId) {
        throw new ApiError(401, "User not authenticated");
    }

    if(role !== 'admin') {
        throw new ApiError(403, "Only admin can view created tasks");
    }

    const tasks = await Task.find({createdBy: adminId})
        .populate('assignedTo', 'name email')
        .populate('createdBy', 'name email');

    if(!tasks) {
        throw new ApiError(500, "Something went wrong while fetching tasks");
    }

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                tasks,
                "Tasks created by admin fetched successfully"
            )
        )
});

const getAllUsers = asyncHandler(async(req, res) => {
    const role = req.user?.role;
    
    if(role !== 'admin') {
        throw new ApiError(403, "Only admin can view all users");
    }

    const users = await User.find().select('name email _id role');

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                users,
                "All users fetched successfully"
            )
        )
});


export{
    registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken,
    getCurrentUser,
    updateAccountDetails,
    getUserTasks,
    getAdminTasks,
    getAllUsers
}