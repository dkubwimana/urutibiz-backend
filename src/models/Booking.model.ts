// =====================================================
// BOOKING MODEL
// =====================================================

import { 
  BookingData, 
  CreateBookingData, 
  UpdateBookingData, 
  BookingFilters,
  BookingStatus,
  BookingPricing,
  BookingTimelineEvent,
  BookingMessage,
  BookingStatusHistory,
  PickupMethod,
  PaymentStatus,
  InsuranceType,
  ConditionType
} from '@/types';
import { v4 as uuidv4 } from 'uuid';

// Demo Booking Model - In-memory implementation
export class Booking {
  public id: string;
  public bookingNumber: string;
  public renterId: string;
  public ownerId: string;
  public productId: string;
  public startDate: Date;
  public endDate: Date;
  public status: BookingStatus;
  public paymentStatus: PaymentStatus;
  public insuranceType?: InsuranceType;
  
  // Pickup and delivery information
  public pickupMethod: PickupMethod;
  public pickupAddress?: string;
  public deliveryAddress?: string;
  public pickupCoordinates?: { lat: number; lng: number };
  public deliveryCoordinates?: { lat: number; lng: number };
  
  // Insurance information
  public insurancePolicyNumber?: string;
  public insurancePremium?: number;
  public insuranceDetails?: Record<string, any>;
  
  // Financial information
  public pricing: BookingPricing;
  public totalAmount: number;
  public securityDeposit?: number;
  public platformFee?: number;
  public taxAmount?: number;
  
  // AI and risk assessment
  public aiRiskScore?: number;
  public aiAssessment?: Record<string, any>;
  
  // Notes and instructions
  public specialInstructions?: string;
  public renterNotes?: string;
  public ownerNotes?: string;
  public adminNotes?: string;
  
  // Condition tracking
  public initialCondition?: ConditionType;
  public finalCondition?: ConditionType;
  public damageReport?: string;
  public damagePhotos?: string[];
  
  // System fields
  public timeline: BookingTimelineEvent[];
  public messages: BookingMessage[];
  public statusHistory: BookingStatusHistory[];
  public createdBy?: string;
  public lastModifiedBy?: string;
  public createdAt: Date;
  public updatedAt: Date;
  
  // Additional metadata
  public metadata?: Record<string, any>;
  public isRepeatBooking?: boolean;
  public parentBookingId?: string;

  // In-memory storage for demo
  private static bookings: Booking[] = [];

  constructor(data: CreateBookingData & { renterId: string; ownerId: string; pricing: BookingPricing }) {
    this.id = uuidv4();
    this.bookingNumber = this.generateBookingNumber();
    this.renterId = data.renterId;
    this.ownerId = data.ownerId;
    this.productId = data.productId;
    this.startDate = new Date(data.startDate);
    this.endDate = new Date(data.endDate);
    this.status = 'pending';
    this.paymentStatus = 'pending';
    this.pickupMethod = data.pickupMethod;
    this.pickupAddress = data.pickupAddress;
    this.deliveryAddress = data.deliveryAddress;
    this.specialInstructions = data.specialInstructions;
    this.renterNotes = data.renterNotes;
    this.insuranceType = data.insuranceType || 'none';
    this.pricing = data.pricing;
    this.totalAmount = data.pricing.totalAmount;
    this.securityDeposit = data.securityDeposit;
    this.metadata = data.metadata;
    this.timeline = [];
    this.messages = [];
    this.statusHistory = [];
    this.createdBy = data.renterId;
    this.createdAt = new Date();
    this.updatedAt = new Date();

    // Add initial timeline event
    this.addTimelineEvent('booking_created', data.renterId, 'Booking request submitted');
    
    // Add initial status history
    this.addStatusHistoryEntry(undefined, 'pending', data.renterId, 'Booking created');
  }

  // Generate unique booking number
  private generateBookingNumber(): string {
    const date = new Date();
    const year = date.getFullYear().toString().slice(-2);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const random = Math.random().toString(36).substring(2, 8).toUpperCase();
    return `BK${year}${month}${day}${random}`;
  }

  // Static methods for CRUD operations
  static async create(data: CreateBookingData & { renterId: string; ownerId: string; pricing: BookingPricing }): Promise<Booking> {
    const booking = new Booking(data);
    Booking.bookings.push(booking);
    return booking;
  }

  static async findById(id: string): Promise<Booking | null> {
    return Booking.bookings.find(b => b.id === id) || null;
  }

  static async findByBookingNumber(bookingNumber: string): Promise<Booking | null> {
    return Booking.bookings.find(b => b.bookingNumber === bookingNumber) || null;
  }

