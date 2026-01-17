import { Router, Request, Response } from 'express';
import { BookingService } from '../services/booking.service';

const router = Router();
const bookingService = new BookingService();

router.post('/initiate', async (req: Request, res: Response) => {
  try {
    const booking = await bookingService.initiateBooking(req.body);
    res.status(201).json({
      success: true,
      booking,
      message: "Booking initiated successfully"
    });
  } catch (error: any) {
    console.error('Booking initiate error:', error);
    res.status(400).json({
      error: error.message || 'Failed to create booking'
    });
  }
});

router.get('/:id', async (req: Request, res: Response) => {
  try {
    const bookingId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const booking = await bookingService.getBookingById(bookingId);

    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    res.json({
      success: true,
      booking
    });
  } catch (error: any) {
    console.error('Booking fetch error:', error);
    res.status(500).json({
      error: 'Failed to fetch booking'
    });
  }
});

router.patch('/status', async (req: Request, res: Response) => {
  try {
    const { booking_id, booking_status, payment_status, order_id, transaction_id } = req.body;

    if (!booking_id) {
      return res.status(400).json({ error: 'Booking ID is required' });
    }

    const booking = await bookingService.updateBookingStatus(
      booking_id,
      booking_status,
      payment_status,
      order_id,
      transaction_id
    );

    res.json({
      success: true,
      booking,
      message: "Booking status updated successfully"
    });
  } catch (error: any) {
    console.error('Status update error:', error);

    if (error.message.includes('Invalid state transition')) {
      return res.status(400).json({ error: error.message });
    }

    if (error.message === 'Booking not found') {
      return res.status(404).json({ error: error.message });
    }

    res.status(500).json({ error: 'Failed to update booking' });
  }
});

router.post('/confirmed', async (req: Request, res: Response) => {
  try {
    const { booking_id } = req.body;

    if (!booking_id) {
      return res.status(400).json({ error: 'booking_id is required' });
    }

    await bookingService.processConfirmedBooking(booking_id);

    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    const ticketUrl = `${frontendUrl}/ticket?booking_id=${booking_id}`;

    res.json({
      success: true,
      booking_id,
      status: 'TICKET_GENERATED',
      ticket_url: ticketUrl
    });
  } catch (error: any) {
    console.error('Process confirmed error:', error);

    if (error.message.includes('Booking must be in')) {
      return res.status(400).json({ error: error.message });
    }

    if (error.message === 'Booking not found') {
      return res.status(404).json({ error: error.message });
    }

    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/cancelled', async (req: Request, res: Response) => {
  try {
    const { booking_id } = req.body;

    if (!booking_id) {
      return res.status(400).json({ error: 'booking_id is required' });
    }

    const result = await bookingService.processCancelledBooking(booking_id);

    res.json({
      success: result.success,
      booking_id,
      status: result.status,
      refund_id: result.refund_id
    });
  } catch (error: any) {
    console.error('Process cancelled error:', error);

    if (error.message.includes('Booking must be in')) {
      return res.status(400).json({ error: error.message });
    }

    if (error.message === 'Booking not found') {
      return res.status(404).json({ error: error.message });
    }

    if (error.message.includes('Refund failed')) {
      return res.status(500).json({ error: error.message });
    }

    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
