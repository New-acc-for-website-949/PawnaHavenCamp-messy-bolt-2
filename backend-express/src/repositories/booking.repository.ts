import { pool } from '../config/database';
import { Booking, BookingStatus, PaymentStatus, PropertyType } from '../types/booking.types';

export class BookingRepository {
  async create(bookingData: Partial<Booking>): Promise<Booking> {
    const {
      property_id,
      property_name,
      property_type,
      guest_name,
      guest_phone,
      owner_phone,
      admin_phone,
      checkin_datetime,
      checkout_datetime,
      advance_amount,
      persons,
      max_capacity,
      veg_guest_count,
      nonveg_guest_count,
      payment_status = 'INITIATED',
      booking_status = 'PAYMENT_PENDING',
      owner_name,
      map_link,
      property_address,
      total_amount,
    } = bookingData;

    const result = await pool.query(
      `INSERT INTO bookings (
        property_id, property_name, property_type, guest_name, guest_phone,
        owner_phone, admin_phone, checkin_datetime, checkout_datetime, advance_amount,
        persons, max_capacity, veg_guest_count, nonveg_guest_count,
        payment_status, booking_status, owner_name, map_link, property_address, total_amount
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20)
      RETURNING *`,
      [
        property_id, property_name, property_type, guest_name, guest_phone,
        owner_phone, admin_phone, checkin_datetime, checkout_datetime, advance_amount,
        persons, max_capacity, veg_guest_count, nonveg_guest_count,
        payment_status, booking_status, owner_name, map_link, property_address, total_amount
      ]
    );

    return result.rows[0];
  }

  async findById(booking_id: string): Promise<Booking | null> {
    const result = await pool.query(
      'SELECT * FROM bookings WHERE booking_id = $1',
      [booking_id]
    );
    return result.rows[0] || null;
  }

  async findByOrderId(order_id: string): Promise<Booking | null> {
    const result = await pool.query(
      'SELECT * FROM bookings WHERE order_id = $1',
      [order_id]
    );
    return result.rows[0] || null;
  }

  async update(booking_id: string, updates: Partial<Booking>): Promise<Booking> {
    const fields: string[] = [];
    const values: any[] = [];
    let paramCount = 1;

    Object.entries(updates).forEach(([key, value]) => {
      if (value !== undefined) {
        fields.push(`${key} = $${paramCount}`);
        values.push(value);
        paramCount++;
      }
    });

    values.push(booking_id);

    const result = await pool.query(
      `UPDATE bookings SET ${fields.join(', ')} WHERE booking_id = $${paramCount} RETURNING *`,
      values
    );

    return result.rows[0];
  }

  async updateStatus(
    booking_id: string,
    booking_status?: BookingStatus,
    payment_status?: PaymentStatus,
    order_id?: string,
    transaction_id?: string
  ): Promise<Booking> {
    const updates: Partial<Booking> = {};
    if (booking_status) updates.booking_status = booking_status;
    if (payment_status) updates.payment_status = payment_status;
    if (order_id) updates.order_id = order_id;
    if (transaction_id) updates.transaction_id = transaction_id;

    return this.update(booking_id, updates);
  }
}
