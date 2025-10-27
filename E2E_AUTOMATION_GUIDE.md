# E2E Automation with AskUI - Complete Guide

Now that your basic setup is working, here's how to build comprehensive E2E automation for Pixelmon TCG.

## Your Current Setup ✅

- ✅ Android emulator running
- ✅ AskUI Controller connected to emulator
- ✅ App launches successfully
- ✅ Basic test infrastructure in place

---

## E2E Automation Flow

### Step 1: Map Out Your Test Scenarios

**Example for Pixelmon TCG:**
```
1. Login Flow
2. Main Menu Navigation
3. Card Collection View
4. Battle/Game Flow
5. Settings & Profile
6. Logout
```

### Step 2: Identify Elements to Interact With

For each screen, identify:
- Buttons (Login, Start Game, etc.)
- Text fields (Username, Password)
- Images (Card images, Icons)
- Lists (Card collection, Inventory)
- Navigation elements

---

## Two Approaches for Automation

### Approach 1: Visual Element Detection (Traditional API)

Best for precise, reliable automation without AI credits.

```typescript
// Click a button with specific text
await aui.click().button().withText('Login').exec();

// Type into a text field
await aui.click().textfield().contains().text('Username').exec();
await aui.type('myusername').exec();

// Click on an image/icon
await aui.click().image().nearestTo().text('Profile').exec();

// Wait for element to appear
await aui.waitUntil(
  aui.expect().text('Welcome').exists()
);

// Verify element exists
const buttonExists = await aui.expect()
  .button()
  .withText('Start Game')
  .exists()
  .exec();
expect(buttonExists).toBe(true);
```

### Approach 2: Caesar AI (Natural Language) - Requires Credits

Best for rapid prototyping and complex scenarios.

```typescript
// Get credentials from https://app.askui.com
// Update .env with real ASKUI_TOKEN and ASKUI_WORKSPACE_ID

await aui.act('Click on the login button');
await aui.act('Type "myusername" in the username field');
await aui.act('Type "mypassword" in the password field');
await aui.act('Tap the submit button');
await aui.act('Scroll down to see more cards');
```

---

## Sample E2E Test Structure

### Example: Login to Battle Flow

```typescript
describe('Pixelmon TCG - Complete Game Flow', () => {
  beforeAll(async () => {
    // Launch app before all tests
    execSync('adb shell monkey -p com.PixelPalsStudio.PixelmonTCG -c android.intent.category.LAUNCHER 1');
    await aui.waitFor(5000).exec();
  });

  afterAll(async () => {
    // Close app after tests
    execSync('adb shell am force-stop com.PixelPalsStudio.PixelmonTCG');
  });

  it('should complete login flow', async () => {
    // Click login button
    await aui.click().button().withText('Login').exec();
    
    // Enter credentials
    await aui.click().textfield().withText('Email').exec();
    await aui.type('user@example.com').exec();
    
    await aui.click().textfield().withText('Password').exec();
    await aui.type('password123').exec();
    
    // Submit
    await aui.click().button().withText('Submit').exec();
    
    // Wait for home screen
    await aui.waitFor(3000).exec();
    
    // Verify login success
    const homeVisible = await aui.expect()
      .text()
      .withText('Home')
      .exists()
      .exec();
    expect(homeVisible).toBe(true);
  });

  it('should navigate to card collection', async () => {
    await aui.click().button().withText('Collection').exec();
    await aui.waitFor(2000).exec();
    
    // Verify cards are visible
    const cardsVisible = await aui.expect()
      .image()
      .exists()
      .exec();
    expect(cardsVisible).toBe(true);
  });

  it('should start a battle', async () => {
    // Navigate to battle screen
    await aui.click().button().withText('Battle').exec();
    await aui.waitFor(2000).exec();
    
    // Start battle
    await aui.click().button().withText('Start').exec();
    
    // Wait for battle to load
    await aui.waitFor(5000).exec();
  });
});
```

---

## Best Practices

### 1. **Use Page Object Pattern**

Create helper functions for each screen:

