/* eslint-disable import/prefer-default-export */
export const VERIFY_REGEX = /\/\[EXT:.*\]\//;

export const STORAGE_KEYS = {
  APP: 'appKey',
  SESSION: 'sessionKey',
  VERIFY: 'verify',
} as const;

// Make sure to keep in sync with server
export const SOCKET_EVENTS = {
  CONNECTION: 'connection',
  LOGIN: 'login',
  DISCONNECT: 'disconnect',
  UPDATE_SOCKET: 'updateSocket',
  PUBLIC_RETRIEVE: 'public-retrieve',
  PUBLIC_SEND: 'public-send',
  SEND_REQUEST: 'send-request',
  SEND_MESSAGE: 'send-message',
  NEW_MESSAGE: 'new-message',
} as const;
