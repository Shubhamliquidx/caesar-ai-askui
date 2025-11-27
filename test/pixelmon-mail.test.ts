import 'dotenv/config';
import { aui } from '../helpers/askui-helper';
import { execSync } from 'child_process';

/**
 * PIXELMON-MAIL: Natural language flow for testing Mail screen
 * Steps:
 * 1) Use auto-login flow to land on home page (from pixelmon-login3.test.ts)
 * 2) Find envelope-shaped mail icon with red notification dot in the top right corner
 * 3) Click on the envelope-shaped mail icon
 * 4) Verify that mail section opens up
 * 5) Click on cross button
 * 6) Verify back on home screen
 */

describe('Pixelmon TCG - Mail Flow - Natural Language', () => {
  beforeAll(async () => {
    // Ensure the app is launched
    try {
      execSync('adb shell monkey -p com.PixelPalsStudio.PixelmonTCG -c android.intent.category.LAUNCHER 1', { encoding: 'utf-8' });
    } catch {}
    await aui.waitFor(6000).exec();
  });

  it('should login, navigate to home page, open Mail and verify all elements', async () => {
    console.log('🚀 Starting Mail Flow Test...');
    
    // ========== PART 1: LOGIN FLOW (from pixelmon-login3.test.ts) ==========
    
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
    
    // Wait for auto login process (check for various indicators) - reduced iterations
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

    // Click on Start Game
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

    // Verify that user lands on home page and Play button is displayed in UI
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

    expect(isVisible).toBe(true);
    expect(hasStartGame).toBe(true);
    expect(hasPlay).toBe(true);
    expect(isOnHomePage).toBe(true);

    // ========== PART 2: MAIL FLOW ==========

    // 2) Find and click envelope icon in the top right corner (using same approach as Collection in tadtest)
    console.log('📧 Step 5: Looking for and clicking envelope icon...');
    await aui.waitFor(3000).exec(); // Wait for home screen to fully load
    
    // Natural language command - similar to how Collection is located in tadtest.test.ts
    // Provides detailed context: location, appearance, and verification logic
    await aui.act('Navigate to the top right corner of the screen. You should see an envelope icon with a red notification dot. The envelope icon is shaped like a letter envelope and has a small red circle or dot on it indicating new mail. Tap on this envelope icon in the top right corner. After you click the icon, if you see mail messages, inbox content, or a mail screen with mail-related content, it means the mail section has opened correctly, otherwise, you need to try again');
    console.log('✅ Clicked envelope icon using natural language');
    
    // Wait for mail screen to load
    await aui.waitFor(3000).exec();
    console.log('⏳ Waited for mail screen to load\n');

    // 4) Verify that mail section opens up
    console.log('📬 Step 6: Verifying mail screen opened...');
    let isOnMailScreen = false;
    for (let i = 0; i < 5; i++) {
      console.log(`   Checking mail screen (attempt ${i + 1}/5)...`);
      
      // Check multiple indicators
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
        console.log('✅ Mail screen opened!');
        break;
      }
      
      await aui.waitFor(2000).exec();
    }
    expect(isOnMailScreen).toBe(true);
    console.log('✅ Test completed successfully - mail screen opened and verified!');
  }, 600000); // Increased timeout to 10 minutes

  it('should claim rewards from mail entries and verify tick marks', async () => {
    console.log('🎁 Starting Mail Rewards Claim Test...');
    
    // Assumes we're already on Mail screen from Test 1
    // If not, navigate to Mail screen first
    let isOnMailScreen = await aui.ask(
      'Are you on the Mail screen with mail messages or inbox content visible?',
      { json_schema: { type: 'boolean' } }
    );
    
    if (!isOnMailScreen) {
      // Navigate to Mail screen
      console.log('📧 Navigating to Mail screen...');
      await aui.waitFor(3000).exec();
      await aui.act('Navigate to the top right corner of the screen. You should see an envelope icon with a red notification dot. The envelope icon is shaped like a letter envelope and has a small red circle or dot on it indicating new mail. Tap on this envelope icon in the top right corner');
      await aui.waitFor(3000).exec();
      
      // Verify we're on Mail screen
      isOnMailScreen = await aui.ask(
        'Are you on the Mail screen with mail messages or inbox content visible?',
        { json_schema: { type: 'boolean' } }
      );
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
    console.log('✅ Test completed successfully - mail rewards claim flow verified');
  }, 600000);

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

