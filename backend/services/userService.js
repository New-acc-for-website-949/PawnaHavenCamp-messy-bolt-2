const UserRepository = require('../repositories/userRepository');
const jwt = require('jsonwebtoken');

const UserService = {
  async register(username, mobileNumber, referralCode) {
    // 1. Check if username exists
    const existingUser = await UserRepository.findByUsername(username);
    if (existingUser) throw new Error('Username already taken');

    // 2. Check if mobile already registered
    const existingMobile = await UserRepository.findByMobile(mobileNumber);
    if (existingMobile) throw new Error('Mobile number already registered');

    // 3. Generate Unique UPPERCASE Referral Code
    let uniqueCode;
    let isUnique = false;
    while (!isUnique) {
      uniqueCode = Math.random().toString(36).substring(2, 8).toUpperCase();
      const checkCode = await UserRepository.findByReferralCode(uniqueCode);
      if (!checkCode) isUnique = true;
    }

    // 4. Create user
    return await UserRepository.create(username, mobileNumber, uniqueCode);
  },

  async login(mobileNumber) {
    const user = await UserRepository.findByMobile(mobileNumber);
    if (!user) throw new Error('User not found');
    if (user.status === 'blocked') throw new Error('Account is blocked');

    const token = jwt.sign(
      { userId: user.id, username: user.username },
      process.env.JWT_SECRET || 'your_fallback_secret',
      { expiresIn: '24h' }
    );

    return { token, user };
  },

  async getDashboard(userId) {
    const user = await UserRepository.findByMobile(null); // Just to satisfy middleware flow if needed, but we have userId
    // Get user details
    const userResult = await require('../db').query('SELECT username, referral_code, status FROM referral_users WHERE id = $1', [userId]);
    const userDetails = userResult.rows[0];

    if (!userDetails || userDetails.status === 'blocked') {
      throw new Error('Unauthorized or account blocked');
    }

    const stats = await UserRepository.getDashboardData(userId);
    
    return {
      username: userDetails.username,
      referral_code: userDetails.referral_code,
      total_earnings: stats.total_earnings,
      total_withdrawals: stats.total_withdrawals,
      available_balance: stats.total_earnings - stats.total_withdrawals,
      total_referrals: stats.total_referrals
    };
  }
};

module.exports = UserService;