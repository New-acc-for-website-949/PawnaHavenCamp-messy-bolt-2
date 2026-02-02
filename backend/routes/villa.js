const express = require('express');
const router = express.Router();
const villaController = require('../controllers/villa/villaController');
const authMiddleware = require('../middleware/auth');

router.get('/public/:slug', villaController.getPublicVillaBySlug);

router.get('/:id', authMiddleware, villaController.getVillaById);
router.put('/update/:id', authMiddleware, villaController.updateVilla);

router.get('/:id/calendar', villaController.getVillaCalendarData);
router.put('/:id/calendar', authMiddleware, villaController.updateVillaCalendarData);

module.exports = router;
