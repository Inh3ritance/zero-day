# 🛸 zero_day

This project serves as a secure E2EE messaging service.

The beaughty of this application is to create a new identity seemlesly and remove traces of your old one as if creating a new start with yourself, a do over button when neccessary. Because this is on the web multiple identities can be made sporadically with no email or password requirement beyond the user session stored on the device.

## Front End

We have the option of running this project on web, Android, or iOS thanks to React Native Web. Instructions for getting started with the frontend can be found in the second half of this README.

## Server

Inside the terminal write `npm run server`. The server run with nodemon for file changes so developemnt is easier and more convenient.

# How it works

Because the project is E2EE most of the heavy work happens within the browser, tampering or playing with the browser only compromises your security at your discretion. Important data is saved locally, in diffrent methods of storage. The local storage holds 2 key important pieces of information, and the application state (non-persisted) holds a session key. The session key at the moment is a 4 digit password, which then becomes hashed with `SHA-512` to reach 128 chars. long. This will be replaced with `argon2i` for longer complexity times becuase 4 digit support although easy to memorize only has a `10^4 brute force` time. Bio authentication markers + argon would achieve the ideal exceptional security for generating a secure session key.

Upon succesful session creation (remember this as it will be your only key to the application, otherwise you will need to delete you account with all previous messages), a computational secure random number generator `CSRNG` will devise a 128 char. long key for you. Furthur improvement would revolve around True Random generation `TRNG`. This will be the primary key to all your sessions interacting with other members in the application. This then becomes `XORed` with your newly created session key to then become encrypted and stored. WARNING: `CLEARING STORAGE WILL REMOVE KEYS!` unless this is the desired effect of creating a new identity. Decrypting is the same as encrypting so having the session key is all that is needed and at the root of your protection! The unencrypted CSRNG will be hashed with SHA-512 to generate the 2nd keychain string, will encrypt the user data such as name, identifier`[Format:JSON]`, and later reserved space for an image(debate whether an image maybe neccessary). Further chains will be the foundation for private keys with other individuals. This information will be stored securely in `IndexDB or SQLiteDB`, utilizing the secondary keychain and the shared private key generated and reccomended trasmission by person or QRCODE or in server diffiehellmankey exchange. The shared key will also chain providing a new "key" for every message/file sent through the server. The servers only purpose is to connect the encrypted messages from one person to another and store username/ID and socket info.

More Info coming Soon!

---

# Frontend setup

> ⚠️ [Please be sure your environment is set up correctly for React Native CLI.](https://reactnative.dev/docs/environment-setup)

## ⭐ Features

- [React Native Web](https://necolas.github.io/react-native-web/)
- [TypeScript](https://www.typescriptlang.org/)
- [React Navigation](https://reactnavigation.org/)
- [React Native Vector Icons](https://github.com/oblador/react-native-vector-icons#readme)

## Running the app

### Web

#### Development

Run the app: `yarn web`
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.
You will also see any lint errors in the console.

#### Production

Build the app: `yarn build-web`
Use the app `npx serve -s build/`

### Native

1. Start Metro Bundler: `yarn start`
2. Start the Android app: `yarn android`
3. Start the iOS app: `yarn ios` (make sure you have installed pods first! `yarn ios:pods` if needed)

## Development Tools

1. Check your code style with `yarn lint:all` (runs eslint, prettier, and tsc)
1. Check your code correctness with `yarn test:all` (runs jest)
