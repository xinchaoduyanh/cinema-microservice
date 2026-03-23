import { AllExceptionFilter, NotificationMessagePattern } from '@app/common';
import { Controller, UseFilters } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { EmailService } from '../email';
import { BookingSuccessMailPayload, ResetPasswordMailPayload, VerifySignupMailPayload } from '../email/email.interface';

@UseFilters(AllExceptionFilter)
@Controller()
export class SendMailConsumer {
  constructor(private readonly emailService: EmailService) {}

  @MessagePattern(NotificationMessagePattern.FORGOT_PASSWORD)
  async sendForgotPasswordMail(data: ResetPasswordMailPayload): Promise<{ success: boolean }> {
    await this.emailService.forgotPasswordMailer(data);
    return { success: true };
  }

  @MessagePattern(NotificationMessagePattern.VERIFY_ACCOUNT)
  async sendVerifyAccountMail(data: VerifySignupMailPayload): Promise<{ success: boolean }> {
    await this.emailService.verifyAccountMailer(data);
    return { success: true };
  }

  @MessagePattern(NotificationMessagePattern.BOOKING_SUCCESS)
  async sendBookingSuccessMail(data: BookingSuccessMailPayload): Promise<{ success: boolean }> {
    await this.emailService.bookingSuccessMailer(data);
    return { success: true };
  }
}

