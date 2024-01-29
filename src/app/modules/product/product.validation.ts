import { z } from 'zod';

const tagsValidationSchema = z.object({
  name: z.string(),
  isDeleted: z.boolean(),
});

// const detailsValidationSchema = z.object({
//   level: z.enum(['Beginner', 'Intermediate', 'Advanced']),
//   description: z.string(),
// });

export const productValidationSchema = z.object({
  body: z.object({
    name: z.string(),
    price: z.number(),
    brand: z.string(),
    model: z.string(),
    operatingSystem: z.string(),
    storage: z.number(),
    screenSize: z.number(),
    details: z.string(),
    tags: z.array(tagsValidationSchema).optional(),
  }),
});

const updateTagsValidationSchema = z.object({
  name: z.string().optional(),
  isDeleted: z.boolean().optional(),
});

// const updateDetailsValidationSchema = z.object({
//   level: z.enum(['Beginner', 'Intermediate', 'Advanced']).optional(),
//   description: z.string().optional(),
// });

const updateProductValidationSchema = z.object({
  body: z.object({
    name: z.string().optional(),
    price: z.number().optional(),
    brand: z.string().optional(),
    model: z.string().optional(),
    operatingSystem: z.string(),
    storage: z.string().optional(),
    screenSize: z.number().optional(),
    details: z.string().optional(),
    tags: z.array(updateTagsValidationSchema).optional(),
  }),
});

export const ProductValidation = {
  productValidationSchema,
  updateProductValidationSchema,
};
