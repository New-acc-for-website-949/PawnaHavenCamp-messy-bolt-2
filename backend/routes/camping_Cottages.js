const express = require('express');
const router = express.Router();
const campingController = require('../controllers/camping/camping_CottagesController');
const authMiddleware = require('../middleware/auth');

router.get('/public/:slug', campingController.getPublicCampingBySlug);

router.get('/:id', authMiddleware, campingController.getCampingById);
router.put('/update/:id', authMiddleware, campingController.updateCamping);

router.get('/:propertyId/units', authMiddleware, campingController.getPropertyUnits);
router.post('/:propertyId/units', authMiddleware, campingController.createPropertyUnit);
router.put('/units/:unitId', authMiddleware, campingController.updatePropertyUnit);
router.delete('/units/:unitId', authMiddleware, campingController.deletePropertyUnit);

router.get('/units/:unitId/calendar', authMiddleware, campingController.getUnitCalendarData);
router.post('/units/:unitId/calendar', authMiddleware, campingController.updateUnitCalendarData);

module.exports = router;
