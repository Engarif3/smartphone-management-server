import jwt from 'jsonwebtoken';
import { Types } from 'mongoose';

export const createToken = (
  jwtPayload: {
    _id: Types.ObjectId | undefined;
    email: string | undefined;
    username: string;
    iat: number;
    exp?: number;
  },
  secret: string,
  expiresIn: string,
) => {
  const options = jwtPayload.exp ? {} : { expiresIn };
  return jwt.sign(jwtPayload, secret, options);
};
