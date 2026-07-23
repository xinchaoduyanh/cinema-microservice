/**
 * Central success messages. Endpoint code must use these values instead of
 * inline strings so messages can be changed or translated in one place.
 */
export const RESPONSE_MESSAGE = {
  SUCCESS: 'Success',
  CREATED: 'Created successfully',
  UPDATED: 'Updated successfully',
  DELETED: 'Deleted successfully',
} as const;

export type ResponseMessage = (typeof RESPONSE_MESSAGE)[keyof typeof RESPONSE_MESSAGE];
