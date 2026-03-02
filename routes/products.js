const express = require('express');
const slugify = require('slugify');
const router = express.Router();
const Product = require('../schemas/products');

// async wrapper
const asyncHandler = fn => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

// list with optional filters
// list with optional filters
router.get('/', asyncHandler(async (req, res) => {
  const { title = '', maxPrice = 1e4, minPrice = 0, limit = 5, page = 1 } = req.query;
  const query = { isDeleted: false };
  if (title) query.title = { $regex: title, $options: 'i' };
  query.price = { $gte: Number(minPrice), $lte: Number(maxPrice) };

  const docs = await Product.find(query)
    .populate('category')
    .skip(limit * (page - 1))
    .limit(Number(limit));
  res.json(docs);
}));

// seed route for debugging: creates dummy product using first category if none exist
router.get('/seed', asyncHandler(async (req, res) => {
  const category = await require('../schemas/categories').findOne({ isDeleted: false });
  if (!category) return res.status(400).json({ message: 'create a category first' });
  const dummy = {
    title: 'Sample Product',
    slug: slugify('Sample Product', { lower: true, strict: true }),
    description: 'Automatically seeded product',
    price: 9.99,
    category: category._id,
    images: [],
    creationAt: new Date(),
    updatedAt: new Date()
  };
  const prod = new Product(dummy);
  const saved = await prod.save();
  res.json(saved);
}));

router.get('/:id', asyncHandler(async (req, res) => {
  const prod = await Product.findById(req.params.id).populate('category');
  if (!prod || prod.isDeleted) return res.status(404).json({ message: 'Product not found' });
  res.json(prod);
}));

router.post('/', asyncHandler(async (req, res) => {
  const body = req.body;
  body.slug = slugify(body.title || '', { lower: true, strict: true });
  body.creationAt = new Date();
  body.updatedAt = new Date();
  const prod = new Product(body);
  const saved = await prod.save();
  res.status(201).json(saved);
}));

router.put('/:id', asyncHandler(async (req, res) => {
  const updates = req.body;
  if (updates.title) {
    updates.slug = slugify(updates.title, { lower: true, strict: true });
  }
  updates.updatedAt = new Date();
  const prod = await Product.findByIdAndUpdate(req.params.id, updates, { new: true, runValidators: true }).populate('category');
  if (!prod || prod.isDeleted) return res.status(404).json({ message: 'Product not found' });
  res.json(prod);
}));

router.delete('/:id', asyncHandler(async (req, res) => {
  const prod = await Product.findByIdAndUpdate(req.params.id, { isDeleted: true }, { new: true });
  if (!prod) return res.status(404).json({ message: 'Product not found' });
  res.json({ message: 'Product deleted' });
}));

module.exports = router;
