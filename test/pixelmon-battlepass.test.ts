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

describe('Pixelmon TCG - Battlepass Flow (Natural Language)', () => {
  
  // beforeAll(async () => {   
  //   // Launch the app
  //   console.log('🚀 Launching Pixelmon TCG...');
  //   execSync('adb shell monkey -p com.PixelPalsStudio.PixelmonTCG -c android.intent.category.LAUNCHER 1');
    
  //   // Wait for app to fully load
  //   await aui.waitFor(20000).exec();
  //   console.log('✅ App launched!\n');
  // });

  // // Step 0: Login to the game
  // it('should login to the game properly', async () => {
  //   console.log('📝 Step 0: Login to the game\n');
    
  //   // Login to the game
  //   await aui.act('Tap on Start Game button');
    
  //   console.log('✅ Logged in to the game');
  // });

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
