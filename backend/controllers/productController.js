const Product = require('../models/Product');
const Category = require('../models/Category');

// Helper to generate slug from name
const generateSlug = (name) => {
  return name
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '') + '-' + Math.floor(1000 + Math.random() * 9000);
};

// @desc    Get all products with filtering, search, sorting, and pagination
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res, next) => {
  try {
    const {
      keyword,
      category,
      brand,
      minPrice,
      maxPrice,
      minRating,
      inStock,
      discountOnly,
      featuredOnly,
      sort,
      page = 1,
      limit = 12
    } = req.query;

    const query = { isActive: true };

    // Keyword Search across name, brand, description
    if (keyword && keyword.trim()) {
      const searchRegex = new RegExp(keyword.trim(), 'i');
      query.$or = [
        { name: searchRegex },
        { brand: searchRegex },
        { description: searchRegex }
      ];
    }

    // Category filter (supports either ObjectId or Category slug)
    if (category) {
      if (category.match(/^[0-9a-fA-F]{24}$/)) {
        query.category = category;
      } else {
        const foundCategory = await Category.findOne({ slug: category.toLowerCase() });
        if (foundCategory) {
          query.category = foundCategory._id;
        } else {
          // If category slug doesn't exist, return empty result gracefully
          return res.json({
            success: true,
            products: [],
            page: 1,
            pages: 0,
            total: 0
          });
        }
      }
    }

    // Brand filter (supports comma-separated list or single brand)
    if (brand) {
      const brandsList = brand.split(',').map(b => b.trim());
      query.brand = { $in: brandsList.map(b => new RegExp(`^${b}$`, 'i')) };
    }

    // Price range
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    // Rating filter
    if (minRating) {
      query.ratingAverage = { $gte: Number(minRating) };
    }

    // In Stock filter
    if (inStock === 'true' || inStock === true) {
      query.stock = { $gt: 0 };
    }

    // Discount filter
    if (discountOnly === 'true' || discountOnly === true) {
      query.discountPercentage = { $gt: 0 };
    }

    // Featured only
    if (featuredOnly === 'true' || featuredOnly === true) {
      query.isFeatured = true;
    }

    // Sorting
    let sortOption = { createdAt: -1 }; // default newest
    if (sort === 'price_asc') {
      sortOption = { price: 1 };
    } else if (sort === 'price_desc') {
      sortOption = { price: -1 };
    } else if (sort === 'newest') {
      sortOption = { createdAt: -1 };
    } else if (sort === 'rating') {
      sortOption = { ratingAverage: -1, ratingCount: -1 };
    } else if (sort === 'popular') {
      sortOption = { ratingCount: -1, ratingAverage: -1 };
    }

    const currentPage = Math.max(1, parseInt(page, 10));
    const itemsPerPage = Math.max(1, Math.min(100, parseInt(limit, 10)));
    const skip = (currentPage - 1) * itemsPerPage;

    const total = await Product.countDocuments(query);
    const products = await Product.find(query)
      .populate('category', 'name slug')
      .sort(sortOption)
      .skip(skip)
      .limit(itemsPerPage);

    // Get all available brands for the current filtered categories to populate filter sidebar
    const allBrands = await Product.distinct('brand', { isActive: true });

    res.json({
      success: true,
      products,
      page: currentPage,
      pages: Math.ceil(total / itemsPerPage),
      total,
      availableBrands: allBrands.sort()
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single product by ID or slug
// @route   GET /api/products/:identifier
// @access  Public
const getProductByIdOrSlug = async (req, res, next) => {
  try {
    const { identifier } = req.params;
    const isObjectId = identifier.match(/^[0-9a-fA-F]{24}$/);

    const product = isObjectId
      ? await Product.findById(identifier).populate('category', 'name slug')
      : await Product.findOne({ slug: identifier.toLowerCase() }).populate('category', 'name slug');

    if (!product || (!product.isActive && req.user?.role !== 'admin')) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Fetch related products from same category
    const relatedProducts = await Product.find({
      category: product.category._id,
      _id: { $ne: product._id },
      isActive: true
    })
      .limit(4)
      .populate('category', 'name slug');

    res.json({
      success: true,
      product,
      relatedProducts
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get featured products
// @route   GET /api/products/featured
// @access  Public
const getFeaturedProducts = async (req, res, next) => {
  try {
    const products = await Product.find({ isFeatured: true, isActive: true })
      .populate('category', 'name slug')
      .limit(8);

    res.json({
      success: true,
      products
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get deals products
// @route   GET /api/products/deals
// @access  Public
const getDealsProducts = async (req, res, next) => {
  try {
    const products = await Product.find({ discountPercentage: { $gt: 0 }, isActive: true })
      .populate('category', 'name slug')
      .sort({ discountPercentage: -1 })
      .limit(8);

    res.json({
      success: true,
      products
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new product
// @route   POST /api/products
// @access  Private/Admin
const createProduct = async (req, res, next) => {
  try {
    const {
      name,
      brand,
      category,
      description,
      specifications,
      price,
      originalPrice,
      discountPercentage,
      stock,
      isFeatured,
      images
    } = req.body;

    if (!name || !brand || !category || !description || price === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields: name, brand, category, description, price'
      });
    }

    // Verify category exists
    const categoryDoc = await Category.findById(category);
    if (!categoryDoc) {
      return res.status(400).json({
        success: false,
        message: 'Invalid category ID provided'
      });
    }

    const slug = generateSlug(name);

    // Calculate discount percentage if original price given and discount not explicitly given
    let calculatedDiscount = Number(discountPercentage) || 0;
    const numPrice = Number(price);
    const numOriginalPrice = originalPrice ? Number(originalPrice) : numPrice;

    if (numOriginalPrice > numPrice && !discountPercentage) {
      calculatedDiscount = Math.round(((numOriginalPrice - numPrice) / numOriginalPrice) * 100);
    }

    const product = await Product.create({
      name: name.trim(),
      slug,
      brand: brand.trim(),
      category,
      description: description.trim(),
      specifications: specifications || {},
      price: numPrice,
      originalPrice: numOriginalPrice >= numPrice ? numOriginalPrice : numPrice,
      discountPercentage: calculatedDiscount,
      stock: stock !== undefined ? Math.max(0, Number(stock)) : 10,
      isFeatured: !!isFeatured,
      images: Array.isArray(images) && images.length > 0 ? images : ['/placeholder-electronics.svg']
    });

    const populatedProduct = await Product.findById(product._id).populate('category', 'name slug');

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      product: populatedProduct
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update product
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    const {
      name,
      brand,
      category,
      description,
      specifications,
      price,
      originalPrice,
      discountPercentage,
      stock,
      isFeatured,
      isActive,
      images
    } = req.body;

    if (name) {
      product.name = name.trim();
    }
    if (brand) product.brand = brand.trim();
    if (category) {
      const categoryDoc = await Category.findById(category);
      if (!categoryDoc) {
        return res.status(400).json({ success: false, message: 'Invalid category ID' });
      }
      product.category = category;
    }
    if (description) product.description = description.trim();
    if (specifications !== undefined) product.specifications = specifications;
    if (price !== undefined) product.price = Number(price);
    if (originalPrice !== undefined) product.originalPrice = Number(originalPrice);
    if (discountPercentage !== undefined) product.discountPercentage = Number(discountPercentage);
    if (stock !== undefined) product.stock = Math.max(0, Number(stock));
    if (isFeatured !== undefined) product.isFeatured = !!isFeatured;
    if (isActive !== undefined) product.isActive = !!isActive;
    if (images !== undefined) product.images = images;

    await product.save();

    const updated = await Product.findById(product._id).populate('category', 'name slug');

    res.json({
      success: true,
      message: 'Product updated successfully',
      product: updated
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete product (soft delete or remove)
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    await Product.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Product deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Upload product image
// @route   POST /api/products/upload-image
// @access  Private/Admin
const uploadProductImage = (req, res) => {
  if (!req.file) {
    return res.status(400).json({
      success: false,
      message: 'No image file uploaded'
    });
  }

  const imageUrl = `/uploads/${req.file.filename}`;
  res.json({
    success: true,
    message: 'Image uploaded successfully',
    imageUrl
  });
};

module.exports = {
  getProducts,
  getProductByIdOrSlug,
  getFeaturedProducts,
  getDealsProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  uploadProductImage
};
