export type PropertyType = 'VILLA' | 'CAMPING' | 'COTTAGE';
export type PaymentStatus = 'INITIATED' | 'SUCCESS' | 'FAILED' | 'PENDING';
export type BookingStatus =
  | 'PAYMENT_PENDING'
  | 'PAYMENT_SUCCESS'
  | 'BOOKING_REQUEST_SENT_TO_OWNER'
  | 'OWNER_CONFIRMED'
  | 'OWNER_CANCELLED'
  | 'TICKET_GENERATED'
  | 'REFUND_REQUIRED'
  | 'REFUND_INITIATED'
  | 'REFUND_FAILED'
  | 'CANCELLED_NO_REFUND';

export interface Booking {
  booking_id: string;
  property_id: string;
  property_name: string;
  property_type: PropertyType;
  guest_name: string;
  guest_phone: string;
  owner_phone: string;
  admin_phone: string;
  checkin_datetime: Date;
  checkout_datetime: Date;
  advance_amount: number;
  persons?: number;
  max_capacity?: number;
  veg_guest_count?: number;
  nonveg_guest_count?: number;
  payment_status: PaymentStatus;
  booking_status: BookingStatus;
  order_id?: string;
  transaction_id?: string;
  refund_id?: string;
  owner_name?: string;
  map_link?: string;
  property_address?: string;
  total_amount?: number;
  created_at: Date;
  updated_at: Date;
}
