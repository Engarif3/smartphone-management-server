import { z } from 'zod';

const userValidationSchema = z.object({
  username: z
    .string({
      invalid_type_error: 'User name must be string',
    })
    .max(40, { message: 'User name can not be more than 40 characters' }),
  email: z
    .string({
      invalid_type_error: 'Email must be string',
    })
    .max(40, { message: 'Email can not be more than 40 characters' }),
  password: z
    .string({
      invalid_type_error: 'Password must be string',
    })
    .max(20, { message: 'Password can not be more than 20 characters' }),
});

export const UserValidation = {
  userValidationSchema,
};
