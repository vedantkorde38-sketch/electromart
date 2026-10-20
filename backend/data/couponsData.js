const couponsData = [
  {
    code: 'WELCOME10',
    discountType: 'percentage',
    discountValue: 10,
    minimumOrderValue: 999,
    maximumDiscount: 1000,
    expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year
    usageLimit: 1000,
    isActive: true
  },
  {
    code: 'ELECTRO200',
    discountType: 'fixed',
    discountValue: 200,
    minimumOrderValue: 1499,
    maximumDiscount: null,
    expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
    usageLimit: 500,
    isActive: true
  },
  {
    code: 'FESTIVE500',
    discountType: 'fixed',
    discountValue: 500,
    minimumOrderValue: 4999,
    maximumDiscount: null,
    expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
    usageLimit: 500,
    isActive: true
  },
  {
    code: 'MEGA1000',
    discountType: 'percentage',
    discountValue: 15,
    minimumOrderValue: 10000,
    maximumDiscount: 2500,
    expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
    usageLimit: 200,
    isActive: true
  }
];

module.exports = couponsData;
