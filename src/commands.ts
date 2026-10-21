export interface ExpoCommand {
  label: string;
  commandText: string;
  descriptionText: string;
}

export const EXPO_COMMANDS: ExpoCommand[] = [
  {
    label: "Start Dev Server",
    commandText: "npx expo start",
    descriptionText: "Start local development server",
  },
  {
    label: "Start (Clear Cache)",
    commandText: "npx expo start --clear",
    descriptionText: "Clear Metro bundler cache & start",
  },
  {
    label: "Open Android",
    commandText: "npx expo start --android",
    descriptionText: "Open directly in Android emulator",
  },
  {
    label: "Open iOS",
    commandText: "npx expo start --ios",
    descriptionText: "Open directly in iOS simulator",
  },
  {
    label: "Open Web",
    commandText: "npx expo start --web",
    descriptionText: "Open project preview in browser",
  },
  {
    label: "Run Native Android",
    commandText: "npx expo run:android",
    descriptionText: "Build & run native Android app",
  },
  {
    label: "Run Native iOS",
    commandText: "npx expo run:ios",
    descriptionText: "Build & run native iOS app",
  },
  {
    label: "Install Package",
    commandText: "npx expo install ",
    descriptionText: "Install Expo-compatible library",
  },
  {
    label: "Prebuild Native",
    commandText: "npx expo prebuild",
    descriptionText: "Generate native android/ios folders",
  },
  {
    label: "Doctor Check",
    commandText: "npx expo doctor",
    descriptionText: "Check version mismatches & issues",
  },
  {
    label: "Export Bundle",
    commandText: "npx expo export",
    descriptionText: "Export production bundle for hosting",
  },
];
