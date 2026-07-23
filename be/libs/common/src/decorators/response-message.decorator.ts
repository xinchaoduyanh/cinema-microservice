import { SetMetadata } from '@nestjs/common';
import { RESPONSE_MESSAGE, ResponseMessage as ResponseMessageValue } from '../constants';

export const RESPONSE_MESSAGE_KEY = 'responseMessage';

/** Overrides the default success message for one endpoint or controller. */
export const ResponseMessage = (
  message: ResponseMessageValue = RESPONSE_MESSAGE.SUCCESS,
) => SetMetadata(RESPONSE_MESSAGE_KEY, message);
