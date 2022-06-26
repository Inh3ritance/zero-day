/* eslint-disable import/prefer-default-export */
export const VERIFY_REGEX = /\/\[EXT:.*\]\//;

// Make sure to keep in sync with server
export const SOCKET_EVENTS = {
  CONNECTION: 'connection',
  LOGIN: 'login',
  DISCONNECT: 'disconnect',
  UPDATE_SOCKET: 'update-socket',
  PUBLIC_RETRIEVE: 'public-retrieve',
  PUBLIC_SEND: 'public-send',
  SEND_REQUEST: 'send-request',
  SEND_MESSAGE: 'send-message',
  NEW_MESSAGE: 'new-message',
} as const;

export const MEDIA_QUERY_MAX_WIDTHS = {
  mobile: 767,
  tablet: 1024,
  // Don't need desktop as that's essentially infinity
} as const;
