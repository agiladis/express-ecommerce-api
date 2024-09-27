const Cart = require('../entities/cart');

const validateCartOwnership = async (req, res, next) => {
  const userId = req.user.id;
  const cartId = req.params.id;

  try {
    const cart = await Cart.findOne({ where: { id: cartId, userId } });
    if (!cart) return res.error(404, 'cart product not found');

    req.cart = cart;
    next();
  } catch (error) {
    res.error(500, error.message, 'internal server error');
  }
};

module.exports = validateCartOwnership;
