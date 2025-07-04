import { Response } from 'express';
import { BaseController } from './BaseController';
import BookingService from '@/services/BookingService';
import ProductService from '@/services/ProductService';
import UserVerificationService from '@/services/userVerification.service';
import Booking from '@/models/Booking.model';
import { 
  AuthenticatedRequest,
  CreateBookingData,
  BookingFilters,
  BookingStatus,
  BookingData
} from '@/types';
import { ResponseHelper } from '@/utils/response';

export class BookingsController extends BaseController {
  /**
   * Create new booking
   * POST /api/v1/bookings
   */
  public createBooking = this.asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    if (this.handleValidationErrors(req as any, res)) return;

    const renterId = req.user.id;
    const { productId, startDate, endDate, pickupMethod, specialInstructions }: CreateBookingData = req.body;

    // Get product details
    const productResult = await ProductService.getById(productId);
    if (!productResult.success || !productResult.data) {
      return this.handleNotFound(res, 'Product');
    }
    const product = productResult.data;

    // Check if user is trying to book their own product
    if (product.ownerId === renterId) {
      return this.handleBadRequest(res, 'You cannot book your own product');
    }

    // Calculate pricing (simple implementation for demo)
    const startDateObj = new Date(startDate);
    const endDateObj = new Date(endDate);
    const totalDays = Math.ceil((endDateObj.getTime() - startDateObj.getTime()) / (1000 * 60 * 60 * 24));
    const subtotal = product.basePrice * totalDays;
    const platformFee = subtotal * 0.1; // 10% platform fee
    const taxAmount = subtotal * 0.08; // 8% tax
    const insuranceFee = 0; // Add logic if needed
    const totalAmount = subtotal + platformFee + taxAmount + insuranceFee;

    const pricing = {
      basePrice: product.basePrice,
      currency: product.baseCurrency,
      totalDays,
      subtotal,
      platformFee,
      taxAmount,
      insuranceFee,
      totalAmount
    };

    // When creating a booking, ensure startDate/endDate are strings if required by type
    const bookingData = {
      renterId,
      ownerId: product.ownerId,
      productId,
      startDate: startDateObj.toISOString(),
      endDate: endDateObj.toISOString(),
      pickupMethod,
      specialInstructions,
      pricing
    };

    // Enforce KYC: Only fully verified users can book
    const isVerified = await UserVerificationService.isUserFullyKycVerified(renterId);
    if (!isVerified) {
      return ResponseHelper.error(res, 'You must complete KYC verification to book or rent.', 403);
    }

    const created = await BookingService.create(bookingData);
    if (!created.success || !created.data) {
      return ResponseHelper.error(res, created.error || 'Failed to create booking', 400);
    }

    this.logAction('CREATE_BOOKING', renterId, created.data.id, bookingData);

