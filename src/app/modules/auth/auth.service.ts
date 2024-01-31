/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import bcrypt from 'bcrypt';
import { format } from 'date-fns';
import httpStatus from 'http-status';
import { User } from '../user/user.model';
import AppError from '../../errors/AppError';
import config from '../../config';
import { TLoginUser } from './auth.interface';
import { createToken } from './auth.utils';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { PasswordChangeHistory } from '../passwordHistory/password.model';
import { PasswordChangeError } from '../../errors/PasswordChangeError';

const loginUser = async (payload: TLoginUser) => {
  // checking if the user is exist
  const user = await User.isUserExistsByUserName(payload.username);
  const userDetails = await User.findOne(user).select(
    '-createdAt -updatedAt -__v -passwordChangedAt -passwordHistory',
  );

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'This user is not found !');
  }

  //checking if the password is correct

  if (!(await User.isPasswordMatched(payload?.password, user?.password)))
    throw new AppError(
      httpStatus.FORBIDDEN,
      'Password does not match. Please provide the correct password',
    );

  const iat = Math.floor(Date.now() / 1000);
  // const exp = iat + Math.floor(1 * (24 * 60 * 60 * 1000));

  const jwtPayload = {
    _id: userDetails?._id,
    email: userDetails?.email,
    username: user.username,
    iat,
    // exp,
  };

  const accessToken = createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    config.jwt_access_expires_in as string,
  );
  const refreshToken = createToken(
    jwtPayload,
    config.jwt_refresh_secret as string,
    config.jwt_refresh_expires_in as string,
  );

  return {
    userDetails,
    accessToken,
    refreshToken,
  };
};

const changePassword = async (
  userData: JwtPayload,
  payload: { currentPassword: string; newPassword: string },
) => {
  // checking if the user exists
  const user = await User.isUserExistsByUserName(userData.username);

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'This user is not found!');
  }

  // checking if the password is correct
  if (!(await User.isPasswordMatched(payload.currentPassword, user.password))) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      'Password does not match.Please provide the correct current password to change the password',
    );
  }

  // checking if the new password is in the password history
  const passwordHistory = user.passwordHistory || [];
  const isNewPasswordInHistory = passwordHistory.some((hashedPassword) =>
    bcrypt.compareSync(payload.newPassword, hashedPassword),
  );

  if (isNewPasswordInHistory) {
    const lastChangedAt = user.passwordChangedAt
      ? `last used on ${format(
          user.passwordChangedAt,
          "yyyy-MM-dd 'at' h:mm a",
        )}`
      : 'never used';

    throw new PasswordChangeError(
      httpStatus.BAD_REQUEST,
      'Password change failed. Ensure the new password is unique and not among the last 2 used ' +
        `(${lastChangedAt}).`,
    );
  }

  // hash new password
  const newHashedPassword = await bcrypt.hash(
    payload.newPassword,
    Number(config.bcrypt_salt_rounds),
  );

  // Update user document with the new password and update password history array
  const result = await User.findOneAndUpdate(
    {
      username: userData.username,
    },
    {
      password: newHashedPassword,
      $push: {
        passwordHistory: {
          $each: [newHashedPassword],
          $position: 0,
          $slice: 2, // Keep only the last two passwords in the history array
        },
      },
      needsPasswordChange: false,
      passwordChangedAt: new Date(),
    },
    { new: true }, // Return the updated document
  ).select('-__v -passwordChangedAt -passwordHistory');

  // Save the password change in the history collection
  await PasswordChangeHistory.create({
    username: user.username,
    password: newHashedPassword,
  });

  return result;
};

const refreshToken = async (token: string) => {
  // checking if the given token is valid
  try {
    const decoded = jwt.verify(
      token,
      config.jwt_refresh_secret as string,
    ) as JwtPayload;

    const { username, iat } = decoded;

    // checking if the user is exist
    const user = await User.isUserExistsByUserName(username);

    if (!user) {
      throw new AppError(httpStatus.NOT_FOUND, 'This user is not found !');
    }

    if (
      user.passwordChangedAt &&
      User.isJWTIssuedBeforePasswordChanged(
        user.passwordChangedAt,
        iat as number,
      )
    ) {
      throw new AppError(httpStatus.UNAUTHORIZED, 'You are not authorized !');
    }

    const jwtPayload = {
      _id: user._id,
      email: user.email,
      username: user.username,
      iat: Math.floor(Date.now() / 1000), // Current timestamp
      // You can also add 'exp' if your token requires an expiration time
    };

    const accessToken = createToken(
      jwtPayload,
      config.jwt_access_secret as string,
      config.jwt_access_expires_in as string,
    );

    return {
      accessToken,
    };
  } catch (error) {
    console.error('Error in token verification: ', error);
    // Handle token expiration or other verification errors here
    throw new AppError(httpStatus.UNAUTHORIZED, 'Token expired or invalid');
  }
};

export const AuthServices = {
  loginUser,
  changePassword,
  refreshToken,
};
