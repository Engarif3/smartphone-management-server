// passwordChangeHistory.model.ts
export type PasswordChangeHistoryDocument = {
  username: string;
  password: string;
  createdAt: Date;
};

export interface PasswordChangeHistoryModel
  extends PasswordChangeHistoryDocument {}