    return ResponseHelper.success(res, 'Booking created successfully', created.data, 201);
  });

  /**
   * Get user's bookings
   * GET /api/v1/bookings
   */
  public getUserBookings = this.asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const userId = req.user.id;
    const { page, limit } = this.getPaginationParams(req as any);
    const { sortBy, sortOrder } = this.getSortParams(req as any, 'created_at', 'desc');
    
    const role = (req.query.role as 'renter' | 'owner') || 'renter';
    const status = req.query.status as BookingStatus;

    const filters: BookingFilters = {};
    
    if (role === 'renter') {
      filters.renterId = userId;
    } else if (role === 'owner') {
      filters.ownerId = userId;
    }
    
    if (status) filters.status = status;

    // Convert string dates in filters to Date objects for compatibility
    const query: Partial<BookingData> = {};
    if (filters.renterId) query.renterId = filters.renterId;
    if (filters.ownerId) query.ownerId = filters.ownerId;
    if (filters.productId) query.productId = filters.productId;
    if (filters.status) query.status = filters.status;
    if (filters.paymentStatus) query.paymentStatus = filters.paymentStatus;
    if (filters.startDate) {
      const d = new Date(filters.startDate);
      if (!isNaN(d.getTime())) query.startDate = d;
    }
    if (filters.endDate) {
      const d = new Date(filters.endDate);
      if (!isNaN(d.getTime())) query.endDate = d;
    }

    const result = await BookingService.getPaginated(query, page, limit, sortBy, sortOrder);

    this.logAction('GET_USER_BOOKINGS', userId, undefined, { role, filters });

    if (!result.success || !result.data) {
      return ResponseHelper.error(res, result.error || 'Failed to fetch bookings', 400);
    }

    return this.formatPaginatedResponse(res, 'Bookings retrieved successfully', result.data);
  });

  /**
   * Get booking by ID
   * GET /api/v1/bookings/:id
   */
  public getBooking = this.asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const { id } = req.params;
    const result = await BookingService.getById(id);
    if (!result.success || !result.data) {
      return this.handleNotFound(res, 'Booking');
    }
    // Only involved users can view the booking
    if (!this.checkResourceOwnership(req, result.data.renterId) && !this.checkResourceOwnership(req, result.data.ownerId)) {
      return this.handleUnauthorized(res, 'Not authorized to view this booking');
    }
    this.logAction('GET_BOOKING', req.user.id, id);
    return ResponseHelper.success(res, 'Booking retrieved successfully', result.data);
  });

  /**
   * Update booking (status, etc.)
   * PUT /api/v1/bookings/:id
   */
  public updateBooking = this.asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    if (this.handleValidationErrors(req as any, res)) return;
    const { id } = req.params;
    const result = await BookingService.getById(id);
    if (!result.success || !result.data) {
      return this.handleNotFound(res, 'Booking');
    }
    // Only involved users can update the booking
    if (!this.checkResourceOwnership(req, result.data.renterId) && !this.checkResourceOwnership(req, result.data.ownerId)) {
      return this.handleUnauthorized(res, 'Not authorized to update this booking');
    }
    const updateData = req.body;
    const updated = await BookingService.update(id, updateData);
    if (!updated.success || !updated.data) {
      return ResponseHelper.error(res, updated.error || 'Failed to update booking', 400);
    }
    this.logAction('UPDATE_BOOKING', req.user.id, id, updateData);
    return ResponseHelper.success(res, 'Booking updated successfully', updated.data);
  });

  /**
   * Cancel booking
   * POST /api/v1/bookings/:id/cancel
   */
  public cancelBooking = this.asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const { id } = req.params;
    const { reason }: { reason?: string } = req.body;
    const userId = req.user.id;

    const booking = await Booking.findById(id);
    if (!booking) {
      return this.handleNotFound(res, 'Booking');
    }

    // Check if user can cancel
    if (booking.renterId !== userId && booking.ownerId !== userId) {
      return this.handleUnauthorized(res, 'Not authorized to cancel this booking');
    }

    // Check if booking can be cancelled
    if (!['pending', 'confirmed'].includes(booking.status)) {
      return this.handleBadRequest(res, 'Booking cannot be cancelled at this stage');
    }

    const cancelledBooking = await booking.cancel(userId, reason);

    this.logAction('CANCEL_BOOKING', userId, id, { reason });

    ResponseHelper.success(res, 'Booking cancelled successfully', cancelledBooking.toJSON());
  });

  /**
   * Confirm booking (owner only)
   * POST /api/v1/bookings/:id/confirm
   */
  public confirmBooking = this.asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const { id } = req.params;
    const userId = req.user.id;

    const booking = await Booking.findById(id);
    if (!booking) {
      return this.handleNotFound(res, 'Booking');
    }

    // Only owner can confirm
    if (booking.ownerId !== userId && req.user.role !== 'admin') {
      return this.handleUnauthorized(res, 'Only the product owner can confirm this booking');
    }

    // Check if booking can be confirmed
    if (booking.status !== 'pending') {
      return this.handleBadRequest(res, 'Booking cannot be confirmed at this stage');
    }

    const confirmedBooking = await booking.updateStatus('confirmed', userId);

    this.logAction('CONFIRM_BOOKING', userId, id);

    ResponseHelper.success(res, 'Booking confirmed successfully', confirmedBooking.toJSON());
  });

  /**
   * Start rental (check-in)
   * POST /api/v1/bookings/:id/checkin
   */
  public checkIn = this.asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const { id } = req.params;
    const userId = req.user.id;

    const booking = await Booking.findById(id);
    if (!booking) {
      return this.handleNotFound(res, 'Booking');
    }

    // Both renter and owner should be able to initiate check-in
    if (booking.renterId !== userId && booking.ownerId !== userId && req.user.role !== 'admin') {
      return this.handleUnauthorized(res, 'Not authorized to check-in this booking');
    }

    // Check if booking can be started
    if (booking.status !== 'confirmed') {
      return this.handleBadRequest(res, 'Booking must be confirmed before check-in');
    }

    const updatedBooking = await booking.checkIn(userId);

    this.logAction('CHECKIN_BOOKING', userId, id);

    ResponseHelper.success(res, 'Check-in completed successfully', updatedBooking.toJSON());
  });

  /**
   * End rental (check-out)
   * POST /api/v1/bookings/:id/checkout
   */
  public checkOut = this.asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const { id } = req.params;
    const userId = req.user.id;

    const booking = await Booking.findById(id);
    if (!booking) {
      return this.handleNotFound(res, 'Booking');
    }

    // Both renter and owner should be able to initiate check-out
    if (booking.renterId !== userId && booking.ownerId !== userId && req.user.role !== 'admin') {
      return this.handleUnauthorized(res, 'Not authorized to check-out this booking');
    }

    // Check if booking can be ended
    if (booking.status !== 'in_progress') {
      return this.handleBadRequest(res, 'Booking must be in progress to check-out');
    }

    const updatedBooking = await booking.checkOut(userId);

    this.logAction('CHECKOUT_BOOKING', userId, id);

    ResponseHelper.success(res, 'Check-out completed successfully', updatedBooking.toJSON());
  });

  /**
   * Get booking timeline/history
   * GET /api/v1/bookings/:id/timeline
   */
  public getBookingTimeline = this.asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const { id } = req.params;
    const userId = req.user.id;

    const booking = await Booking.findById(id);
    if (!booking) {
      return this.handleNotFound(res, 'Booking');
    }

    // Check if user is involved in this booking
    if (booking.renterId !== userId && booking.ownerId !== userId && req.user.role !== 'admin') {
      return this.handleUnauthorized(res, 'Not authorized to view this booking timeline');
    }

    const timeline = await booking.getTimeline();

    this.logAction('GET_BOOKING_TIMELINE', userId, id);

    ResponseHelper.success(res, 'Booking timeline retrieved successfully', timeline);
  });

  /**
   * Get booking analytics (admin only)
   * GET /api/v1/bookings/analytics
   */
  public getBookingAnalytics = this.asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    // Only allow admin/super_admin roles
    if (!['admin', 'super_admin'].includes(req.user.role)) {
      return this.handleUnauthorized(res, 'Admin access required');
    }

    // Parse analytics params from query
    const params: import('@/types/analytics.types').BookingAnalyticsParams = {
      period: (req.query.period as string) || '30d',
      granularity: (req.query.granularity as any) || 'day',
      startDate: req.query.startDate as string,
      endDate: req.query.endDate as string,
      filters: {
        status: req.query.status ? (req.query.status as string).split(',') : undefined,
        countryId: req.query.countryId as string,
        categoryId: req.query.categoryId as string,
        ownerId: req.query.ownerId as string,
        renterId: req.query.renterId as string,
        minAmount: req.query.minAmount ? parseFloat(req.query.minAmount as string) : undefined,
        maxAmount: req.query.maxAmount ? parseFloat(req.query.maxAmount as string) : undefined,
        productIds: req.query.productIds ? (req.query.productIds as string).split(',') : undefined
      }
    };

    const AnalyticsService = (await import('@/services/analytics.service')).default;
    const analytics = await AnalyticsService.getBookingAnalytics(params);

    this.logAction('GET_BOOKING_ANALYTICS', req.user.id, undefined, params);

    return ResponseHelper.success(res, 'Booking analytics retrieved successfully', analytics);
  });
}

export default new BookingsController();
