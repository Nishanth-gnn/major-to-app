SKYOS Mobile — Expo scaffold

This folder contains the initial Expo + TypeScript scaffold for the SKYOS mobile migration.

Next steps:

1. From `mobile-expo/` run:

```bash
npm install
npx expo start
```

2. Install native dependencies where required (follow `expo` warnings).

3. Replace placeholder components with production implementations and wire APIs from the existing server.

Architecture notes:
- Uses Expo Router file-based navigation under `app/`.
- Theme tokens are in `app/theme/tokens.ts`.
- Core components live in `app/components/common/`.

Please tell me if you want me to proceed installing dependencies, or to generate more modules (Flights, Baggage, Transit) next.
