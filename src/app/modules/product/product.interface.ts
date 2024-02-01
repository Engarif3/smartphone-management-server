import { Model } from 'mongoose';
//
//=====================================
export type TTags = {
  name: string;
  isDeleted: boolean;
};
export type TProduct = {
  // _id?: Types.ObjectId;
  name: string;
  price: number;
  quantity: number;
  brand: string;
  model: string;
  operatingSystem: string;
  storage: number;
  screenSize: number;
  details: string;
  tags?: [TTags];
  createdAt?: string;
  updatedAt?: string;
};

export interface ProductModel extends Model<TProduct> {
  // eslint-disable-next-line no-unused-vars
  isProductExistsBy_id(id: string): Promise<TProduct>;
}
