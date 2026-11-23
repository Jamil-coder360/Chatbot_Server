const httpStatus = require("http-status").default;
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import authService from "./auth.service";


const login = catchAsync(async (req, res) => {
  const result = await authService.login(req.body);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "User logged in successfully",
    data: result,
  });
});

const changePassword = catchAsync(async (req, res)=>{
  const result = await authService.changePassword(req.user?.id, req.body);

  sendResponse(res,{
    success:true,
    statusCode:httpStatus.OK,
    message:"Password changed successfully",
    data: result,

  });
});
const forgatePassword = catchAsync(async (req, res)=>{
  const result = await authService.forgatePassword(req.body);

  sendResponse(res,{
    success:true,
    statusCode:httpStatus.OK,
    message:"OTP sent to your email successfully",
    data: result,

  });
});

const authController = {
  login,
  changePassword,
  forgatePassword
};

export default authController;
