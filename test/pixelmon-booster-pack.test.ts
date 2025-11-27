import 'dotenv/config';
import { aui } from '../helpers/askui-helper';
import { execSync } from 'child_process';
import { getDefaultAutoSelectFamily } from 'net';
import { Agent } from 'http';

// Function to clear the Pixelmon app (if needed)
function clearPixelmonApp() {
  // This ACTUALLY closes the app (force stop)
  execSync('adb shell am force-stop com.PixelPalsStudio.PixelmonTCG');
  console.log('✅ Pixelmon app force stopped');
}


/**
 * CAESAR AI - NATURAL LANGUAGE TEST
 * 
 * This test uses natural language commands (aui.act()) instead of 
 * traditional element selectors (aui.click().text().withText())
 * 
 * Benefits:
 * - Easier to write (plain English)
 * - More human-readable
 * - Handles complex scenarios better
 * 
 * Note: Uses AI credits from your AskUI account
 */

describe('Pixelmon TCG - Booster Pack Flow (Natural Language)', () => {
  
  beforeAll(async () => {   
    // Launch the app
    console.log('🚀 Launching Pixelmon TCG...');
    execSync('adb shell monkey -p com.PixelPalsStudio.PixelmonTCG -c android.intent.category.LAUNCHER 1');
    
    // Wait for app to fully load
    await aui.waitFor(20000).exec();
    console.log('✅ App launched!\n');
  });

  // Step 0: Login to the game
  it('should login to the game properly', async () => {
    console.log('📝 Step 0: Login to the game\n');
    
    // Login to the game
    await aui.act('Tap on Start Game button');
    
    console.log('✅ Logged in to the game');
  });

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
    
    await aui.act('Now you need to navigate pack to the normal booster pack, which is the brown colored booster pack. Locate the brown colored booster pack by swipe horizontally on the screen until you clearly see the pack.');
    await aui.act('Below the pack you should see a button to open the booster pack. Tap on the button to open the pack one time, then input swipe 539 50 539 2000 to open the pack.');

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


