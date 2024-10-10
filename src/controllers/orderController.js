const { Op, where } = require('sequelize');
const sequelize = require('../config/database');
const Cart = require('../entities/cart');
const Product = require('../entities/product');
const Order = require('../entities/order');
const OrderItem = require('../entities/orderItem');
const CartItem = require('../entities/cartItem');

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
  const cartItemsId = req.body.items;

  const transaction = await sequelize.transaction();

  try {
    const cart = await Cart.findOne({
      where: { userId },
      include: [
        {
          model: CartItem,
          where: { id: { [Op.in]: cartItemsId } },
          include: [Product], // Include product data for stock checking
        },
      ],
      transaction,
    });

    if (!cart || cart.CartItems.length === 0)
      return res.error(404, 'Cart is empty or no valid cart items found');

    let totalPrice = 0;
    for (let item of cart.CartItems) {
      const product = item.Product;

      if (product.stock < item.quantity) {
        throw new Error(`Insufficient stock for product ${product.name}`);
      }

      totalPrice += product.price * item.quantity;
    }

    // create order
    const order = await Order.create({ userId, totalPrice }, { transaction });

    // save order items and reduce stock of product
    for (let item of cart.CartItems) {
      const product = await Product.findByPk(item.Product.id, { transaction });
      product.stock -= item.quantity;
      await product.save({ transaction });

      await OrderItem.create(
        {
          orderId: order.id,
          productId: item.Product.id,
          quantity: item.quantity,
        },
        { transaction }
      );
    }

    // delete product from cart item
    await CartItem.destroy({
      where: { id: { [Op.in]: cartItemsId }, cartId: cart.id },
      transaction,
    });

    // commit transaction
    await transaction.commit();

    res.success(201, order, 'Order created successfully');
  } catch (error) {
    await transaction.rollback();
    res.error(400, error.message, 'Error create order');
  }
};

module.exports = { getAllOrders, getOrderById, createOrder };
