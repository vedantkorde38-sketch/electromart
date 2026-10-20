const express = require('express');
const router = express.Router();
const {
  getProducts,
  getProductByIdOrSlug,
  getFeaturedProducts,
  getDealsProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  uploadProductImage
} = require('../controllers/productController');
const { protect, optionalProtect, admin } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.get('/', getProducts);
router.get('/featured', getFeaturedProducts);
router.get('/deals', getDealsProducts);
router.get('/:identifier', optionalProtect, getProductByIdOrSlug);

router.post('/', protect, admin, createProduct);
router.put('/:id', protect, admin, updateProduct);
router.delete('/:id', protect, admin, deleteProduct);
router.post('/upload-image', protect, admin, upload.single('image'), uploadProductImage);

module.exports = router;
