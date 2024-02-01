import { ProductModel, TProduct, TTags } from './product.interface';
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
const productSchema = new Schema<TProduct, ProductModel>(
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
    model: {
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
productSchema.statics.isProductExistsBy_id = async function (id: string) {
  // here all are correct possibilities
  // return await Product.findOne({ id }).select('+password');
  // return await Product.findOne({ _id: id });
  // const product = await this.findOne({ _id: id });
  // const product = await this.findById({ _id: id });
  const product = await Product.findById({ _id: id });
  // return !!product; //to convert boolean
  return product;
};

export const Product = model<TProduct, ProductModel>('product', productSchema);
