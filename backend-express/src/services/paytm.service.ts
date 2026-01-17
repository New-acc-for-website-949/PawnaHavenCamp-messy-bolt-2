import { PaytmChecksum } from '../utils/paytmChecksum';
import { BookingRepository } from '../repositories/booking.repository';
import { WhatsAppService } from '../utils/whatsappService';

interface PaytmConfig {
  mid: string;
  website: string;
  industryType: string;
  merchantKey: string;
  callbackUrl: string;
  gatewayUrl: string;
}

export class PaytmService {
  private config: PaytmConfig;
  private bookingRepo: BookingRepository;
  private whatsappService: WhatsAppService;

  constructor() {
    this.config = {
      mid: process.env.PAYTM_MID || "SpwYpD36833569776448",
      website: process.env.PAYTM_WEBSITE || "WEBSTAGING",
      industryType: process.env.PAYTM_INDUSTRY_TYPE || "Retail",
      merchantKey: process.env.PAYTM_MERCHANT_KEY || "j@D7fI3pAMAl7nQC",
      callbackUrl: process.env.PAYTM_CALLBACK_URL || "http://localhost:3000/api/payments/paytm/callback",
      gatewayUrl: process.env.PAYTM_GATEWAY_URL || "https://securegw-stage.paytm.in/order/process",
    };

    this.bookingRepo = new BookingRepository();
    this.whatsappService = new WhatsAppService();
  }

  async initiatePayment(booking_id: string, channel_id: "WEB" | "WAP" = "WEB"): Promise<any> {
    const booking = await this.bookingRepo.findById(booking_id);

    if (!booking) {
      throw new Error('Booking not found');
    }

    if (booking.payment_status === 'SUCCESS') {
      throw new Error('Payment already completed for this booking');
    }

    const paytmOrderId = this.generatePaytmOrderId();

    const paytmParams: Record<string, string> = {
      MID: this.config.mid,
      WEBSITE: this.config.website,
      INDUSTRY_TYPE_ID: this.config.industryType,
      CHANNEL_ID: channel_id,
      ORDER_ID: paytmOrderId,
      CUST_ID: booking.guest_phone,
      MOBILE_NO: booking.guest_phone,
      EMAIL: `${booking.guest_phone}@guest.com`,
      TXN_AMOUNT: booking.advance_amount.toString(),
      CALLBACK_URL: this.config.callbackUrl,
    };

    const checksum = PaytmChecksum.generateChecksum(paytmParams, this.config.merchantKey);

    console.log("Payment Parameters:", {
      mid: this.config.mid,
      website: this.config.website,
      industryType: this.config.industryType,
      orderId: paytmOrderId,
      amount: booking.advance_amount,
      gatewayUrl: this.config.gatewayUrl,
    });

    await this.bookingRepo.update(booking_id, { order_id: paytmOrderId });

    return {
      success: true,
      paytm_params: {
        ...paytmParams,
        CHECKSUMHASH: checksum,
      },
      gateway_url: this.config.gatewayUrl,
      order_id: paytmOrderId,
      booking_id: booking_id,
      amount: booking.advance_amount,
    };
  }

