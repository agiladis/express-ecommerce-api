const express = require('express');
const router = express.Router();
const {
  addToCart,
  getAllFromCart,
  updateCartProduct,
} = require('../controllers/cartController');

router.post('/', addToCart);
router.get('/', getAllFromCart);
router.put('/:productId', updateCartProduct);
router.patch('/:productId', updateCartProduct);

module.exports = router;
