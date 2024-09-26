const { Op } = require('sequelize');
const Product = require('../entities/product');
const Category = require('../entities/category');

const getAll = async (req, res) => {
  try {
    const {
      page = 1,
      size = 5,
      sort = 'createdAt',
      order = 'DESC',
      search = '',
      category = '',
    } = req.query;
    const limit = parseInt(size);
    const offset = (page - 1) * limit;

    const where = { stock: { [Op.gt]: 0 } };
    if (search) {
      where.name = { [Op.like]: `%${search}%` };
    }

    const include = [];
    if (category) {
      const categoryInstance = await Category.findOne({
        where: { name: category },
      });
      if (categoryInstance) where.categoryId = categoryInstance.id;
    }

    const products = await Product.findAll({
      where,
      include,
      order: [[sort, order.toUpperCase()]],
      offset,
      limit,
      attributes: ['id', 'name', 'price'],
    });

    res.success(200, products, 'Get all products success');
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
        stock: { [Op.gt]: 0 },
      },
      include: {
        model: Category,
        attributes: ['name'],
      },
      attributes: ['id', 'name', 'price', 'description', 'stock'],
    });
    if (!product) return res.error(404, 'product was not found');

    res.success(200, product);
  } catch (error) {
    res.error(500, error.message, 'internal server error');
  }
};

module.exports = { getAll, getById };
