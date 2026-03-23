import { Body, Font, Head, Html, Img, Link, Section, Text } from '@react-email/components';
import { Tailwind } from '@react-email/tailwind';

interface EmailLayoutProps {
  children: React.ReactNode;
  unsubscribeLink?: string;
  previewText?: string;
}

export const EmailLayout = ({
  children,
  unsubscribeLink = '#',
  previewText,
}: EmailLayoutProps) => {
  return (
    <Html lang="en">
      <Head>
        {previewText && (
          <div style={{ display: 'none', overflow: 'hidden', maxHeight: 0, maxWidth: 0, opacity: 0 }}>
            {previewText}
          </div>
        )}
        <Font
          fontFamily="Playfair Display"
          fallbackFontFamily="Georgia"
          webFont={{
            url: 'https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700&display=swap',
            format: 'woff2',
          }}
          fontStyle="normal"
        />
        <Font
          fontFamily="Inter"
          fallbackFontFamily="Arial"
          webFont={{
            url: 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&display=swap',
            format: 'woff2',
          }}
          fontStyle="normal"
        />
      </Head>
      <Tailwind>
        <Body
          style={{
            margin: 0,
            padding: 0,
            backgroundColor: '#0a0a0a',
            fontFamily: "'Inter', Arial, sans-serif",
            WebkitFontSmoothing: 'antialiased',
          }}
        >
          {/* Background gradient top accent */}
          <Section
            style={{
              height: '4px',
              background: 'linear-gradient(90deg, #ffffff 0%, #a1a1a1 50%, #ffffff 100%)',
            }}
          />

          {/* Header */}
          <Section
            style={{
              backgroundColor: '#050505',
              padding: '32px 40px 24px',
              textAlign: 'center',
              borderBottom: '1px solid rgba(255,255,255,0.06)',
            }}
          >
            <Text
              style={{
                fontFamily: "'Playfair Display', Georgia, serif",
                fontSize: '24px',
                fontWeight: '700',
                letterSpacing: '0.3em',
                color: '#ffffff',
                margin: '0',
                textTransform: 'uppercase',
              }}
            >
              AESTHETIX
            </Text>
            <Text
              style={{
                fontFamily: "'Inter', Arial, sans-serif",
                fontSize: '10px',
                fontWeight: '300',
                letterSpacing: '0.25em',
                color: '#a1a1a1',
                margin: '4px 0 0',
                textTransform: 'uppercase',
              }}
            >
              Immersive Cinema Experience
            </Text>
          </Section>

          {/* Main content */}
          <Section
            style={{
              backgroundColor: '#0a0a0a',
              padding: '0 24px 24px',
            }}
          >
            {children}
          </Section>

          {/* Footer */}
          <Section
            style={{
              backgroundColor: '#050505',
              borderTop: '1px solid rgba(255,255,255,0.06)',
              padding: '32px 40px',
              textAlign: 'center',
            }}
          >
            <Text
              style={{
                fontFamily: "'Inter', Arial, sans-serif",
                fontSize: '12px',
                color: '#a1a1a1',
                margin: '0 0 8px',
                letterSpacing: '0.05em',
              }}
            >
              © AESTHETIX {new Date().getFullYear()}. All rights reserved.
            </Text>
            <Text
              style={{
                fontFamily: "'Inter', Arial, sans-serif",
                fontSize: '11px',
                color: '#6b6b6b',
                margin: '0',
              }}
            >
              You are receiving this because you are a member of AESTHETIX.{' '}
              <Link
                href={unsubscribeLink}
                style={{ color: '#a1a1a1', textDecoration: 'underline' }}
              >
                Unsubscribe
              </Link>
            </Text>
          </Section>
        </Body>
      </Tailwind>
    </Html>
  );
};
