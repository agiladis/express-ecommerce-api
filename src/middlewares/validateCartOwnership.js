const Cart = require('../entities/cart');
const CartItem = require('../entities/cartItem');

const validateCartOwnership = async (req, res, next) => {
  const userId = req.user.id;
  const id = req.params.id;

  try {
    const cartItem = await CartItem.findByPk(id, {
      include: {
        model: Cart,
        where: { userId },
      },
    });
    if (!cartItem)
      return res.error(
        404,
        'Cart item not found or does not belong to the user'
      );

    req.cartItem = cartItem;
    next();
  } catch (error) {
    res.error(500, error.message, 'internal server error');
  }
};

module.exports = validateCartOwnership;
