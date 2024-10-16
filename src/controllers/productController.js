const { Op, fn, col } = require('sequelize');
const Product = require('../entities/product');
const Category = require('../entities/category');
const Review = require('../entities/review');
const User = require('../entities/user');

const getAll = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const sort = req.query.sort || 'createdAt';
    const order = req.query.order ? req.query.order.toUpperCase() : 'DESC';
    const search = req.query.search || '';
    const category = req.query.category || '';

    const offset = (page - 1) * limit;

    if (isNaN(page) || isNaN(limit) || !['ASC', 'DESC'].includes(order)) {
      return res.error(400, 'Invalid query parameters');
    }

    const where = { stock: { [Op.gt]: 0 } };
    if (search) {
      where.name = { [Op.like]: `%${search}%` };
    }

    if (category) {
      const categoryInstance = await Category.findOne({
        where: { name: category },
      });
      if (categoryInstance) {
        where.categoryId = categoryInstance.id;
      } else {
        return res.error(404, 'Category not found');
      }
    }

    const { count, rows } = await Product.findAndCountAll({
      where,
      order: [[sort, order.toUpperCase()]],
      offset,
      limit,
      attributes: ['id', 'imageUrl', 'name', 'price'],
      raw: true,
    });

    if (rows.length == 0 && count == 0) {
      return res.success(200, rows, 'No products found');
    }

    const totalPages = Math.ceil(count / limit);

    if (page > totalPages) {
      return res.error(404, 'Page not found');
    }

    const pagination = {
      currentPage: page,
      totalPages,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
    };

    res.success(200, rows, 'Get all products success', pagination);
  } catch (error) {
    res.error(500, error.message, 'internal server error');
  }
};

const getById = async (req, res) => {
  const { id } = req.params;

  try {
    if (isNaN(Number(id))) return res.error(422, 'params must be number');

    const product = await Product.findOne({
      where: {
        id,
        isAvail: true,
        stock: { [Op.gt]: 0 },
      },
      include: [
        {
          model: Category,
          attributes: ['name'],
        },
        {
          model: Review,
          limit: 2,
          order: [['updated_at', 'DESC']],
          attributes: ['id', 'comment', 'rating', 'created_at'],
        },
      ],
      attributes: ['id', 'imageUrl', 'name', 'price', 'description', 'stock'],
    });

    if (!product) return res.error(404, 'product was not found');

    const review = await Review.findOne({
      where: { productId: id },
      attributes: [
        [fn('AVG', col('rating')), 'avgRating'],
        [fn('COUNT', col('id')), 'totalReviewer'],
      ],
      raw: true,
    });

    const avgRating = parseFloat(review.avgRating);
    const totalReviewer = parseInt(review.totalReviewer, 10);

    const productDetails = {
      ...product.toJSON(),
      avgRating,
      totalReviewer,
    };

    res.success(200, productDetails);
  } catch (error) {
    res.error(500, error.message, 'internal server error');
  }
};

const getAllReviews = async (req, res) => {
  const { productId } = req.params;

  try {
    if (!productId) return res.error(400, 'Product ID is require');
    if (isNaN(Number(productId)))
      return res.error(422, 'Params must be number');

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const sort = req.query.sort || 'updatedAt';
    const order = req.query.order ? req.query.order.toUpperCase() : 'DESC';
    const offset = (page - 1) * limit;

    const { count, rows } = await Review.findAndCountAll({
      where: { productId },
      order: [[sort, order]],
      offset,
      limit,
      attributes: ['id', 'comment', 'rating', 'updated_at'],
      include: {
        model: User,
        attributes: ['email'],
      },
    });
    if (rows.length == 0) return res.error(200, rows, 'No reviews found');

    const totalPages = Math.ceil(count / limit);
    if (page > totalPages) {
      return res.error(404, 'Page not found');
    }

    const pagination = {
      currentPage: page,
      totalPages,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
    };

    res.success(200, rows, 'Get all reviews success', pagination);
  } catch (error) {
    res.error(500, error.message, 'internal server error');
  }
};

module.exports = { getAll, getById, getAllReviews };
