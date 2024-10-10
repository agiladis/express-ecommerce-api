const sequelize = require('../config/database');
const Cart = require('../entities/cart');
const Product = require('../entities/product');
const CartItem = require('../entities/cartItem');

const addToCart = async (req, res) => {
  const { productId } = req.body;
  const userId = req.user.id;

  const transaction = await sequelize.transaction();

  try {
    const product = await Product.findByPk(productId, { transaction });
    if (!product) return res.error(404, 'product not found');
    if (!product.isAvail) return res.error(400, 'product is not available');

    let cart = await Cart.findOne({ where: { userId }, transaction });
    if (!cart) {
      cart = await Cart.create({ userId }, { transaction });
    }

    let cartItem = await CartItem.findOne({
      where: { cartId: cart.id, productId },
      transaction,
    });
    if (cartItem) {
      cartItem.quantity += 1;
      await cartItem.save({ transaction });
    } else {
      cartItem = await CartItem.create(
        {
          cartId: cart.id,
          productId,
          quantity: 1,
        },
        { transaction }
      );

      cart.isEmpty = false;
      await cart.save({ transaction });
    }

    await transaction.commit();
    res.success(200, cartItem, 'Product successfully added to cart');
  } catch (error) {
    await transaction.rollback();
    res.error(500, error.message, 'internal server error');
  }
};

const getAllProductFromCart = async (req, res) => {
  try {
    res.success(200, req.cartItems, 'Get all products from cart success');
  } catch (error) {
    res.error(500, error.message, 'internal server error');
  }
};

const updateCartProduct = async (req, res) => {
  const { quantity } = req.body;
  const cartItem = req.cartItem;

  try {
    if (quantity === 0) {
      await CartItem.destroy({
        where: {
          id: cartItem.id,
        },
      });

      return res.success(204, cartItem, 'Update cart product success');
    }

    if (!quantity || quantity < 0)
      return res.error(400, 'Quantity must be a positive number');

    const product = await Product.findByPk(cartItem.productId);
    if (!product || !product.isAvail)
      return res.error(404, 'Product not found');

    if (quantity > product.stock)
      return res.error(404, 'Insufficient stock available');

    cartItem.quantity = quantity;
    await cartItem.save();

    res.success(204, cartItem, 'Update cart product success');
  } catch (error) {
    res.error(500, error.message, 'internal server error');
  }
};

module.exports = { addToCart, getAllProductFromCart, updateCartProduct };
