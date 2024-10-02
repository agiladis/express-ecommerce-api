const { where } = require('sequelize');
const Cart = require('../entities/cart');
const Product = require('../entities/product');

const addToCart = async (req, res) => {
  const { productId, quantity = 1 } = req.body;
  const userId = req.user.id;

  try {
    const product = await Product.findOne({
      where: { id: productId },
    });
    if (!product) return res.error(404, 'product not found');
    if (product.stock < quantity) return res.error(400, 'Insufficient stock');

    let cart = await Cart.findOne({ where: { userId, productId } });
    if (cart) {
      cart.quantity += quantity;
      await cart.save();
    } else {
      cart = await Cart.create({ userId, productId, quantity });
    }

    res.success(200, cart, 'Product successfully added to cart');
  } catch (error) {
    res.error(500, error.message, 'internal server error');
  }
};

const getAllProductFromCart = async (req, res) => {
  // const userId = req.user.id;

  try {
    // const cartProducts = await Cart.findAll({
    //   where: { userId },
    //   include: {
    //     model: Product,
    //     attributes: ['id', 'name', 'price'],
    //   },
    //   attributes: ['quantity'],
    // });
    // if (!cartProducts) return res.error(404, 'Cart is empty');

    res.success(200, req.cartItems, 'Get all products from cart success');
  } catch (error) {
    res.error(500, error.message, 'internal server error');
  }
};

const updateCartProduct = async (req, res) => {
  const updates = req.body;
  const cartProduct = req.cart;

  try {
    Object.keys(updates).forEach((key) => {
      cartProduct[key] = updates[key];
    });

    await cartProduct.save();
    res.success(200, cartProduct, 'Update cart product success');
  } catch (error) {
    res.error(500, error.message, 'internal server error');
  }
};

module.exports = { addToCart, getAllProductFromCart, updateCartProduct };