  async processCallback(paytmResponse: Record<string, string>): Promise<{ redirectUrl: string; html: string }> {
    const checksumHash = paytmResponse.CHECKSUMHASH;
    if (!checksumHash) {
      throw new Error('Checksum not found in response');
    }

    const isValidChecksum = PaytmChecksum.verifyChecksumByObject(
      paytmResponse,
      this.config.merchantKey,
      checksumHash
    );

    if (!isValidChecksum) {
      throw new Error('Invalid checksum');
    }

    const orderId = paytmResponse.ORDERID;
    const txnId = paytmResponse.TXNID || "";
    const txnAmount = paytmResponse.TXNAMOUNT || "";
    const status = paytmResponse.STATUS || "";
    const respCode = paytmResponse.RESPCODE || "";
    const respMsg = paytmResponse.RESPMSG || "";

    const booking = await this.bookingRepo.findByOrderId(orderId);

    if (!booking) {
      throw new Error('Booking not found for order_id: ' + orderId);
    }

    const updateData: any = {
      transaction_id: txnId,
    };

    if (status === "TXN_SUCCESS") {
      updateData.payment_status = "SUCCESS";
      updateData.booking_status = "PAYMENT_SUCCESS";
    } else if (status === "TXN_FAILURE") {
      updateData.payment_status = "FAILED";
    } else if (status === "PENDING") {
      updateData.payment_status = "PENDING";
    } else {
      updateData.payment_status = "FAILED";
    }

    await this.bookingRepo.update(booking.booking_id, updateData);

    console.log("Booking updated successfully:", {
      booking_id: booking.booking_id,
      order_id: orderId,
      payment_status: updateData.payment_status,
      booking_status: updateData.booking_status || booking.booking_status,
    });

    if (status === "TXN_SUCCESS") {
      await this.whatsappService.sendTextMessage(
        booking.guest_phone,
        `Payment successful ✅\n\nWe are processing your booking.\nYou will receive your e-ticket after owner confirmation.`
      );

      const checkinDate = new Date(booking.checkin_datetime).toLocaleString("en-IN", {
        dateStyle: "medium",
        timeStyle: "short",
      });
      const checkoutDate = new Date(booking.checkout_datetime).toLocaleString("en-IN", {
        dateStyle: "medium",
        timeStyle: "short",
      });

      const dueAmount = (booking.total_amount || 0) - booking.advance_amount;

      const ownerMessage = `🔔 New Booking Request\n\nProperty: ${booking.property_name}\nGuest: ${booking.guest_name}\nCheck-in: ${checkinDate}\nCheck-out: ${checkoutDate}\nPersons: ${booking.persons || 0}\nAdvance Paid: ₹${booking.advance_amount}\nDue Amount: ₹${dueAmount}\n\nPlease confirm or cancel:`;

      await this.whatsappService.sendInteractiveButtons(
        booking.owner_phone,
        ownerMessage,
        [
          {
            id: JSON.stringify({ bookingId: booking.booking_id, action: "CONFIRM" }),
            title: "✅ Confirm",
          },
          {
            id: JSON.stringify({ bookingId: booking.booking_id, action: "CANCEL" }),
            title: "❌ Cancel",
          },
        ]
      );

      await this.whatsappService.sendTextMessage(
        booking.admin_phone,
        `📋 New Booking Alert\n\nProperty: ${booking.property_name}\nOwner: ${booking.owner_phone}\nGuest: ${booking.guest_name} (${booking.guest_phone})\nAdvance: ₹${booking.advance_amount}\nDue: ₹${dueAmount}\nStatus: Waiting for owner confirmation`
      );

      await this.bookingRepo.update(booking.booking_id, {
        booking_status: "BOOKING_REQUEST_SENT_TO_OWNER"
      });

      console.log("WhatsApp notifications sent for booking:", booking.booking_id);
    }

    const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
    const redirectUrl = status === "TXN_SUCCESS"
      ? `${frontendUrl}/ticket?booking_id=${booking.booking_id}`
      : `${frontendUrl}`;

    const html = this.generateResponseHtml(status, booking.booking_id, orderId, txnId, txnAmount, respMsg, redirectUrl);

    return { redirectUrl, html };
  }

  private generatePaytmOrderId(): string {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 10000);
    return `PAYTM_${timestamp}_${random}`;
  }

  private generateResponseHtml(
    status: string,
    bookingId: string,
    orderId: string,
    txnId: string,
    txnAmount: string,
    respMsg: string,
    redirectUrl: string
  ): string {
    return `
<!DOCTYPE html>
<html>
<head>
  <title>Payment ${status === "TXN_SUCCESS" ? "Success" : "Failed"}</title>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body {
      font-family: Arial, sans-serif;
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      margin: 0;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    }
    .container {
      background: white;
      padding: 2rem;
      border-radius: 10px;
      box-shadow: 0 10px 40px rgba(0,0,0,0.2);
      text-align: center;
      max-width: 500px;
    }
    .success { color: #10b981; }
    .failed { color: #ef4444; }
    .icon { font-size: 4rem; margin-bottom: 1rem; }
    h1 { margin: 0 0 1rem 0; }
    p { color: #666; margin: 0.5rem 0; }
    .details {
      background: #f9fafb;
      padding: 1rem;
      border-radius: 5px;
      margin: 1rem 0;
      text-align: left;
    }
    .details p { margin: 0.5rem 0; font-size: 0.9rem; }
    .btn {
      display: inline-block;
      margin-top: 1.5rem;
      padding: 0.75rem 2rem;
      background: #667eea;
      color: white;
      text-decoration: none;
      border-radius: 5px;
      transition: background 0.3s;
    }
    .btn:hover { background: #5568d3; }
  </style>
</head>
<body>
  <div class="container">
    ${status === "TXN_SUCCESS" ? `
      <div class="icon success">✓</div>
      <h1 class="success">Payment Successful!</h1>
      <p>Your booking has been confirmed.</p>
    ` : `
      <div class="icon failed">✗</div>
      <h1 class="failed">Payment Failed</h1>
      <p>${respMsg}</p>
    `}
    <div class="details">
      <p><strong>Booking ID:</strong> ${bookingId}</p>
      <p><strong>Order ID:</strong> ${orderId}</p>
      ${txnId ? `<p><strong>Transaction ID:</strong> ${txnId}</p>` : ""}
      <p><strong>Amount:</strong> ₹${txnAmount}</p>
      <p><strong>Status:</strong> ${status}</p>
    </div>
    <a href="${redirectUrl}" class="btn">Continue</a>
  </div>
</body>
</html>
    `;
  }
}
