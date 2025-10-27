# Android Mobile Testing Setup

Complete guide for setting up AskUI to test Android mobile applications.

## Prerequisites ✅

- ✅ Node.js (v16 or higher)
- ✅ AskUI Desktop App installed
- ✅ Android SDK installed at `~/Library/Android/sdk`
- ✅ ADB (Android Debug Bridge) installed and in PATH
- ✅ Android emulator or physical device

## Step 1: Configure Environment Variables

Your `~/.zshrc` has been updated with Android SDK paths:

```bash
# Android SDK
export ANDROID_HOME=~/Library/Android/sdk
export PATH=$PATH:$ANDROID_HOME/emulator:$ANDROID_HOME/platform-tools
```

**Reload your shell:**
```bash
source ~/.zshrc
```

## Step 2: Start an Android Emulator

### List Available Emulators
```bash
emulator -list-avds
```

Available emulators on your system:
- Medium_Phone_API_36
- Pixel_7a
- Pixel_8
- Pixel_9
- Pixel_9_Pro

### Start an Emulator
```bash
emulator -avd Pixel_8 &
```

*(Replace `Pixel_8` with your preferred device)*

### Verify Connection
Wait for the emulator to fully boot (~30-60 seconds), then:

```bash
adb devices
```

Expected output:
```
List of devices attached
emulator-5554    device
```

**Note the device ID** (e.g., `emulator-5554`) - you'll need it for the next step.

## Step 3: Start AskUI Controller for Android

The AskUI Controller must be started with Android runtime mode:

```bash
askui-controller --runtime android --device-id emulator-5554
```

Replace `emulator-5554` with your actual device ID from `adb devices`.

### Controller Options

- `--runtime android` - Sets controller to Android mode
- `--device-id <id>` - Specifies which Android device to control
- `--port 6769` - Controller port (default: 6769)

### Verify Controller is Running

The controller should display:
```
AskUI Controller started
Runtime: android
Device ID: emulator-5554
Port: 6769
```

## Step 4: Write Your First Mobile Test

Create a test file in `test/mobile-example.test.ts`:

```typescript
import 'dotenv/config';
import { aui } from '../helpers/askui-helper';

describe('Android Mobile Test', () => {
  it('should automate Android app', async () => {
    // Open an app (replace with your app package name)
    await aui.exec('Open the Settings app');
    
    // Navigate using Caesar AI
    await aui.exec('Scroll down');
    await aui.exec('Click on About phone');
    
    // Alternative: Traditional API
    await aui.click().text().withText('About phone').exec();
  });

  it('should interact with app elements', async () => {
    // Caesar AI examples for mobile
    await aui.exec('Tap on the search icon');
    await aui.exec('Type "wifi" in the search field');
    await aui.exec('Tap the first result');
    
    // Verify element exists
    const wifiText = await aui.expect().text().withText('Wi-Fi').exists().exec();
    expect(wifiText).toBe(true);
  });
});
```

## Step 5: Run Mobile Tests

```bash
npm test -- test/mobile-example.test.ts
```

## Testing Your Own Android App

### Install App on Emulator

```bash
adb install path/to/your-app.apk
```

### Launch App in Test

```typescript
// Option 1: Using Caesar AI
await aui.exec('Open the MyApp application');

// Option 2: Using ADB (outside test)
// First get your app's package name:
// adb shell pm list packages | grep your-app-name
// Then launch it:
await aui.exec('Open com.example.myapp');
```

## Troubleshooting

### Emulator Not Detected

```bash
# Kill and restart ADB server
adb kill-server
adb start-server
adb devices
```

### Controller Connection Issues

1. Verify controller is running with Android runtime
2. Check device ID matches: `adb devices`
3. Restart controller with correct device ID

### App Not Found

```bash
# List installed apps
adb shell pm list packages

# Install your app
adb install -r path/to/app.apk
```

### Slow Emulator Performance

- Use x86/x86_64 emulator images (faster than ARM on Intel/AMD Macs)
- Increase emulator RAM in Android Studio (Tools → Device Manager → Edit Device)
- Enable hardware acceleration

## Switching Between Desktop and Mobile Testing

### For Desktop Testing
```bash
# Start controller without runtime flag (default is desktop)
askui-controller
```

### For Mobile Testing
```bash
# Start controller with Android runtime
askui-controller --runtime android --device-id emulator-5554
```

The same test code works for both - just restart the controller with the appropriate runtime!

## Physical Android Device Setup

1. **Enable Developer Options** on your device:
   - Settings → About Phone
   - Tap "Build Number" 7 times

2. **Enable USB Debugging**:
   - Settings → Developer Options
   - Enable "USB Debugging"

3. **Connect via USB** and authorize computer

4. **Verify connection**:
   ```bash
   adb devices
   ```

5. **Start controller** with your device ID:
   ```bash
   askui-controller --runtime android --device-id <your-device-id>
   ```

## Best Practices

- **Sequential Tests**: Keep `maxWorkers: 1` in jest.config.js
- **Clean State**: Reset app state between tests
- **Explicit Waits**: Mobile UI may be slower - use `waitFor()` or `waitUntil()`
- **Screen Orientation**: Test both portrait and landscape if applicable
- **Network Conditions**: Consider testing offline scenarios

## Resources

- [AskUI Documentation](https://docs.askui.com)
- [Caesar AI Guide](https://docs.askui.com/docs/general/Caesar/overview)
- [Android ADB Documentation](https://developer.android.com/tools/adb)
- [Android Emulator Documentation](https://developer.android.com/studio/run/emulator-commandline)
