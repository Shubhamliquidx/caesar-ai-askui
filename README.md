# Pixelmon TCG - E2E Automation Framework

Android mobile UI automation framework using **AskUI** and **Caesar AI** for Pixelmon TCG app testing.

## 🎯 Features

- ✅ **Android Mobile Automation** - Test Pixelmon TCG on real devices or emulators
- ✅ **Visual Element Detection** - AI-powered element recognition
- ✅ **Natural Language Commands** - Write tests in plain English using Caesar AI
- ✅ **TypeScript + Jest** - Modern testing stack
- ✅ **Two Automation Approaches** - Traditional API & Caesar AI

## 📚 Documentation

- **[QUICKSTART.md](QUICKSTART.md)** - Get started in 5 minutes
- **[ANDROID_SETUP.md](ANDROID_SETUP.md)** - Complete Android setup guide
- **[E2E_AUTOMATION_GUIDE.md](E2E_AUTOMATION_GUIDE.md)** - Comprehensive automation guide
- **[VISUAL_ELEMENTS_CHEATSHEET.md](VISUAL_ELEMENTS_CHEATSHEET.md)** - Quick API reference

## 🚀 Quick Start

### 1. Prerequisites

- Node.js v16+
- Android SDK & ADB
- Android emulator or physical device
- [AskUI Desktop App](https://www.askui.com/download)

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Credentials

1. Sign up at [app.askui.com](https://app.askui.com)
2. Get your Access Token and Workspace ID
3. Copy `.env.example` to `.env` and add your credentials:

```bash
cp .env.example .env
# Edit .env with your credentials
```

### 4. Start Android Emulator

```bash
emulator -avd Pixel_8  # Replace with your emulator name
```

### 5. Start AskUI Controller for Android

```bash
/Applications/.askui-suite/DependencyCache/UIController-0.16.0/askui-ui-controller.app/Contents/MacOS/askui-ui-controller --runtime android --device-id emulator-5554
```

### 6. Run Tests

```bash
# Run specific test
npm test -- test/pixelmon-collection-flow.test.ts

# Run all tests
npm test
```

## 🧪 Example Tests

### Traditional API (Visual Element Selection)

```typescript
// test/pixelmon-collection-flow.test.ts
await aui.click().text().withText('COLLECTION').exec();
await aui.expect().text().withText('Decks').exists().exec();
```

### Natural Language (Caesar AI)

```typescript
// test/pixelmon-collection-natural-language.test.ts
await aui.act('Tap on Collection');
const hasDecks = await aui.ask('Is there text "Decks" on screen?');
```

## 📁 Project Structure

```
caesar-ai-askui/
├── test/
│   ├── pixelmon-collection-flow.test.ts          # Traditional API demo
│   └── pixelmon-collection-natural-language.test.ts  # Caesar AI demo
├── helpers/
│   └── askui-helper.ts       # AskUI client configuration
├── ANDROID_SETUP.md        # Android setup guide
├── E2E_AUTOMATION_GUIDE.md # Complete automation guide
├── package.json
└── .env.example           # Credentials template
```

## 🥇 Two Automation Approaches

### Traditional API (Precise & Reliable)
- Element-based selection
- No AI credits needed
- Best for stable, repeatable tests

### Caesar AI (Fast & Flexible)
- Natural language commands
- Great for rapid prototyping
- Uses AI credits from AskUI account

## 🔧 Tech Stack

- **AskUI** - Visual UI automation
- **Caesar AI** - Natural language automation
- **TypeScript** - Type-safe test code
- **Jest** - Testing framework
- **Android SDK** - Mobile device control

## 📝 Resources

- [AskUI Documentation](https://docs.askui.com)
- [Caesar AI Guide](https://docs.askui.com/docs/general/Caesar/overview)
- [Android ADB](https://developer.android.com/tools/adb)

## 👥 Contributing

Feel free to add more test scenarios and improve the framework!

---

**Built for Pixelmon TCG automation** 🎮
