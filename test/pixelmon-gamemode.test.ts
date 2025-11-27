import 'dotenv/config';
import { aui } from '../helpers/askui-helper';
import { execSync } from 'child_process';

/**
 * PIXELMON-GAME MODE: Natural language flow for testing Game Mode change flow
 * Steps:
 * 1) Launch the app
 * 2) Login flow should complete
 * 3) Click on Start Game
 * 4) Land on home page verifying Play button
 * 5) Click on game mode icon (golden shield-shaped icon with black background, featuring stylized insect/beetle emblem)
 * 6) Verify game mode screen opens with different modes (practice, duel)
 * 7) Click on (!) icon to display message
 * 8) Click cross button to close message and return to game mode screen
 * 9) Choose a game mode (practice or duel)
 * 10) Verify return to main screen
 * 11) Verify game mode is displayed above the big Play button
 */

describe('Pixelmon TCG - Game Mode Change Flow - Natural Language', () => {
  beforeAll(async () => {
    // Ensure the app is launched
    try {
      execSync('adb shell monkey -p com.PixelPalsStudio.PixelmonTCG.Stg -c android.intent.category.LAUNCHER 1', { encoding: 'utf-8' });
    } catch {}
    await aui.waitFor(6000).exec();
  });

  afterAll(async () => {
    // Force stop the app after all tests are complete
    console.log('🛑 Stopping Pixelmon TCG app...');
    try {
      execSync('adb shell am force-stop com.PixelPalsStudio.PixelmonTCG.Stg', { encoding: 'utf-8' });
      console.log('✅ App force-stopped successfully');
    } catch (error) {
      console.log('⚠️ Error stopping app:', error);
    }
  });

  it('should login, navigate to home page, open game mode screen, interact with info icon, choose mode and verify on main screen', async () => {
    console.log('🎮 Starting Game Mode Change Flow Test...');
    
    // ========== PART 1: LOGIN FLOW ==========
    
    // 1) App launch – verify visible, relaunch if needed
    console.log('📱 Step 1: Verifying app is visible...');
    let isVisible = await aui.ask(
      'Is the Pixelmon TCG app currently open and visible (not the Android home screen)?',
      { json_schema: { type: 'boolean' } }
    );
    if (!isVisible) {
      console.log('⚠️ App not visible, relaunching...');
      try {
        execSync('adb shell monkey -p com.PixelPalsStudio.PixelmonTCG.Stg -c android.intent.category.LAUNCHER 1', { encoding: 'utf-8' });
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

    // 3) Click on Start Game
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

    // 4) Verify that user lands on home page and Play button is displayed in UI
    console.log('🏠 Step 4: Verifying home page...');
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

    expect(hasStartGame).toBe(true);
    expect(hasPlay).toBe(true);
    expect(isOnHomePage).toBe(true);
    console.log('✅ Main screen verified - Play button is visible');

    // ========== PART 2: GAME MODE FLOW ==========

    // 5) Find and click on the game mode icon (golden shield-shaped icon)
    console.log('🛡️ Step 5: Looking for and clicking game mode icon...');
    await aui.waitFor(3000).exec(); // Wait for home screen to fully load
    
    // Natural language command to find and click the golden shield icon
    await aui.act('Locate the golden shield icon with a horned insect emblem inside a gold diamond outline, positioned to the right of the PLAY button. Click the center of that icon');
    console.log('✅ Clicked game mode icon using natural language');
    
    // Wait for game mode screen to load
    await aui.waitFor(3000).exec();
    console.log('⏳ Waited for game mode screen to load');

    // 6) Verify that game mode screen opens with different modes
    console.log('🎮 Step 6: Verifying game mode screen opened...');
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

    // 7) Click on (!) icon to display message
    console.log('ℹ️ Step 7: Looking for and clicking info icon (!)...');
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

    // 8) Click cross button to close message and return to game mode screen
    console.log('❌ Step 8: Clicking cross button to close message...');
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

    // 9) Choose a game mode (practice or duel)
    console.log('🎯 Step 9: Choosing a game mode...');
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

    // 10) Verify return to main screen
    console.log('🏠 Step 10: Verifying return to main screen...');
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

    // 11) Verify game mode is displayed above the big Play button
    console.log('✅ Step 11: Verifying game mode is displayed above Play button...');
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

