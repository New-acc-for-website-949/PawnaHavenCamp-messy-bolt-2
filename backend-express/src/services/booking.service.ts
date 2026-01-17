import { BookingRepository } from '../repositories/booking.repository';
import { Booking, BookingStatus, PaymentStatus } from '../types/booking.types';
import { WhatsAppService } from '../utils/whatsappService';

const VALID_TRANSITIONS: Record<BookingStatus, BookingStatus[]> = {
  "PAYMENT_PENDING": ["PAYMENT_SUCCESS"],
  "PAYMENT_SUCCESS": ["BOOKING_REQUEST_SENT_TO_OWNER"],
  "BOOKING_REQUEST_SENT_TO_OWNER": ["OWNER_CONFIRMED", "OWNER_CANCELLED"],
  "OWNER_CONFIRMED": ["TICKET_GENERATED"],
  "OWNER_CANCELLED": ["REFUND_REQUIRED", "REFUND_INITIATED", "CANCELLED_NO_REFUND"],
  "TICKET_GENERATED": [],
  "REFUND_REQUIRED": ["REFUND_INITIATED", "REFUND_FAILED"],
  "REFUND_INITIATED": [],
  "REFUND_FAILED": [],
  "CANCELLED_NO_REFUND": [],
};

export class BookingService {
  private bookingRepo: BookingRepository;
  private whatsappService: WhatsAppService;

  constructor() {
    this.bookingRepo = new BookingRepository();
    this.whatsappService = new WhatsAppService();
  }

  async initiateBooking(bookingData: Partial<Booking>): Promise<Booking> {
    this.validateBookingData(bookingData);
    return await this.bookingRepo.create(bookingData);
  }

  async getBookingById(booking_id: string): Promise<Booking | null> {
    return await this.bookingRepo.findById(booking_id);
  }

  async updateBookingStatus(
    booking_id: string,
    booking_status?: BookingStatus,
    payment_status?: PaymentStatus,
    order_id?: string,
    transaction_id?: string
  ): Promise<Booking> {
    const currentBooking = await this.bookingRepo.findById(booking_id);

    if (!currentBooking) {
      throw new Error('Booking not found');
    }

    if (booking_status && !this.isValidTransition(currentBooking.booking_status, booking_status)) {
      throw new Error(
        `Invalid state transition from ${currentBooking.booking_status} to ${booking_status}`
      );
    }

    return await this.bookingRepo.updateStatus(
      booking_id,
      booking_status,
      payment_status,
      order_id,
      transaction_id
    );
  }

  async processConfirmedBooking(booking_id: string): Promise<void> {
    const booking = await this.bookingRepo.findById(booking_id);

    if (!booking) {
      throw new Error('Booking not found');
    }

    if (booking.booking_status !== 'OWNER_CONFIRMED') {
      throw new Error(`Booking must be in OWNER_CONFIRMED status, current: ${booking.booking_status}`);
    }

    await this.bookingRepo.update(booking_id, { booking_status: 'TICKET_GENERATED' });

    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    const ticketUrl = `${frontendUrl}/ticket?booking_id=${booking_id}`;

    const customerMessage = `🎉 Booking Confirmed!\n\nYour booking has been confirmed.\n\nBooking ID: ${booking_id}\nProperty: ${booking.property_name}\n\nView your e-ticket:\n${ticketUrl}`;

    await this.whatsappService.sendTextMessage(booking.guest_phone, customerMessage);

    const dueAmount = (booking.total_amount || 0) - booking.advance_amount;
    const adminMessage = `✅ Booking Confirmed & Ticket Generated\n\nBooking ID: ${booking_id}\nProperty: ${booking.property_name}\nGuest: ${booking.guest_name} (${booking.guest_phone})\nOwner: ${booking.owner_phone}\nAdvance: ₹${booking.advance_amount}\nDue: ₹${dueAmount}\n\nE-ticket: ${ticketUrl}`;

    await this.whatsappService.sendTextMessage(booking.admin_phone, adminMessage);
  }

