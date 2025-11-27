import 'dotenv/config';
import { aui } from '../helpers/askui-helper';
import { execSync } from 'child_process';

/**
 * PIXELMON-OPTIONS: Natural language flow for testing Options screen
 * Steps:
 * 1) Launch the app
 * 2) Once the screen loads, click on Options
 * 3) Verify that options screen opens up and "Options" is available
 * 4) Verify that audio section is available
 * 5) Verify that options screen has:
 *    - Terms of Service
 *    - Privacy Policy
 *    - Customer Service
 *    - Report a Bug
 * 6) Click on return/back button to go back
 */

describe('Pixelmon TCG - Options Flow - Natural Language', () => {
  beforeAll(async () => {
    // Launch the app via ADB
    try {
      execSync('adb shell monkey -p com.PixelPalsStudio.PixelmonTCG -c android.intent.category.LAUNCHER 1', { encoding: 'utf-8' });
    } catch {}
    await aui.waitFor(8000).exec();
  });

  it('should navigate to Options screen and verify all required elements', async () => {
    // 1) Launch the app – verify visible, relaunch if needed
    let isVisible = await aui.ask(
      'Is the Pixelmon TCG app currently open and visible (not the Android home screen)?',
      { json_schema: { type: 'boolean' } }
    );
    if (!isVisible) {
      try {
        execSync('adb shell monkey -p com.PixelPalsStudio.PixelmonTCG -c android.intent.category.LAUNCHER 1', { encoding: 'utf-8' });
      } catch {}
      await aui.waitFor(8000).exec();
      isVisible = await aui.ask(
        'Is the Pixelmon TCG app currently open and visible (not the Android home screen)?',
        { json_schema: { type: 'boolean' } }
      );
    }
    expect(isVisible).toBe(true);

    // 2) Once the screen loads, click on Options
    // Wait for screen to fully load
    await aui.waitFor(3000).exec();
    
    // Click on Options button
    await aui.act('Tap on the Options button');
    await aui.waitFor(2500).exec();

    // 3) Verify that options screen opens up and "Options" is available
    const hasOptionsTitle = await aui.ask(
      'Do you see text "Options" on the screen indicating you are on the options screen?',
      { json_schema: { type: 'boolean' } }
    );
    expect(hasOptionsTitle).toBe(true);

    // 4) Verify that audio section is available
    const hasAudioSection = await aui.ask(
      'Do you see an audio section or audio-related settings on the options screen?',
      { json_schema: { type: 'boolean' } }
    );
    expect(hasAudioSection).toBe(true);

    // 5) Verify that options screen has all required elements
    // Terms of Service
    const hasTermsOfService = await aui.ask(
      'Do you see text "Terms of Service" on the options screen?',
      { json_schema: { type: 'boolean' } }
    );
    expect(hasTermsOfService).toBe(true);

    // Privacy Policy
    const hasPrivacyPolicy = await aui.ask(
      'Do you see text "Privacy Policy" on the options screen?',
      { json_schema: { type: 'boolean' } }
    );
    expect(hasPrivacyPolicy).toBe(true);

    // Customer Service
    const hasCustomerService = await aui.ask(
      'Do you see text "Customer Service" on the options screen?',
      { json_schema: { type: 'boolean' } }
    );
    expect(hasCustomerService).toBe(true);

    // Report a Bug
    const hasReportBug = await aui.ask(
      'Do you see text "Report a Bug" on the options screen?',
      { json_schema: { type: 'boolean' } }
    );
    expect(hasReportBug).toBe(true);

    // 6) Click on return/back button to go back
    await aui.act('Tap on the back button or return button to go back to the previous screen');
    await aui.waitFor(2000).exec();
  }, 300000);

  it('should navigate to Terms of Service page and verify all elements', async () => {
    console.log('📄 Starting Terms of Service Test...');
    
    // Assumes we're already on Options screen with Terms of Service visible
    
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
  }, 300000);

  it('should navigate to Privacy Policy page and verify all elements', async () => {
    console.log('🔒 Starting Privacy Policy Test...');
    
    // Assumes we're already on Options screen with Privacy Policy visible
    
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
  }, 300000);

  it('should navigate to Customer Service page and verify all elements', async () => {
    console.log('💬 Starting Customer Service Test...');
    
    // Assumes we're already on Options screen with Customer Service visible
    
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
  }, 300000);

  it('should navigate to Report a Bug page and verify all elements', async () => {
    console.log('🐛 Starting Report a Bug Test...');
    
    // Assumes we're already on Options screen with Report a Bug visible
    
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
  }, 300000);

  it('should click back button on Options screen and return to main screen', async () => {
    console.log('↩️ Starting Back Button Test...');
    
    // Assumes we're already on Options screen
    
    // 1) Verify we're on Options screen
    console.log('🔍 Step 1: Verifying we are on Options screen...');
    const isOnOptionsScreen = await aui.ask(
      'Are you on the Options screen with "Options" text visible?',
      { json_schema: { type: 'boolean' } }
    );
    expect(isOnOptionsScreen).toBe(true);
    console.log('✅ Confirmed on Options screen');

    // 2) Click on back button in the top left corner
    console.log('👆 Step 2: Clicking on back button in top left corner...');
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
  }, 300000);

  afterAll(async () => {
    // Force stop the app after all tests are complete
    console.log('🛑 Stopping Pixelmon TCG app...');
    try {
      execSync('adb shell am force-stop com.PixelPalsStudio.PixelmonTCG', { encoding: 'utf-8' });
      console.log('✅ App force-stopped successfully');
    } catch (error) {
      console.log('⚠️ Error stopping app:', error);
    }
  });
});

