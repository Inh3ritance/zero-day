import { State as HomeState } from './Home';

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

export const defaultHomeState: HomeState = {
  friends: [ // encrypted and saved locally
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
  ],
  searchField: '',
  selectedUser: '',
  loadedMessages: [ // encrypted and saved locally
    {
      user: 'rick',
      message: 'ticky whoicky kjnkjn njkjknj jnkjnkjnjk jknjnjn nkjnj kjnkjn njkjknj jnkjnkjnjk jknjnjn nkjnj kjnkjn njkjknj jnkjnkjnjk jknjnjn nkjnj kjnkjn njkjknj jnkjnkjnjk jknjnjn nkjnj',
      time: 'UTC',
    },
    {
      user: 'rick',
      message: 'schwonk',
      time: '11pm',
    },
    {
      user: 'Inhe',
      message: 'test',
      time: '4am',
    },
  ],
  username: null, // encrypted and saved locally
  csrng: null, // encrypted and saved locally
  isSidebarOpen: false,
  socket: null,
  message: '',
};
