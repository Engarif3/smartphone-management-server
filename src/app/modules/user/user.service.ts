import { TUser } from './user.interface';
import { User } from './user.model';

const createUserIntoDB = async (userData: TUser) => {
  //static method
  if (await User.isUserExistsByUserName(userData.username)) {
    throw new Error('User name already exists');
  }
  if (await User.isUserExistsByUserEmail(userData.email)) {
    throw new Error('Email already exists');
  }
  const result = await User.create(userData);

  return result;
};

export const UserServices = {
  createUserIntoDB,
};
