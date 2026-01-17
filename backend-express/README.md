# LoonCamp Express Backend

Production-ready Express.js backend for the LoonCamp booking platform, converted from Supabase Edge Functions.

## Architecture

- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Database**: PostgreSQL (using `pg`)
- **Language**: TypeScript

## Project Structure

```
backend-express/
├── src/
│   ├── config/
│   │   └── database.ts          # PostgreSQL connection pool
│   ├── repositories/
│   │   └── booking.repository.ts # Database access layer
│   ├── services/
│   │   ├── booking.service.ts    # Booking business logic
│   │   └── paytm.service.ts      # Payment processing
│   ├── routes/
│   │   ├── booking.routes.ts     # Booking endpoints
│   │   ├── payment.routes.ts     # Payment endpoints
│   │   ├── eticket.routes.ts     # E-ticket endpoints
│   │   └── whatsapp.routes.ts    # WhatsApp webhook
│   ├── utils/
│   │   ├── paytmChecksum.ts      # Paytm encryption
│   │   └── whatsappService.ts    # WhatsApp integration
│   ├── types/
│   │   └── booking.types.ts      # TypeScript types
│   └── server.ts                 # Express app entry point
├── migrations/
│   ├── 001_initial_schema.sql
│   ├── 002_create_bookings_table.sql
│   └── 003_add_booking_fields_and_statuses.sql
├── package.json
├── tsconfig.json
└── .env.example
```

## API Endpoints

### Bookings
- `POST   /api/bookings/initiate`       - Create new booking
- `GET    /api/bookings/:id`            - Get booking details
- `PATCH  /api/bookings/status`         - Update booking status
- `POST   /api/bookings/confirmed`      - Process owner confirmation
- `POST   /api/bookings/cancelled`      - Process owner cancellation

### Payments
- `POST   /api/payments/paytm/initiate` - Initiate Paytm payment
- `POST   /api/payments/paytm/callback` - Handle Paytm callback

### E-Tickets
- `GET    /api/eticket/:bookingId`      - Get e-ticket data

### WhatsApp Webhooks
- `GET    /api/webhooks/whatsapp/webhook` - Webhook verification
- `POST   /api/webhooks/whatsapp/webhook` - Handle button responses

## Setup

### 1. Install Dependencies

```bash
cd backend-express
npm install
```

### 2. Configure Environment

Copy `.env.example` to `.env` and configure:

```bash
cp .env.example .env
```

Update the following variables:

```env
DATABASE_URL=postgresql://user:password@localhost:5432/looncamp
PORT=3000
FRONTEND_URL=http://localhost:5173

# Paytm
PAYTM_MID=your_merchant_id
PAYTM_MERCHANT_KEY=your_merchant_key
PAYTM_CALLBACK_URL=http://localhost:3000/api/payments/paytm/callback
```

### 3. Setup Database

Run the migrations:

```bash
psql $DATABASE_URL -f migrations/001_initial_schema.sql
psql $DATABASE_URL -f migrations/002_create_bookings_table.sql
psql $DATABASE_URL -f migrations/003_add_booking_fields_and_statuses.sql
```

### 4. Run Development Server

```bash
npm run dev
```

### 5. Build for Production

```bash
npm run build
npm start
```

## Database Schema

### Booking State Machine

```
PAYMENT_PENDING
    ↓
PAYMENT_SUCCESS
    ↓
BOOKING_REQUEST_SENT_TO_OWNER
    ↓         ↓
OWNER_CONFIRMED  OWNER_CANCELLED
    ↓              ↓
TICKET_GENERATED  REFUND_INITIATED
```

### Enums

- `property_type_enum`: VILLA, CAMPING, COTTAGE
- `payment_status_enum`: INITIATED, SUCCESS, FAILED, PENDING
- `booking_status_enum`: Full lifecycle states

## Migration from Supabase

### What Was Removed
- ✗ Supabase client (`@supabase/supabase-js`)
- ✗ Deno runtime
- ✗ Row Level Security (RLS) policies
- ✗ Supabase Edge Functions
- ✗ Supabase authentication

### What Was Preserved
- ✓ All business logic
- ✓ Booking state machine
- ✓ Payment flow (Paytm)
- ✓ WhatsApp integration
- ✓ Database schema
- ✓ Validation rules

## Testing

```bash
# Health check
curl http://localhost:3000/health

# Create booking
curl -X POST http://localhost:3000/api/bookings/initiate \
  -H "Content-Type: application/json" \
  -d '{"property_id":"1","property_name":"Test Villa",...}'
```

## Production Deployment

1. Set `NODE_ENV=production`
2. Configure production database URL
3. Use a process manager like PM2:

```bash
npm install -g pm2
pm2 start dist/server.js --name looncamp-backend
```

## Support

For issues or questions, contact the development team.
