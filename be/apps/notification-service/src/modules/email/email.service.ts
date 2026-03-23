import {
  BookingSuccessEmail,
  ForgotPasswordEmail,
  renderEmail,
  VerifyAccountEmail,
} from '@app/email-template';
import { Injectable } from '@nestjs/common';
import { AbstractEmailService } from './abstract-email.service';
import { EMAIL_SUBJECT } from './email.constants';
import { BookingSuccessMailPayload, ResetPasswordMailPayload, VerifySignupMailPayload } from './email.interface';

@Injectable()
export class EmailService {
  constructor(private readonly emailService: AbstractEmailService) {}

  /**
   * Send account verification email
   */
  async verifyAccountMailer(payload: VerifySignupMailPayload): Promise<void> {
    const htmlContent = await renderEmail(VerifyAccountEmail, {
      name: payload.name,
      verifyUrl: payload.verifyUrl,
    });
    await this.emailService.sendEmail({
      to: payload.email,
      subject: EMAIL_SUBJECT.VERIFY_ACCOUNT,
      htmlContent,
    });
  }

  /**
   * Send forgot password email
   */
  async forgotPasswordMailer(payload: ResetPasswordMailPayload): Promise<void> {
    const htmlContent = await renderEmail(ForgotPasswordEmail, {
      name: payload.name,
      resetPasswordUrl: payload.resetPasswordUrl,
    });
    await this.emailService.sendEmail({
      to: payload.email,
      subject: EMAIL_SUBJECT.RESET_PASSWORD,
      htmlContent,
    });
  }

  /**
   * Send booking success confirmation email
   */
  async bookingSuccessMailer(payload: BookingSuccessMailPayload): Promise<void> {
    const htmlContent = await renderEmail(BookingSuccessEmail, {
      name: payload.name,
      bookingId: payload.bookingId,
      movieTitle: payload.movieTitle,
      cinemaName: payload.cinemaName,
      hallName: payload.hallName,
      showDate: payload.showDate,
      showTime: payload.showTime,
      seats: payload.seats,
      totalAmount: payload.totalAmount,
      currency: payload.currency ?? 'VND',
    });
    await this.emailService.sendEmail({
      to: payload.email,
      subject: EMAIL_SUBJECT.BOOKING_SUCCESS,
      htmlContent,
    });
  }
}

