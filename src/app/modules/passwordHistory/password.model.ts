// passwordChangeHistory.model.ts

import { Schema, model } from 'mongoose';

const passwordChangeHistorySchema = new Schema(
  {
    username: {
      type: String,
      ref: 'User',
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    collection: 'passwordChangeHistory',
  },
);

export const PasswordChangeHistory = model(
  'PasswordChangeHistory',
  passwordChangeHistorySchema,
);
