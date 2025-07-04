import { BaseRepository } from './BaseRepository';
import Booking from '@/models/Booking.model';
import { BookingData, CreateBookingData, UpdateBookingData } from '@/types/booking.types';

class BookingRepository extends BaseRepository<BookingData, CreateBookingData, UpdateBookingData> {
  protected readonly tableName = 'bookings';
  protected readonly modelClass = Booking;
}

export default new BookingRepository();
