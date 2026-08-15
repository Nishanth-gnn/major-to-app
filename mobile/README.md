# Airport Assistance mobile app

This Expo Router application is the native companion to `client/`; it communicates directly with the deployed Railway API.

## Configuration

`EXPO_PUBLIC_API_URL` is the only public API setting. It defaults to `https://major-to-app-production.up.railway.app` in `services/api/config.ts`. Copy `.env.example` to `.env.local` only to override it for another backend.

All Axios requests use `${EXPO_PUBLIC_API_URL}/api`, Socket.IO uses `EXPO_PUBLIC_API_URL`, and JWTs are stored with Expo SecureStore.

## Android development build

1. Install dependencies: `npm ci`
2. Sign in to Expo: `npx eas login`
3. Create the first installable Android development build: `npx eas build --platform android --profile development`
4. After installing the generated APK on the device, start Metro with `npm start` (equivalent to `npx expo start --dev-client`).

The development profile is defined in `eas.json` and includes the Railway URL. Rebuild the native client after changing a native dependency or `app.json`.
