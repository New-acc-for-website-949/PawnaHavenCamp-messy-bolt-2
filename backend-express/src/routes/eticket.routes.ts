import { Router, Request, Response } from 'express';
import { BookingRepository } from '../repositories/booking.repository';

const router = Router();
const bookingRepo = new BookingRepository();

router.get('/:bookingId', async (req: Request, res: Response) => {
  try {
    const { bookingId } = req.params;

    if (!bookingId) {
      return res.status(400).json({ error: 'booking_id is required' });
    }

    const booking = await bookingRepo.findById(bookingId);

    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    const now = new Date();
    const checkoutDate = new Date(booking.checkout_datetime);
    const isExpired = now > checkoutDate;

    if (isExpired) {
      return res.status(410).json({
        error: 'Booking expired',
        message: 'This booking has expired',
        booking_id: bookingId,
        checkout_datetime: booking.checkout_datetime,
      });
    }

    if (booking.booking_status !== 'TICKET_GENERATED' &&
        booking.booking_status !== 'OWNER_CONFIRMED') {
      return res.status(403).json({
        error: 'Ticket not available',
        message: 'E-ticket is not yet available for this booking',
        current_status: booking.booking_status,
      });
    }

    const dueAmount = (booking.total_amount || 0) - booking.advance_amount;

    const ticketData = {
      booking_id: booking.booking_id,
      property_name: booking.property_name,
      guest_name: booking.guest_name,
      guest_phone: booking.guest_phone,
      checkin_datetime: booking.checkin_datetime,
      checkout_datetime: booking.checkout_datetime,
      advance_amount: booking.advance_amount,
      due_amount: dueAmount,
      total_amount: booking.total_amount,
      owner_name: booking.owner_name,
      owner_phone: booking.owner_phone,
      map_link: booking.map_link,
      property_address: booking.property_address,
      persons: booking.persons,
      booking_status: booking.booking_status,
      created_at: booking.created_at,
    };

    res.json(ticketData);
  } catch (error: any) {
    console.error('E-ticket fetch error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
