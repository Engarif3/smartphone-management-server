import express from 'express';
import { ProductControllers } from './product.controller';
import validateRequest from '../../middlewares/validateRequest';
import { ProductValidation } from './product.validation';
import auth from '../../middlewares/auth';

const router = express.Router();

router.post(
  '/create-product',
  auth(),
  validateRequest(ProductValidation.productValidationSchema),
  ProductControllers.createProduct,
);

router.get('/products', auth(), ProductControllers.getAllProducts);

router.get('/product/:productId', ProductControllers.getSingleProduct);

router.get('/course/best', ProductControllers.getBestProduct);
// router.get('/courses', ProductControllers.getPaginatedAndFilteredProducts);

router.put(
  '/product/:productId',
  // auth(),
  validateRequest(ProductValidation.productValidationSchema),
  ProductControllers.updateProduct,
);

// router.get(
//   '/courses/:courseId/reviews',
//   ProductControllers.getSingleProductWithReviews,
// );

router.delete('/product/:productId', ProductControllers.deleteProduct);

export const ProductRoutes = router;
