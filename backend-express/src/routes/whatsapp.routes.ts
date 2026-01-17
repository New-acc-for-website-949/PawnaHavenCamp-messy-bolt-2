import { Router, Request, Response } from 'express';
import { WhatsAppService } from '../utils/whatsappService';
import { BookingRepository } from '../repositories/booking.repository';

const router = Router();
const whatsappService = new WhatsAppService();
const bookingRepo = new BookingRepository();

const processedMessages = new Set<string>();

router.get('/webhook', async (req: Request, res: Response) => {
  try {
    const mode = req.query['hub.mode'] as string;
    const token = req.query['hub.verify_token'] as string;
    const challenge = req.query['hub.challenge'] as string;

    if (!mode || !token || !challenge) {
      return res.status(400).send('Missing verification parameters');
    }

    const verifiedChallenge = whatsappService.verifyWebhook(mode, token, challenge);
    if (verifiedChallenge) {
      return res.status(200).send(verifiedChallenge);
    }

    res.status(403).send('Verification failed');
  } catch (error) {
    console.error('Webhook verification error:', error);
    res.status(500).send('Internal server error');
  }
});

router.post('/webhook', async (req: Request, res: Response) => {
  try {
    const payload = req.body;
    console.log("WhatsApp webhook received:", JSON.stringify(payload, null, 2));

    const buttonResponse = whatsappService.extractButtonResponse(payload);
    if (!buttonResponse) {
      return res.json({ status: "ignored", reason: "not_button_response" });
    }

    const messageId = payload?.entry?.[0]?.changes?.[0]?.value?.messages?.[0]?.id;
    if (messageId && processedMessages.has(messageId)) {
      console.log("Duplicate message ignored:", messageId);
      return res.json({ status: "ignored", reason: "duplicate" });
    }

    if (messageId) {
      processedMessages.add(messageId);
      setTimeout(() => processedMessages.delete(messageId), 600000);
    }

    let actionPayload: { bookingId: string; action: "CONFIRM" | "CANCEL" };
    try {
      actionPayload = JSON.parse(buttonResponse.buttonId);
    } catch {
      console.error("Invalid button payload:", buttonResponse.buttonId);
      return res.json({ status: "error", reason: "invalid_payload" });
    }

    const { bookingId, action } = actionPayload;

    const booking = await bookingRepo.findById(bookingId);

    if (!booking) {
      console.error("Booking not found:", bookingId);
      return res.json({ status: "error", reason: "booking_not_found" });
    }

    if (booking.booking_status !== "BOOKING_REQUEST_SENT_TO_OWNER") {
      console.log("Booking already processed:", booking.booking_status);
      return res.json({ status: "ignored", reason: "already_processed" });
    }

    const newStatus = action === "CONFIRM" ? "OWNER_CONFIRMED" : "OWNER_CANCELLED";
    await bookingRepo.update(bookingId, { booking_status: newStatus });

    if (action === "CONFIRM") {
      await whatsappService.sendTextMessage(
        booking.owner_phone,
        `✅ Booking confirmed!\n\nBooking ID: ${bookingId}\nGuest: ${booking.guest_name}\nProperty: ${booking.property_name}`
      );

      try {
        const baseUrl = process.env.BASE_URL || 'http://localhost:3000';
        const processUrl = `${baseUrl}/api/bookings/confirmed`;
        const processResponse = await fetch(processUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ booking_id: bookingId }),
        });

        if (!processResponse.ok) {
          console.error("Failed to process confirmed booking:", await processResponse.text());
        } else {
          console.log("Confirmed booking processed successfully");
        }
      } catch (error) {
        console.error("Error triggering booking-process-confirmed:", error);
      }
    } else {
      await whatsappService.sendTextMessage(
        booking.owner_phone,
        `❌ Booking cancelled.\n\nBooking ID: ${bookingId}\nGuest: ${booking.guest_name}\nProperty: ${booking.property_name}`
      );

      try {
        const baseUrl = process.env.BASE_URL || 'http://localhost:3000';
        const processUrl = `${baseUrl}/api/bookings/cancelled`;
        const processResponse = await fetch(processUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ booking_id: bookingId }),
        });

        if (!processResponse.ok) {
          console.error("Failed to process cancelled booking:", await processResponse.text());
        } else {
          console.log("Cancelled booking processed successfully");
        }
      } catch (error) {
        console.error("Error triggering booking-process-cancelled:", error);
      }
    }

    console.log(`Booking ${bookingId} updated to ${newStatus}`);

    res.json({ status: "success", action: newStatus });
  } catch (error: any) {
    console.error('Webhook error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
