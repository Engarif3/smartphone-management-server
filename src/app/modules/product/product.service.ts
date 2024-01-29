/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Product } from './product.model';
import mongoose from 'mongoose';
import { TProduct, TTags } from './product.interface';

const createProductIntoDB = async (courseData: TProduct) => {
  const result = await Product.create(courseData);

  return result;
};

const getAllProductsFromDB = async () => {
  const result = await Product.find();
  return result;
};
const getSingleProductFromDB = async (id: string) => {
  const result = await Product.findById(id);
  return result;
};

// ======================================
const updateProductIntoDB = async (
  id: string,
  payload: Partial<TProduct>,
): Promise<TProduct | null> => {
  const { tags, details, ...rest } = payload;

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // Update primitive fields using $set
    // eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
    const updatedBasicProductInfo = await Product.findByIdAndUpdate(
      id,
      { $set: rest },
      {
        new: true,
        runValidators: true,
        session,
      },
    );

    if (tags) {
      await Product.findByIdAndUpdate(
        id,
        {
          $pull: {
            tags: { name: { $in: (tags ?? []).map((tag) => tag.name) } },
          },
        },
        { runValidators: true, session },
      );

      await Product.findByIdAndUpdate(
        id,
        { $push: { tags: { $each: tags ?? [] } } },
        { runValidators: true, session },
      );
    }

    // if (details) {
    //   await Product.findByIdAndUpdate(
    //     id,
    //     {
    //       $set: {
    //         'details.level': details.level,
    //         'details.description': details.description,
    //       },
    //     },
    //     { runValidators: true, session },
    //   );
    // }
    // Use select to exclude specific fields
    const updatedProduct = await Product.findById(
      id,
      '-averageRating -reviewCount -reviews',
    )
      .populate({
        path: 'createdBy',
        select:
          '-passwordHistory -createdAt -updatedAt -passwordChangedAt -__v',
      })
      .select('-__v')
      .session(session);

    // Modify the tags array to filter out deleted tags
    if (updatedProduct?.tags) {
      updatedProduct.tags = (updatedProduct.tags ?? []).filter(
        (tag) => !tag.isDeleted,
      ) as [TTags];
    }

    await session.commitTransaction();
    return updatedProduct;
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};

const getBestProductFromDB = async () => {
  const bestProduct = await Product.aggregate([
    {
      $lookup: {
        from: 'reviews',
        localField: '_id',
        foreignField: 'courseId',
        as: 'reviews',
      },
    },
    {
      $addFields: {
        averageRating: {
          $avg: '$reviews.rating',
        },
        reviewCount: {
          $size: '$reviews',
        },
      },
    },
    // Lookup and reshape createdBy
    {
      $lookup: {
        from: 'reviews',
        localField: '_id',
        foreignField: 'courseId',
        as: 'createdByArray',
      },
    },
    {
      $unwind: '$createdByArray',
    },
    {
      $replaceRoot: {
        newRoot: {
          course: {
            _id: '$_id',
            title: '$title',
            instructor: '$instructor',
            categoryId: '$categoryId',
            price: '$price',
            tags: '$tags',
            startDate: '$startDate',
            endDate: '$endDate',
            language: '$language',
            provider: '$provider',
            durationInWeeks: '$durationInWeeks',
            details: '$details',
            createdBy: {
              _id: '$createdByArray.createdBy._id',
              username: '$createdByArray.createdBy.username',
              email: '$createdByArray.createdBy.email',
              role: '$createdByArray.createdBy.role',
            },
            createdAt: '$createdByArray.createdAt',
            updatedAt: '$createdByArray.updatedAt',
          },
          averageRating: {
            $round: ['$averageRating', 1],
          },
          reviewCount: '$reviewCount',
        },
      },
    },
    {
      $sort: {
        'course.averageRating': -1,
        'course.reviewCount': -1,
      },
    },
    {
      $limit: 1,
    },
    {
      $project: {
        reviews: 0,
      },
    },
  ]);

  if (!bestProduct || bestProduct.length === 0) {
    throw new Error('Best course not found');
  }

  return bestProduct[0];
};

// ========================
const getPaginatedAndFilteredProductsFromDB = async (query: any) => {
  const {
    page = 1,
    limit = 10,
    sortBy = 'startDate',
    sortOrder = 'asc',
    minPrice,
    maxPrice,
    tags,
    startDate,
    endDate,
    language,
    provider,
    durationInWeeks,
    level,
  } = query;

  const sortCriteria: any = {};
  sortCriteria[sortBy] = sortOrder === 'asc' ? 1 : -1;

  const filter: any = {};

  if (minPrice && maxPrice) {
    filter.price = { $gte: parseFloat(minPrice), $lte: parseFloat(maxPrice) };
  }

  if (tags) {
    filter['tags.name'] = Array.isArray(tags) ? { $in: tags } : tags;
  }

  if (startDate) {
    filter.startDate = {
      $gte: startDate,
    };
  }

  if (endDate) {
    filter.endDate = {
      $lte: endDate,
    };
  }

  if (language) {
    filter.language = language;
  }

  if (provider) {
    filter.provider = provider;
  }

  if (durationInWeeks) {
    filter.durationInWeeks = { $eq: parseInt(durationInWeeks, 10) };
  }

  if (level) {
    filter['details.level'] = level;
  }

  const skip = (parseInt(page, 10) - 1) * parseInt(limit, 10);

  const courses = await Product.find(filter)
    .populate({
      path: 'createdBy',
      select: '-passwordHistory -createdAt -updatedAt -passwordChangedAt -__v',
    })
    .sort(sortCriteria)
    .skip(skip)
    .limit(parseInt(limit, 10))
    .select('-__v');

  const total = await Product.countDocuments(filter);

  return {
    meta: {
      page: parseInt(page, 10),
      limit: parseInt(limit, 10),
      total,
    },
    courses,
  };
};
export const ProductServices = {
  createProductIntoDB,
  getAllProductsFromDB,
  getSingleProductFromDB,
  updateProductIntoDB,
  getBestProductFromDB,
  getPaginatedAndFilteredProductsFromDB,
};