```typescript
// helpers/pixelmon-pages.ts
export class LoginPage {
  static async login(email: string, password: string) {
    await aui.click().textfield().withText('Email').exec();
    await aui.type(email).exec();
    
    await aui.click().textfield().withText('Password').exec();
    await aui.type(password).exec();
    
    await aui.click().button().withText('Login').exec();
    await aui.waitFor(3000).exec();
  }
}

export class HomePage {
  static async navigateToCollection() {
    await aui.click().button().withText('Collection').exec();
    await aui.waitFor(2000).exec();
  }
  
  static async navigateToBattle() {
    await aui.click().button().withText('Battle').exec();
    await aui.waitFor(2000).exec();
  }
}
```

### 2. **Handle Waits Properly**

```typescript
// Bad: Fixed wait
await aui.waitFor(5000).exec();

// Good: Wait for specific element
await aui.waitUntil(
  aui.expect().button().withText('Continue').exists(),
  30, // max retries
  1000 // wait time between retries
);
```

### 3. **Add Screenshot on Failure**

```typescript
afterEach(async () => {
  if (expect.getState().currentTestName.includes('FAIL')) {
    await aui.annotate(); // Takes screenshot
  }
});
```

### 4. **Test Data Management**

```typescript
// test-data/users.ts
export const testUsers = {
  validUser: {
    email: 'test@example.com',
    password: 'Test123!'
  },
  invalidUser: {
    email: 'invalid@example.com',
    password: 'wrong'
  }
};
```

### 5. **Organize Tests by Feature**

```
test/
├── auth/
│   ├── login.test.ts
│   ├── signup.test.ts
│   └── logout.test.ts
├── collection/
│   ├── view-cards.test.ts
│   └── filter-cards.test.ts
├── battle/
│   ├── start-battle.test.ts
│   └── battle-flow.test.ts
└── profile/
    └── edit-profile.test.ts
```

---

## Debugging Tips

### 1. **Use Interactive Annotation**

```typescript
// Pause test and visually see what AskUI detects
await aui.annotateInteractively();
```

### 2. **Check Element Detection**

```typescript
// See what elements are detected on screen
const elements = await aui.get().text().exec();
console.log('Detected text elements:', elements);
```

### 3. **Use ADB for Inspection**

```bash
# Get current activity
adb shell dumpsys window | grep -E 'mCurrentFocus'

# Get UI hierarchy
adb shell uiautomator dump
adb pull /sdcard/window_dump.xml
```

---

## Recommended Workflow

### Day 1-2: Exploration
1. Manually play through the app
2. Document all screens and flows
3. Identify key test scenarios
4. Use `annotateInteractively()` to see what AskUI detects

### Day 3-5: Build Core Tests
1. Start with login/logout
2. Add main navigation tests
3. Test critical user flows
4. Use traditional API (no AI credits needed)

### Week 2: Expand Coverage
1. Add edge cases
2. Test error scenarios
3. Add data-driven tests
4. Refactor to page objects

### Week 3+: Maintenance
1. Run tests in CI/CD
2. Update tests as app changes
3. Add new features as they're released

---

## Running Tests in CI/CD

```yaml
# .github/workflows/android-tests.yml
name: Android E2E Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: macos-latest
    steps:
      - uses: actions/checkout@v2
      
      - name: Set up Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '16'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Start Android Emulator
        run: |
          emulator -avd test_emulator -no-window -no-audio &
          adb wait-for-device
      
      - name: Install APK
        run: adb install path/to/app.apk
      
      - name: Start AskUI Controller
        run: |
          askui-ui-controller --runtime android --device-id emulator-5554 &
      
      - name: Run E2E Tests
        run: npm test
```

---

## Next Steps

1. **Explore your app** - Click through manually
2. **Pick one flow** - Start with login or main navigation
3. **Write first E2E test** - Use traditional API
4. **Iterate** - Add more scenarios
5. **Refactor** - Create page objects and helpers
6. **Scale** - Add CI/CD integration

## Resources

- [AskUI API Documentation](https://docs.askui.com/docs/api/API/table-of-contents)
- [Element Selectors Guide](https://docs.askui.com/docs/api/Element-Selection/text)
- [Relations Guide](https://docs.askui.com/docs/api/Relations/above)
- Your test files: `test/pixelmon-tcg.test.ts` and `test/android-basic.test.ts`

---

**Ready to build your first E2E test? Start by exploring the app and documenting the flows you want to automate!** 🚀