  async processCancelledBooking(booking_id: string): Promise<{ success: boolean; refund_id?: string; status: string }> {
    const booking = await this.bookingRepo.findById(booking_id);

    if (!booking) {
      throw new Error('Booking not found');
    }

    if (booking.booking_status !== 'OWNER_CANCELLED') {
      throw new Error(`Booking must be in OWNER_CANCELLED status, current: ${booking.booking_status}`);
    }

    if (booking.refund_id) {
      return {
        success: true,
        refund_id: booking.refund_id,
        status: 'already_processed'
      };
    }

    if (booking.payment_status === 'SUCCESS') {
      const refundResult = await this.initiateRefund(
        booking.order_id!,
        booking.transaction_id!,
        booking.advance_amount.toString()
      );

      if (refundResult.success) {
        await this.bookingRepo.update(booking_id, {
          booking_status: 'REFUND_INITIATED',
          refund_id: refundResult.refundId
        });

        const customerMessage = `❌ Booking Cancelled\n\nYour booking has been cancelled by the property owner.\n\nBooking ID: ${booking_id}\nRefund Amount: ₹${booking.advance_amount}\n\nYour refund has been initiated and will be credited to your payment account within 5-7 business days.`;

        await this.whatsappService.sendTextMessage(booking.guest_phone, customerMessage);

        const adminMessage = `❌ Booking Cancelled - Refund Initiated\n\nBooking ID: ${booking_id}\nProperty: ${booking.property_name}\nGuest: ${booking.guest_name} (${booking.guest_phone})\nRefund Amount: ₹${booking.advance_amount}\nRefund ID: ${refundResult.refundId}\n\nStatus: Refund initiated successfully`;

        await this.whatsappService.sendTextMessage(booking.admin_phone, adminMessage);

        return {
          success: true,
          refund_id: refundResult.refundId,
          status: 'REFUND_INITIATED'
        };
      } else {
        await this.bookingRepo.update(booking_id, { booking_status: 'REFUND_FAILED' });

        const adminMessage = `⚠️ Refund Failed\n\nBooking ID: ${booking_id}\nProperty: ${booking.property_name}\nGuest: ${booking.guest_name} (${booking.guest_phone})\nAmount: ₹${booking.advance_amount}\n\nError: ${refundResult.error}\n\nManual refund required!`;

        await this.whatsappService.sendTextMessage(booking.admin_phone, adminMessage);

        throw new Error('Refund failed: ' + refundResult.error);
      }
    } else {
      await this.bookingRepo.update(booking_id, { booking_status: 'CANCELLED_NO_REFUND' });

      const customerMessage = `❌ Booking Cancelled\n\nYour booking has been cancelled.\n\nBooking ID: ${booking_id}\n\nNo payment was processed, so no refund is needed.`;

      await this.whatsappService.sendTextMessage(booking.guest_phone, customerMessage);

      const adminMessage = `❌ Booking Cancelled - No Refund Required\n\nBooking ID: ${booking_id}\nProperty: ${booking.property_name}\nGuest: ${booking.guest_name}\n\nPayment Status: ${booking.payment_status}\nNo refund required.`;

      await this.whatsappService.sendTextMessage(booking.admin_phone, adminMessage);

      return {
        success: true,
        status: 'CANCELLED_NO_REFUND'
      };
    }
  }

  private async initiateRefund(
    orderId: string,
    transactionId: string,
    refundAmount: string
  ): Promise<{ success: boolean; refundId?: string; error?: string }> {
    console.warn("Paytm refund initiated (mock). Order:", orderId, "Amount:", refundAmount);
    return { success: true, refundId: `MOCK_REFUND_${Date.now()}` };
  }

  private isValidTransition(currentStatus: BookingStatus, newStatus: BookingStatus): boolean {
    const allowedTransitions = VALID_TRANSITIONS[currentStatus];
    return allowedTransitions.includes(newStatus);
  }

  private validateBookingData(bookingData: Partial<Booking>): void {
    if (!bookingData.property_id || !bookingData.property_name || !bookingData.property_type) {
      throw new Error("Missing required property fields");
    }

    if (!bookingData.guest_name || !bookingData.guest_phone) {
      throw new Error("Missing required guest information");
    }

    if (!bookingData.owner_phone || !bookingData.admin_phone) {
      throw new Error("Missing required contact information");
    }

    if (!bookingData.checkin_datetime || !bookingData.checkout_datetime) {
      throw new Error("Missing required booking dates");
    }

    if (!bookingData.advance_amount || bookingData.advance_amount <= 0) {
      throw new Error("Advance amount must be greater than 0");
    }

    const checkin = new Date(bookingData.checkin_datetime);
    const checkout = new Date(bookingData.checkout_datetime);
    if (checkout <= checkin) {
      throw new Error("Checkout must be after checkin");
    }

    if (bookingData.property_type === "VILLA") {
      if (!bookingData.persons || !bookingData.max_capacity) {
        throw new Error("VILLA bookings require persons and max_capacity");
      }
      if (bookingData.persons <= 0 || bookingData.persons > bookingData.max_capacity) {
        throw new Error("Persons must be between 1 and max_capacity");
      }
    } else if (bookingData.property_type === "CAMPING" || bookingData.property_type === "COTTAGE") {
      if (bookingData.veg_guest_count === undefined || bookingData.nonveg_guest_count === undefined) {
        throw new Error("CAMPING/COTTAGE bookings require veg and nonveg guest counts");
      }
      if ((bookingData.veg_guest_count + bookingData.nonveg_guest_count) <= 0) {
        throw new Error("Total guest count must be greater than 0");
      }
    }
  }
}
