import { Router, Request, Response } from 'express';
import { PaytmService } from '../services/paytm.service';

const router = Router();
const paytmService = new PaytmService();

router.post('/paytm/initiate', async (req: Request, res: Response) => {
  try {
    const { booking_id, channel_id } = req.body;

    if (!booking_id) {
      return res.status(400).json({ error: 'Booking ID is required' });
    }

    const paymentData = await paytmService.initiatePayment(
      booking_id,
      channel_id || 'WEB'
    );

    res.json(paymentData);
  } catch (error: any) {
    console.error('Payment initiate error:', error);

    if (error.message === 'Booking not found') {
      return res.status(404).json({ error: error.message });
    }

    if (error.message.includes('already completed')) {
      return res.status(400).json({ error: error.message });
    }

    res.status(500).json({ error: 'Failed to initiate payment' });
  }
});

router.post('/paytm/callback', async (req: Request, res: Response) => {
  try {
    let paytmResponse: Record<string, string>;

    const contentType = req.headers['content-type'] || '';

    if (contentType.includes('application/x-www-form-urlencoded')) {
      paytmResponse = req.body;
    } else if (contentType.includes('application/json')) {
      paytmResponse = req.body;
    } else {
      return res.status(400).json({ error: 'Unsupported content type' });
    }

    console.log("Paytm callback received:", paytmResponse);

    const result = await paytmService.processCallback(paytmResponse);

    res.setHeader('Content-Type', 'text/html');
    res.send(result.html);
  } catch (error: any) {
    console.error('Payment callback error:', error);

    if (error.message === 'Checksum not found in response') {
      return res.status(400).json({ error: error.message });
    }

    if (error.message === 'Invalid checksum') {
      return res.status(400).json({ error: error.message });
    }

    if (error.message.includes('Booking not found')) {
      return res.status(404).json({ error: error.message });
    }

    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
