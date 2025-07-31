const Checkin = require('../models/Checkin');
const { encryptData, decryptData } = require('../utils/encryption');
const { validationResult } = require('express-validator');

exports.createCheckin = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { moodRating, stressLevel, journalEntry } = req.body;

    // Check if user already has a check-in today
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const existingCheckin = await Checkin.findOne({
      userId: req.userId,
      date: { $gte: today }
    });

    if (existingCheckin) {
      return res.status(400).json({ error: 'You have already checked in today' });
    }

    // Encrypt sensitive data
    const encryptedJournal = encryptData(journalEntry);

    const checkin = new Checkin({
      userId: req.userId,
      moodRating,
      stressLevel,
      journalEntry: encryptedJournal
    });

    await checkin.save();

    res.status(201).json({
      message: 'Check-in saved successfully',
      checkin: {
        id: checkin._id,
        date: checkin.date,
        moodRating: checkin.moodRating,
        stressLevel: checkin.stressLevel
      }
    });
  } catch (error) {
    next(error);
  }
};

exports.getCheckins = async (req, res, next) => {
  try {
    const { limit = 30, skip = 0 } = req.query;

    const checkins = await Checkin.find({ userId: req.userId })
      .sort({ date: -1 })
      .limit(parseInt(limit))
      .skip(parseInt(skip));

    // Decrypt journal entries
    const decryptedCheckins = checkins.map(checkin => ({
      id: checkin._id,
      date: checkin.date,
      moodRating: checkin.moodRating,
      stressLevel: checkin.stressLevel,
      journalEntry: decryptData(checkin.journalEntry)
    }));

    res.json({
      checkins: decryptedCheckins,
      total: await Checkin.countDocuments({ userId: req.userId })
    });
  } catch (error) {
    next(error);
  }
};