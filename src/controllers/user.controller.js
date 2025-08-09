import { asyncHandler } from "../utils/asyncHandler.js";
import { apiError } from "../utils/apiError.js";
import { User } from "../models/user.model.js";
import { uploadCloudinary } from "../utils/cloudinary.js";
import { apiResponse } from "../utils/apiReaponse.js";

const registerUser = asyncHandler(async (req, res) => {
  /* 
    step1 : user detail from frontend
    step2 : validation -- not empty
    step3 : if user already exists
    step4 : check for images, for avatar
    step5 : upload to cloudinary, avatar check that is    uploaded on cloudinary
    step6 : create user obj - for entry in db
    step7 : remove password & refresh token from response
    step8 : check if user is created
    step9 : return res
  */

  const { fulName, email, userName, password } = req.body;
  console.log("email:", email);
  // check if field is empty or not
  if (
    [fulName, email, userName, password].some((field) => field?.trim() === "")
  ) {
    throw new apiError(400, "All is require");
  }
  // existed User validation
  const existedUser = User.findOne({
    $or: [{ userName }, { email }],
  });

  if (existedUser) {
    throw new apiError(409, "user already exists");
  }

  // files get from multer
  const avatarLocalPath = req.files?.avatar[0]?.path;

  const coverImageLocalPath = req.files?.coverImage[0]?.path;

  if (!avatarLocalPath) {
    throw new apiError(400, "avatar is required");
  }
});

// upload on cloudinary
const avatar = await uploadCloudinary(avatarLocalPath);
const coverImage = await uploadCloudinary(coverImageLocalPath);

if (avatar) {
  throw new apiError(400, "avatar is required");
}

// create entry in data base
const user = await User.create({
  fullName,
  avatar: avatar.url,
  coverImage: coverImage?.url || "",
  email,
  password,
  userName: userName.toLowerCase(),
});

// remove fields
const createdUser = await User.findById(user._id).select(
  "-password -refershToken"
);

if (!createdUser) {
  throw new apiError(500, "something went wrong while creating user");
}

return res
  .status(201)
  .json(new apiResponse(200, createdUser, "user register successfully"));

export { registerUser };
