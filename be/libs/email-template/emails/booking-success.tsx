import { Container, Hr, Section, Text } from '@react-email/components';
import { EmailLayout } from '../_layouts/EmailLayout';

export interface BookingSuccessEmailProps {
  name?: string;
  bookingId?: string;
  movieTitle?: string;
  cinemaName?: string;
  hallName?: string;
  showDate?: string;
  showTime?: string;
  seats?: string[];
  totalAmount?: number;
  currency?: string;
  posterUrl?: string;
  unsubscribeLink?: string;
}

export const BookingSuccessEmail = ({
  name = 'Cinephile',
  bookingId = 'BK-000000',
  movieTitle = 'Interstellar',
  cinemaName = 'AESTHETIX Grand Cinema',
  hallName = 'Hall A - IMAX',
  showDate = 'Saturday, March 23, 2026',
  showTime = '19:30',
  seats = ['A5', 'A6'],
  totalAmount = 0,
  currency = 'VND',
  unsubscribeLink = '#',
}: BookingSuccessEmailProps) => {
  const formattedAmount = new Intl.NumberFormat('vi-VN').format(totalAmount);

  return (
    <EmailLayout
      unsubscribeLink={unsubscribeLink}
      previewText={`Your tickets for ${movieTitle} are confirmed! Booking #${bookingId}`}
    >
      <Container
        style={{
          maxWidth: '580px',
          margin: '40px auto',
          backgroundColor: '#111111',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: '16px',
          overflow: 'hidden',
        }}
      >
        {/* Hero section */}
        <Section
          style={{
            background: 'linear-gradient(135deg, #1a1a1a 0%, #050505 100%)',
            padding: '48px 48px 36px',
            textAlign: 'center',
            borderBottom: '1px solid rgba(255,255,255,0.06)',
          }}
        >
          {/* Success checkmark */}
          <div
            style={{
              display: 'inline-flex',
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              backgroundColor: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(255,255,255,0.12)',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '20px',
              fontSize: '28px',
              lineHeight: '64px',
            }}
          >
            ✓
          </div>
          <Text
            style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: '28px',
              fontWeight: '700',
              color: '#ffffff',
              margin: '0 0 8px',
              letterSpacing: '0.02em',
              lineHeight: '1.3',
            }}
          >
            Booking Confirmed
          </Text>
          <Text
            style={{
              fontFamily: "'Inter', Arial, sans-serif",
              fontSize: '14px',
              fontWeight: '300',
              color: '#a1a1a1',
              margin: '0 0 16px',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
            }}
          >
            Your cinematic experience awaits
          </Text>
          {/* Booking ID */}
          <Section
            style={{
              display: 'inline-block',
              backgroundColor: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '6px',
              padding: '8px 20px',
            }}
          >
            <Text
              style={{
                fontFamily: "'Inter', Arial, sans-serif",
                fontSize: '12px',
                fontWeight: '500',
                color: '#a1a1a1',
                margin: '0',
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
              }}
            >
              Booking #{bookingId}
            </Text>
          </Section>
        </Section>

        {/* Greeting */}
        <Section style={{ padding: '32px 48px 0' }}>
          <Text
            style={{
              fontFamily: "'Inter', Arial, sans-serif",
              fontSize: '15px',
              color: '#e5e5e5',
              margin: '0 0 8px',
              lineHeight: '1.7',
            }}
          >
            Hello, <strong style={{ color: '#ffffff' }}>{name}</strong>.
          </Text>
          <Text
            style={{
              fontFamily: "'Inter', Arial, sans-serif",
              fontSize: '15px',
              color: '#a1a1a1',
              margin: '0',
              lineHeight: '1.7',
            }}
          >
            Your booking is confirmed. Below are your ticket details.
          </Text>
        </Section>

        <Hr style={{ borderColor: 'rgba(255,255,255,0.06)', margin: '24px 48px' }} />

        {/* Movie Info */}
        <Section style={{ padding: '0 48px' }}>
          {/* Movie title */}
          <Text
            style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: '22px',
              fontWeight: '700',
              color: '#ffffff',
              margin: '0 0 20px',
              lineHeight: '1.3',
              letterSpacing: '0.01em',
            }}
          >
            {movieTitle}
          </Text>

          {/* Details grid */}
          <Section
            style={{
              backgroundColor: 'rgba(255,255,255,0.02)',
              border: '1px solid rgba(255,255,255,0.06)',
              borderRadius: '12px',
              overflow: 'hidden',
            }}
          >
            {/* Row: Cinema */}
            <Section
              style={{
                padding: '16px 24px',
                borderBottom: '1px solid rgba(255,255,255,0.04)',
                display: 'flex',
                justifyContent: 'space-between',
              }}
            >
              <Text
                style={{
                  fontFamily: "'Inter', Arial, sans-serif",
                  fontSize: '12px',
                  fontWeight: '500',
                  color: '#6b6b6b',
                  margin: '0',
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  display: 'inline-block',
                  width: '40%',
                }}
              >
                Cinema
              </Text>
              <Text
                style={{
                  fontFamily: "'Inter', Arial, sans-serif",
                  fontSize: '13px',
                  color: '#e5e5e5',
                  margin: '0',
                  display: 'inline-block',
                  width: '60%',
                  textAlign: 'right',
                }}
              >
                {cinemaName}
              </Text>
            </Section>

            {/* Row: Hall */}
            <Section
              style={{
                padding: '16px 24px',
                borderBottom: '1px solid rgba(255,255,255,0.04)',
                display: 'flex',
                justifyContent: 'space-between',
              }}
            >
              <Text
                style={{
                  fontFamily: "'Inter', Arial, sans-serif",
                  fontSize: '12px',
                  fontWeight: '500',
                  color: '#6b6b6b',
                  margin: '0',
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  display: 'inline-block',
                  width: '40%',
                }}
              >
                Hall
              </Text>
              <Text
                style={{
                  fontFamily: "'Inter', Arial, sans-serif",
                  fontSize: '13px',
                  color: '#e5e5e5',
                  margin: '0',
                  display: 'inline-block',
                  width: '60%',
                  textAlign: 'right',
                }}
              >
                {hallName}
              </Text>
            </Section>

            {/* Row: Date */}
            <Section
              style={{
                padding: '16px 24px',
                borderBottom: '1px solid rgba(255,255,255,0.04)',
                display: 'flex',
                justifyContent: 'space-between',
              }}
            >
              <Text
                style={{
                  fontFamily: "'Inter', Arial, sans-serif",
                  fontSize: '12px',
                  fontWeight: '500',
                  color: '#6b6b6b',
                  margin: '0',
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  display: 'inline-block',
                  width: '40%',
                }}
              >
                Date
              </Text>
              <Text
                style={{
                  fontFamily: "'Inter', Arial, sans-serif",
                  fontSize: '13px',
                  color: '#e5e5e5',
                  margin: '0',
                  display: 'inline-block',
                  width: '60%',
                  textAlign: 'right',
                }}
              >
                {showDate}
              </Text>
            </Section>

            {/* Row: Time */}
            <Section
              style={{
                padding: '16px 24px',
                borderBottom: '1px solid rgba(255,255,255,0.04)',
                display: 'flex',
                justifyContent: 'space-between',
              }}
            >
              <Text
                style={{
                  fontFamily: "'Inter', Arial, sans-serif",
                  fontSize: '12px',
                  fontWeight: '500',
                  color: '#6b6b6b',
                  margin: '0',
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  display: 'inline-block',
                  width: '40%',
                }}
              >
                Showtime
              </Text>
              <Text
                style={{
                  fontFamily: "'Inter', Arial, sans-serif",
                  fontSize: '13px',
                  fontWeight: '600',
                  color: '#ffffff',
                  margin: '0',
                  display: 'inline-block',
                  width: '60%',
                  textAlign: 'right',
                }}
              >
                {showTime}
              </Text>
            </Section>

            {/* Row: Seats */}
            <Section
              style={{
                padding: '16px 24px',
                display: 'flex',
                justifyContent: 'space-between',
              }}
            >
              <Text
                style={{
                  fontFamily: "'Inter', Arial, sans-serif",
                  fontSize: '12px',
                  fontWeight: '500',
                  color: '#6b6b6b',
                  margin: '0',
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  display: 'inline-block',
                  width: '40%',
                }}
              >
                Seats
              </Text>
              <Text
                style={{
                  fontFamily: "'Inter', Arial, sans-serif",
                  fontSize: '13px',
                  fontWeight: '600',
                  color: '#ffffff',
                  margin: '0',
                  display: 'inline-block',
                  width: '60%',
                  textAlign: 'right',
                  letterSpacing: '0.05em',
                }}
              >
                {seats.join(', ')}
              </Text>
            </Section>
          </Section>
        </Section>

        <Hr style={{ borderColor: 'rgba(255,255,255,0.06)', margin: '24px 48px' }} />

        {/* Total Amount */}
        <Section
          style={{
            padding: '0 48px 16px',
          }}
        >
          <Section
            style={{
              backgroundColor: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '10px',
              padding: '20px 24px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <Text
              style={{
                fontFamily: "'Inter', Arial, sans-serif",
                fontSize: '13px',
                fontWeight: '500',
                color: '#a1a1a1',
                margin: '0',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                display: 'inline-block',
              }}
            >
              Total Paid
            </Text>
            <Text
              style={{
                fontFamily: "'Playfair Display', Georgia, serif",
                fontSize: '22px',
                fontWeight: '700',
                color: '#ffffff',
                margin: '0',
                display: 'inline-block',
                letterSpacing: '0.02em',
              }}
            >
              {formattedAmount} {currency}
            </Text>
          </Section>
        </Section>

        {/* Reminder note */}
        <Section style={{ padding: '8px 48px 40px' }}>
          <Text
            style={{
              fontFamily: "'Inter', Arial, sans-serif",
              fontSize: '12px',
              color: '#6b6b6b',
              margin: '0',
              lineHeight: '1.7',
              textAlign: 'center',
            }}
          >
            Please arrive at least 15 minutes before showtime. Present this email or your booking
            ID at the counter. Enjoy the experience. 🎬
          </Text>
        </Section>
      </Container>
    </EmailLayout>
  );
};

export default BookingSuccessEmail;
