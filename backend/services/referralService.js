const ReferralRepository = require('../repositories/referralRepository');

const ReferralService = {
  async getTopEarners(period) {
    if (!['month', 'all'].includes(period)) {
      period = 'all';
    }
    return ReferralRepository.getTopEarners(period);
  }
};

module.exports = ReferralService;