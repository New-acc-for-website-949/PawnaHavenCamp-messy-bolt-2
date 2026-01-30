const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');

router.post('/initiate', bookingController.initiateBooking);
router.get('/ledger', bookingController.getLedgerEntries);
router.post('/ledger', bookingController.addLedgerEntry);
router.get('/:bookingId', bookingController.getBooking);
router.put('/update-status', bookingController.updateBookingStatus);
router.post('/process-confirmed', bookingController.processConfirmedBooking);
router.post('/process-cancelled', bookingController.processCancelledBooking);

module.exports = router;
