const express = require('express');
const mongoose = require('mongoose');
const Schedule = require('../models/schedule');

const router = express.Router();

// GET /api/schedules
router.get('/', async (req, res) => {
  try {
    const { farmId } = req.query;
    let query = {};
    if (farmId) {
      if (!mongoose.Types.ObjectId.isValid(farmId)) {
        return res.status(400).json({ error: 'Invalid farmId' });
      }
      query.farmId = farmId;
    }
    const schedules = await Schedule.find(query).populate('farmId', 'name');
    res.json(schedules);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

// POST /api/schedules
router.post('/', async (req, res) => {
  try {
    const schedule = await Schedule.create(req.body);
    const populatedSchedule = await Schedule.findById(schedule._id).populate('farmId', 'name');
    res.status(201).json(populatedSchedule);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// GET /api/schedules/:id
router.get('/:id', async (req, res) => {
  try {
    const schedule = await Schedule.findById(req.params.id).populate('farmId', 'name');
    if (!schedule) {
      return res.status(404).json({ error: 'Schedule not found' });
    }
    res.json(schedule);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT /api/schedules/:id
router.put('/:id', async (req, res) => {
  try {
    const schedule = await Schedule.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('farmId', 'name');
    if (!schedule) {
      return res.status(404).json({ error: 'Schedule not found' });
    }
    res.json(schedule);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// DELETE /api/schedules/:id
router.delete('/:id', async (req, res) => {
  try {
    const schedule = await Schedule.findByIdAndDelete(req.params.id);
    if (!schedule) {
      return res.status(404).json({ error: 'Schedule not found' });
    }
    res.json({ message: 'Schedule deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
