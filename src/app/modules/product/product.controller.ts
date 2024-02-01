/* eslint-disable no-unused-vars */
import { ProductServices } from './product.service';
import catchAsync from '../../utils/catchAsync';
import httpStatus from 'http-status';

const createProduct = catchAsync(async (req, res) => {
  const course = req.body;
  // course.createdBy = req.user._id;

  const {
    name,
    price,
    brand,
    model,
    operatingSystem,
    storage,
    screenSize,
    details,
    tags,
    createdAt,
    updatedAt,
  } = await ProductServices.createProductIntoDB(course);
  res.status(200).json({
    success: true,
    statusCode: 201,
    message: 'Product created successfully',
    data: {
      name,
      price,
      brand,
      model,
      operatingSystem,
      storage,
      screenSize,
      details,
      tags,
      createdAt,
      updatedAt,
    },
  });
});

const getAllProducts = catchAsync(async (req, res) => {
  const result = await ProductServices.getAllProductsFromDB();

  res.status(200).json({
    success: true,
    statusCode: httpStatus.OK,
    message: 'All courses retrieved successfully',
    data: result,
  });
});

const getSingleProduct = catchAsync(async (req, res) => {
  const { productId } = req.params;
  const result = await ProductServices.getSingleProductFromDB(productId);

  res.status(200).json({
    success: true,
    statusCode: httpStatus.OK,
    message: 'Product retrieved successfully',
    data: result,
  });
});

const updateProduct = catchAsync(async (req, res) => {
  const { productId } = req.params;

  const result = await ProductServices.updateProductIntoDB(productId, req.body);

  res.status(200).json({
    success: true,
    statusCode: 200,
    message: 'Product updated successfully',
    data: result,
  });
});

// const getSingleProductWithReviews = catchAsync(async (req, res) => {
//   const { courseId } = req.params;
//   const result =
//     await ProductServices.getSingleProductWithReviewsFromDB(courseId);

//   if (!result) {
//     return res.status(404).json({
//       success: false,
//       statusCode: 404,
//       message: 'Product not found',
//     });
//   }

//   res.status(200).json({
//     success: true,
//     statusCode: httpStatus.OK,
//     message: 'Product with reviews retrieved successfully',
//     data: result,
//   });
// });

const getBestProduct = catchAsync(async (req, res) => {
  const result = await ProductServices.getBestProductFromDB();

  res.status(200).json({
    success: true,
    statusCode: httpStatus.OK,
    message: 'Best course retrieved successfully',
    data: result,
  });
});

// ==============================
// const getPaginatedAndFilteredProducts = catchAsync(async (req, res) => {
//   const result = await ProductServices.getPaginatedAndFilteredProductsFromDB(
//     req.query,
//   );
//   const { page = '1', limit = '10', total } = result.meta;

//   const simplifiedProducts = result.courses.map((course) => {
//     // eslint-disable-next-line @typescript-eslint/no-unused-vars
//     const { averageRating, reviewCount, reviews, ...rest } = course.toJSON();
//     return rest;
//   });

//   res.status(200).json({
//     success: true,
//     statusCode: 200,
//     message: 'Products retrieved successfully',
//     meta: {
//       page: +page,
//       limit: +limit,
//       total,
//     },
//     data: { courses: simplifiedProducts },
//   });
// });

// delete user
const deleteProduct = catchAsync(async (req, res) => {
  const { productId } = req.params;
  await ProductServices.deleteProductFromDB(productId);

  res.status(200).json({
    success: true,
    message: 'Product deleted successfully!',
    data: null,
  });
});

export const ProductControllers = {
  createProduct,
  getAllProducts,
  getSingleProduct,
  updateProduct,
  getBestProduct,
  deleteProduct,
  // getPaginatedAndFilteredProducts,
};
