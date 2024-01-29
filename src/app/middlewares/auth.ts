import { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';
import jwt, { JwtPayload } from 'jsonwebtoken';
import config from '../config';
import AppError from '../errors/AppError';
import { User } from '../modules/user/user.model';
import catchAsync from '../utils/catchAsync';
// import { TUserRole } from '../modules/user/user.interface';
import { UnauthorizedAccessError } from '../errors/unauthorizedAccessError';

const auth = () => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization;

    // checking if the token is missing
    if (!token) {
      throw new UnauthorizedAccessError(
        'Unauthorized Access',
        'You do not have the necessary permissions to access this resource.',
      );
    }

    // checking if the given token is valid
    const decoded = jwt.verify(
      token,
      config.jwt_access_secret as string,
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
      throw new UnauthorizedAccessError(
        'Unauthorized Access',
        'You do not have the necessary permissions to access this resource.',
      );
    }

    req.user = decoded as JwtPayload;
    next();
  });
};

export default auth;
