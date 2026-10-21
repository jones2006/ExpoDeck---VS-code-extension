Kandipa mapla! Unga **ExpoDeck** extension-kku oru professional-aana, clean-ana GitHub README markdown content inga therenchurkuken. Athai copy panni unga project root folder-la `README.md` nu save panikalam:

````markdown
# 🚀 ExpoDeck

**ExpoDeck** is a lightweight, high-performance Visual Studio Code extension designed for Expo and React Native developers. It streamlines your local development workflow by replacing complex terminal commands with a clean Sidebar command deck, inline quick actions, and a lightning-fast Quick Search menu.

---

## ✨ Features

- **🚀 Interactive Sidebar Command Deck:** Access all essential Expo commands right from your VS Code Activity Bar.
- **⚡ Quick Search Menu (`Ctrl + Alt + E`):** Instantly filter and execute any Expo command using VS Code's Quick Pick interface.
- **▶️ Inline Run & Copy Actions:** Run commands directly in a dedicated `ExpoDeck` terminal or copy them to your clipboard with a single click.
- **📂 Modular Architecture:** Clean command management supporting seamless expansion of custom workflows.
- **📝 Rich Tooltips:** Hover over any command in the sidebar to view detailed descriptions and syntax.

---

## 🛠️ Supported Commands

| Command                 | Action / Description                                                 |
| :---------------------- | :------------------------------------------------------------------- |
| **Start Dev Server**    | Start the local development server (`npx expo start`)                |
| **Start (Clear Cache)** | Clear Metro bundler cache & start (`npx expo start --clear`)         |
| **Open Android**        | Launch directly in the Android emulator (`npx expo start --android`) |
| **Open iOS**            | Launch directly in the iOS simulator (`npx expo start --ios`)        |
| **Open Web**            | Open project preview in browser (`npx expo start --web`)             |
| **Run Native Android**  | Build & run the native Android app (`npx expo run:android`)          |
| **Run Native iOS**      | Build & run the native iOS app (`npx expo run:ios`)                  |
| **Install Package**     | Install an Expo-compatible library (`npx expo install <package>`)    |
| **Prebuild Native**     | Generate native Android/iOS directories (`npx expo prebuild`)        |
| **Doctor Check**        | Diagnose version mismatches & issues (`npx expo doctor`)             |
| **Export Bundle**       | Export production bundle for hosting (`npx expo export`)             |

---

## ⌨️ Keyboard Shortcuts

- **`Ctrl + Alt + E`** (Windows/Linux) / **`Ctrl + Cmd + E`** (Mac): Open the Quick Search command menu.

---

## 🚀 Getting Started

1. Clone or download this repository.
2. Install dependencies:
   ```bash
   npm install
   ```
````

3. Press **F5** in VS Code to compile and open a new Extension Development Host window.

---

## 📦 Building & Publishing

To package the extension into a `.vsix` file for distribution or publishing:

```bash
npm install -g @vscode/vsce
vsce package

```

---

## 👥 Authors

- **Jones J.**
- **Surya Perumal Jeyapandi**

---

## 📄 License

This project is open-source and available under the [MIT License](https://www.google.com/search?q=LICENSE).