  static async findAll(): Promise<Booking[]> {
    return Booking.bookings;
  }

  static async getPaginated(
    page: number = 1, 
    limit: number = 10, 
    filters: BookingFilters = {},
    sortBy: string = 'created_at',
    sortOrder: 'asc' | 'desc' = 'desc'
  ): Promise<{
    data: Booking[];
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  }> {
    let filtered = Booking.bookings;

    // Apply filters
    if (filters.renterId) {
      filtered = filtered.filter(b => b.renterId === filters.renterId);
    }

    if (filters.ownerId) {
      filtered = filtered.filter(b => b.ownerId === filters.ownerId);
    }

    if (filters.productId) {
      filtered = filtered.filter(b => b.productId === filters.productId);
    }

    if (filters.status) {
      filtered = filtered.filter(b => b.status === filters.status);
    }

    if (filters.paymentStatus) {
      filtered = filtered.filter(b => b.paymentStatus === filters.paymentStatus);
    }

    if (filters.insuranceType) {
      filtered = filtered.filter(b => b.insuranceType === filters.insuranceType);
    }

    if (filters.bookingNumber) {
      filtered = filtered.filter(b => b.bookingNumber.toLowerCase().includes(filters.bookingNumber!.toLowerCase()));
    }

    if (filters.minAmount) {
      filtered = filtered.filter(b => b.totalAmount >= filters.minAmount!);
    }

    if (filters.maxAmount) {
      filtered = filtered.filter(b => b.totalAmount <= filters.maxAmount!);
    }

    if (filters.hasInsurance !== undefined) {
      filtered = filtered.filter(b => (b.insuranceType !== 'none') === filters.hasInsurance);
    }

    if (filters.isDamaged !== undefined) {
      filtered = filtered.filter(b => (b.damageReport !== undefined && b.damageReport !== '') === filters.isDamaged);
    }

    if (filters.startDate) {
      const filterDate = typeof filters.startDate === 'string' ? new Date(filters.startDate) : filters.startDate;
      filtered = filtered.filter(b => b.startDate >= (filterDate as Date));
    }

    if (filters.endDate) {
      const filterDate = typeof filters.endDate === 'string' ? new Date(filters.endDate) : filters.endDate;
      filtered = filtered.filter(b => b.endDate <= (filterDate as Date));
    }

    // Sorting
    filtered.sort((a, b) => {
      let valueA: any;
      let valueB: any;

      switch (sortBy) {
        case 'created_at':
          valueA = a.createdAt;
          valueB = b.createdAt;
          break;
        case 'start_date':
          valueA = a.startDate;
          valueB = b.startDate;
          break;
        case 'total_amount':
          valueA = a.totalAmount;
          valueB = b.totalAmount;
          break;
        case 'booking_number':
          valueA = a.bookingNumber;
          valueB = b.bookingNumber;
          break;
        default:
          valueA = a.createdAt;
          valueB = b.createdAt;
      }

      if (sortOrder === 'asc') {
        return valueA < valueB ? -1 : valueA > valueB ? 1 : 0;
      } else {
        return valueA > valueB ? -1 : valueA < valueB ? 1 : 0;
      }
    });

    // Calculate pagination
    const total = filtered.length;
    const totalPages = Math.ceil(total / limit);
    const offset = (page - 1) * limit;
    const data = filtered.slice(offset, offset + limit);

    return {
      data,
      page,
      limit,
      total,
      totalPages,
      hasNext: page < totalPages,
      hasPrev: page > 1
    };
  }

  // Instance methods
  async update(data: UpdateBookingData): Promise<Booking> {
    Object.keys(data).forEach(key => {
      if (data[key as keyof UpdateBookingData] !== undefined) {
        (this as any)[key] = data[key as keyof UpdateBookingData];
      }
    });
    this.updatedAt = new Date();
    return this;
  }

  async updateStatus(status: BookingStatus, userId: string, reason?: string): Promise<Booking> {
    const oldStatus = this.status;
    this.status = status;
    this.lastModifiedBy = userId;
    this.updatedAt = new Date();

    // Add timeline event
    const description = reason 
      ? `Status changed from ${oldStatus} to ${status}. Reason: ${reason}`
      : `Status changed from ${oldStatus} to ${status}`;
    
    this.addTimelineEvent('status_changed', userId, description, { oldStatus, newStatus: status, reason });
    
    // Add status history entry
    this.addStatusHistoryEntry(oldStatus, status, userId, reason);

    return this;
  }

  // Add status history entry
  private addStatusHistoryEntry(previousStatus: BookingStatus | undefined, newStatus: BookingStatus, changedBy: string, reason?: string): void {
    const historyEntry: BookingStatusHistory = {
      id: uuidv4(),
      bookingId: this.id,
      previousStatus,
      newStatus,
      changedBy,
      reason,
      changedAt: new Date()
    };
    this.statusHistory.push(historyEntry);
  }

