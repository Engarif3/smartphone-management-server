import catchAsync from '../../utils/catchAsync';
import { UserServices } from './user.service';

const createUser = catchAsync(async (req, res) => {
  // const { password, student: studentData } = req.body;

  const { _id, username, email, createdAt, updatedAt } =
    await UserServices.createUserIntoDB(req.body);

  res.json({
    success: true,
    statusCode: 201,
    message: 'User registered successfully',
    data: {
      _id,
      username,
      email,
      createdAt,
      updatedAt,
    },
  });
});

export const UserControllers = {
  createUser,
};
