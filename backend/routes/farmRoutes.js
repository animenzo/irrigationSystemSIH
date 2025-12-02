const express = require('express');
const Farm = require('../models/farm');

const router = express.Router();

// POST /api/farms
router.post('/', async (req, res) => {
  try {
    const farm = await Farm.create(req.body);
    res.status(201).json(farm);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// GET /api/farms
router.get('/', async (req, res) => {
  try {
    const farms = await Farm.find();
    res.json(farms);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/farms/:id
router.get('/:id', async (req, res) => {
  try {
    const farm = await Farm.findById(req.params.id);
    if (!farm) {
      return res.status(404).json({ error: 'Farm not found' });
    }
    res.json(farm);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT /api/farms/:id
router.put('/:id', async (req, res) => {
  try {
    const farm = await Farm.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!farm) {
      return res.status(404).json({ error: 'Farm not found' });
    }
    res.json(farm);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// DELETE /api/farms/:id
router.delete('/:id', async (req, res) => {
  try {
    const farm = await Farm.findByIdAndDelete(req.params.id);
    if (!farm) {
      return res.status(404).json({ error: 'Farm not found' });
    }
    res.json({ message: 'Farm deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