  async cancel(userId: string, reason?: string): Promise<Booking> {
    return this.updateStatus('cancelled', userId, reason);
  }

  async checkIn(userId: string): Promise<Booking> {
    this.status = 'in_progress';
    this.lastModifiedBy = userId;
    this.updatedAt = new Date();
    this.addTimelineEvent('checked_in', userId, 'Rental period started');
    this.addStatusHistoryEntry('confirmed', 'in_progress', userId, 'Check-in completed');
    return this;
  }

  async checkOut(userId: string): Promise<Booking> {
    this.status = 'completed';
    this.lastModifiedBy = userId;
    this.updatedAt = new Date();
    this.addTimelineEvent('checked_out', userId, 'Rental period completed');
    this.addStatusHistoryEntry('in_progress', 'completed', userId, 'Check-out completed');
    return this;
  }

  canUpdateStatus(userId: string, newStatus: BookingStatus): boolean {
    // Owner can confirm/reject pending bookings
    if (this.ownerId === userId && this.status === 'pending' && ['confirmed', 'cancelled'].includes(newStatus)) {
      return true;
    }

    // Both parties can cancel
    if ((this.renterId === userId || this.ownerId === userId) && newStatus === 'cancelled') {
      return true;
    }

    // Both parties can start/end rental
    if ((this.renterId === userId || this.ownerId === userId) && 
        ((this.status === 'confirmed' && newStatus === 'in_progress') ||
         (this.status === 'in_progress' && newStatus === 'completed'))) {
      return true;
    }

    return false;
  }

  toJSON(): BookingData {
    return {
      id: this.id,
      bookingNumber: this.bookingNumber,
      renterId: this.renterId,
      ownerId: this.ownerId,
      productId: this.productId,
      startDate: this.startDate,
      endDate: this.endDate,
      status: this.status,
      paymentStatus: this.paymentStatus,
      insuranceType: this.insuranceType,
      pickupMethod: this.pickupMethod,
      pickupAddress: this.pickupAddress,
      deliveryAddress: this.deliveryAddress,
      pickupCoordinates: this.pickupCoordinates,
      deliveryCoordinates: this.deliveryCoordinates,
      insurancePolicyNumber: this.insurancePolicyNumber,
      insurancePremium: this.insurancePremium,
      insuranceDetails: this.insuranceDetails,
      specialInstructions: this.specialInstructions,
      renterNotes: this.renterNotes,
      ownerNotes: this.ownerNotes,
      adminNotes: this.adminNotes,
      pricing: {
        ...this.pricing,
        insuranceFee: typeof this.pricing.insuranceFee === 'number' ? this.pricing.insuranceFee : 0
      },
      totalAmount: this.totalAmount,
      securityDeposit: this.securityDeposit,
      platformFee: this.platformFee,
      taxAmount: this.taxAmount,
      aiRiskScore: this.aiRiskScore,
      aiAssessment: this.aiAssessment,
      initialCondition: this.initialCondition,
      finalCondition: this.finalCondition,
      damageReport: this.damageReport,
      damagePhotos: this.damagePhotos,
      createdBy: this.createdBy,
      lastModifiedBy: this.lastModifiedBy,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      metadata: this.metadata,
      isRepeatBooking: this.isRepeatBooking,
      parentBookingId: this.parentBookingId
    };
  }

  // Timeline management
  addTimelineEvent(eventType: string, userId: string, description: string, metadata?: Record<string, any>): void {
    const event: BookingTimelineEvent = {
      id: uuidv4(),
      eventType,
      userId,
      timestamp: new Date(),
      description,
      metadata
    };
    this.timeline.push(event);
  }

  async getTimeline(): Promise<BookingTimelineEvent[]> {
    return this.timeline.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
  }

  // Get status history
  async getStatusHistory(): Promise<BookingStatusHistory[]> {
    return this.statusHistory.sort((a, b) => a.changedAt.getTime() - b.changedAt.getTime());
  }

  // Message management
  static async sendMessage(bookingId: string, senderId: string, message: string): Promise<BookingMessage> {
    const messageObj: BookingMessage = {
      id: uuidv4(),
      bookingId,
      senderId,
      message,
      timestamp: new Date(),
      isRead: false
    };

    const booking = await Booking.findById(bookingId);
    if (booking) {
      booking.messages.push(messageObj);
    }

    return messageObj;
  }

  static async getMessages(bookingId: string, page: number = 1, limit: number = 50): Promise<{
    data: BookingMessage[];
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  }> {
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      throw new Error('Booking not found');
    }

