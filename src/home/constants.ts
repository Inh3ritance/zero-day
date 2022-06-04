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

export const DEFAULT_FRIENDS: Friend[] = [ // encrypted and saved locally
  {
    username: 'test1',
    image: 'mksms.png',
    lastMessage: 'lorem oskskkskksk',
    hashKeyPattern: 'ghjhgjgjghj',
    active: false,
    newMessages: 0,
  },
  {
    username: 'test2',
    image: 'mksms.png',
    lastMessage: 'hgjkgh oskskkskksk',
    hashKeyPattern: 'ghjhgjgjghj',
    active: false,
    newMessages: 0,
  },
];

export const DEFAULT_LOADED_MESSAGES: Message[] = [ // encrypted and saved locally
  {
    user: 'rick',
    message: 'ticky whoicky kjnkjn njkjknj jnkjnkjnjk jknjnjn nkjnj kjnkjn njkjknj jnkjnkjnjk jknjnjn nkjnj kjnkjn njkjknj jnkjnkjnjk jknjnjn nkjnj kjnkjn njkjknj jnkjnkjnjk jknjnjn nkjnj',
    time: '2022-06-04T05:40:29.943Z',
  },
  {
    user: 'rick',
    message: 'schwonk',
    time: '2022-06-05T05:40:29.943Z',
  },
  {
    user: 'Inhe',
    message: 'test',
    time: '2022-06-06T05:40:29.943Z',
  },
];
