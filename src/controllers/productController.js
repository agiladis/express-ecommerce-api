const { Op } = require('sequelize');
const Product = require('../entities/product');

const getAll = async (req, res) => {
  try {
    const products = await Product.findAll({
      where: {
        stock: {
          [Op.gt]: 0,
        },
      },
      attributes: ['name', 'price'],
    });

    res.success(200, products, 'Get all products success');
  } catch (error) {
    res.error(500, error.message, 'internal server error');
  }
};

module.exports = { getAll };
