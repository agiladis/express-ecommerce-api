const Cart = require('../entities/cart');
const Product = require('../entities/product');

const validateCartStock = async (req, res, next) => {
  const userId = req.user.id;

  try {
    const cartItems = await Cart.findAll({
      where: { userId },
      include: { model: Product },
    });
    if (!cart) return res.error(404, 'Cart is empty');

    const updatedCartItems = cartItems.map((item) => {
      if (!item.Product || item.Product.stock == 0) {
        return {
          ...item.toJSON(),
          stockStatus: 'Product not available',
        };
      }

      return {
        ...item.toJSON(),
        stockStatus: 'Available',
      };
    });

    req.cartItems = updatedCartItems;
    next();
  } catch (error) {
    res.error(500, error.message, 'internal server error');
  }
};
