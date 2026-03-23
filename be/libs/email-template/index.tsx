import { render } from '@react-email/components'

// Email templates
export { VerifyAccountEmail } from './emails/verify-account'
export type { VerifyAccountEmailProps } from './emails/verify-account'

export { ForgotPasswordEmail } from './emails/forgot-password'
export type { ForgotPasswordEmailProps } from './emails/forgot-password'

export { BookingSuccessEmail } from './emails/booking-success'
export type { BookingSuccessEmailProps } from './emails/booking-success'

// Keep backward compatibility
export { ResetYourPasswordEmail } from './emails/reset-your-password'

/**
 * Render an email component with the given props
 *
 * @example — Verify account
 * const html = await renderEmail(VerifyAccountEmail, { name: 'John', verifyUrl: '...' });
 *
 * @example — Forgot password
 * const html = await renderEmail(ForgotPasswordEmail, { name: 'John', resetPasswordUrl: '...' });
 *
 * @example — Booking success
 * const html = await renderEmail(BookingSuccessEmail, {
 *   name: 'John', bookingId: 'BK-123', movieTitle: 'Dune Part 2', ...
 * });
 *
 * ses.sendMail({ to: 'user@email.com', subject: '...', html })
 */
export async function renderEmail<T extends Record<string, any>>(
	Component: React.FC<T>,
	props: T
) {
	const html = await render(<Component {...props} />)
	return html
}
