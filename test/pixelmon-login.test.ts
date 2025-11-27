import 'dotenv/config';
import { aui } from '../helpers/askui-helper';
import { execSync } from 'child_process';

/**
 * Merged Login Tests - Pixelmon TCG
 * Contains three different login flow test cases:
 * 1. Full Google login with email/password entry
 * 2. Login using already-added Google account
 * 3. Auto-login flow
 */

describe('Pixelmon TCG - Login Tests (Merged)', () => {
  beforeAll(async () => {
    // Initial setup - ensure AskUI is connected
    console.log('🚀 Starting Login Tests Suite...');
  });

  afterAll(async () => {
    // Force stop the app after all tests are complete
    console.log('🛑 Stopping Pixelmon TCG app after all tests...');
    try {
      execSync('adb shell am force-stop com.PixelPalsStudio.PixelmonTCG', { encoding: 'utf-8' });
      console.log('✅ App force-stopped successfully');
    } catch (error) {
      console.log('⚠️ Error stopping app:', error);
    }
  });

  // Test 1: Google login flow using existing account (simplified)
  it('Google login flow: Launch → Login → Continue with Google → Select account → Verify Play button', async () => {
    console.log('🔐 Starting Test 1: Google Login Flow...');
    
    // Kill app before test to ensure fresh start
    console.log('🛑 Force-stopping app before test...');
    try {
      execSync('adb shell am force-stop com.PixelPalsStudio.PixelmonTCG', { encoding: 'utf-8' });
      await aui.waitFor(2000).exec();
    } catch (error) {
      console.log('⚠️ Error stopping app:', error);
    }

    const email = process.env.PIXELMON_GOOGLE_EMAIL || 'shubhamtestfinal@gmail.com';

    // 1) Launch the app (ensure visible)
    let isLaunched = await aui.ask(
      'Is the Pixelmon TCG app currently open and visible (not the Android home screen)?',
      { json_schema: { type: 'boolean' } }
    );
    if (!isLaunched) {
      try {
        execSync('adb shell monkey -p com.PixelPalsStudio.PixelmonTCG -c android.intent.category.LAUNCHER 1', { encoding: 'utf-8' });
      } catch {}
      await aui.waitFor(6000).exec();
      isLaunched = await aui.ask(
        'Is the Pixelmon TCG app currently open and visible (not the Android home screen)?',
        { json_schema: { type: 'boolean' } }
      );
    }
    expect(isLaunched).toBe(true);

    // 2) Click on Login
    await aui.act('Tap on the Login button');
    await aui.waitFor(2000).exec();

    // 3) Click on Continue with Google
    await aui.act('Tap on "Continue with Google"');
    await aui.waitFor(3000).exec();

    // 4) Select the Google account (handles both account picker and auto-selection)
    let accountChosen = false;
    for (let i = 0; i < 5; i++) {
      const isAccountVisible = await aui.ask(
        `Do you see the Google account "${email}" listed on the screen?`,
        { json_schema: { type: 'boolean' } }
      );
      if (isAccountVisible) {
        await aui.act(`Tap on the Google account option labeled "${email}"`);
        accountChosen = true;
        break;
      }
      // Check if already past account selection
      const hasStartGame = await aui.ask(
        'Is there a button labeled "Start Game" visible?',
        { json_schema: { type: 'boolean' } }
      );
      if (hasStartGame) {
        accountChosen = true;
        break;
      }
      await aui.waitFor(2000).exec();
    }
    if (!accountChosen) {
      // Fallback: try to select any visible Google account
      await aui.act(`Tap on the Google account that contains the text "${email}"`);
    }
    
    // 5) Wait for login to complete
    await aui.waitFor(5000).exec();

    // 10) Click on Start Game
    let hasStartGame = false;
    for (let i = 0; i < 8; i++) {
      hasStartGame = await aui.ask('Is there a button labeled "Start Game" visible?', { json_schema: { type: 'boolean' } });
      if (hasStartGame) break;
      await aui.waitFor(3000).exec();
    }
    expect(hasStartGame).toBe(true);
    await aui.act('Tap on the "Start Game" button');
    await aui.waitFor(3000).exec();

    // 11) Verify Play button is visible on homepage
    let hasPlay = false;
    for (let i = 0; i < 6; i++) {
      hasPlay = await aui.ask('Do you see a button labeled "Play" on the home screen?', { json_schema: { type: 'boolean' } });
      if (hasPlay) break;
      await aui.waitFor(3000).exec();
    }
    expect(hasPlay).toBe(true);
    console.log('✅ Test 1 completed successfully');

    // Kill app after test 1
    console.log('🛑 Stopping Pixelmon TCG app after test 1...');
    try {
      execSync('adb shell am force-stop com.PixelPalsStudio.PixelmonTCG', { encoding: 'utf-8' });
      console.log('✅ App force-stopped successfully');
    } catch (error) {
      console.log('⚠️ Error stopping app:', error);
    }
  }, 300000);

  // Test 2: Login using already-added Google account (from pixelmon-login2.test.ts)
  it('Login via existing Google account and verify homepage Play button', async () => {
    console.log('🔐 Starting Test 2: Login with Existing Google Account...');
    
    // Kill app before test to ensure fresh start
    console.log('🛑 Force-stopping app before test...');
    try {
      execSync('adb shell am force-stop com.PixelPalsStudio.PixelmonTCG', { encoding: 'utf-8' });
      await aui.waitFor(2000).exec();
    } catch (error) {
      console.log('⚠️ Error stopping app:', error);
    }

    // 1) App launch – verify visible, relaunch if needed
    let isVisible = await aui.ask(
      'Is the Pixelmon TCG app currently open and visible (not the Android home screen)?',
      { json_schema: { type: 'boolean' } }
    );
    if (!isVisible) {
      try {
        execSync('adb shell monkey -p com.PixelPalsStudio.PixelmonTCG -c android.intent.category.LAUNCHER 1', { encoding: 'utf-8' });
      } catch {}
      await aui.waitFor(6000).exec();
      isVisible = await aui.ask(
        'Is the Pixelmon TCG app currently open and visible (not the Android home screen)?',
        { json_schema: { type: 'boolean' } }
      );
    }

    // 2) Click on Login
    await aui.act('Tap on the Login button');
    await aui.waitFor(2500).exec();

    // 3) Login with Google
    // Try common variants
    const hasGoogle = await aui.ask(
      'Is there an option that says "Continue with Google" or "Login with Google" or "Sign in with Google"?',
      { json_schema: { type: 'boolean' } }
    );
    if (hasGoogle) {
      await aui.act('Tap on the Google sign-in option (Continue/Login/Sign in with Google)');
    } else {
      await aui.act('Tap on the Google sign-in option');
    }
    await aui.waitFor(3000).exec();

    // 4) Choose already registered/added email
    const email = 'shubhamtestfinal@gmail.com';
    // If account chooser displays a list, select the specific email
    let accountChosen = false;
    for (let i = 0; i < 5; i++) {
      const isAccountVisible = await aui.ask(
        `Do you see the Google account "${email}" listed on the screen?`,
        { json_schema: { type: 'boolean' } }
      );
      if (isAccountVisible) {
        await aui.act(`Tap on the Google account option labeled "${email}"`);
        accountChosen = true;
        break;
      }
      await aui.waitFor(2000).exec();
    }
    if (!accountChosen) {
      // Fallback wording (if UI labels differ)
      await aui.act(`Tap on the Google account that contains the text "${email}"`);
    }

    // 5) Wait for a while as it tries to login
    await aui.act('Wait for the login process to complete');
    await aui.waitFor(5000).exec();

    // 6) Click on Start Game
    let hasStartGame = false;
    for (let i = 0; i < 8; i++) {
      hasStartGame = await aui.ask('Is there a button labeled "Start Game" visible?', { json_schema: { type: 'boolean' } });
      if (hasStartGame) break;
      await aui.waitFor(3000).exec();
    }
    if (hasStartGame) {
      await aui.act('Tap on the "Start Game" button');
      await aui.waitFor(3000).exec();
    }

    // 7) Verify we land on homepage and Play button is visible
    let hasPlay = false;
    for (let i = 0; i < 6; i++) {
      hasPlay = await aui.ask('Do you see a button labeled "Play" on the home screen?', { json_schema: { type: 'boolean' } });
      if (hasPlay) break;
      await aui.waitFor(3000).exec();
    }

    expect(isVisible).toBe(true);
    expect(hasStartGame).toBe(true);
    expect(hasPlay).toBe(true);
    console.log('✅ Test 2 completed successfully');

    // Kill app after test 2
    console.log('🛑 Stopping Pixelmon TCG app after test 2...');
    try {
      execSync('adb shell am force-stop com.PixelPalsStudio.PixelmonTCG', { encoding: 'utf-8' });
      console.log('✅ App force-stopped successfully');
    } catch (error) {
      console.log('⚠️ Error stopping app:', error);
    }
  }, 300000);

  // Test 3: Auto-login flow (from pixelmon-login3.test.ts)
  it('Auto login flow and verify homepage Play button', async () => {
    console.log('🔐 Starting Test 3: Auto-Login Flow...');
    
    // Kill app before test to ensure fresh start
    console.log('🛑 Force-stopping app before test...');
    try {
      execSync('adb shell am force-stop com.PixelPalsStudio.PixelmonTCG', { encoding: 'utf-8' });
      await aui.waitFor(2000).exec();
    } catch (error) {
      console.log('⚠️ Error stopping app:', error);
    }

    // 1) App launch – verify visible, relaunch if needed
    let isVisible = await aui.ask(
      'Is the Pixelmon TCG app currently open and visible (not the Android home screen)?',
      { json_schema: { type: 'boolean' } }
    );
    if (!isVisible) {
      try {
        execSync('adb shell monkey -p com.PixelPalsStudio.PixelmonTCG -c android.intent.category.LAUNCHER 1', { encoding: 'utf-8' });
      } catch {}
      await aui.waitFor(6000).exec();
      isVisible = await aui.ask(
        'Is the Pixelmon TCG app currently open and visible (not the Android home screen)?',
        { json_schema: { type: 'boolean' } }
      );
    }
    expect(isVisible).toBe(true);

    // 2) Wait for auto login to complete
    // Check if we're still on login screen or if auto login has started
    let isLoggedIn = false;
    let loginInProgress = false;
    
    // Wait for auto login process (check for various indicators)
    for (let i = 0; i < 10; i++) {
      // Check if we're already past login (Start Game button visible means logged in)
      const hasStartGame = await aui.ask(
        'Is there a button labeled "Start Game" visible on the screen?',
        { json_schema: { type: 'boolean' } }
      );
      
      if (hasStartGame) {
        isLoggedIn = true;
        break;
      }
      
      // Check if login is in progress (looking for loading indicators or login UI elements)
      const hasLoginScreen = await aui.ask(
        'Do you see a login screen with "Login" button or Google sign-in options?',
        { json_schema: { type: 'boolean' } }
      );
      
      if (!hasLoginScreen) {
        // If login screen is gone, might be logging in
        loginInProgress = true;
      }
      
      // Use natural language to wait for login process
      await aui.act('Wait for the auto login process to complete');
      await aui.waitFor(3000).exec();
    }
    
    // Additional wait after auto login detection
    if (isLoggedIn || loginInProgress) {
      await aui.waitFor(5000).exec();
    }

    // 3) Click on Start Game
    let hasStartGame = false;
    for (let i = 0; i < 8; i++) {
      hasStartGame = await aui.ask('Is there a button labeled "Start Game" visible?', { json_schema: { type: 'boolean' } });
      if (hasStartGame) break;
      await aui.waitFor(3000).exec();
    }
    if (hasStartGame) {
      await aui.act('Tap on the "Start Game" button');
      await aui.waitFor(3000).exec();
    }

    // 4) Verify that user lands on home page and Play button is displayed in UI
    let hasPlay = false;
    for (let i = 0; i < 6; i++) {
      hasPlay = await aui.ask('Do you see a button labeled "Play" on the home screen?', { json_schema: { type: 'boolean' } });
      if (hasPlay) break;
      await aui.waitFor(3000).exec();
    }

    // Verify we're on the home page
    const isOnHomePage = await aui.ask(
      'Are you on the home page or main screen of the Pixelmon TCG app?',
      { json_schema: { type: 'boolean' } }
    );

    expect(hasStartGame).toBe(true);
    expect(hasPlay).toBe(true);
    expect(isOnHomePage).toBe(true);
    console.log('✅ Test 3 completed successfully');

    // Kill app after test 3
    console.log('🛑 Stopping Pixelmon TCG app after test 3...');
    try {
      execSync('adb shell am force-stop com.PixelPalsStudio.PixelmonTCG', { encoding: 'utf-8' });
      console.log('✅ App force-stopped successfully');
    } catch (error) {
      console.log('⚠️ Error stopping app:', error);
    }
  }, 300000);
});

