const express = require('express');
const router = express.Router();
const {
  addToCart,
  getAllProductFromCart,
  updateCartProduct,
} = require('../controllers/cartController');
const validateCartOwnership = require('../middlewares/validateCartOwnership');

router.post('/', addToCart);
router.get('/', getAllProductFromCart);
router.put('/:id', validateCartOwnership, updateCartProduct);
router.patch('/:id', validateCartOwnership, updateCartProduct);

module.exports = router;
