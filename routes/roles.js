const express = require('express');
const router = express.Router();
const Role = require('../schemas/roles');

// helper middleware to handle async errors
const asyncHandler = fn => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

// Create a new role
router.post('/', asyncHandler(async (req, res) => {
  const role = new Role(req.body);
  const saved = await role.save();
  res.status(201).json(saved);
}));

// Get all roles (not deleted)
router.get('/', asyncHandler(async (req, res) => {
  const roles = await Role.find({ isDeleted: false });
  res.json(roles);
}));

// Get role by id
router.get('/:id', asyncHandler(async (req, res) => {
  const role = await Role.findById(req.params.id);
  if (!role || role.isDeleted) {
    return res.status(404).json({ message: 'Role not found' });
  }
  res.json(role);
}));

// Update role
router.put('/:id', asyncHandler(async (req, res) => {
  const updates = req.body;
  const role = await Role.findByIdAndUpdate(req.params.id, updates, { new: true, runValidators: true });
  if (!role || role.isDeleted) {
    return res.status(404).json({ message: 'Role not found' });
  }
  res.json(role);
}));

// Soft delete role
router.delete('/:id', asyncHandler(async (req, res) => {
  const role = await Role.findByIdAndUpdate(req.params.id, { isDeleted: true }, { new: true });
  if (!role) {
    return res.status(404).json({ message: 'Role not found' });
  }
  res.json({ message: 'Role deleted' });
}));

module.exports = router;
