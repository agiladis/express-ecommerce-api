const express = require('express');
const router = express.Router();
const {
  addToCart,
  getAllProductFromCart,
  updateCartProduct,
} = require('../controllers/cartController');
const validateCartOwnership = require('../middlewares/validateCartOwnership');
const validateCartStock = require('../middlewares/validateCartStock');

router.post('/', addToCart);
router.get('/', validateCartStock, getAllProductFromCart);
router.put('/:id', validateCartOwnership, updateCartProduct);
router.patch('/:id', validateCartOwnership, updateCartProduct);

module.exports = router;
