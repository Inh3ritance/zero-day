export interface Friend {
  username: string;
  image: string;
  lastMessage: string;
  hashKeyPattern: string;
  active: boolean;
  newMessages: number;
}

export interface Message {
  user: string;
  message: string;
  time: string;
}
