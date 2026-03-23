import { Button, Container, Hr, Section, Text } from '@react-email/components';
import { EmailLayout } from '../_layouts/EmailLayout';

export interface VerifyAccountEmailProps {
  name?: string;
  verifyUrl?: string;
  unsubscribeLink?: string;
}

export const VerifyAccountEmail = ({
  name = 'Cinephile',
  verifyUrl = 'https://aesthetix.cinema/verify',
  unsubscribeLink = '#',
}: VerifyAccountEmailProps) => (
  <EmailLayout
    unsubscribeLink={unsubscribeLink}
    previewText={`Welcome to AESTHETIX, ${name}. Please verify your email address.`}
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
          position: 'relative',
        }}
      >
        {/* Decorative top accent */}
        <div
          style={{
            display: 'inline-block',
            width: '48px',
            height: '3px',
            background: 'linear-gradient(90deg, transparent, #ffffff, transparent)',
            marginBottom: '24px',
          }}
        />

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
          Welcome to the Experience
        </Text>
        <Text
          style={{
            fontFamily: "'Inter', Arial, sans-serif",
            fontSize: '14px',
            fontWeight: '300',
            color: '#a1a1a1',
            margin: '0',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
          }}
        >
          Verify your email address
        </Text>
      </Section>

      {/* Body */}
      <Section style={{ padding: '40px 48px' }}>
        <Text
          style={{
            fontFamily: "'Inter', Arial, sans-serif",
            fontSize: '15px',
            color: '#e5e5e5',
            margin: '0 0 16px',
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
            margin: '0 0 16px',
            lineHeight: '1.7',
          }}
        >
          Thank you for joining{' '}
          <span style={{ color: '#ffffff', fontWeight: '500' }}>AESTHETIX</span> — where European
          modernism meets cinematic excellence. To complete your registration and unlock the full
          experience, please verify your email address.
        </Text>

        <Hr
          style={{
            borderColor: 'rgba(255,255,255,0.06)',
            margin: '32px 0',
          }}
        />

        {/* CTA Button */}
        <Section style={{ textAlign: 'center', margin: '8px 0 32px' }}>
          <Button
            href={verifyUrl}
            style={{
              display: 'inline-block',
              backgroundColor: '#ffffff',
              color: '#000000',
              fontFamily: "'Inter', Arial, sans-serif",
              fontSize: '13px',
              fontWeight: '600',
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              padding: '14px 40px',
              borderRadius: '8px',
              textDecoration: 'none',
            }}
          >
            Verify Email Address
          </Button>
        </Section>

        {/* Expiry notice */}
        <Section
          style={{
            backgroundColor: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.06)',
            borderRadius: '8px',
            padding: '16px 24px',
            marginBottom: '24px',
          }}
        >
          <Text
            style={{
              fontFamily: "'Inter', Arial, sans-serif",
              fontSize: '13px',
              color: '#a1a1a1',
              margin: '0',
              lineHeight: '1.6',
            }}
          >
            ⏱ This link expires in{' '}
            <span style={{ color: '#ffffff', fontWeight: '600' }}>24 hours</span>. If you did not
            create an account, you can safely ignore this email.
          </Text>
        </Section>

        <Text
          style={{
            fontFamily: "'Inter', Arial, sans-serif",
            fontSize: '12px',
            color: '#6b6b6b',
            margin: '0',
            lineHeight: '1.6',
          }}
        >
          If the button above doesn't work, copy and paste this URL into your browser:
          <br />
          <span style={{ color: '#a1a1a1', wordBreak: 'break-all' }}>{verifyUrl}</span>
        </Text>
      </Section>
    </Container>
  </EmailLayout>
);

export default VerifyAccountEmail;
