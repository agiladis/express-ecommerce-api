const express = require('express');
const router = express.Router();
const {
  addToCart,
  getAllProductFromCart,
  updateCartProduct,
} = require('../controllers/cartController');

router.post('/', addToCart);
router.get('/', getAllProductFromCart);
router.put('/:productId', updateCartProduct);
router.patch('/:productId', updateCartProduct);

module.exports = router;
