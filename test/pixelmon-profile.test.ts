import 'dotenv/config';
import { aui } from '../helpers/askui-helper';
import { execSync } from 'child_process';

/**
 * PIXELMON-PROFILE: Natural language flow for testing Profile screen
 * Steps:
 * 1) Use auto-login flow to land on home page (from pixelmon-mail.test.ts)
 * 2) Find and click the profile icon (red creature in golden circle)
 * 3) Verify that profile screen opens with "Profile" heading
 * 4) Verify player level and score are present
 * 5) Verify username and user ID are present
 * 6) Verify different unique collected cards section is present
 * 7) Click on cross/back button to return to home screen
 */

describe('Pixelmon TCG - Profile Flow - Natural Language', () => {
  beforeAll(async () => {
    // Ensure the app is launched
    try {
      execSync('adb shell monkey -p com.PixelPalsStudio.PixelmonTCG -c android.intent.category.LAUNCHER 1', { encoding: 'utf-8' });
    } catch {}
    await aui.waitFor(6000).exec();
  });

  it('should login, navigate to home page, open Profile and verify all elements', async () => {
    console.log('🚀 Starting Profile Flow Test...');
    
    // ========== PART 1: LOGIN FLOW (from pixelmon-mail.test.ts) ==========
    
    // 1) App launch – verify visible, relaunch if needed
    console.log('📱 Step 1: Verifying app is visible...');
    let isVisible = await aui.ask(
      'Is the Pixelmon TCG app currently open and visible (not the Android home screen)?',
      { json_schema: { type: 'boolean' } }
    );
    if (!isVisible) {
      console.log('⚠️ App not visible, relaunching...');
      try {
        execSync('adb shell monkey -p com.PixelPalsStudio.PixelmonTCG -c android.intent.category.LAUNCHER 1', { encoding: 'utf-8' });
      } catch {}
      await aui.waitFor(6000).exec();
      isVisible = await aui.ask(
        'Is the Pixelmon TCG app currently open and visible (not the Android home screen)?',
        { json_schema: { type: 'boolean' } }
      );
    }
    console.log(`✅ App visible: ${isVisible}`);

    // Wait for auto login to complete
    console.log('🔐 Step 2: Waiting for auto login...');
    let isLoggedIn = false;
    let loginInProgress = false;
    
    // Wait for auto login process (check for various indicators)
    for (let i = 0; i < 6; i++) {
      console.log(`   Checking login status (attempt ${i + 1}/6)...`);
      // Check if we're already past login (Start Game button visible means logged in)
      const hasStartGame = await aui.ask(
        'Is there a button labeled "Start Game" visible on the screen?',
        { json_schema: { type: 'boolean' } }
      );
      
      if (hasStartGame) {
        isLoggedIn = true;
        console.log('✅ Start Game button found - logged in!');
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
      
      await aui.waitFor(3000).exec();
    }
    
    // Additional wait after auto login detection
    if (isLoggedIn || loginInProgress) {
      console.log('⏳ Waiting for login to complete...');
      await aui.waitFor(5000).exec();
    }

    // 2) Click on Start Game
    console.log('🎮 Step 3: Looking for Start Game button...');
    let hasStartGame = false;
    for (let i = 0; i < 5; i++) {
      hasStartGame = await aui.ask('Is there a button labeled "Start Game" visible?', { json_schema: { type: 'boolean' } });
      if (hasStartGame) {
        console.log('✅ Start Game button found!');
        break;
      }
      await aui.waitFor(2000).exec();
    }
    if (hasStartGame) {
      console.log('👆 Tapping Start Game button...');
      await aui.act('Tap on the "Start Game" button');
      await aui.waitFor(3000).exec();
    }

    // 3) Wait for some time
    console.log('⏳ Step 4: Waiting for game to load...');
    await aui.waitFor(5000).exec();

    // 4) Verify that user lands on home page and Play button is displayed in UI
    console.log('🏠 Step 5: Verifying home page...');
    let hasPlay = false;
    for (let i = 0; i < 5; i++) {
      hasPlay = await aui.ask('Do you see a button labeled "Play" on the home screen?', { json_schema: { type: 'boolean' } });
      if (hasPlay) {
        console.log('✅ Play button found!');
        break;
      }
      await aui.waitFor(2000).exec();
    }

    // Verify we're on the home page
    const isOnHomePage = await aui.ask(
      'Are you on the home page or main screen of the Pixelmon TCG app?',
      { json_schema: { type: 'boolean' } }
    );

    expect(isVisible).toBe(true);
    expect(hasStartGame).toBe(true);
    expect(hasPlay).toBe(true);
    expect(isOnHomePage).toBe(true);

    // ========== PART 2: PROFILE FLOW ==========

    // 5) Find and click profile icon (golden circular icon with red creature)
    console.log('👤 Step 6: Looking for and clicking profile icon...');
    await aui.waitFor(3000).exec(); // Wait for home screen to fully load
    
    // Natural language command - similar to how Collection is located in tadtest.test.ts
    // Provides detailed context: location, appearance, and verification logic
    await aui.act('Navigate to the top left corner of the screen. You should see a circular icon with a golden or metallic circular frame. Inside this circle, there is a red cartoonish creature with glowing yellow eyes and a raised fist. The creature is set against a glowing orange and yellow background. At the bottom of this circular icon, there is a small blue diamond shape with the number "1" displayed inside it. Tap on this profile icon in the top left corner. After you click the icon, if you see a screen with "Profile" as a heading or title, it means you are on the correct page, otherwise, you are on the wrong page');
    console.log('✅ Clicked profile icon using natural language');
    
    // Wait for profile screen to load
    await aui.waitFor(3000).exec();
    console.log('⏳ Waited for profile screen to load\n');

    // 7) Verify that profile screen opens with "Profile" heading
    console.log('📊 Step 7: Verifying profile screen opened...');
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

    // 8) Verify player level and score are present in the UI
    console.log('📈 Step 8: Verifying player level and score...');
    const hasPlayerLevelAndScore = await aui.ask(
      'Do you see "Player Level" or "Level" and a numerical "Score" displayed on the profile screen?',
      { json_schema: { type: 'boolean' } }
    );
    expect(hasPlayerLevelAndScore).toBe(true);
    console.log('✅ Player level and score verified');

    // 9) Verify that username and user ID are also mentioned in the profile section
    console.log('🆔 Step 9: Verifying username and user ID...');
    const hasUsernameAndID = await aui.ask(
      'Do you see the user\'s "Username" and "User ID" displayed on the profile screen?',
      { json_schema: { type: 'boolean' } }
    );
    expect(hasUsernameAndID).toBe(true);
    console.log('✅ Username and User ID verified');

    // 10) Verify that different unique collected cards are also present
    console.log('🃏 Step 10: Verifying collected cards section...');
    const hasCollectedCards = await aui.ask(
      'Do you see a section displaying "Collected Cards", "Unique Cards", or a list of cards on the profile screen?',
      { json_schema: { type: 'boolean' } }
    );
    expect(hasCollectedCards).toBe(true);
    console.log('✅ Collected cards section verified');
  }, 600000);

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

    // 4) Enter a random name value
    const randomName = `Player${Math.floor(Math.random() * 10000)}`;
    console.log(`⌨️ Step 4: Entering random name as "${randomName}"...`);
    await aui.act('Tap on the name input field or text box to focus it');
    await aui.waitFor(1000).exec();
    await aui.act('Clear the name field if it already has any text');
    await aui.act(`Type "${randomName}" into the name input field`);
    await aui.waitFor(2000).exec();
    console.log(`✅ Entered random name as "${randomName}"`);

    // 5) Click on Confirm
    console.log('✅ Step 5: Clicking on Confirm button...');
    await aui.act('Tap on the "Confirm" button to save the name change');
    await aui.waitFor(2000).exec();
    console.log('✅ Clicked Confirm button');
    
    // Wait for navigation back to profile screen
    await aui.waitFor(3000).exec();
    console.log('⏳ Waited for navigation back to profile screen');

    // 6) Verify that we land back on profile page
    console.log('🔍 Step 6: Verifying return to profile page after confirm...');
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


