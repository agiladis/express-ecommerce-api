const express = require('express');
const router = express.Router();
const {
  getAllOrders,
  getOrderById,
  createOrder,
} = require('../controllers/orderController');

router.post('/', createOrder);
router.get('/', getAllOrders);
router.get('/:id', getOrderById);

module.exports = router;
