import { TProduct, TTags } from './product.interface';
import { Schema, model } from 'mongoose';

const tagsSchema = new Schema<TTags>({
  name: {
    type: String,
    // required: true,
    // unique: true,
  },
  isDeleted: {
    type: Boolean,
    default: false,
  },
});
const productSchema = new Schema<TProduct>(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    price: {
      type: Number,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
    brand: {
      type: String,
      required: true,
    },
    operatingSystem: {
      type: String,
      required: true,
    },
    storage: {
      type: Number,
      required: true,
    },
    screenSize: {
      type: Number,
      required: true,
    },
    details: {
      type: String,
      required: true,
    },
    tags: {
      type: [tagsSchema],
      default: [],
    },
  },
  {
    timestamps: true,
  },
);

export const Product = model<TProduct>('product', productSchema);
