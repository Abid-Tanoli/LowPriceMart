export const paginate = async (model, query = {}, options = {}) => {
  try {
    const page = parseInt(options.page, 10) > 0 ? parseInt(options.page, 10) : 1;
    const limit = parseInt(options.limit, 10) > 0 ? parseInt(options.limit, 10) : 10;
    const skip = (page - 1) * limit;

    const sort = options.sort || { createdAt: -1 };
    const select = options.select || "";
    const populate = options.populate || "";

    const totalDocs = await model.countDocuments(query);

    let mongooseQuery = model.find(query).sort(sort).skip(skip).limit(limit).select(select);

    if (populate) {
      mongooseQuery = mongooseQuery.populate(populate);
    }

    const docs = await mongooseQuery.exec();

    return {
      success: true,
      totalDocs,
      totalPages: Math.ceil(totalDocs / limit),
      currentPage: page,
      limit,
      hasNextPage: page * limit < totalDocs,
      hasPrevPage: page > 1,
      docs,
    };
  } catch (error) {
    console.error("Pagination error:", error.message);
    throw new Error("Pagination failed");
  }
};