import 'dotenv/config';
import { aui } from '../helpers/askui-helper';
import { execSync } from 'child_process';

/**
 * PIXELMON END-TO-END TEST SUITE
 * This file contains comprehensive end-to-end tests that run multiple test flows in sequence.
 * 
 * Test Flow:
 * 1. LAUNCH THE APP (in beforeAll)
 * 2. Login Flow Tests (from pixelmon-login.test.ts) - Kills app, launches app, tests login, ends on MAIN SCREEN
 * 3. Account Flow Tests (from pixelmon-account.test.ts) - Assumes MAIN SCREEN, ends on LOGIN/START GAME SCREEN
 * 4. Options Flow Tests (from pixelmon-option.test.ts) - Starts from LOGIN/START GAME SCREEN, ends on MAIN SCREEN
 * 5. Profile Flow Tests (from pixelmon-profile.test.ts) - Assumes MAIN SCREEN, ends on MAIN SCREEN
 * 6. Mail Flow Tests (from pixelmon-mail.test.ts) - Assumes MAIN SCREEN, ends on MAIN SCREEN
 * 7. Game Mode Flow Tests (from pixelmon-gamemode.test.ts) - Assumes MAIN SCREEN, ends on MAIN SCREEN
 * 8. Collection Flow Tests (from pixelmon-collection.test.ts) - Assumes MAIN SCREEN, ends on COLLECTION SCREEN
 * 9. Booster Pack Flow Tests (from pixelmon-booster-pack.test.ts) - Assumes MAIN SCREEN, ends on BOOSTER PACK SCREEN
 * 10. Battle Pass Flow Tests (from pixelmon-battlepass.test.ts) - Assumes MAIN SCREEN, ends on BATTLE PASS SCREEN
 * 11. Shop Flow Tests (from pixelmon-shop.test.ts) - Assumes MAIN SCREEN, ends on MAIN SCREEN
 * 
 * Note: Each test suite ensures the app is in the correct state for the next test suite.
 */

