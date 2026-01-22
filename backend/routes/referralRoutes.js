const express = require('express');
const router = express.Router();
const OtpController = require('../controllers/otpController');
const ReferralController = require('../controllers/referralController');

// Public endpoints
router.get('/top-earners', ReferralController.getTopEarners);

// OTP endpoints
router.post('/request-otp', OtpController.requestOtp);
router.post('/verify-otp', OtpController.verifyOtp);

module.exports = router;