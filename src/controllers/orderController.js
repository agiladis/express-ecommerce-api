const { Op, Transaction } = require('sequelize');
const sequelize = require('../config/database');
const Cart = require('../entities/cart');
const Product = require('../entities/product');
const Order = require('../entities/order');
const OrderItem = require('../entities/orderItem');

const getAllOrders = async (req, res) => {
  const userId = req.user.id;

  try {
    const orders = await Order.findAndCountAll({
      where: { userId },
      limit: 10,
      offset: 0,
    });
    if (!orders) return res.error(404, "You don't have any transactions yet");

    res.success(200, orders, 'Get all transactions success');
  } catch (error) {
    res.error(500, error.message, 'internal server error');
  }
};

const getOrderById = async (req, res) => {
  const userId = req.user.id;
  const { id } = req.params;

  try {
    if (isNaN(Number(id))) return res.error(422, 'params must be number');

    const order = await Order.findOne({
      where: {
        id,
        userId,
      },
      include: {
        model: OrderItem,
        attributes: ['id', 'productId', 'quantity'],
        include: {
          model: Product,
          attributes: ['name', 'price'],
        },
      },
    });
    if (!order) return res.error(404, 'transaction not found');

    res.success(200, order);
  } catch (error) {
    res.error(500, error.message, 'internal server error');
  }
};

const createOrder = async (req, res) => {
  const userId = req.user.id;
  const items = req.body.items;

  const t = await sequelize.transaction();

  try {
    const cartProduct = await Cart.findAll({
      where: { id: { [Op.in]: items }, userId },
      include: [Product],
      transaction: t,
    });
    if (!cartProduct.length)
      return res.error(404, 'bad request', 'Product not found');

    let totalPrice = 0;
    for (const item of cartProduct) {
      const product = await Product.findByPk(item.Product.id, {
        transaction: t,
      });
      if (!product)
        throw new Error(`Product with id ${item.Product.id} not found`);
      if (product.stock < item.quantity)
        throw new Error(`Insufficient stock for product ${product.name}`);

      totalPrice += item.Product.price * item.quantity;
    }

    // create order
    const order = await Order.create(
      { userId, totalPrice },
      { transaction: t }
    );

    // save order items and reduce stock of product
    for (const item of cartProduct) {
      const product = await Product.findByPk(item.Product.id, {
        transaction: t,
      });
      product.stock -= item.quantity;
      await product.save({ transaction: t });

      await OrderItem.create(
        {
          orderId: order.id,
          productId: item.Product.id,
          quantity: item.quantity,
        },
        { transaction: t }
      );
    }

    // delete prodcut from cart
    await Cart.destroy({
      where: { id: { [Op.in]: items }, userId },
      transaction: t,
    });

    // commit transaction
    await t.commit();
    res.success(201, order, 'Order created successfully');
  } catch (error) {
    await t.rollback();
    res.error(400, error.message, 'Error registering user');
  }
};

module.exports = { getAllOrders, getOrderById, createOrder };