    const messages = booking.messages.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
    const total = messages.length;
    const totalPages = Math.ceil(total / limit);
    const offset = (page - 1) * limit;
    const data = messages.slice(offset, offset + limit);

    return {
      data,
      page,
      limit,
      total,
      totalPages,
      hasNext: page < totalPages,
      hasPrev: page > 1
    };
  }

  // Analytics
  static async getAnalytics(timeframe: string = '30d'): Promise<{
    totalBookings: number;
    totalRevenue: number;
    averageBookingValue: number;
    bookingsByStatus: Record<BookingStatus, number>;
    revenueOverTime: Array<{ date: string; revenue: number; bookings: number }>;
    insuranceStats: Record<InsuranceType, number>;
    damageStats: { totalDamaged: number; damageRate: number };
  }> {
    const bookings = Booking.bookings;
    
    // Calculate date range based on timeframe
    const now = new Date();
    const daysBack = timeframe === '7d' ? 7 : timeframe === '30d' ? 30 : 90;
    const startDate = new Date(now.getTime() - (daysBack * 24 * 60 * 60 * 1000));
    
    const filteredBookings = bookings.filter(b => b.createdAt >= startDate);
    
    const totalBookings = filteredBookings.length;
    const totalRevenue = filteredBookings.reduce((sum, b) => sum + b.totalAmount, 0);
    const averageBookingValue = totalBookings > 0 ? totalRevenue / totalBookings : 0;
    
    const bookingsByStatus: Record<BookingStatus, number> = {
      pending: 0,
      confirmed: 0,
      in_progress: 0,
      completed: 0,
      cancelled: 0,
      disputed: 0
    };
    
    const insuranceStats: Record<InsuranceType, number> = {
      none: 0,
      basic: 0,
      standard: 0,
      premium: 0
    };
    
    filteredBookings.forEach(b => {
      bookingsByStatus[b.status]++;
      if (b.insuranceType) {
        insuranceStats[b.insuranceType]++;
      }
    });
    
    // Damage statistics
    const damagedBookings = filteredBookings.filter(b => b.damageReport && b.damageReport.trim() !== '');
    const damageStats = {
      totalDamaged: damagedBookings.length,
      damageRate: totalBookings > 0 ? (damagedBookings.length / totalBookings) * 100 : 0
    };
    
    // Mock revenue over time data
    const revenueOverTime = [];
    for (let i = daysBack - 1; i >= 0; i--) {
      const date = new Date(now.getTime() - (i * 24 * 60 * 60 * 1000));
      const dayBookings = filteredBookings.filter(b => 
        b.createdAt.toDateString() === date.toDateString()
      );
      
      revenueOverTime.push({
        date: date.toISOString().split('T')[0],
        revenue: dayBookings.reduce((sum, b) => sum + b.totalAmount, 0),
        bookings: dayBookings.length
      });
    }

    return {
      totalBookings,
      totalRevenue,
      averageBookingValue,
      bookingsByStatus,
      revenueOverTime,
      insuranceStats,
      damageStats
    };
  }

  // Demo data seeding
  static async seed(): Promise<void> {
    if (Booking.bookings.length > 0) return;

    // Create some demo bookings after products are seeded
    const demoBookings = [
      {
        renterId: 'demo-user-4',
        ownerId: 'demo-user-1',
        productId: 'will-be-replaced-with-actual-product-id',
        startDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
        endDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000), // 10 days from now
        pickupMethod: 'pickup' as PickupMethod,
        pickupAddress: '123 Main St, Downtown',
        specialInstructions: 'Please have the property cleaned and ready for check-in at 3 PM',
        renterNotes: 'First time renting, please provide detailed instructions',
        insuranceType: 'standard' as InsuranceType,
        securityDeposit: 500,
        pricing: {
          basePrice: 299.99,
          currency: 'USD',
          totalDays: 3,
          subtotal: 899.97,
          platformFee: 89.99,
          taxAmount: 71.99,
          insuranceFee: 25.00,
          totalAmount: 1061.95
        }
      }
    ];

    for (const bookingData of demoBookings) {
      await Booking.create({
        ...bookingData,
        startDate: (bookingData.startDate instanceof Date)
          ? bookingData.startDate.toISOString()
          : bookingData.startDate,
        endDate: (bookingData.endDate instanceof Date)
          ? bookingData.endDate.toISOString()
          : bookingData.endDate,
        pricing: {
          ...bookingData.pricing,
          insuranceFee: typeof bookingData.pricing.insuranceFee === 'number' ? bookingData.pricing.insuranceFee : 0
        }
      });
    }
  }
}

export default Booking;
