// =====================================================
// BUSINESS RULES CONFIGURATION
// =====================================================

export const businessRules = {
  product: {
    requireVerifiedUser: true, // Only verified users, admin, moderator can create
    allowedRoles: ['admin', 'moderator'],
  },
  category: {
    allowedRoles: ['admin', 'moderator'], // Only admin/moderator can create
  },
  booking: {
    requireVerifiedUser: true, // Only verified users can book
    allowedRoles: ['admin', 'moderator', 'user'],
    defaultStatus: 'pending',
  },
  // Add more rules as needed
};
