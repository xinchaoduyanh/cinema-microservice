import { Button, Container, Hr, Section, Text } from '@react-email/components';
import { EmailLayout } from '../_layouts/EmailLayout';

export interface ForgotPasswordEmailProps {
  name?: string;
  resetPasswordUrl?: string;
  unsubscribeLink?: string;
}

export const ForgotPasswordEmail = ({
  name = 'Cinephile',
  resetPasswordUrl = 'https://aesthetix.cinema/reset-password',
  unsubscribeLink = '#',
}: ForgotPasswordEmailProps) => (
  <EmailLayout
    unsubscribeLink={unsubscribeLink}
    previewText={`Reset your AESTHETIX password, ${name}.`}
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
        {/* Lock icon (text-based) */}
        <Text
          style={{
            fontSize: '36px',
            margin: '0 0 16px',
            display: 'block',
          }}
        >
          🔐
        </Text>
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
          Password Reset Request
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
          Secure account recovery
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
            margin: '0 0 24px',
            lineHeight: '1.7',
          }}
        >
          We received a request to reset the password for your{' '}
          <span style={{ color: '#ffffff', fontWeight: '500' }}>AESTHETIX</span> account. Click
          the button below to create a new password.
        </Text>

        <Hr
          style={{
            borderColor: 'rgba(255,255,255,0.06)',
            margin: '8px 0 32px',
          }}
        />

        {/* CTA Button */}
        <Section style={{ textAlign: 'center', margin: '8px 0 32px' }}>
          <Button
            href={resetPasswordUrl}
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
            Reset My Password
          </Button>
        </Section>

        {/* Security warning box */}
        <Section
          style={{
            backgroundColor: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.06)',
            borderRadius: '8px',
            padding: '20px 24px',
            marginBottom: '24px',
          }}
        >
          <Text
            style={{
              fontFamily: "'Inter', Arial, sans-serif",
              fontSize: '13px',
              fontWeight: '600',
              color: '#ffffff',
              margin: '0 0 8px',
              letterSpacing: '0.05em',
              textTransform: 'uppercase',
            }}
          >
            Security Notice
          </Text>
          <Text
            style={{
              fontFamily: "'Inter', Arial, sans-serif",
              fontSize: '13px',
              color: '#a1a1a1',
              margin: '0 0 6px',
              lineHeight: '1.6',
            }}
          >
            ⏱ This link expires in{' '}
            <span style={{ color: '#ffffff', fontWeight: '600' }}>15 minutes</span>.
          </Text>
          <Text
            style={{
              fontFamily: "'Inter', Arial, sans-serif",
              fontSize: '13px',
              color: '#a1a1a1',
              margin: '0',
              lineHeight: '1.6',
            }}
          >
            🔒 If you did not request this, please ignore this email — your account remains secure.
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
          <span style={{ color: '#a1a1a1', wordBreak: 'break-all' }}>{resetPasswordUrl}</span>
        </Text>
      </Section>
    </Container>
  </EmailLayout>
);

export default ForgotPasswordEmail;
