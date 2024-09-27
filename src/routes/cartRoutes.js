const express = require('express');
const router = express.Router();
const {
  addToCart,
  getAllProductFromCart,
  updateCartProduct,
} = require('../controllers/cartController');

router.post('/', addToCart);
router.get('/', getAllProductFromCart);
router.put('/:id', updateCartProduct);
router.patch('/:id', updateCartProduct);

module.exports = router;
