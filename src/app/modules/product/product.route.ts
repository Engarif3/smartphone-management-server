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

router.get('/products', ProductControllers.getAllProducts);

router.get('/courses/:courseId', ProductControllers.getSingleProduct);

router.get('/course/best', ProductControllers.getBestProduct);
// router.get('/courses', ProductControllers.getPaginatedAndFilteredProducts);

router.put(
  '/courses/:courseId',
  // auth(USER_ROLE.admin),
  // validateRequest(ProductValidation.updateProductValidationSchema),
  ProductControllers.updateProduct,
);

// router.get(
//   '/courses/:courseId/reviews',
//   ProductControllers.getSingleProductWithReviews,
// );

export const ProductRoutes = router;
