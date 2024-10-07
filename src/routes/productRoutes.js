const express = require('express');
const router = express.Router();
const {
  getAll,
  getById,
  getAllReviews,
} = require('../controllers/productController');

router.get('/', getAll);
router.get('/:id', getById);
router.get('/review/:productId', getAllReviews);

module.exports = router;
