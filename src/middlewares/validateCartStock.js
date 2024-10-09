const Cart = require('../entities/cart');
const CartItem = require('../entities/cartItem');
const Product = require('../entities/product');

const validateCartStock = async (req, res, next) => {
  const userId = req.user.id;

  try {
    const cart = await Cart.findOne({ where: { userId } });
    if (!cart) return res.success(200, [], 'Cart is empty');

    const cartItems = await CartItem.findAll({
      where: { cartId: cart.id },
      attributes: ['id', 'quantity'],
      include: {
        model: Product,
        attributes: ['id', 'name', 'imageUrl', 'price', 'stock', 'isAvail'],
      },
    });

    const products = cartItems.map((item) => ({
      ...item.toJSON(),
      stockStatus:
        item.Product && item.Product.stock > 0 && item.Product.isAvail
          ? 'Available'
          : 'Product not available',
    }));

    req.cartItems = products;
    next();
  } catch (error) {
    res.error(500, error.message, 'internal server error');
  }
};

module.exports = validateCartStock;