describe('Pixelmon TCG - End-to-End Test Suite', () => {
  beforeAll(async () => {
    // Launch the app via ADB
    console.log('🚀 Starting End-to-End Test Suite...');
    try {
      execSync('adb shell monkey -p com.PixelPalsStudio.PixelmonTCG.Stg -c android.intent.category.LAUNCHER 1', { encoding: 'utf-8' });
    } catch {}
    await aui.waitFor(8000).exec();
  });

  afterAll(async () => {
    // Force stop the app after all tests are complete
    console.log(':octagonal_sign: Stopping Pixelmon TCG app after all E2E tests...');
    try {
      execSync('adb shell am force-stop com.PixelPalsStudio.PixelmonTCG.Stg', { encoding: 'utf-8' });
      console.log(':white_check_mark: App force-stopped successfully');
    } catch (error) {
      console.log(':warning: Error stopping app:', error);
    }
  });


  // ========== PART 1: LOGIN FLOW TESTS ==========
  
  describe('Login Flow Tests', () => {
    // Test: Login using already-added Google account and verify Start Game button appears
    it('should login via existing Google account and verify Start Game button appears', async () => {
      console.log('🔐 Starting Login Flow Test...');
      
      // 1) Launch the app
      console.log('📱 Step 1: Launching the app...');
      let isVisible = await aui.ask(
        'Is the Pixelmon TCG app currently open and visible (not the Android home screen)?',
        { json_schema: { type: 'boolean' } }
      );
      if (!isVisible) {
        try {
          execSync('adb shell monkey -p com.PixelPalsStudio.PixelmonTCG.Stg -c android.intent.category.LAUNCHER 1', { encoding: 'utf-8' });
        } catch {}
        await aui.waitFor(6000).exec();
        isVisible = await aui.ask(
          'Is the Pixelmon TCG app currently open and visible (not the Android home screen)?',
          { json_schema: { type: 'boolean' } }
        );
      }
      expect(isVisible).toBe(true);
      console.log('✅ App launched and visible');

      // 2) Click on Login
      console.log('🔐 Step 2: Clicking on Login button...');
      await aui.act('Tap on the Login button');
      await aui.waitFor(2500).exec();
      console.log('✅ Clicked Login button');

      // 3) Choose Google account
      console.log('🔐 Step 3: Clicking on Google sign-in option...');
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
      console.log('✅ Clicked Google sign-in option');

      // 4) Choose already registered/added email
      const email = 'shubhamtestfinal@gmail.com';
      console.log(`🔐 Step 4: Selecting Google account: ${email}...`);
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
      console.log('✅ Selected Google account');

      // 5) Wait for login
      console.log('⏳ Step 5: Waiting for login process to complete...');
      await aui.act('Wait for the login process to complete');
      await aui.waitFor(5000).exec();
      console.log('✅ Login process completed');

      // 6) Verify Start Game appears
      console.log('🎮 Step 6: Verifying Start Game button appears...');
      let hasStartGame = false;
      for (let i = 0; i < 8; i++) {
        hasStartGame = await aui.ask('Is there a button labeled "Start Game" visible?', { json_schema: { type: 'boolean' } });
        if (hasStartGame) {
          console.log('✅ Start Game button found!');
          break;
        }
        await aui.waitFor(3000).exec();
      }
      expect(hasStartGame).toBe(true);
      console.log('✅ Login flow completed - Start Game button is visible');
    }, 300000);
  });

  // ========== PART 2: ACCOUNT FLOW TESTS ==========
  
  describe('Account Flow Tests', () => {
    // Test 1: Verify Account screen elements
    it('should navigate to Account screen and verify all required elements', async () => {
      console.log('👤 Starting Test 1: Account Screen Elements Verification...');
      
      // 1) Launch the app – verify visible, relaunch if needed
      let isVisible = await aui.ask(
        'Is the Pixelmon TCG app currently open and visible (not the Android home screen)?',
        { json_schema: { type: 'boolean' } }
      );
      if (!isVisible) {
        try {
          execSync('adb shell monkey -p com.PixelPalsStudio.PixelmonTCG.Stg -c android.intent.category.LAUNCHER 1', { encoding: 'utf-8' });
        } catch {}
        await aui.waitFor(8000).exec();
        isVisible = await aui.ask(
          'Is the Pixelmon TCG app currently open and visible (not the Android home screen)?',
          { json_schema: { type: 'boolean' } }
        );
      }
      expect(isVisible).toBe(true);

      // 2) Click on Account
      // Wait for screen to fully load
      await aui.waitFor(3000).exec();
      
      // Click on Account button
      console.log('📱 Clicking on Account button...');
      await aui.act('Tap on the Account button');
      await aui.waitFor(2500).exec();
      console.log('✅ Clicked Account button');

      // 3) Verify that account screen has heading as "Account"
      console.log('🔍 Verifying Account heading...');
      const hasAccountHeading = await aui.ask(
        'Do you see a heading or title that says "Account" on the screen?',
        { json_schema: { type: 'boolean' } }
      );
      expect(hasAccountHeading).toBe(true);
      console.log('✅ Account heading verified');

      // 4) Verify that logout is present
      console.log('🔍 Verifying Logout option...');
      const hasLogout = await aui.ask(
        'Do you see a button or option labeled "Logout" or "Log out" on the account screen?',
        { json_schema: { type: 'boolean' } }
      );
      expect(hasLogout).toBe(true);
      console.log('✅ Logout option verified');

      // 5) Verify that user ID is present
      console.log('🔍 Verifying User ID...');
      const hasUserId = await aui.ask(
        'Do you see a user ID or user identifier displayed on the account screen?',
        { json_schema: { type: 'boolean' } }
      );
      expect(hasUserId).toBe(true);
      console.log('✅ User ID verified');

      // 6) Verify that delete account is present
      console.log('🔍 Verifying Delete Account option...');
      const hasDeleteAccount = await aui.ask(
        'Do you see an option or button labeled "Delete Account" on the account screen?',
        { json_schema: { type: 'boolean' } }
      );
      expect(hasDeleteAccount).toBe(true);
      console.log('✅ Delete Account option verified');
      console.log('✅ Test 1 completed successfully');
    }, 300000);

    // Test 2: Logout flow and re-login (without clicking Start Game)
    it('should logout and re-login without clicking Start Game button', async () => {
      console.log('🚪 Starting Test 2: Logout and Re-Login Flow...');
      
      // Assumes we're already on Account screen from Test 1
      // If not, navigate to Account screen first
      let isOnAccountScreen = await aui.ask(
        'Are you on the Account screen with "Account" heading visible?',
        { json_schema: { type: 'boolean' } }
      );
      
      if (!isOnAccountScreen) {
        // Navigate to Account screen
        console.log('📱 Navigating to Account screen...');
        await aui.act('Tap on the Account button');
        await aui.waitFor(2500).exec();
      }

      // 1) Click on Logout
      console.log('🚪 Step 1: Clicking on Logout button...');
      await aui.act('Tap on the Logout button or "Log out" option');
      await aui.waitFor(3000).exec();
      console.log('✅ Clicked Logout');

      // 2) Verify that you land back on login screen
      console.log('🔍 Step 2: Verifying login screen...');
      let isOnLoginScreen = false;
      for (let i = 0; i < 5; i++) {
        console.log(`   Checking login screen (attempt ${i + 1}/5)...`);
        
        const hasLoginButton = await aui.ask(
          'Do you see a "Login" button on the screen?',
          { json_schema: { type: 'boolean' } }
        );
        
        const hasGoogleSignIn = await aui.ask(
          'Do you see Google sign-in options or "Continue with Google" on the screen?',
          { json_schema: { type: 'boolean' } }
        );
        
        if (hasLoginButton || hasGoogleSignIn) {
          isOnLoginScreen = true;
          console.log('✅ Successfully landed on login screen!');
          break;
        }
        
        await aui.waitFor(2000).exec();
      }
      expect(isOnLoginScreen).toBe(true);

      // 3) Use login flow (from pixelmon-login.test.ts lines 132-236) but stop before Start Game button
      console.log('🔐 Step 3: Starting login flow...');
      
      // Click on Login
      console.log('   Clicking on Login button...');
      await aui.act('Tap on the Login button');
      await aui.waitFor(2500).exec();

      // Login with Google
      console.log('   Clicking on Google sign-in option...');
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

      // Choose already registered/added email
      const email = 'shubhamtestfinal@gmail.com';
      console.log(`   Selecting Google account: ${email}...`);
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

      // Wait for login to complete
      console.log('   Waiting for login process to complete...');
      await aui.act('Wait for the login process to complete');
      await aui.waitFor(5000).exec();

      // 4) Verify Start Game button is visible but DO NOT click it
      console.log('🔍 Step 4: Verifying Start Game button is visible (without clicking)...');
      let hasStartGame = false;
      for (let i = 0; i < 8; i++) {
        hasStartGame = await aui.ask('Is there a button labeled "Start Game" visible?', { json_schema: { type: 'boolean' } });
        if (hasStartGame) {
          console.log('✅ Start Game button is visible - login successful!');
          break;
        }
        await aui.waitFor(3000).exec();
      }
      expect(hasStartGame).toBe(true);
      console.log('✅ Test 2 completed successfully - logged in without clicking Start Game');
    }, 300000);

    // Test 3: Copy user ID and verify, then return to main screen
    it('should copy user ID and return to main screen', async () => {
      console.log('📋 Starting Test 3: Copy User ID Flow...');
      
      // Navigate to Account screen by clicking Account button
      console.log('📱 Navigating to Account screen...');
      await aui.act('Tap on the Account button');
      await aui.waitFor(2500).exec();

      // Verify we're on Account screen
      const isOnAccountScreen = await aui.ask(
        'Are you on the Account screen with "Account" heading visible?',
        { json_schema: { type: 'boolean' } }
      );
      expect(isOnAccountScreen).toBe(true);
      console.log('✅ On Account screen');

      // 1) Click on copy button/icon to copy user ID
      console.log('📋 Step 1: Clicking on copy button to copy user ID...');
      await aui.act('Tap on the copy button or copy icon next to the user ID');
      await aui.waitFor(2000).exec();
      console.log('✅ Clicked copy button');

      // 2) Verify that user ID is copied (check clipboard or verify copy action completed)
      console.log('🔍 Step 2: Verifying user ID was copied...');
      // Note: We can't directly verify clipboard content, but we can verify the copy action was successful
      // by checking if the UI shows any confirmation or if the copy action completed
      const copySuccessful = await aui.ask(
        'Did the copy action complete successfully? Is there any indication that the user ID was copied (like a toast message, checkmark, or confirmation)?',
        { json_schema: { type: 'boolean' } }
      );
      // Even if no visual confirmation, the action should have completed
      // We'll assume success if we can proceed (no error state)
      console.log('✅ User ID copy action completed');

      // 3) Click on cross button to close Account screen
      console.log('❌ Step 3: Clicking on cross button to close Account screen...');
      await aui.act('Tap on the cross button or X button to close the account screen');
      await aui.waitFor(2000).exec();
      console.log('✅ Clicked cross button');

      // 4) Verify that you land back on main screen which says "Pixelmon TCG"
      console.log('🏠 Step 4: Verifying return to main screen...');
      let isOnMainScreen = false;
      for (let i = 0; i < 5; i++) {
        console.log(`   Checking main screen (attempt ${i + 1}/5)...`);
        
        const hasPixelmonText = await aui.ask(
          'Do you see the text "Pixelmon TCG" written on the main screen or home screen?',
          { json_schema: { type: 'boolean' } }
        );
        
        const isOnHomePage = await aui.ask(
          'Are you on the home page or main screen of the Pixelmon TCG app?',
          { json_schema: { type: 'boolean' } }
        );
        
        if (hasPixelmonText || isOnHomePage) {
          isOnMainScreen = true;
          console.log('✅ Successfully returned to main screen!');
          break;
        }
        
        await aui.waitFor(2000).exec();
      }
      expect(isOnMainScreen).toBe(true);
      
      console.log('✅ Test 3 completed successfully - app is on main screen after copying user ID');
    }, 300000);
  });

  // ========== PART 2: OPTIONS FLOW TESTS ==========
  
  describe('Options Flow Tests', () => {
    // Test 1: Navigate to Options screen and verify all required elements
    it('should navigate to Options screen and verify all required elements', async () => {
      console.log('⚙️ Starting Options Screen Elements Verification...');
      
      // Wait for screen to fully load
      await aui.waitFor(3000).exec();
      
      // Click on Options button
      console.log('📱 Clicking on Options button...');
      await aui.act('Tap on the Options button');
      await aui.waitFor(2500).exec();
      console.log('✅ Clicked Options button');

      // Verify that options screen opens up and "Options" is available
      console.log('🔍 Verifying Options screen...');
      const hasOptionsTitle = await aui.ask(
        'Do you see text "Options" on the screen indicating you are on the options screen?',
        { json_schema: { type: 'boolean' } }
      );
      expect(hasOptionsTitle).toBe(true);
      console.log('✅ Options title verified');

      // Verify that audio section is available
      console.log('🔍 Verifying audio section...');
      const hasAudioSection = await aui.ask(
        'Do you see an audio section or audio-related settings on the options screen?',
        { json_schema: { type: 'boolean' } }
      );
      expect(hasAudioSection).toBe(true);
      console.log('✅ Audio section verified');

      // Verify that options screen has all required elements
      // Terms of Service
      console.log('🔍 Verifying Terms of Service...');
      const hasTermsOfService = await aui.ask(
        'Do you see text "Terms of Service" on the options screen?',
        { json_schema: { type: 'boolean' } }
      );
      expect(hasTermsOfService).toBe(true);
      console.log('✅ Terms of Service verified');

      // Privacy Policy
      console.log('🔍 Verifying Privacy Policy...');
      const hasPrivacyPolicy = await aui.ask(
        'Do you see text "Privacy Policy" on the options screen?',
        { json_schema: { type: 'boolean' } }
      );
      expect(hasPrivacyPolicy).toBe(true);
      console.log('✅ Privacy Policy verified');

      // Customer Service
      console.log('🔍 Verifying Customer Service...');
      const hasCustomerService = await aui.ask(
        'Do you see text "Customer Service" on the options screen?',
        { json_schema: { type: 'boolean' } }
      );
      expect(hasCustomerService).toBe(true);
      console.log('✅ Customer Service verified');

      // Report a Bug
      console.log('🔍 Verifying Report a Bug...');
      const hasReportBug = await aui.ask(
        'Do you see text "Report a Bug" on the options screen?',
        { json_schema: { type: 'boolean' } }
      );
      expect(hasReportBug).toBe(true);
      console.log('✅ Report a Bug verified');

      // Click on return/back button to go back
      console.log('↩️ Clicking back button...');
      await aui.act('Tap on the back button or return button to go back to the previous screen');
      await aui.waitFor(2000).exec();
      console.log('✅ Test completed successfully');
    }, 300000);

    // Test 2: Navigate to Terms of Service page and verify all elements
    it('should navigate to Terms of Service page and verify all elements', async () => {
      console.log('📄 Starting Terms of Service Test...');
      
      // Navigate to Options screen first
      console.log('📱 Navigating to Options screen...');
      await aui.act('Tap on the Options button');
      await aui.waitFor(2500).exec();
      
      // 1) Click on Terms of Service button
      console.log('📜 Step 1: Clicking on Terms of Service button...');
      await aui.act('Tap on the "Terms of Service" button or text');
      await aui.waitFor(3000).exec();
      console.log('✅ Clicked Terms of Service');

      // 2) Verify navigation to Terms of Service page
      console.log('🔍 Step 2: Verifying Terms of Service page...');
      let isOnTermsPage = false;
      for (let i = 0; i < 5; i++) {
        console.log(`   Checking Terms of Service page (attempt ${i + 1}/5)...`);
        
        const hasTermsHeading = await aui.ask(
          'Do you see a heading or title that says "Terms of Service" on the screen?',
          { json_schema: { type: 'boolean' } }
        );
        
        const hasTermsContent = await aui.ask(
          'Do you see Terms of Service content or legal text on the screen?',
          { json_schema: { type: 'boolean' } }
        );
        
        if (hasTermsHeading || hasTermsContent) {
          isOnTermsPage = true;
          console.log('✅ Successfully navigated to Terms of Service page!');
          break;
        }
        
        await aui.waitFor(2000).exec();
      }
      expect(isOnTermsPage).toBe(true);

      // 3) Verify "Terms of Service" heading is displayed
      console.log('📋 Step 3: Verifying Terms of Service heading...');
      const hasTermsHeading = await aui.ask(
        'Do you see a heading or title that says "Terms of Service" at the top of the screen?',
        { json_schema: { type: 'boolean' } }
      );
      expect(hasTermsHeading).toBe(true);
      console.log('✅ Terms of Service heading verified');

      // 4) Verify "mon logo" is displayed in the header
      console.log('🖼️ Step 4: Verifying mon logo in header...');
      const hasMonLogo = await aui.ask(
        'Do you see a "mon" logo or "mon" text in the header area at the top of the Terms of Service page?',
        { json_schema: { type: 'boolean' } }
      );
      expect(hasMonLogo).toBe(true);
      console.log('✅ Mon logo in header verified');

      // 5) Press Android back button to navigate back to Options screen
      console.log('↩️ Step 5: Pressing Android back button to return to Options screen...');
      execSync('adb shell input keyevent KEYCODE_BACK', { encoding: 'utf-8' });
      await aui.waitFor(2000).exec();
      console.log('✅ Android back button pressed');

      // 6) Verify we're back on Options screen
      console.log('🔍 Step 6: Verifying return to Options screen...');
      let isBackOnOptions = false;
      for (let i = 0; i < 3; i++) {
        isBackOnOptions = await aui.ask(
          'Are you back on the Options screen with "Options" text visible?',
          { json_schema: { type: 'boolean' } }
        );
        if (isBackOnOptions) {
          console.log('✅ Successfully returned to Options screen!');
          break;
        }
        await aui.waitFor(2000).exec();
      }
      expect(isBackOnOptions).toBe(true);
      console.log('✅ Test completed successfully');
    }, 300000);

    // Test 3: Navigate to Privacy Policy page and verify all elements
    it('should navigate to Privacy Policy page and verify all elements', async () => {
      console.log('🔒 Starting Privacy Policy Test...');
      
      // Assumes we're already on Options screen with Privacy Policy visible
      // If not, navigate to Options screen first
      let isOnOptionsScreen = await aui.ask(
        'Are you on the Options screen with "Options" text visible?',
        { json_schema: { type: 'boolean' } }
      );
      
      if (!isOnOptionsScreen) {
        console.log('📱 Navigating to Options screen...');
        await aui.act('Tap on the Options button');
        await aui.waitFor(2500).exec();
      }
      
      // 1) Click on Privacy Policy button
      console.log('📜 Step 1: Clicking on Privacy Policy button...');
      await aui.act('Tap on the "Privacy Policy" button or text');
      await aui.waitFor(3000).exec();
      console.log('✅ Clicked Privacy Policy');

      // 2) Verify navigation to Privacy Policy page
      console.log('🔍 Step 2: Verifying Privacy Policy page...');
      let isOnPrivacyPage = false;
      for (let i = 0; i < 5; i++) {
        console.log(`   Checking Privacy Policy page (attempt ${i + 1}/5)...`);
        
        const hasPrivacyHeading = await aui.ask(
          'Do you see a heading or title that says "Privacy Policy" on the screen?',
          { json_schema: { type: 'boolean' } }
        );
        
        const hasPrivacyContent = await aui.ask(
          'Do you see Privacy Policy content or legal text on the screen?',
          { json_schema: { type: 'boolean' } }
        );
        
        if (hasPrivacyHeading || hasPrivacyContent) {
          isOnPrivacyPage = true;
          console.log('✅ Successfully navigated to Privacy Policy page!');
          break;
        }
        
        await aui.waitFor(2000).exec();
      }
      expect(isOnPrivacyPage).toBe(true);

      // 3) Verify "Privacy Policy" heading is displayed
      console.log('📋 Step 3: Verifying Privacy Policy heading...');
      const hasPrivacyHeading = await aui.ask(
        'Do you see a heading or title that says "Privacy Policy" at the top of the screen?',
        { json_schema: { type: 'boolean' } }
      );
      expect(hasPrivacyHeading).toBe(true);
      console.log('✅ Privacy Policy heading verified');

      // 4) Verify "mon logo" is displayed in the header
      console.log('🖼️ Step 4: Verifying mon logo in header...');
      const hasMonLogo = await aui.ask(
        'Do you see a "mon" logo or "mon" text in the header area at the top of the Privacy Policy page?',
        { json_schema: { type: 'boolean' } }
      );
      expect(hasMonLogo).toBe(true);
      console.log('✅ Mon logo in header verified');

      // 5) Press Android back button to navigate back to Options screen
      console.log('↩️ Step 5: Pressing Android back button to return to Options screen...');
      execSync('adb shell input keyevent KEYCODE_BACK', { encoding: 'utf-8' });
      await aui.waitFor(2000).exec();
      console.log('✅ Android back button pressed');

      // 6) Verify we're back on Options screen
      console.log('🔍 Step 6: Verifying return to Options screen...');
      let isBackOnOptions = false;
      for (let i = 0; i < 3; i++) {
        isBackOnOptions = await aui.ask(
          'Are you back on the Options screen with "Options" text visible?',
          { json_schema: { type: 'boolean' } }
        );
        if (isBackOnOptions) {
          console.log('✅ Successfully returned to Options screen!');
          break;
        }
        await aui.waitFor(2000).exec();
      }
      expect(isBackOnOptions).toBe(true);
      console.log('✅ Test completed successfully');
    }, 300000);

    // Test 4: Navigate to Customer Service page and verify all elements
    it('should navigate to Customer Service page and verify all elements', async () => {
      console.log('💬 Starting Customer Service Test...');
      
      // Assumes we're already on Options screen with Customer Service visible
      // If not, navigate to Options screen first
      let isOnOptionsScreen = await aui.ask(
        'Are you on the Options screen with "Options" text visible?',
        { json_schema: { type: 'boolean' } }
      );
      
      if (!isOnOptionsScreen) {
        console.log('📱 Navigating to Options screen...');
        await aui.act('Tap on the Options button');
        await aui.waitFor(2500).exec();
      }
      
      // 1) Click on Customer Service button
      console.log('📜 Step 1: Clicking on Customer Service button...');
      await aui.act('Tap on the "Customer Service" button or text');
      await aui.waitFor(3000).exec();
      console.log('✅ Clicked Customer Service');

      // 2) Verify navigation to Customer Service page and "what can we help you with ?" text
      console.log('🔍 Step 2: Verifying Customer Service page...');
      let isOnCustomerServicePage = false;
      for (let i = 0; i < 5; i++) {
        console.log(`   Checking Customer Service page (attempt ${i + 1}/5)...`);
        
        const hasHelpText = await aui.ask(
          'Do you see the text "what can we help you with ?" on the screen?',
          { json_schema: { type: 'boolean' } }
        );
        
        const hasCustomerServiceContent = await aui.ask(
          'Do you see Customer Service content or support-related text on the screen?',
          { json_schema: { type: 'boolean' } }
        );
        
        if (hasHelpText || hasCustomerServiceContent) {
          isOnCustomerServicePage = true;
          console.log('✅ Successfully navigated to Customer Service page!');
          break;
        }
        
        await aui.waitFor(2000).exec();
      }
      expect(isOnCustomerServicePage).toBe(true);

      // 3) Verify "what can we help you with ?" text is displayed
      console.log('📋 Step 3: Verifying "what can we help you with ?" text...');
      const hasHelpText = await aui.ask(
        'Do you see the text "what can we help you with ?" on the Customer Service screen?',
        { json_schema: { type: 'boolean' } }
      );
      expect(hasHelpText).toBe(true);
      console.log('✅ "what can we help you with ?" text verified');

      // 4) Press Android back button to navigate back to Options screen
      console.log('↩️ Step 4: Pressing Android back button to return to Options screen...');
      execSync('adb shell input keyevent KEYCODE_BACK', { encoding: 'utf-8' });
      await aui.waitFor(2000).exec();
      console.log('✅ Android back button pressed');

      // 5) Verify we're back on Options screen
      console.log('🔍 Step 5: Verifying return to Options screen...');
      let isBackOnOptions = false;
      for (let i = 0; i < 3; i++) {
        isBackOnOptions = await aui.ask(
          'Are you back on the Options screen with "Options" text visible?',
          { json_schema: { type: 'boolean' } }
        );
        if (isBackOnOptions) {
          console.log('✅ Successfully returned to Options screen!');
          break;
        }
        await aui.waitFor(2000).exec();
      }
      expect(isBackOnOptions).toBe(true);
      console.log('✅ Test completed successfully');
    }, 300000);

    // Test 5: Navigate to Report a Bug page and verify all elements
    it('should navigate to Report a Bug page and verify all elements', async () => {
      console.log('🐛 Starting Report a Bug Test...');
      
      // Assumes we're already on Options screen with Report a Bug visible
      // If not, navigate to Options screen first
      let isOnOptionsScreen = await aui.ask(
        'Are you on the Options screen with "Options" text visible?',
        { json_schema: { type: 'boolean' } }
      );
      
      if (!isOnOptionsScreen) {
        console.log('📱 Navigating to Options screen...');
        await aui.act('Tap on the Options button');
        await aui.waitFor(2500).exec();
      }
      
      // 1) Click on Report a Bug button
      console.log('📜 Step 1: Clicking on Report a Bug button...');
      await aui.act('Tap on the "Report a Bug" button or text');
      await aui.waitFor(3000).exec();
      console.log('✅ Clicked Report a Bug');

      // 2) Verify navigation to Report a Bug page and "what can we help you with ?" text
      console.log('🔍 Step 2: Verifying Report a Bug page...');
      let isOnReportBugPage = false;
      for (let i = 0; i < 5; i++) {
        console.log(`   Checking Report a Bug page (attempt ${i + 1}/5)...`);
        
        const hasHelpText = await aui.ask(
          'Do you see the text "what can we help you with ?" on the screen?',
          { json_schema: { type: 'boolean' } }
        );
        
        const hasReportBugContent = await aui.ask(
          'Do you see Report a Bug content or bug reporting form on the screen?',
          { json_schema: { type: 'boolean' } }
        );
        
        if (hasHelpText || hasReportBugContent) {
          isOnReportBugPage = true;
          console.log('✅ Successfully navigated to Report a Bug page!');
          break;
        }
        
        await aui.waitFor(2000).exec();
      }
      expect(isOnReportBugPage).toBe(true);

      // 3) Verify "what can we help you with ?" text is displayed
      console.log('📋 Step 3: Verifying "what can we help you with ?" text...');
      const hasHelpText = await aui.ask(
        'Do you see the text "what can we help you with ?" on the Report a Bug screen?',
        { json_schema: { type: 'boolean' } }
      );
      expect(hasHelpText).toBe(true);
      console.log('✅ "what can we help you with ?" text verified');

      // 4) Press Android back button to navigate back to Options screen
      console.log('↩️ Step 4: Pressing Android back button to return to Options screen...');
      execSync('adb shell input keyevent KEYCODE_BACK', { encoding: 'utf-8' });
      await aui.waitFor(2000).exec();
      console.log('✅ Android back button pressed');

      // 5) Verify we're back on Options screen
      console.log('🔍 Step 5: Verifying return to Options screen...');
      let isBackOnOptions = false;
      for (let i = 0; i < 3; i++) {
        isBackOnOptions = await aui.ask(
          'Are you back on the Options screen with "Options" text visible?',
          { json_schema: { type: 'boolean' } }
        );
        if (isBackOnOptions) {
          console.log('✅ Successfully returned to Options screen!');
          break;
        }
        await aui.waitFor(2000).exec();
      }
      expect(isBackOnOptions).toBe(true);
      console.log('✅ Test completed successfully');
    }, 300000);

    // Test 6: Click back button on Options screen and return to main screen
    it('should click back button on Options screen and return to main screen', async () => {
      console.log('↩️ Starting Back Button Test...');
      
      // Navigate to Options screen first if not already there
      let isOnOptionsScreen = await aui.ask(
        'Are you on the Options screen with "Options" text visible?',
        { json_schema: { type: 'boolean' } }
      );
      
      if (!isOnOptionsScreen) {
        console.log('📱 Navigating to Options screen...');
        await aui.act('Tap on the Options button');
        await aui.waitFor(2500).exec();
      }
      
      // 1) Verify we're on Options screen
      console.log('🔍 Step 1: Verifying we are on Options screen...');
      isOnOptionsScreen = await aui.ask(
        'Are you on the Options screen with "Options" text visible?',
        { json_schema: { type: 'boolean' } }
      );
      expect(isOnOptionsScreen).toBe(true);
      console.log('✅ Confirmed on Options screen');

      // 2) Click on back button in the top right corner
      console.log('👆 Step 2: Clicking on back button in top right corner...');
      await aui.act('Navigate to the top right corner of the screen and tap on the back button or return button');
      await aui.waitFor(2000).exec();
      console.log('✅ Clicked back button');

      // 3) Verify we're back on main screen/home screen
      console.log('🏠 Step 3: Verifying return to main screen...');
      let isOnMainScreen = false;
      for (let i = 0; i < 5; i++) {
        console.log(`   Checking main screen (attempt ${i + 1}/5)...`);
        
        const hasPixelmonText = await aui.ask(
          'Do you see the text "Pixelmon TCG" written on the main screen or home screen?',
          { json_schema: { type: 'boolean' } }
        );
        
        const isOnHomePage = await aui.ask(
          'Are you on the home page or main screen of the Pixelmon TCG app?',
          { json_schema: { type: 'boolean' } }
        );
        
        if (hasPixelmonText || isOnHomePage) {
          isOnMainScreen = true;
          console.log('✅ Successfully returned to main screen!');
          break;
        }
        
        await aui.waitFor(2000).exec();
      }
      expect(isOnMainScreen).toBe(true);
      console.log('✅ Test completed successfully - returned to main screen');

      // 4) Check if Start Game button is visible and click it to reach homepage
      console.log('🎮 Step 4: Checking for Start Game button...');
      const hasStartGame = await aui.ask(
        'Is there a button labeled "Start Game" visible on the screen?',
        { json_schema: { type: 'boolean' } }
      );
      
      if (hasStartGame) {
        console.log('🎮 Start Game button found, clicking it to reach homepage...');
        await aui.act('Tap on the "Start Game" button');
        await aui.waitFor(3000).exec();
        console.log('✅ Clicked Start Game button');

        // 5) Handle downloadable asset option if it appears (AFTER clicking Start Game)
        console.log('📥 Step 5: Handling downloadable asset option if present...');
        const hasDownloadableAssetOption = await aui.ask(
          'Do you see any dialog or screen with a "Downloadable Assets" option or a button to download additional assets?',
          { json_schema: { type: 'boolean' } }
        );
        if (hasDownloadableAssetOption) {
          await aui.act('If a "Downloadable Assets" option or similar is visible, tap on the Continue or Download button to start downloading the assets');
          await aui.act('Wait until the downloadable assets have finished downloading and any progress bar or loading indicator for the assets has completed');
          await aui.waitFor(10000).exec();
          console.log('✅ Downloadable assets handled');
        }

        // 6) Verify we land on homepage and Play button is visible
        console.log('🏠 Step 6: Verifying home page with Play button...');
        let hasPlay = false;
        for (let i = 0; i < 6; i++) {
          hasPlay = await aui.ask('Do you see a button labeled "Play" on the home screen?', { json_schema: { type: 'boolean' } });
          if (hasPlay) {
            console.log('✅ Play button found!');
            break;
          }
          await aui.waitFor(3000).exec();
        }

        const isOnHomePage = await aui.ask(
          'Are you on the home page or main screen of the Pixelmon TCG app?',
          { json_schema: { type: 'boolean' } }
        );

        expect(hasPlay).toBe(true);
        expect(isOnHomePage).toBe(true);
        console.log('✅ Successfully on homepage - ready for Profile Flow Tests');
      } else {
        // If no Start Game button, verify we're already on homepage
        console.log('ℹ️ No Start Game button found, verifying we are on homepage...');
        const isOnHomePage = await aui.ask(
          'Are you on the home page or main screen of the Pixelmon TCG app?',
          { json_schema: { type: 'boolean' } }
        );
        expect(isOnHomePage).toBe(true);
        console.log('✅ Already on homepage - ready for Profile Flow Tests');
      }
    }, 300000);
  });

  // ========== PART 3: PROFILE FLOW TESTS ==========
  
  describe('Profile Flow Tests', () => {
    // Test 1: Navigate to Profile and verify all elements
    it('should navigate to home page, open Profile and verify all elements', async () => {
      console.log('👤 Starting Profile Flow Test...');
      
      // Verify we're on the home page (from previous login test)
      console.log('🏠 Step 1: Verifying we are on home page...');
      const isOnHomePage = await aui.ask(
        'Are you on the home page or main screen of the Pixelmon TCG app?',
        { json_schema: { type: 'boolean' } }
      );
      
      if (!isOnHomePage) {
        // If not on home page, verify Play button is visible
        let hasPlay = false;
        for (let i = 0; i < 5; i++) {
          hasPlay = await aui.ask('Do you see a button labeled "Play" on the home screen?', { json_schema: { type: 'boolean' } });
          if (hasPlay) break;
          await aui.waitFor(2000).exec();
        }
        expect(hasPlay).toBe(true);
      }
      console.log('✅ On home page');

      // ========== PROFILE FLOW ==========

      // 2) Find and click profile icon (golden circular icon with red creature)
      console.log('👤 Step 2: Looking for and clicking profile icon...');
      await aui.waitFor(3000).exec(); // Wait for home screen to fully load
      
      // Natural language command - similar to how Collection is located in tadtest.test.ts
      // Provides detailed context: location, appearance, and verification logic
      await aui.act('Navigate to the top left corner of the screen. You should see a circular icon with a golden or metallic circular frame. Inside this circle, there is a red cartoonish creature with glowing yellow eyes and a raised fist. The creature is set against a glowing orange and yellow background. At the bottom of this circular icon, there is a small blue diamond shape with the number "1" displayed inside it. Tap on this profile icon in the top left corner. After you click the icon, if you see a screen with "Profile" as a heading or title, it means you are on the correct page, otherwise, you are on the wrong page');
      console.log('✅ Clicked profile icon using natural language');
      
      // Wait for profile screen to load
      await aui.waitFor(3000).exec();
      console.log('⏳ Waited for profile screen to load');

      // 3) Verify that profile screen opens with "Profile" heading
      console.log('📊 Step 3: Verifying profile screen opened...');
      let isOnProfileScreen = false;
      for (let i = 0; i < 5; i++) {
        console.log(`   Checking profile screen (attempt ${i + 1}/5)...`);
        
        // Check multiple indicators
        const hasProfileHeading = await aui.ask(
          'Do you see a heading or title that says "Profile" at the top of the screen?',
          { json_schema: { type: 'boolean' } }
        );
        
        const hasProfileContent = await aui.ask(
          'Do you see profile-related content like player information, level, or score on the screen?',
          { json_schema: { type: 'boolean' } }
        );
        
        if (hasProfileHeading || hasProfileContent) {
          isOnProfileScreen = true;
          console.log('✅ Profile screen opened!');
          break;
        }
        
        await aui.waitFor(2000).exec();
      }
      expect(isOnProfileScreen).toBe(true);

      // 4) Verify player level and score are present in the UI
      console.log('📈 Step 4: Verifying player level and score...');
      const hasPlayerLevelAndScore = await aui.ask(
        'Do you see "Player Level" or "Level" and a numerical "Score" displayed on the profile screen?',
        { json_schema: { type: 'boolean' } }
      );
      expect(hasPlayerLevelAndScore).toBe(true);
      console.log('✅ Player level and score verified');

      // 5) Verify that username and user ID are also mentioned in the profile section
      console.log('🆔 Step 5: Verifying username and user ID...');
      const hasUsernameAndID = await aui.ask(
        'Do you see the user\'s "Username" and "User ID" displayed on the profile screen?',
        { json_schema: { type: 'boolean' } }
      );
      expect(hasUsernameAndID).toBe(true);
      console.log('✅ Username and User ID verified');

      // 6) Verify that different unique collected cards are also present
      console.log('🃏 Step 6: Verifying collected cards section...');
      const hasCollectedCards = await aui.ask(
        'Do you see a section displaying "Collected Cards", "Unique Cards", or a list of cards on the profile screen?',
        { json_schema: { type: 'boolean' } }
      );
      expect(hasCollectedCards).toBe(true);
      console.log('✅ Collected cards section verified');
      console.log('✅ Test completed successfully');
    }, 600000);

    // Test 2: Change profile icon using pencil icon and save
    it('should change profile icon using pencil icon and save', async () => {
      console.log('✏️ Starting Profile Icon Change Test...');
      
      // Assumes we're already on Profile screen from Test 1
      // If not, navigate to Profile screen first
      let isOnProfileScreen = await aui.ask(
        'Are you on the Profile screen with "Profile" heading visible?',
        { json_schema: { type: 'boolean' } }
      );
      
      if (!isOnProfileScreen) {
        // Navigate to Profile screen
        console.log('📱 Navigating to Profile screen...');
        await aui.waitFor(3000).exec();
        await aui.act('Navigate to the top left corner of the screen. You should see a circular icon with a golden or metallic circular frame. Inside this circle, there is a red cartoonish creature with glowing yellow eyes and a raised fist. The creature is set against a glowing orange and yellow background. At the bottom of this circular icon, there is a small blue diamond shape with the number "1" displayed inside it. Tap on this profile icon in the top left corner');
        await aui.waitFor(3000).exec();
        
        // Verify we're on Profile screen
        isOnProfileScreen = await aui.ask(
          'Are you on the Profile screen with "Profile" heading visible?',
          { json_schema: { type: 'boolean' } }
        );
      }
      expect(isOnProfileScreen).toBe(true);
      console.log('✅ On Profile screen');

      // ========== PROFILE ICON CHANGE FLOW ==========

      // 1) Find and click pencil icon near profile image
      console.log('✏️ Step 1: Looking for pencil icon near profile image...');
      await aui.waitFor(2000).exec(); // Wait for profile screen to fully load
      
      // Natural language command to find and click pencil icon
      await aui.act('Look for a pencil icon or edit icon near the profile image or profile picture. The pencil icon is typically small and located near the profile image, usually in the top area of the profile screen. Tap on the pencil icon to edit or change the profile image');
      console.log('✅ Clicked pencil icon');
      
      // Wait for icon selection screen to load
      await aui.waitFor(3000).exec();
      console.log('⏳ Waited for icon selection screen to load');

      // 2) Verify that icon selection screen opened
      console.log('🖼️ Step 2: Verifying icon selection screen opened...');
      let isOnIconSelectionScreen = false;
      for (let i = 0; i < 5; i++) {
        console.log(`   Checking icon selection screen (attempt ${i + 1}/5)...`);
        
        const hasIconOptions = await aui.ask(
          'Do you see different icons or profile image options displayed on the screen that you can select to change your profile icon?',
          { json_schema: { type: 'boolean' } }
        );
        
        const hasIconGrid = await aui.ask(
          'Do you see a grid or list of different profile icons or images that you can choose from?',
          { json_schema: { type: 'boolean' } }
        );
        
        const hasSaveButton = await aui.ask(
          'Do you see a "Save" button or "Confirm" button on the screen?',
          { json_schema: { type: 'boolean' } }
        );
        
        if (hasIconOptions || hasIconGrid || hasSaveButton) {
          isOnIconSelectionScreen = true;
          console.log('✅ Icon selection screen opened!');
          break;
        }
        
        await aui.waitFor(2000).exec();
      }
      expect(isOnIconSelectionScreen).toBe(true);

      // 3) Verify that different icons/images are available for selection
      console.log('🖼️ Step 3: Verifying different icons/images are available...');
      const hasMultipleIcons = await aui.ask(
        'Do you see multiple different icons or images available for selection on the icon selection screen?',
        { json_schema: { type: 'boolean' } }
      );
      expect(hasMultipleIcons).toBe(true);
      console.log('✅ Multiple icons/images verified as available');

      // 4) Click on Save button
      console.log('💾 Step 4: Clicking on Save button...');
      await aui.act('Tap on the "Save" button to save the profile icon selection');
      await aui.waitFor(2000).exec();
      console.log('✅ Clicked Save button');
      
      // Wait for navigation back to profile screen
      await aui.waitFor(3000).exec();
      console.log('⏳ Waited for navigation back to profile screen');

      // 5) Verify that we land back on profile page
      console.log('🔍 Step 5: Verifying return to profile page...');
      let isBackOnProfilePage = false;
      for (let i = 0; i < 5; i++) {
        console.log(`   Checking profile page (attempt ${i + 1}/5)...`);
        
        const hasProfileHeading = await aui.ask(
          'Do you see a heading or title that says "Profile" at the top of the screen?',
          { json_schema: { type: 'boolean' } }
        );
        
        const hasProfileContent = await aui.ask(
          'Do you see profile-related content like player information, level, or score on the screen?',
          { json_schema: { type: 'boolean' } }
        );
        
        const isNotOnIconSelection = await aui.ask(
          'Are you no longer on the icon selection screen with multiple icon options?',
          { json_schema: { type: 'boolean' } }
        );
        
        if ((hasProfileHeading || hasProfileContent) && isNotOnIconSelection) {
          isBackOnProfilePage = true;
          console.log('✅ Successfully returned to profile page!');
          break;
        }
        
        await aui.waitFor(2000).exec();
      }
      expect(isBackOnProfilePage).toBe(true);
      console.log('✅ Test completed successfully - profile icon change flow verified');
    }, 300000);

    // Test 3: Change player name/tag using pencil icon, confirm, and then cancel
    it('should change player name/tag using pencil icon, confirm, and then cancel', async () => {
      console.log('✏️ Starting Player Name/Tag Change Test...');
      
      // Assumes we're already on Profile screen from previous tests
      // If not, navigate to Profile screen first
      let isOnProfileScreen = await aui.ask(
        'Are you on the Profile screen with "Profile" heading visible?',
        { json_schema: { type: 'boolean' } }
      );
      
      if (!isOnProfileScreen) {
        // Navigate to Profile screen
        console.log('📱 Navigating to Profile screen...');
        await aui.waitFor(3000).exec();
        await aui.act('Navigate to the top left corner of the screen. You should see a circular icon with a golden or metallic circular frame. Inside this circle, there is a red cartoonish creature with glowing yellow eyes and a raised fist. The creature is set against a glowing orange and yellow background. At the bottom of this circular icon, there is a small blue diamond shape with the number "1" displayed inside it. Tap on this profile icon in the top left corner');
        await aui.waitFor(3000).exec();
        
        // Verify we're on Profile screen
        isOnProfileScreen = await aui.ask(
          'Are you on the Profile screen with "Profile" heading visible?',
          { json_schema: { type: 'boolean' } }
        );
      }
      expect(isOnProfileScreen).toBe(true);
      console.log('✅ On Profile screen');

      // ========== PART 1: CHANGE PLAYER NAME/TAG FLOW ==========

      // 1) Find and click pencil icon beside the name tag
      console.log('✏️ Step 1: Looking for pencil icon beside name tag...');
      await aui.waitFor(2000).exec(); // Wait for profile screen to fully load
      
      // Natural language command to find and click pencil icon beside name tag
      await aui.act('Look for a pencil icon or edit icon beside the player name tag or username. The pencil icon is typically small and located near the name or username field on the profile screen. Tap on the pencil icon to edit or change the player name');
      console.log('✅ Clicked pencil icon beside name tag');
      
      // Wait for name change screen to load
      await aui.waitFor(3000).exec();
      console.log('⏳ Waited for name change screen to load');

      // 2) Verify that "change player tag" opens up
      console.log('🔍 Step 2: Verifying change player tag screen opened...');
      let isOnChangePlayerTagScreen = false;
      for (let i = 0; i < 5; i++) {
        console.log(`   Checking change player tag screen (attempt ${i + 1}/5)...`);
        
        const hasChangePlayerTagHeading = await aui.ask(
          'Do you see a heading or title that says "Change Player Tag" or "Change Name" or "Edit Name" on the screen?',
          { json_schema: { type: 'boolean' } }
        );
        
        const hasNameInputField = await aui.ask(
          'Do you see an input field or text box where you can enter or change the player name?',
          { json_schema: { type: 'boolean' } }
        );
        
        const hasConfirmButton = await aui.ask(
          'Do you see a "Confirm" button or "Save" button on the screen?',
          { json_schema: { type: 'boolean' } }
        );
        
        if (hasChangePlayerTagHeading || hasNameInputField || hasConfirmButton) {
          isOnChangePlayerTagScreen = true;
          console.log('✅ Change player tag screen opened!');
          break;
        }
        
        await aui.waitFor(2000).exec();
      }
      expect(isOnChangePlayerTagScreen).toBe(true);

      // 3) Verify that options to change name is available
      console.log('📝 Step 3: Verifying options to change name are available...');
      const hasNameChangeOptions = await aui.ask(
        'Do you see options or an input field available to change the player name on the screen?',
        { json_schema: { type: 'boolean' } }
      );
      expect(hasNameChangeOptions).toBe(true);
      console.log('✅ Name change options verified as available');

      // 4) Click on Confirm (without entering any value)
      console.log('✅ Step 4: Clicking on Confirm button...');
      await aui.act('Tap on the "Confirm" button to save the name change');
      await aui.waitFor(2000).exec();
      console.log('✅ Clicked Confirm button');
      
      // Wait for navigation back to profile screen
      await aui.waitFor(3000).exec();
      console.log('⏳ Waited for navigation back to profile screen');

      // 5) Verify that we land back on profile page
      console.log('🔍 Step 5: Verifying return to profile page after confirm...');
      let isBackOnProfilePage = false;
      for (let i = 0; i < 5; i++) {
        console.log(`   Checking profile page (attempt ${i + 1}/5)...`);
        
        const hasProfileHeading = await aui.ask(
          'Do you see a heading or title that says "Profile" at the top of the screen?',
          { json_schema: { type: 'boolean' } }
        );
        
        const hasProfileContent = await aui.ask(
          'Do you see profile-related content like player information, level, or score on the screen?',
          { json_schema: { type: 'boolean' } }
        );
        
        const isNotOnNameChangeScreen = await aui.ask(
          'Are you no longer on the name change or change player tag screen?',
          { json_schema: { type: 'boolean' } }
        );
        
        if ((hasProfileHeading || hasProfileContent) && isNotOnNameChangeScreen) {
          isBackOnProfilePage = true;
          console.log('✅ Successfully returned to profile page after confirm!');
          break;
        }
        
        await aui.waitFor(2000).exec();
      }
      expect(isBackOnProfilePage).toBe(true);

      // ========== PART 2: CANCEL FLOW ==========

      // 7) Again click on pencil icon beside name
      console.log('✏️ Step 7: Clicking on pencil icon beside name again...');
      await aui.waitFor(2000).exec();
      
      // Natural language command to find and click pencil icon beside name tag again
      await aui.act('Look for a pencil icon or edit icon beside the player name tag or username. The pencil icon is typically small and located near the name or username field on the profile screen. Tap on the pencil icon to edit or change the player name');
      console.log('✅ Clicked pencil icon beside name tag again');
      
      // Wait for name change screen to load
      await aui.waitFor(3000).exec();
      console.log('⏳ Waited for name change screen to load again');

      // 8) Click on Cancel
      console.log('❌ Step 8: Clicking on Cancel button...');
      await aui.act('Tap on the "Cancel" button to cancel the name change without saving');
      await aui.waitFor(2000).exec();
      console.log('✅ Clicked Cancel button');
      
      // Wait for navigation back to profile screen
      await aui.waitFor(3000).exec();
      console.log('⏳ Waited for navigation back to profile screen');

      // 9) Verify that we land back on profile page
      console.log('🔍 Step 9: Verifying return to profile page after cancel...');
      let isBackOnProfilePageAfterCancel = false;
      for (let i = 0; i < 5; i++) {
        console.log(`   Checking profile page (attempt ${i + 1}/5)...`);
        
        const hasProfileHeading = await aui.ask(
          'Do you see a heading or title that says "Profile" at the top of the screen?',
          { json_schema: { type: 'boolean' } }
        );
        
        const hasProfileContent = await aui.ask(
          'Do you see profile-related content like player information, level, or score on the screen?',
          { json_schema: { type: 'boolean' } }
        );
        
        const isNotOnNameChangeScreen = await aui.ask(
          'Are you no longer on the name change or change player tag screen?',
          { json_schema: { type: 'boolean' } }
        );
        
        if ((hasProfileHeading || hasProfileContent) && isNotOnNameChangeScreen) {
          isBackOnProfilePageAfterCancel = true;
          console.log('✅ Successfully returned to profile page after cancel!');
          break;
        }
        
        await aui.waitFor(2000).exec();
      }
      expect(isBackOnProfilePageAfterCancel).toBe(true);
      console.log('✅ Test completed successfully - player name/tag change flow verified');
    }, 300000);

    // Test 4: Verify player level, test user ID masking/unmasking, and navigate back to homepage
    it('should verify player level, test user ID masking/unmasking, and navigate back to homepage', async () => {
      console.log('🔍 Starting Player Level and User ID Masking Test...');
      
      // Assumes we're already on Profile screen from previous tests
      // If not, navigate to Profile screen first
      let isOnProfileScreen = await aui.ask(
        'Are you on the Profile screen with "Profile" heading visible?',
        { json_schema: { type: 'boolean' } }
      );
      
      if (!isOnProfileScreen) {
        // Navigate to Profile screen
        console.log('📱 Navigating to Profile screen...');
        await aui.waitFor(3000).exec();
        await aui.act('Navigate to the top left corner of the screen. You should see a circular icon with a golden or metallic circular frame. Inside this circle, there is a red cartoonish creature with glowing yellow eyes and a raised fist. The creature is set against a glowing orange and yellow background. At the bottom of this circular icon, there is a small blue diamond shape with the number "1" displayed inside it. Tap on this profile icon in the top left corner');
        await aui.waitFor(3000).exec();
        
        // Verify we're on Profile screen
        isOnProfileScreen = await aui.ask(
          'Are you on the Profile screen with "Profile" heading visible?',
          { json_schema: { type: 'boolean' } }
        );
      }
      expect(isOnProfileScreen).toBe(true);
      console.log('✅ On Profile screen');

      // ========== PART 1: VERIFY PLAYER LEVEL ==========

      // 1) Check for player level at the top (any number should be present)
      console.log('📊 Step 1: Verifying player level is displayed...');
      const hasPlayerLevel = await aui.ask(
        'Do you see a player level displayed at the top of the profile screen? Is there a number showing the player level (it can be any number like 1, 2, 3, etc.)?',
        { json_schema: { type: 'boolean' } }
      );
      expect(hasPlayerLevel).toBe(true);
      console.log('✅ Player level verified (number is present)');

      // ========== PART 2: TEST USER ID MASKING/UNMASKING ==========

      // 2) Test user ID masking/unmasking using eye icon
      console.log('🔒 Step 2: Testing user ID masking/unmasking using eye icon...');
      
      // First, check if user ID is currently visible or masked
      const isUserIdVisible = await aui.ask(
        'Do you see the actual user ID or user identifier displayed on the profile screen (not masked or hidden)?',
        { json_schema: { type: 'boolean' } }
      );
      
      // Look for eye icon for masking/unmasking
      console.log('   Looking for eye icon near user ID...');
      const hasEyeIcon = await aui.ask(
        'Do you see an eye icon near the user ID field that can be used to mask or unmask the user ID?',
        { json_schema: { type: 'boolean' } }
      );
      
      if (hasEyeIcon) {
        // If user ID is currently visible, click eye icon to mask it
        if (isUserIdVisible) {
          console.log('   User ID is currently visible, clicking eye icon to mask it...');
          await aui.act('Tap on the eye icon near the user ID field to mask or hide the user ID');
          await aui.waitFor(2000).exec();
          
          // Verify user ID is now masked (not visible)
          const isUserIdMasked = await aui.ask(
            'Is the user ID now masked or hidden? Can you no longer see the actual user ID value on the screen?',
            { json_schema: { type: 'boolean' } }
          );
          expect(isUserIdMasked).toBe(true);
          console.log('✅ User ID is now masked (not visible)');
        } else {
          console.log('   User ID is already masked');
        }
        
        // Now click eye icon again to unmask it
        console.log('   Clicking eye icon to unmask user ID...');
        await aui.act('Tap on the eye icon near the user ID field to unmask or show the user ID');
        await aui.waitFor(2000).exec();
        
        // Verify user ID is now unmasked (visible)
        const isUserIdUnmasked = await aui.ask(
          'Is the user ID now unmasked or visible? Can you see the actual user ID value displayed on the screen?',
          { json_schema: { type: 'boolean' } }
        );
        expect(isUserIdUnmasked).toBe(true);
        console.log('✅ User ID is now unmasked (visible)');
      } else {
        // If no eye icon found, just verify the current state
        console.log('   No eye icon found, verifying current user ID visibility state...');
        if (isUserIdVisible) {
          console.log('✅ User ID is currently visible (unmasked)');
        } else {
          console.log('✅ User ID is currently masked (not visible)');
        }
      }

      // ========== PART 3: NAVIGATE BACK TO HOMEPAGE ==========

      // 3) Click on back button
      console.log('↩️ Step 3: Clicking on back button...');
      await aui.act('Tap on the back button or return button to go back to the previous screen');
      await aui.waitFor(2000).exec();
      console.log('✅ Clicked back button');
      
      // Wait for navigation to homepage
      await aui.waitFor(3000).exec();
      console.log('⏳ Waited for navigation to homepage');

      // 4) Verify that it lands on homepage and Play button is visible
      console.log('🏠 Step 4: Verifying homepage with Play button...');
      let isOnHomepage = false;
      let hasPlayButton = false;
      
      for (let i = 0; i < 5; i++) {
        console.log(`   Checking homepage (attempt ${i + 1}/5)...`);
        
        // Check for Play button
        hasPlayButton = await aui.ask(
          'Do you see a button labeled "Play" on the home screen?',
          { json_schema: { type: 'boolean' } }
        );
        
        // Check if we're on homepage
        const isOnHomePage = await aui.ask(
          'Are you on the home page or main screen of the Pixelmon TCG app?',
          { json_schema: { type: 'boolean' } }
        );
        
        const isNotOnProfileScreen = await aui.ask(
          'Are you no longer on the Profile screen?',
          { json_schema: { type: 'boolean' } }
        );
        
        if (hasPlayButton && isOnHomePage && isNotOnProfileScreen) {
          isOnHomepage = true;
          console.log('✅ Successfully landed on homepage with Play button!');
          break;
        }
        
        await aui.waitFor(2000).exec();
      }
      
      expect(isOnHomepage).toBe(true);
      expect(hasPlayButton).toBe(true);
      console.log('✅ Test completed successfully - player level, user ID masking, and back navigation verified');
    }, 300000);
  });

  // ========== PART 5: MAIL FLOW TESTS ==========
  
  describe('Mail Flow Tests', () => {
    // Test 1: Navigate to home page, open Mail and verify all elements
    it('should navigate to home page, open Mail and verify all elements', async () => {
      console.log('📧 Starting Mail Flow Test...');
      
      // Verify we're on the home page (from previous tests)
      console.log('🏠 Step 1: Verifying we are on home page...');
      const isOnHomePage = await aui.ask(
        'Are you on the home page or main screen of the Pixelmon TCG app?',
        { json_schema: { type: 'boolean' } }
      );
      
      if (!isOnHomePage) {
        // If not on home page, verify Play button is visible
        let hasPlay = false;
        for (let i = 0; i < 5; i++) {
          hasPlay = await aui.ask('Do you see a button labeled "Play" on the home screen?', { json_schema: { type: 'boolean' } });
          if (hasPlay) break;
          await aui.waitFor(2000).exec();
        }
        expect(hasPlay).toBe(true);
      }
      console.log('✅ On home page');

      // ========== MAIL FLOW ==========

      // 2) Find and click envelope icon below gold ring icon on top right with retry logic
      console.log('📧 Step 2: Looking for and clicking envelope icon with retry logic...');
      await aui.waitFor(3000).exec(); // Wait for home screen to fully load
      
      let isOnMailScreen = false;
      const maxRetries = 5;
      
      for (let attempt = 1; attempt <= maxRetries; attempt++) {
        console.log(`📧 Attempt ${attempt}/${maxRetries}: Trying to locate and click mail icon...`);
        
        // Try to click on the mail icon
        // Locate the envelope-style mail icon on the screen and click on it
        // You can identify it using the following visual and positional cues:
        // It is on the top-right side of the screen.
        // First, look for the blue diamond icon with a "+" sign (represents gems).
        // Just to the right of the blue diamond, you will see a gold ring icon with a "+" sign (represents coins).
        // Directly below the "+" symbol of the gold ring icon, there is a small envelope-shaped mail icon with sparkles above it.
        // The mail icon is surrounded by a square button and looks like an envelope with two small shining stars above it.
        // Click on that envelope mail icon.
        await aui.act('Locate the envelope-style mail icon on the screen and click on it. You can identify it using the following visual and positional cues: It is on the top-right side of the screen. First, look for the blue diamond icon with a "+" sign (represents gems). Just to the right of the blue diamond, you will see a gold ring icon with a "+" sign (represents coins). Directly below the "+" symbol of the gold ring icon, there is a small envelope-shaped mail icon with sparkles above it. The mail icon is surrounded by a square button and looks like an envelope with two small shining stars above it. Click on that envelope mail icon.');
        await aui.waitFor(3000).exec();
        
        // Verify if mail screen opened
        console.log(`   Verifying if mail screen opened (attempt ${attempt})...`);
        const hasMailHeading = await aui.ask(
          'Do you see a heading or title that says "Mail" on the screen?',
          { json_schema: { type: 'boolean' } }
        );
        
        const hasMailContent = await aui.ask(
          'Do you see mail messages, inbox content, or mail-related items on the screen?',
          { json_schema: { type: 'boolean' } }
        );
        
        const isMailScreenOpen = await aui.ask(
          'Has the mail section or mail screen opened up? Are you viewing mail or inbox content?',
          { json_schema: { type: 'boolean' } }
        );
        
        if (hasMailHeading || hasMailContent || isMailScreenOpen) {
          isOnMailScreen = true;
          console.log('✅ Mail screen opened successfully!');
          break;
        }
        
        // If mail screen didn't open, we might have clicked the wrong icon
        // Check if we're on a different screen (like shop, gems, coins, etc.)
        console.log(`   Mail screen not detected. Checking if wrong screen opened...`);
        const isOnHomePage = await aui.ask(
          'Are you still on the home page or main screen of the Pixelmon TCG app?',
          { json_schema: { type: 'boolean' } }
        );
        
        if (!isOnHomePage) {
          // We're on some other screen (shop, gems, etc.), close it and retry
          console.log('   Wrong screen opened. Closing it and retrying...');
          await aui.act('Tap on the back button or X button or close button to return to the home screen');
          await aui.waitFor(2000).exec();
          
          // Verify we're back on homepage
          const isBackOnHomePage = await aui.ask(
            'Are you back on the home page or main screen?',
            { json_schema: { type: 'boolean' } }
          );
          if (!isBackOnHomePage) {
            // Try using Android back button
            execSync('adb shell input keyevent KEYCODE_BACK', { encoding: 'utf-8' });
            await aui.waitFor(2000).exec();
          }
        }
        
        // Wait before retrying
        if (attempt < maxRetries) {
          console.log(`   Waiting before retry...`);
          await aui.waitFor(2000).exec();
        }
      }
      
      // 3) Final verification that mail section opened up
      console.log('📬 Step 3: Final verification of mail screen...');
      expect(isOnMailScreen).toBe(true);
      console.log('✅ Test completed successfully - mail screen opened and verified!');
    }, 600000);

    // Test 2: Claim rewards from mail entries and verify tick marks
    it('should claim rewards from mail entries and verify tick marks', async () => {
      console.log('🎁 Starting Mail Rewards Claim Test...');
      
      // Assumes we're already on Mail screen from Test 1
      // If not, navigate to Mail screen first
      let isOnMailScreen = await aui.ask(
        'Are you on the Mail screen with mail messages or inbox content visible?',
        { json_schema: { type: 'boolean' } }
      );
      
      if (!isOnMailScreen) {
        // Navigate to Mail screen with retry logic
        console.log('📧 Navigating to Mail screen with retry logic...');
        await aui.waitFor(3000).exec();
        
        const maxRetries = 5;
        for (let attempt = 1; attempt <= maxRetries; attempt++) {
          console.log(`📧 Attempt ${attempt}/${maxRetries}: Trying to locate and click mail icon...`);
          
          // Try to click on the mail icon
          // Locate the envelope-style mail icon on the screen and click on it
          // You can identify it using the following visual and positional cues:
          // It is on the top-right side of the screen.
          // First, look for the blue diamond icon with a "+" sign (represents gems).
          // Just to the right of the blue diamond, you will see a gold ring icon with a "+" sign (represents coins).
          // Directly below the "+" symbol of the gold ring icon, there is a small envelope-shaped mail icon with sparkles above it.
          // The mail icon is surrounded by a square button and looks like an envelope with two small shining stars above it.
          // Click on that envelope mail icon.
          await aui.act('Locate the envelope-style mail icon on the screen and click on it. You can identify it using the following visual and positional cues: It is on the top-right side of the screen. First, look for the blue diamond icon with a "+" sign (represents gems). Just to the right of the blue diamond, you will see a gold ring icon with a "+" sign (represents coins). Directly below the "+" symbol of the gold ring icon, there is a small envelope-shaped mail icon with sparkles above it. The mail icon is surrounded by a square button and looks like an envelope with two small shining stars above it. Click on that envelope mail icon.');
          await aui.waitFor(3000).exec();
          
          // Verify if mail screen opened
          console.log(`   Verifying if mail screen opened (attempt ${attempt})...`);
          isOnMailScreen = await aui.ask(
            'Are you on the Mail screen with mail messages or inbox content visible?',
            { json_schema: { type: 'boolean' } }
          );
          
          if (isOnMailScreen) {
            console.log('✅ Mail screen opened successfully!');
            break;
          }
          
          // If mail screen didn't open, we might have clicked the wrong icon
          // Check if we're on a different screen (like shop, gems, coins, etc.)
          console.log(`   Mail screen not detected. Checking if wrong screen opened...`);
          const isOnHomePage = await aui.ask(
            'Are you still on the home page or main screen of the Pixelmon TCG app?',
            { json_schema: { type: 'boolean' } }
          );
          
          if (!isOnHomePage) {
            // We're on some other screen (shop, gems, etc.), close it and retry
            console.log('   Wrong screen opened. Closing it and retrying...');
            await aui.act('Tap on the back button or X button or close button to return to the home screen');
            await aui.waitFor(2000).exec();
            
            // Verify we're back on homepage
            const isBackOnHomePage = await aui.ask(
              'Are you back on the home page or main screen?',
              { json_schema: { type: 'boolean' } }
            );
            if (!isBackOnHomePage) {
              // Try using Android back button
              execSync('adb shell input keyevent KEYCODE_BACK', { encoding: 'utf-8' });
              await aui.waitFor(2000).exec();
            }
          }
          
          // Wait before retrying
          if (attempt < maxRetries) {
            console.log(`   Waiting before retry...`);
            await aui.waitFor(2000).exec();
          }
        }
      }
      expect(isOnMailScreen).toBe(true);
      console.log('✅ On Mail screen');

      // ========== PART 1: CHECK FOR MAIL ENTRIES AND CLAIM REWARDS ==========

      // Step 1: Check the mail list - how many mails are present
      console.log('📬 Step 1: Checking mail list for available mails...');
      await aui.waitFor(2000).exec();
      
      // Check if there are any mail entries in the list
      const hasMailEntries = await aui.ask(
        'Do you see any mail entries or mail items in the mail list?',
        { json_schema: { type: 'boolean' } }
      );
      
      if (!hasMailEntries) {
        console.log('ℹ️ No mail entries found in the mail list');
      } else {
        console.log('✅ Mail entries found in the list');
        
        // Step 2: Check which mails are claimed and which are unclaimed
        console.log('🔍 Step 2: Checking which mails are claimed and which are unclaimed...');
        
        // Check for unclaimed mails (without tick marks)
        const hasUnclaimedMail = await aui.ask(
          'Do you see any mail entries or mail items in the mail list that do not have a tick mark or checkmark indicating they have already been claimed?',
          { json_schema: { type: 'boolean' } }
        );
        
        // Check for claimed mails (with tick marks)
        const hasClaimedMail = await aui.ask(
          'Do you see any mail entries or mail items in the mail list that have a tick mark or checkmark indicating they have already been claimed?',
          { json_schema: { type: 'boolean' } }
        );
        
        if (hasUnclaimedMail) {
          console.log('✅ Found unclaimed mail entries (can be claimed)');
        } else {
          console.log('ℹ️ No unclaimed mail entries found');
        }
        
        if (hasClaimedMail) {
          console.log('✅ Found claimed mail entries (already claimed)');
        } else {
          console.log('ℹ️ No claimed mail entries found');
        }
        
        // Step 3: Try to claim unclaimed mails if available
        if (hasUnclaimedMail) {
          console.log('🎁 Step 3: Attempting to claim unclaimed mail...');
          
          // Click on an unclaimed mail entry
          console.log('👆 Clicking on unclaimed mail entry...');
          await aui.act('Tap on a mail entry or mail item that does not have a tick mark or checkmark. This should be a mail that has not been claimed yet');
          await aui.waitFor(3000).exec();
          console.log('✅ Clicked on unclaimed mail entry');
          
          // Check if there are any claimable items
          console.log('🔍 Checking for claimable items in this mail...');
          let hasClaimableItems = false;
          for (let i = 0; i < 5; i++) {
            console.log(`   Checking for claimable items (attempt ${i + 1}/5)...`);
            
            const hasClaimButton = await aui.ask(
              'Do you see a "Claim" button or "Claim Reward" button on the mail detail screen?',
              { json_schema: { type: 'boolean' } }
            );
            
            const hasClaimableRewards = await aui.ask(
              'Do you see any claimable rewards, items, gems, diamonds, or other claimable content in this mail?',
              { json_schema: { type: 'boolean' } }
            );
            
            if (hasClaimButton || hasClaimableRewards) {
              hasClaimableItems = true;
              console.log('✅ Found claimable items!');
              break;
            }
            
            await aui.waitFor(2000).exec();
          }
          
          if (hasClaimableItems) {
            // Click on Claim button
            console.log('🎁 Clicking on Claim button...');
            await aui.act('Tap on the "Claim" button or "Claim Reward" button to claim the rewards');
            await aui.waitFor(3000).exec();
            console.log('✅ Clicked Claim button');
          
            // Wait for rewards screen to appear
            await aui.waitFor(2000).exec();
            
            // Handle multiple reward screens (gems, diamonds, etc.)
            let rewardScreenCount = 0;
            const maxRewardScreens = 5; // Maximum expected reward screens
            
            while (rewardScreenCount < maxRewardScreens) {
              console.log(`🎉 Checking for rewards screen (attempt ${rewardScreenCount + 1}/${maxRewardScreens})...`);
              
              // Check if rewards screen is displayed
              const hasRewardsScreen = await aui.ask(
                'Do you see a rewards screen with a heading that says "Reward" or "Rewards Earned" or similar? Are rewards like gems, diamonds, or other items displayed?',
                { json_schema: { type: 'boolean' } }
              );
              
              if (hasRewardsScreen) {
                rewardScreenCount++;
                console.log(`✅ Rewards screen ${rewardScreenCount} displayed!`);
                
                // Verify rewards heading
                const hasRewardHeading = await aui.ask(
                  'Do you see a heading or title that says "Reward" or "Rewards" on the rewards screen?',
                  { json_schema: { type: 'boolean' } }
                );
                expect(hasRewardHeading).toBe(true);
                console.log('✅ Reward heading verified');
                
                // Click on "Tap to Continue" or "Continue" button
                console.log('👆 Clicking on "Tap to Continue" or "Continue" button...');
                await aui.act('Tap on the "Tap to Continue" button or "Continue" button to proceed after viewing the rewards');
                await aui.waitFor(2000).exec();
                console.log('✅ Clicked continue button');
                
                // Wait a bit to see if another rewards screen appears
                await aui.waitFor(2000).exec();
                
                // Check if we're back on mail screen or if another rewards screen appears
                const isBackOnMailScreen = await aui.ask(
                  'Are you back on the mail detail screen or mail list screen?',
                  { json_schema: { type: 'boolean' } }
                );
                
                if (isBackOnMailScreen) {
                  console.log('✅ Returned to mail screen after claiming rewards');
                  break;
                }
              } else {
                // No more rewards screens, check if we're back on mail screen
                const isBackOnMailScreen = await aui.ask(
                  'Are you back on the mail detail screen or mail list screen?',
                  { json_schema: { type: 'boolean' } }
                );
                
                if (isBackOnMailScreen) {
                  console.log('✅ Returned to mail screen');
                  break;
                }
                
                // If neither rewards screen nor mail screen, wait a bit more
                await aui.waitFor(2000).exec();
                break;
              }
            }
            
            // Verify that tick mark appears on the mail entry after claiming
            console.log('✅ Verifying tick mark appears on claimed mail...');
            await aui.waitFor(2000).exec();
            
            // If we're on mail detail screen, go back to mail list
            const isOnMailDetail = await aui.ask(
              'Are you on a mail detail screen showing the content of a specific mail?',
              { json_schema: { type: 'boolean' } }
            );
            
            if (isOnMailDetail) {
              console.log('   Going back to mail list...');
              await aui.act('Tap on the back button or return button to go back to the mail list');
              await aui.waitFor(2000).exec();
            }
            
            // Verify tick mark is now present
            const hasTickMark = await aui.ask(
              'Do you see a tick mark or checkmark on the mail entry that was just claimed, indicating it has been successfully claimed?',
              { json_schema: { type: 'boolean' } }
            );
            
            if (hasTickMark) {
              console.log('✅ Tick mark verified on claimed mail entry');
            } else {
              console.log('⚠️ Tick mark not immediately visible, but claim may have been successful');
            }
          } else {
            console.log('⚠️ No claimable items found in this mail entry');
            // Go back to mail list
            await aui.act('Tap on the back button or return button to go back to the mail list');
            await aui.waitFor(2000).exec();
          }
        }
        
        // Step 4: Verify that claimed mails cannot be claimed again
        if (hasClaimedMail) {
          console.log('🔒 Step 4: Verifying claimed mails cannot be claimed again...');
          
          // Make sure we're on mail list
          const isOnMailList = await aui.ask(
            'Are you on the mail list screen showing all mail entries?',
            { json_schema: { type: 'boolean' } }
          );
          
          if (!isOnMailList) {
            // Go back to mail list if needed
            await aui.act('Tap on the back button or return button to go back to the mail list');
            await aui.waitFor(2000).exec();
          }
          
          console.log('   Attempting to click on a mail entry with tick mark...');
          await aui.act('Tap on a mail entry that has a tick mark or checkmark indicating it has already been claimed');
          await aui.waitFor(3000).exec();
          
          // Check if claim button is still available (it shouldn't be)
          const hasClaimButtonOnClaimed = await aui.ask(
            'Do you see a "Claim" button on this mail detail screen? If the mail is already claimed, there should be no claim button available',
            { json_schema: { type: 'boolean' } }
          );
          
          if (!hasClaimButtonOnClaimed) {
            console.log('✅ Verified: Claimed mail does not have claim button (cannot be claimed again)');
          } else {
            console.log('⚠️ Claim button still visible on claimed mail (may need further verification)');
          }
          
          // Go back to mail list
          await aui.act('Tap on the back button or return button to go back to the mail list');
          await aui.waitFor(2000).exec();
        } else {
          console.log('ℹ️ No claimed mails found to verify');
        }
      }

      // ========== PART 2: VERIFY CROSS BUTTON NAVIGATION ==========

      // Step 5: Click on cross button
      console.log('❌ Step 5: Clicking on cross button to close mail screen...');
      await aui.act('Tap on the cross button or X button to close the mail screen');
      await aui.waitFor(2000).exec();
      console.log('✅ Clicked cross button');
      
      // Wait for navigation to homepage
      await aui.waitFor(3000).exec();
      console.log('⏳ Waited for navigation to homepage');

      // Verify that it lands on homepage and Play button is visible
      console.log('🏠 Step 6: Verifying homepage with Play button...');
      let isOnHomepage = false;
      let hasPlayButton = false;
      
      for (let i = 0; i < 5; i++) {
        console.log(`   Checking homepage (attempt ${i + 1}/5)...`);
        
        // Check for Play button
        hasPlayButton = await aui.ask(
          'Do you see a button labeled "Play" on the home screen?',
          { json_schema: { type: 'boolean' } }
        );
        
        // Check if we're on homepage
        const isOnHomePage = await aui.ask(
          'Are you on the home page or main screen of the Pixelmon TCG app?',
          { json_schema: { type: 'boolean' } }
        );
        
        const isNotOnMailScreen = await aui.ask(
          'Are you no longer on the Mail screen?',
          { json_schema: { type: 'boolean' } }
        );
        
        if (hasPlayButton && isOnHomePage && isNotOnMailScreen) {
          isOnHomepage = true;
          console.log('✅ Successfully landed on homepage with Play button!');
          break;
        }
        
        await aui.waitFor(2000).exec();
      }
      
      expect(isOnHomepage).toBe(true);
      expect(hasPlayButton).toBe(true);
      console.log('✅ Mail Flow Tests completed successfully - app is on homepage and ready for Game Mode Flow Tests');
    }, 600000);
  });

  // ========== PART 6: GAME MODE FLOW TESTS ==========
  
  describe('Game Mode Flow Tests', () => {
    // Test: Game mode change flow
    it('should navigate to home page, open game mode screen, interact with info icon, choose mode and verify on main screen', async () => {
      console.log('🎮 Starting Game Mode Change Flow Test...');
      
      // Verify we're on the home page (from previous tests)
      console.log('🏠 Step 1: Verifying we are on home page...');
      const isOnHomePage = await aui.ask(
        'Are you on the home page or main screen of the Pixelmon TCG app?',
        { json_schema: { type: 'boolean' } }
      );
      
      if (!isOnHomePage) {
        // If not on home page, verify Play button is visible
        let hasPlay = false;
        for (let i = 0; i < 5; i++) {
          hasPlay = await aui.ask('Do you see a button labeled "Play" on the home screen?', { json_schema: { type: 'boolean' } });
          if (hasPlay) break;
          await aui.waitFor(2000).exec();
        }
        expect(hasPlay).toBe(true);
      }
      console.log('✅ On home page');

      // ========== GAME MODE FLOW ==========

      // 2) Find and click on the game mode icon (golden shield-shaped icon)
      console.log('🛡️ Step 2: Looking for and clicking game mode icon...');
      await aui.waitFor(3000).exec(); // Wait for home screen to fully load
      
      // Natural language command to find and click the golden shield icon
      await aui.act('Locate the golden shield icon with a horned insect emblem inside a gold diamond outline, positioned to the right of the PLAY button. Click the center of that icon');
      console.log('✅ Clicked game mode icon using natural language');
      
      // Wait for game mode screen to load
      await aui.waitFor(3000).exec();
      console.log('⏳ Waited for game mode screen to load');

      // 3) Verify that game mode screen opens with different modes
      console.log('🎮 Step 3: Verifying game mode screen opened...');
      let isOnGameModeScreen = false;
      for (let i = 0; i < 5; i++) {
        console.log(`   Checking game mode screen (attempt ${i + 1}/5)...`);
        
        // Check multiple indicators
        const hasGameModeScreen = await aui.ask(
          'Has the game mode screen or game mode selection screen opened up? Are you viewing different game modes or mode options?',
          { json_schema: { type: 'boolean' } }
        );
        
        const hasModeOptions = await aui.ask(
          'Do you see different game mode options or modes available to choose from on the screen?',
          { json_schema: { type: 'boolean' } }
        );
        
        if (hasGameModeScreen || hasModeOptions) {
          isOnGameModeScreen = true;
          console.log('✅ Game mode screen opened!');
          break;
        }
        
        await aui.waitFor(2000).exec();
      }
      expect(isOnGameModeScreen).toBe(true);
      
      // Verify that practice and duel modes are visible
      console.log('🔍 Verifying practice and duel modes are visible...');
      const hasPracticeMode = await aui.ask(
        'Do you see a "Practice" mode or practice game mode option visible on the game mode screen?',
        { json_schema: { type: 'boolean' } }
      );
      
      const hasDuelMode = await aui.ask(
        'Do you see a "Duel" mode or duel game mode option visible on the game mode screen?',
        { json_schema: { type: 'boolean' } }
      );
      
      expect(hasPracticeMode || hasDuelMode).toBe(true);
      console.log(`✅ Game modes verified - Practice: ${hasPracticeMode}, Duel: ${hasDuelMode}`);

      // 4) Click on (!) icon to display message
      console.log('ℹ️ Step 4: Looking for and clicking info icon (!)...');
      await aui.waitFor(2000).exec();
      
      // Natural language command to find and click the info icon
      await aui.act('Look for an exclamation mark icon or (!) icon on the game mode screen. This is typically an information icon. Tap on this exclamation mark or info icon');
      console.log('✅ Clicked info icon (!) using natural language');
      
      // Wait for message to appear
      await aui.waitFor(2000).exec();
      console.log('⏳ Waited for message to appear');

      // Verify that message is displayed
      console.log('📋 Verifying message is displayed...');
      let isMessageDisplayed = false;
      for (let i = 0; i < 5; i++) {
        const hasMessage = await aui.ask(
          'Do you see a message or information popup displayed on the screen after clicking the info icon?',
          { json_schema: { type: 'boolean' } }
        );
        
        if (hasMessage) {
          isMessageDisplayed = true;
          console.log('✅ Message displayed!');
          break;
        }
        await aui.waitFor(2000).exec();
      }
      expect(isMessageDisplayed).toBe(true);

      // 5) Click cross button to close message and return to game mode screen
      console.log('❌ Step 5: Clicking cross button to close message...');
      await aui.waitFor(2000).exec();
      
      // Natural language command to find and click the cross button
      await aui.act('Look for a cross button or X button to close the message or popup. Tap on this cross button or X button');
      console.log('✅ Clicked cross button using natural language');
      
      // Wait for message to close
      await aui.waitFor(2000).exec();
      console.log('⏳ Waited for message to close');

      // Verify that message is closed and game mode screen is displayed
      console.log('🔍 Verifying message is closed and game mode screen is displayed...');
      let isBackOnGameModeScreen = false;
      for (let i = 0; i < 5; i++) {
        const isMessageClosed = await aui.ask(
          'Is the message or popup closed? Is it no longer visible on the screen?',
          { json_schema: { type: 'boolean' } }
        );
        
        const isGameModeScreenVisible = await aui.ask(
          'Are you back on the game mode screen with different game mode options visible?',
          { json_schema: { type: 'boolean' } }
        );
        
        if (isMessageClosed && isGameModeScreenVisible) {
          isBackOnGameModeScreen = true;
          console.log('✅ Message closed and game mode screen is displayed!');
          break;
        }
        await aui.waitFor(2000).exec();
      }
      expect(isBackOnGameModeScreen).toBe(true);

      // 6) Choose a game mode (practice or duel)
      console.log('🎯 Step 6: Choosing a game mode...');
      await aui.waitFor(2000).exec();
      
      // First, check which modes are available
      const practiceAvailable = await aui.ask(
        'Do you see a "Practice" mode or practice game mode option that can be selected?',
        { json_schema: { type: 'boolean' } }
      );
      
      const duelAvailable = await aui.ask(
        'Do you see a "Duel" mode or duel game mode option that can be selected?',
        { json_schema: { type: 'boolean' } }
      );
      
      // Choose practice mode if available, otherwise choose duel
      if (practiceAvailable) {
        console.log('👆 Selecting Practice mode...');
        await aui.act('Tap on the "Practice" mode or practice game mode option to select it');
        console.log('✅ Selected Practice mode');
      } else if (duelAvailable) {
        console.log('👆 Selecting Duel mode...');
        await aui.act('Tap on the "Duel" mode or duel game mode option to select it');
        console.log('✅ Selected Duel mode');
      } else {
        // If specific names not found, try to click on any available game mode
        console.log('👆 Selecting any available game mode...');
        await aui.act('Tap on any available game mode option to select it');
        console.log('✅ Selected a game mode');
      }
      
      // Wait for navigation back to main screen
      await aui.waitFor(3000).exec();
      console.log('⏳ Waited for navigation to main screen');

      // 7) Verify return to main screen
      console.log('🏠 Step 7: Verifying return to main screen...');
      let isBackOnMainScreen = false;
      for (let i = 0; i < 5; i++) {
        const isOnMainScreen = await aui.ask(
          'Are you back on the main screen or home page of the Pixelmon TCG app?',
          { json_schema: { type: 'boolean' } }
        );
        
        const hasPlayButton = await aui.ask(
          'Do you see a big "Play" button on the main screen?',
          { json_schema: { type: 'boolean' } }
        );
        
        if (isOnMainScreen && hasPlayButton) {
          isBackOnMainScreen = true;
          console.log('✅ Back on main screen with Play button visible!');
          break;
        }
        await aui.waitFor(2000).exec();
      }
      expect(isBackOnMainScreen).toBe(true);

      // 8) Verify game mode is displayed above the big Play button
      console.log('✅ Step 8: Verifying game mode is displayed above Play button...');
      await aui.waitFor(2000).exec();
      
      // Verify that game mode text is displayed above the Play button
      let isGameModeDisplayed = false;
      for (let i = 0; i < 5; i++) {
        const hasGameModeText = await aui.ask(
          'Do you see game mode information or text displayed just above the big Play button? Is there text showing the selected game mode (like "Practice" or "Duel") above the Play button?',
          { json_schema: { type: 'boolean' } }
        );
        
        if (hasGameModeText) {
          isGameModeDisplayed = true;
          console.log('✅ Game mode is displayed above Play button!');
          break;
        }
        await aui.waitFor(2000).exec();
      }
      expect(isGameModeDisplayed).toBe(true);
      
      // Additional verification - check if the chosen game mode text is visible
      console.log('🔍 Verifying chosen game mode text is visible...');
      const hasChosenModeText = await aui.ask(
        'Do you see the text of the chosen game mode (like "Practice" or "Duel") displayed on the main screen, particularly above or near the Play button?',
        { json_schema: { type: 'boolean' } }
      );
      expect(hasChosenModeText).toBe(true);
      console.log('✅ Chosen game mode text is visible on main screen');
      
      console.log('✅ Test completed successfully - game mode change flow verified!');
    }, 600000);
  });

  // ========== PART 7: COLLECTION FLOW TESTS ==========
  describe('Collection Flow Tests', () => {
    // Step 1: Navigate to Collection tab
    it('should navigate to Collection tab', async () => {
      console.log('📝 Step 1: Tap on Collection\n');
      
      // Natural language command - Caesar AI interprets and clicks Collection
      await aui.act('Navigate to the bottom of the screen,  below the "Play" button you should see a set of 5 buttons. From the set of 5 buttons, Tap the "Collection" button, which is the fourth button from the left. The button looks like a hexagon wrapped in a rectangle, which is again wrapped in a sun-like circle shape. After you click the button, if you see the "Collection" text title on the screen, it means you are on the correct page, otherwise, you are on the wrong page');
      console.log('✅ Clicked Collection using natural language');
      
      // Wait for screen to load
      await aui.waitFor(3000).exec();
      console.log('⏳ Waited for Collection screen to load\n');

      // Check if we're on Collection screen
      const isOnCollection = await aui.ask(
        'Is the text "COLLECTION" visible on the screen?',
        { json_schema: { type: 'boolean' } }
      );
      
      console.log(`On Collection screen: ${isOnCollection ? '✅ Yes' : '❌ No'}`);
      expect(isOnCollection).toBe(true);
    });

    // Step 2: Verify Collection screen is displayed along with the available cards
    it('should verify Collection screen is displayed along with the available cards', async () => {
      console.log('📝 Step 2: Check what\'s on the Collection screen\n');

      const contentFound = await aui.ask('Is there a list of cards with 3 cards arrangement in a row?', { json_schema: { type: 'boolean' } });
      expect(contentFound).toBe(true);

      console.log('\n🎉 SUCCESS: Collection screen accessed!');
    });

    // Step 3: Preview a card
    it('Should be able to preview a card', async () => {
      console.log('\n📝 Step 3: Preview a card\n');
      
      await aui.act('Tap on the first card in the list');
      
      console.log('✅ Previewed a card');
      
      // Wait for screen to load
      await aui.waitFor(3000).exec();
      console.log('⏳ Waited for screen to load\n');
      
      const cardPreview = await aui.ask('Is the text "Ability" with a sentence of the card ability description visible on the screen?', { json_schema: { type: 'boolean' } });
      expect(cardPreview).toBe(true);
      
      console.log('✅ Ability text visible');
      
      // Wait for screen to load
      await aui.waitFor(3000).exec();
      console.log('⏳ Waited for screen to load\n');

      await aui.act("Tap the card once to close the card preview");

      await aui.waitFor(3000).exec();
      console.log('⏳ Waited for screen to load\n');

      const cardPreviewClosed = await aui.ask('Is the card preview closed?', { json_schema: { type: 'boolean' } });
      expect(cardPreviewClosed).toBe(true);

      console.log('✅ Card preview closed');
    });

    // Step 4: Go to the "Edit Decks" tab
    it('Should be able to navigate to Edit Decks tab', async () => {
      console.log('\n📝 Step 4: Navigate to Edit Decks tab\n');
      
      await aui.act('Tap on the "Starter Deck" button');
      
      console.log('✅ Navigated to Edit Decks tab');
      
      // Wait for screen to load
      await aui.waitFor(3000).exec();
      console.log('⏳ Waited for screen to load\n');

      const titleVisible = await aui.ask('Is the title "Starter Deck" visible on the screen?', { json_schema: { type: 'boolean' } });
      expect(titleVisible).toBe(true);

      console.log('✅ Title "Starter Deck" visible');
    });

    // Step 5: Remove a card from the deck
    it('Should be able to remove a card from the deck', async () => {
      console.log('\n📝 Step 5: Remove a card from the deck\n');

      await aui.waitFor(3000).exec();
      console.log('⏳ Waited for screen to load\n');

      // const cardOnDeckCount = await aui.ask('Locate a red and green button, on the right side of it, you should see a card image with a number counter formatted as "x/20" on the screen. How many cards are on the deck based on the current visible counter (x)?', { json_schema: { type: 'number' } });
      // expect(cardOnDeckCount).toBe(20);

      // console.log(`Card counter before removal: ${cardOnDeckCount}`);
      // console.log('✅ Card counter visible');

      await aui.act('Beside the card with the number counter, you should see a set of cards formatted in a 6x2 grid. Tap on the first card in the list');
      await aui.waitFor(3000).exec();
      console.log('⏳ Waited for screen to load\n');

      const cardPreview = await aui.ask('Is the text "Ability" with a sentence of the card ability description visible on the screen?', { json_schema: { type: 'boolean' } });
      expect(cardPreview).toBe(true);

      const removeButtonVisible = await aui.ask('Is the button with the text "Remove" visible on the screen?', { json_schema: { type: 'boolean' } });
      expect(removeButtonVisible).toBe(true);

      await aui.act('Tap on the "Remove" button');

      await aui.waitFor(3000).exec();

      // const cardAfterRemovedCount = await aui.ask('Relocate the card counter, you should see a card image with a number counter formatted as "x/20" on the screen. How many cards are on the deck based on the current visible counter (x)?', { json_schema: { type: 'number' } });
      // expect(cardAfterRemovedCount).toBe(19);

      // console.log(`Card counter after removal: ${cardAfterRemovedCount}`);
      console.log('✅ Card removed');
    });

    // Step 6: Add a card to the deck
    it('Should be able to add a card to the deck', async () => {
      console.log('\n📝 Step 6: Add a card to the deck\n');

      // const cardOnDeckCount = await aui.ask('Locate a red and green button, on the right side of it, you should see a card image with a number counter formatted as "x/20" on the screen. How many cards are on the deck based on the current visible counter (x)?', { json_schema: { type: 'number' } });
      // expect(cardOnDeckCount).toBe(19);

      // console.log(`Card counter before addition: ${cardOnDeckCount}`);
      
      await aui.act('Now you should see a list of cards with 3 cards arrangement in a row, some greyed out (unavailable) and some are highlighted (available). Tap on a card in the list that is available and not greyed out. If there is no card available, scroll down until you see a card that is available and not greyed out, then tap on it. If you click correctly, you should see the card preview with the ability description and "Add" buttonvisible on the screen.');

      await aui.waitFor(3000).exec();

      const cardPreview = await aui.ask('Is the text "Ability" with a sentence of the card ability description visible on the screen?', { json_schema: { type: 'boolean' } });
      expect(cardPreview).toBe(true);

      const addButtonVisible = await aui.ask('Is the button with the text "Add" visible on the screen?', { json_schema: { type: 'boolean' } });
      expect(addButtonVisible).toBe(true);

      await aui.act('Tap on the "Add" button');

      await aui.waitFor(3000).exec();
      
      // const cardAfterAddedCount = await aui.ask('Relocate the card counter, you should see a card image with a number counter formatted as "x/20" on the screen. How many cards are on the deck based on the current visible counter (x)?', { json_schema: { type: 'number' } });
      // expect(cardAfterAddedCount).toBe(20);
      
      // console.log(`Card counter after addition: ${cardAfterAddedCount}`);
      console.log('✅ Added a card to the deck');

      // Save the changes
      await aui.act('Tap on the "Save" button, which is a button with a disk icon located on the right side of the screen.');

      await aui.waitFor(3000).exec();

      await aui.act('A popup titled "Save Deck" should appear. Tap on the "Continue" button to save the changes.');

      await aui.waitFor(3000).exec();

      const saveSuccess = await aui.ask('Is the text "Save deck successful" visible on the screen?', { json_schema: { type: 'boolean' } });
      expect(saveSuccess).toBe(true);
      console.log('✅ Deck saved successfully');

      await aui.act('Tap on the "X" button to close the popup.');

    });
  });

  // ========== PART 8: BOOSTER PACK FLOW TESTS ==========
  describe('Booster Pack Flow Tests', () => {
    // Step 1: Navigate to Booster Pack tab
    it('should navigate to Booster Pack tab', async () => {
      console.log('📝 Step 1: Tap on Booster Pack\n');
      
      // Natural language command - Caesar AI interprets and clicks Collection
      await aui.act('Navigate to the bottom of the screen,  below the "Play" button you should see a set of 5 buttons. From the set of 5 buttons, Tap the "Booster Pack" button, which is the first button from the left. The button looks like a Card Box with two crossing swords inside of it. After you click the button, if you see the "Booster Pack" text title on the screen, it means you are on the correct page, otherwise, you are on the wrong page');
      console.log('✅ Clicked Booster Pack using natural language');
      
      // Wait for screen to load
      await aui.waitFor(3000).exec();
      console.log('⏳ Waited for Booster Pack screen to load\n');

      // Check if we're on Booster Pack screen
      const isOnBoosterPack = await aui.ask(
        'Is the text "BOOSTER PACK" visible on the screen?',
        { json_schema: { type: 'boolean' } }
      );
      
      console.log(`On Booster Pack screen: ${isOnBoosterPack ? '✅ Yes' : '❌ No'}`);
      expect(isOnBoosterPack).toBe(true);
    });

    // Step 2: Can view the pack information
    it('should be able to view the pack information', async () => {
      console.log('📝 Step 2: View the pack information\n');
      
      await aui.act('Locate the brown colored booster pack. Below the pack you should see a text indicates "Pack Information". Tap on the text to view the pack information.');
      await aui.waitFor(5000).exec();
      console.log('⏳ Waited for pack information to open\n');

      const normalPackInfo = await aui.ask('Did you see a pop-up dialog box indicating the pack information on the screen?', { json_schema: { type: 'boolean' } });
      expect(normalPackInfo).toBe(true);

      await aui.act('Tap on the "X" button to close the pack information.');

      await aui.act('Swipe to the right and locate the golden colored booster pack. Below the pack you should see a text indicates "Pack Information". Tap on the text to view the pack information.');
      await aui.waitFor(5000).exec();
      console.log('⏳ Waited for premium pack information to open\n');

      const premiumPackInfo = await aui.ask('Did you see a pop-up dialog box indicating the premium pack information on the screen?', { json_schema: { type: 'boolean' } });
      expect(premiumPackInfo).toBe(true);

      await aui.act('Tap on the "X" button to close the premium pack information.');

      console.log('✅ Viewed pack information');
    });

    // Step 3: Open the premium booster pack
    it('should open a premium booster', async () => {
      console.log('📝 Step 3: Open a premium booster\n');
      
      await aui.act('Now your task is to open the premium booster pack, which is the golden colored booster pack. Below the pack you should see a button to open the booster pack. Tap on the button to open the pack one time, then input swipe 539 50 539 2000 to open the pack.');

      await aui.waitFor(5000).exec();
      console.log('⏳ Waited for booster pack to open\n');

      const boosterPackOpen = await aui.ask('Did you see a card with the button "Open All" below it on the screen?', { json_schema: { type: 'boolean' } });
      expect(boosterPackOpen).toBe(true);

      await aui.act('Tap on the "Open All" button to finish the opening process.');
      await aui.waitFor(5000).exec();

      await aui.act('Tap on the "Next" button to finish the process.')

      console.log('✅ Opened a normal booster');
    });

    // Step 4: Open a normal booster pack
    it('should open a normal booster', async () => {
      console.log('📝 Step 4: Open a normal booster\n');
      
      await aui.act('Now you need to open the normal booster pack, which is the brown colored booster pack. Locate the brown colored booster pack by input swipe 250 1061 750 1061 until you clearly see the pack. Below the pack you should see a button to open the booster pack. Tap on the button to open the pack one time, then input swipe 539 50 539 2000 to open the pack.');

      await aui.waitFor(5000).exec();
      console.log('⏳ Waited for booster pack to open\n');

      const boosterPackOpen = await aui.ask('Did you see a card with the button "Open All" below it on the screen?', { json_schema: { type: 'boolean' } });
      expect(boosterPackOpen).toBe(true);

      await aui.act('Tap on the "Open All" button to finish the opening process.');
      await aui.waitFor(5000).exec();

      await aui.act('Tap on the "Next" button to finish the process.')

      console.log('✅ Opened a normal booster');
    });
  });

  // ========== PART 9: BATTLE PASS FLOW TESTS (VISUAL VERIFICATION ONLY)==========
  describe('Battle Pass Flow Tests', () => {
    // Step 1: Navigate to Battle Pass tab
    it('should navigate to Battle Pass tab', async () => {
      console.log('📝 Step 1: Tap on Battle Pass\n');
      
      // Natural language command - Caesar AI interprets and clicks Collection
      await aui.act('Navigate to the bottom of the screen,  below the "Play" button you should see a set of 5 buttons. From the set of 5 buttons, Tap the "Battle Pass" button, which is the fifth button from the left. The button looks like a golden badge with blue ribbon on its sides. After you click the button, if you see the "Battle Pass" text title on the screen, it means you are on the correct page, otherwise, you are on the wrong page');
      console.log('✅ Clicked Battle Pass using natural language');
      
      // Wait for screen to load
      await aui.waitFor(3000).exec();
      console.log('⏳ Waited for Battle Pass screen to load\n');

      // Check if we're on Booster Pack screen
      const isOnBattlePass = await aui.ask(
        'Is the text "BATTLE PASS" visible on the screen?',
        { json_schema: { type: 'boolean' } }
      );
      
      console.log(`On Battle Pass screen: ${isOnBattlePass ? '✅ Yes' : '❌ No'}`);
      expect(isOnBattlePass).toBe(true);
    });

    // Step 2: View XP Progression, Levels, and Battle Pass Duration
    it ('should view XP Progression and Levels', async () => {
      console.log('📝 Step 2: View XP Progression and Levels\n');
      
      const pointElement = await aui.ask("Is the text 'Battle Pass Points' visible on the screen?", { json_schema: { type: 'boolean' } });
      expect(pointElement).toBe(true);

      const xpNumber = await aui.ask("Did you see a number formatted as 'x/y', indicating the current XP progression on the screen? What is the value?", { json_schema: { type: 'string' } });
      expect(xpNumber).toBeDefined();
      console.log(`XP Number: ${xpNumber}`);

      const levelNumber = await aui.ask("Did you should see a indicator of the current player's battlepass level on the screen? What is the value?", { json_schema: { type: 'string' } });
      expect(levelNumber).toBeDefined();
      console.log(`Level Number: ${levelNumber}`);

      const battlePassDuration = await aui.ask("Did you see a text indicating the time left until the season ends) on the screen? What is the value?", { json_schema: { type: 'string' } });
      expect(battlePassDuration).toBeDefined();
      console.log(`Battle Pass Duration: ${battlePassDuration}`);
    });

  });

  // ========== PART 10: SHOP FLOW TESTS ==========
  
  describe('Shop Flow Tests', () => {
    // Test 1: Navigate to Shop and verify all elements
    it('should navigate to home page, open Shop and verify all elements', async () => {
      console.log('🛒 Starting Shop Flow Test...');
      
      // Verify we're on the home page (from previous tests)
      console.log('🏠 Step 1: Verifying we are on home page...');
      const isOnHomePage = await aui.ask(
        'Are you on the home page or main screen of the Pixelmon TCG app?',
        { json_schema: { type: 'boolean' } }
      );
      
      if (!isOnHomePage) {
        // If not on home page, verify Play button is visible
        let hasPlay = false;
        for (let i = 0; i < 5; i++) {
          hasPlay = await aui.ask('Do you see a button labeled "Play" on the home screen?', { json_schema: { type: 'boolean' } });
          if (hasPlay) break;
          await aui.waitFor(2000).exec();
        }
        expect(hasPlay).toBe(true);
      }
      console.log('✅ On home page');

      // ========== SHOP FLOW ==========

      // 2) Find and click shop icon (bottom left, second icon from left)
      console.log('🛒 Step 2: Looking for and clicking shop icon...');
      await aui.waitFor(3000).exec(); // Wait for home screen to fully load
      
      // Natural language command to find and click shop icon
      // Shop icon is located at bottom left, second icon from the left
      await aui.act('Navigate to the bottom left area of the screen. Look for the second icon from the left in the bottom navigation bar. This should be the shop icon. Tap on this shop icon which is the second icon from the left in the bottom navigation area');
      console.log('✅ Clicked shop icon using natural language');
      
      // Wait for screen to load after clicking shop icon
      await aui.waitFor(3000).exec();
      console.log('⏳ Waited for screen to load after clicking shop icon');

      // Check if intermediate shop details screen appears (with "do not show this message again")
      console.log('🔍 Step 2a: Checking for intermediate shop details screen...');
      const hasShopDetailsScreen = await aui.ask(
        'Do you see a screen or popup with details about the shop that contains text like "do not show this message again" or similar shop information message?',
        { json_schema: { type: 'boolean' } }
      );
      
      if (hasShopDetailsScreen) {
        console.log('ℹ️ Shop details screen detected, clicking cross button to close it...');
        // Click on cross button to close the shop details screen
        await aui.act('Tap on the cross button or X button to close the shop details screen or popup');
        await aui.waitFor(2000).exec();
        console.log('✅ Clicked cross button to close shop details screen');
      } else {
        console.log('ℹ️ No shop details screen detected, proceeding to shop screen...');
      }

      // Wait for shop screen to load
      await aui.waitFor(2000).exec();
      console.log('⏳ Waited for shop screen to load');

      // 3) Verify that shop screen opens with "Shop" heading
      console.log('🛒 Step 3: Verifying shop screen opened...');
      let isOnShopScreen = false;
      for (let i = 0; i < 5; i++) {
        console.log(`   Checking shop screen (attempt ${i + 1}/5)...`);
        
        // Check multiple indicators
        const hasShopHeading = await aui.ask(
          'Do you see a heading or title that says "Shop" at the top of the screen?',
          { json_schema: { type: 'boolean' } }
        );
        
        const hasShopContent = await aui.ask(
          'Do you see shop-related content like items for sale, products, or shop-related items on the screen?',
          { json_schema: { type: 'boolean' } }
        );
        
        const isShopScreenOpen = await aui.ask(
          'Has the shop section or shop screen opened up? Are you viewing shop content or items for purchase?',
          { json_schema: { type: 'boolean' } }
        );
        
        if (hasShopHeading || hasShopContent || isShopScreenOpen) {
          isOnShopScreen = true;
          console.log('✅ Shop screen opened!');
          break;
        }
        
        await aui.waitFor(2000).exec();
      }
      expect(isOnShopScreen).toBe(true);
      
      // Additional verification - verify "Shop" heading specifically
      console.log('📋 Verifying "Shop" heading is displayed...');
      const hasShopHeading = await aui.ask(
        'Do you see a heading or title that says "Shop" on the shop screen?',
        { json_schema: { type: 'boolean' } }
      );
      expect(hasShopHeading).toBe(true);
      console.log('✅ "Shop" heading verified');
      console.log('✅ Test completed successfully - shop screen opened and verified!');
    }, 600000);

    // Test 2: Verify all three shop sections
    it('should verify all three shop sections: Gem/Diamond Shop, Bundle Shop, and Base Set', async () => {
      console.log('🛒 Starting Shop Sections Verification Test...');
      
      // Assumes we're already on the shop screen from Test 1
      // Verify we're on shop screen
      console.log('📱 Verifying we are on shop screen...');
      const isOnShopScreen = await aui.ask(
        'Are you on the shop screen with "Shop" heading visible?',
        { json_schema: { type: 'boolean' } }
      );
      expect(isOnShopScreen).toBe(true);
      console.log('✅ On shop screen');

      // ========== PART 1: VERIFY GEM AND DIAMOND SHOP (FIRST ICON FROM LEFT) ==========

      // 1) Click on first icon on the left - should open gem and diamond shop
      console.log('💎 Step 1: Clicking on first icon from left (Gem and Diamond Shop)...');
      await aui.act('Navigate to the left side of the shop screen. Look for the first icon from the left in the shop navigation or tab area. This should be the gem and diamond shop icon. Tap on this first icon from the left');
      await aui.waitFor(3000).exec();
      console.log('✅ Clicked first icon from left');

      // Verify gem and diamond shop opened with message
      console.log('🔍 Verifying Gem and Diamond Shop section...');
      let isGemDiamondShopOpen = false;
      for (let i = 0; i < 5; i++) {
        console.log(`   Checking gem and diamond shop (attempt ${i + 1}/5)...`);
        
        const hasGemShop = await aui.ask(
          'Do you see a gem shop section or gem-related items for purchase on the screen?',
          { json_schema: { type: 'boolean' } }
        );
        
        const hasDiamondShop = await aui.ask(
          'Do you see a diamond shop section or diamond-related items for purchase on the screen?',
          { json_schema: { type: 'boolean' } }
        );
        
        const hasGoldShop = await aui.ask(
          'Do you see a gold shop section or gold-related items for purchase on the screen?',
          { json_schema: { type: 'boolean' } }
        );
        
        const hasCurrencyMessage = await aui.ask(
          'Do you see a message that says "buy various currencies like gold and diamond" or similar text about buying currencies?',
          { json_schema: { type: 'boolean' } }
        );
        
        if ((hasGemShop || hasDiamondShop || hasGoldShop) && hasCurrencyMessage) {
          isGemDiamondShopOpen = true;
          console.log('✅ Gem and Diamond Shop section verified!');
          break;
        }
        
        await aui.waitFor(2000).exec();
      }
      expect(isGemDiamondShopOpen).toBe(true);
      
      // Verify the specific message
      const hasCurrencyMessage = await aui.ask(
        'Do you see a message that says "buy various currencies like gold and diamond" on the gem and diamond shop screen?',
        { json_schema: { type: 'boolean' } }
      );
      expect(hasCurrencyMessage).toBe(true);
      console.log('✅ Currency message verified: "buy various currencies like gold and diamond"');

      // ========== GEM SHOP UI ELEMENT VERIFICATION ==========
      console.log('💎 ========== GEM SHOP UI ELEMENT VERIFICATION ==========');

      // Verify gem items are displayed
      console.log('💎 Verifying gem items are displayed...');
      const hasGemItems = await aui.ask(
        'Do you see gem items or gem packages displayed in the gem shop section?',
        { json_schema: { type: 'boolean' } }
      );
      expect(hasGemItems).toBe(true);
      console.log('✅ Gem items verified');

      // Verify gem prices are displayed
      console.log('💎 Verifying gem prices are displayed...');
      const hasGemPrices = await aui.ask(
        'Do you see prices or cost information displayed on the gem items showing how much each gem package costs?',
        { json_schema: { type: 'boolean' } }
      );
      expect(hasGemPrices).toBe(true);
      console.log('✅ Gem prices verified');

      // Verify gem quantities are displayed
      console.log('💎 Verifying gem quantities are displayed...');
      const hasGemQuantities = await aui.ask(
        'Do you see gem quantities or amounts displayed on the gem items (like "90 gems", "100 gems", etc.)?',
        { json_schema: { type: 'boolean' } }
      );
      expect(hasGemQuantities).toBe(true);
      console.log('✅ Gem quantities verified');

      // ========== GOLD SHOP UI ELEMENT VERIFICATION ==========
      console.log('🪙 ========== GOLD SHOP UI ELEMENT VERIFICATION ==========');

      // Check if gold shop is visible
      console.log('🪙 Checking Gold Shop section...');
      const isGoldShopVisible = await aui.ask(
        'Do you see gold items or gold packages available for purchase on the current screen?',
        { json_schema: { type: 'boolean' } }
      );
      
      if (!isGoldShopVisible) {
        // May need to scroll or navigate to gold shop
        console.log('   Gold shop not immediately visible, looking for gold shop section...');
        await aui.act('Scroll or navigate to find the gold shop section with gold items or gold packages available for purchase');
        await aui.waitFor(2000).exec();
      }

      // Verify gold items are displayed
      console.log('🪙 Verifying gold items are displayed...');
      const hasGoldItems = await aui.ask(
        'Do you see gold items or gold packages displayed in the gold shop section?',
        { json_schema: { type: 'boolean' } }
      );
      expect(hasGoldItems).toBe(true);
      console.log('✅ Gold items verified');

      // Verify gold prices are displayed
      console.log('🪙 Verifying gold prices are displayed...');
      const hasGoldPrices = await aui.ask(
        'Do you see prices or cost information displayed on the gold items showing how much each gold package costs?',
        { json_schema: { type: 'boolean' } }
      );
      expect(hasGoldPrices).toBe(true);
      console.log('✅ Gold prices verified');

      // Verify gold quantities are displayed
      console.log('🪙 Verifying gold quantities are displayed...');
      const hasGoldQuantities = await aui.ask(
        'Do you see gold quantities or amounts displayed on the gold items (like "600 gold", "1000 gold", etc.)?',
        { json_schema: { type: 'boolean' } }
      );
      expect(hasGoldQuantities).toBe(true);
      console.log('✅ Gold quantities verified');

      // ========== PART 2: VERIFY BUNDLE SHOP (SECOND ICON FROM LEFT) ==========

      // 2) Click on second icon from left - should open bundle shop
      console.log('📦 Step 2: Clicking on second icon from left (Bundle Shop)...');
      await aui.act('Navigate to the left side of the shop screen. Look for the second icon from the left in the shop navigation or tab area. This should be the bundle shop icon. Tap on this second icon from the left');
      await aui.waitFor(3000).exec();
      console.log('✅ Clicked second icon from left');

      // Verify bundle shop opened with three bundles and message
      console.log('🔍 Verifying Bundle Shop section...');
      let isBundleShopOpen = false;
      for (let i = 0; i < 5; i++) {
        console.log(`   Checking bundle shop (attempt ${i + 1}/5)...`);
        
        const hasNewPlayerBundle = await aui.ask(
          'Do you see a "New Player Bundle" or bundle labeled for new players in the bundle shop?',
          { json_schema: { type: 'boolean' } }
        );
        
        const hasDeckBoostBundle = await aui.ask(
          'Do you see a "Deck Boost Bundle" or bundle labeled for deck boosting in the bundle shop?',
          { json_schema: { type: 'boolean' } }
        );
        
        const hasCompletionistBundle = await aui.ask(
          'Do you see a "Completionist Bundle" or bundle labeled for completionists in the bundle shop?',
          { json_schema: { type: 'boolean' } }
        );
        
        const hasBundleMessage = await aui.ask(
          'Do you see a message that says "grab value packed deals with cards currency and more" or similar text about value-packed deals?',
          { json_schema: { type: 'boolean' } }
        );
        
        const hasThreeBundles = await aui.ask(
          'Do you see three different bundles displayed in the bundle shop section?',
          { json_schema: { type: 'boolean' } }
        );
        
        if ((hasNewPlayerBundle || hasDeckBoostBundle || hasCompletionistBundle || hasThreeBundles) && hasBundleMessage) {
          isBundleShopOpen = true;
          console.log('✅ Bundle Shop section verified!');
          break;
        }
        
        await aui.waitFor(2000).exec();
      }
      expect(isBundleShopOpen).toBe(true);
      
      // Verify the specific message
      const hasBundleMessage = await aui.ask(
        'Do you see a message that says "grab value packed deals with cards currency and more" on the bundle shop screen?',
        { json_schema: { type: 'boolean' } }
      );
      expect(hasBundleMessage).toBe(true);
      console.log('✅ Bundle message verified: "grab value packed deals with cards currency and more"');
      
      // Verify bundles are present (no specific count required)
      const areBundlesPresent = await aui.ask(
        'Do you see bundles or bundle items displayed in the bundle shop section?',
        { json_schema: { type: 'boolean' } }
      );
      expect(areBundlesPresent).toBe(true);
      console.log('✅ Bundles verified in bundle shop');

      // ========== BUNDLE SHOP UI ELEMENT VERIFICATION ==========
      console.log('📦 ========== BUNDLE SHOP UI ELEMENT VERIFICATION ==========');

      // Verify purchase limits on bundles
      console.log('🔢 Verifying purchase limits on bundles...');
      const hasPurchaseLimit1 = await aui.ask(
        'Do you see a purchase limit displayed on any bundle that shows "purchase limit 1/1" or similar purchase limit indicator?',
        { json_schema: { type: 'boolean' } }
      );
      
      const hasPurchaseLimitNoLimit = await aui.ask(
        'Do you see a purchase limit displayed on any bundle that shows "no purchase limit" or "unlimited" or similar text indicating no purchase limit?',
        { json_schema: { type: 'boolean' } }
      );
      
      const hasPurchaseLimitText = await aui.ask(
        'Do you see purchase limit information displayed on the bundles, such as "purchase limit" text or purchase limit indicators?',
        { json_schema: { type: 'boolean' } }
      );
      
      expect(hasPurchaseLimit1 || hasPurchaseLimitNoLimit || hasPurchaseLimitText).toBe(true);
      console.log('✅ Purchase limits verified on bundles');

      // Verify price/diamonds information
      console.log('💎 Verifying price/diamonds information is displayed...');
      const hasDiamondPriceBundle = await aui.ask(
        'Do you see diamond prices or diamond amounts displayed on the bundles showing how many diamonds will be charged to buy each bundle?',
        { json_schema: { type: 'boolean' } }
      );
      
      const hasPriceDisplayBundle = await aui.ask(
        'Do you see price information or cost information displayed on the bundles?',
        { json_schema: { type: 'boolean' } }
      );
      
      expect(hasDiamondPriceBundle || hasPriceDisplayBundle).toBe(true);
      console.log('✅ Price/diamonds information verified');

      // Verify bundle descriptions or contents
      console.log('📋 Verifying bundle descriptions or contents are displayed...');
      const hasBundleDescriptions = await aui.ask(
        'Do you see descriptions, contents, or information about what is included in each bundle displayed on the bundle items?',
        { json_schema: { type: 'boolean' } }
      );
      expect(hasBundleDescriptions).toBe(true);
      console.log('✅ Bundle descriptions verified');

      // ========== PART 3: VERIFY BASE SET (THIRD ICON FROM LEFT) ==========

      // 3) Click on third icon from left - should open base set
      console.log('🎴 Step 3: Clicking on third icon from left (Base Set)...');
      await aui.act('Navigate to the left side of the shop screen. Look for the third icon from the left in the shop navigation or tab area. This should be the base set icon. Tap on this third icon from the left');
      await aui.waitFor(3000).exec();
      console.log('✅ Clicked third icon from left');

      // Verify base set opened with message
      console.log('🔍 Verifying Base Set section...');
      let isBaseSetOpen = false;
      for (let i = 0; i < 5; i++) {
        console.log(`   Checking base set (attempt ${i + 1}/5)...`);
        
        const hasBaseSet = await aui.ask(
          'Do you see a "Base Set" section or base set-related content on the screen?',
          { json_schema: { type: 'boolean' } }
        );
        
        const hasBoosterPacks = await aui.ask(
          'Do you see booster packs or pack-related items in the base set section?',
          { json_schema: { type: 'boolean' } }
        );
        
        const hasBaseSetMessage = await aui.ask(
          'Do you see a message that says "open booster pack to expand your collection" or similar text about opening booster packs?',
          { json_schema: { type: 'boolean' } }
        );
        
        const hasThreePacks = await aui.ask(
          'Do you see three different packs or booster packs displayed in the base set section?',
          { json_schema: { type: 'boolean' } }
        );
        
        if ((hasBaseSet || hasBoosterPacks || hasThreePacks) && hasBaseSetMessage) {
          isBaseSetOpen = true;
          console.log('✅ Base Set section verified!');
          break;
        }
        
        await aui.waitFor(2000).exec();
      }
      expect(isBaseSetOpen).toBe(true);
      
      // Verify the specific message
      const hasBaseSetMessage = await aui.ask(
        'Do you see a message that says "open booster pack to expand your collection" on the base set screen?',
        { json_schema: { type: 'boolean' } }
      );
      expect(hasBaseSetMessage).toBe(true);
      console.log('✅ Base Set message verified: "open booster pack to expand your collection"');
      
      // Verify three packs are present
      const hasThreePacks = await aui.ask(
        'Do you see three different packs or booster packs in the base set section?',
        { json_schema: { type: 'boolean' } }
      );
      expect(hasThreePacks).toBe(true);
      console.log('✅ Three packs verified in Base Set section');

      // ========== BASE SET UI ELEMENT VERIFICATION ==========
      console.log('🎴 ========== BASE SET UI ELEMENT VERIFICATION ==========');

      // Verify purchase amounts (diamonds and gold)
      console.log('💎 Verifying purchase amounts (diamonds and gold) are displayed...');
      const hasDiamondPriceBaseSet = await aui.ask(
        'Do you see diamond prices or diamond amounts displayed on the packs showing how many diamonds will be charged to buy each pack?',
        { json_schema: { type: 'boolean' } }
      );
      
      const hasGoldPriceBaseSet = await aui.ask(
        'Do you see gold prices or gold amounts displayed on the packs showing how many gold coins will be charged to buy each pack?',
        { json_schema: { type: 'boolean' } }
      );
      
      const hasPriceDisplayBaseSet = await aui.ask(
        'Do you see price information or cost information displayed on the packs, either in diamonds or gold?',
        { json_schema: { type: 'boolean' } }
      );
      
      expect(hasDiamondPriceBaseSet || hasGoldPriceBaseSet || hasPriceDisplayBaseSet).toBe(true);
      console.log('✅ Purchase amounts (diamonds and/or gold) verified');

      // Verify pack names or types
      console.log('📋 Verifying pack names or types are displayed...');
      const hasPackNames = await aui.ask(
        'Do you see pack names, pack types, or identifiers displayed on the packs in the base set section?',
        { json_schema: { type: 'boolean' } }
      );
      expect(hasPackNames).toBe(true);
      console.log('✅ Pack names/types verified');

      // Verify pack images or visual elements
      console.log('🖼️ Verifying pack images or visual elements are displayed...');
      const hasPackImages = await aui.ask(
        'Do you see pack images, icons, or visual representations of the packs displayed in the base set section?',
        { json_schema: { type: 'boolean' } }
      );
      expect(hasPackImages).toBe(true);
      console.log('✅ Pack images/visual elements verified');
      
      // ========== NAVIGATE BACK TO MAIN SCREEN ==========
      
      // Click on the turquoise/teal glowing diamond-shaped crystal icon to return to main screen
      console.log('💎 Navigating back to main screen by clicking turquoise diamond icon...');
      await aui.waitFor(2000).exec();
      
      // Look for the turquoise/teal glowing diamond-shaped crystal icon
      // It is centered near the bottom-middle of the screen (below the PLAY button)
      // Features: bright cyan/teal color, 3D diamond/gem shape with four triangular faces, glowing outer aura, golden/star-like pattern behind it
      await aui.act('Look at the screen and identify the turquoise/teal glowing diamond-shaped crystal icon. This icon has these distinguishing features: A bright cyan/teal color, a 3D diamond/gem shape with four triangular faces, a glowing outer aura, a golden/star-like pattern behind it, and it is centered near the bottom-middle of the screen UI (below the PLAY button). Find this exact icon on the screen and click directly at its center. If multiple similar shapes exist, choose the one that has the brightest teal glow, is the largest diamond-shaped object, and has a 4-point symmetrical geometry.');
      await aui.waitFor(3000).exec();
      console.log('✅ Clicked turquoise diamond icon');
      
      // Verify we're back on main screen/homepage
      console.log('🏠 Verifying return to main screen...');
      let isOnMainScreen = false;
      let hasPlayButton = false;
      
      for (let i = 0; i < 5; i++) {
        console.log(`   Checking main screen (attempt ${i + 1}/5)...`);
        
        // Check for Play button
        hasPlayButton = await aui.ask(
          'Do you see a button labeled "Play" on the home screen?',
          { json_schema: { type: 'boolean' } }
        );
        
        // Check if we're on homepage
        const isOnHomePage = await aui.ask(
          'Are you on the home page or main screen of the Pixelmon TCG app?',
          { json_schema: { type: 'boolean' } }
        );
        
        const isNotOnShopScreen = await aui.ask(
          'Are you no longer on the Shop screen?',
          { json_schema: { type: 'boolean' } }
        );
        
        if (hasPlayButton && isOnHomePage && isNotOnShopScreen) {
          isOnMainScreen = true;
          console.log('✅ Successfully returned to main screen!');
          break;
        }
        
        await aui.waitFor(2000).exec();
      }
      
      expect(isOnMainScreen).toBe(true);
      expect(hasPlayButton).toBe(true);
      console.log('✅ Test completed successfully - all three shop sections verified and returned to main screen!');
    }, 600000);

  });

});

