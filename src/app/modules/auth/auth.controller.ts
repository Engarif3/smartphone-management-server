import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import { AuthServices } from './auth.service';
import config from '../../config';

const loginUser = catchAsync(async (req, res) => {
  const result = await AuthServices.loginUser(req.body);
  const { accessToken, refreshToken, userDetails } = result;

  res.cookie('refreshToken', refreshToken, {
    secure: config.NODE_ENV === 'production',
    httpOnly: true,
  });

  res.json({
    success: true,
    statusCode: httpStatus.OK,
    message: 'User login successful',
    data: {
      user: userDetails,
      token: accessToken,
    },
  });
});

const changePassword = catchAsync(async (req, res) => {
  const { ...passwordData } = req.body;

  const result = await AuthServices.changePassword(req.user, passwordData);
  res.json({
    success: true,
    statusCode: httpStatus.OK,
    message: 'Password changed successfully',
    data: result,
  });
});

export const AuthControllers = {
  loginUser,
  changePassword,
};
