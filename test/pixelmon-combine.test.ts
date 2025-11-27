import 'dotenv/config';
import { aui } from '../helpers/askui-helper';
import { execSync } from 'child_process';
import { getDefaultAutoSelectFamily } from 'net';

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

describe('Pixelmon TCG - Combination Flow (Natural Language)', () => {
  
//   beforeAll(async () => {   
//     // Launch the app
//     console.log('🚀 Launching Pixelmon TCG...');
//     execSync('adb shell monkey -p com.PixelPalsStudio.PixelmonTCG -c android.intent.category.LAUNCHER 1');
    
//     // Wait for app to fully load
//     await aui.waitFor(20000).exec();
//     console.log('✅ App launched!\n');
//   });

//   // Step 0: Login to the game
//   it('should login to the game properly', async () => {
//     console.log('📝 Step 0: Login to the game\n');
    
//     // Login to the game
//     await aui.act('Tap on Start Game button');
    
//     console.log('✅ Logged in to the game');
//   });

//   // ------------------------------
//   // Collection Flow
//   // ------------------------------
//   // Step 1: Navigate to Collection tab
//   it('should navigate to Collection tab', async () => {
//     console.log('📝 Step 1: Tap on Collection\n');
    
//     // Natural language command - Caesar AI interprets and clicks Collection
//     await aui.act('Navigate to the bottom of the screen,  below the "Play" button you should see a set of 5 buttons. From the set of 5 buttons, Tap the "Collection" button, which is the fourth button from the left. The button looks like a hexagon wrapped in a rectangle, which is again wrapped in a sun-like circle shape. After you click the button, if you see the "Collection" text title on the screen, it means you are on the correct page, otherwise, you are on the wrong page');
//     console.log('✅ Clicked Collection using natural language');
    
//     // Wait for screen to load
//     await aui.waitFor(3000).exec();
//     console.log('⏳ Waited for Collection screen to load\n');

//     // Check if we're on Collection screen
//     const isOnCollection = await aui.ask(
//       'Is the text "COLLECTION" visible on the screen?',
//       { json_schema: { type: 'boolean' } }
//     );
    
//     console.log(`On Collection screen: ${isOnCollection ? '✅ Yes' : '❌ No'}`);
//     expect(isOnCollection).toBe(true);
//   });

//   // Step 2: Verify Collection screen is displayed along with the available cards
//   it('should verify Collection screen is displayed along with the available cards', async () => {
//     console.log('📝 Step 2: Check what\'s on the Collection screen\n');

//     const contentFound = await aui.ask('Is there a list of cards with 3 cards arrangement in a row?', { json_schema: { type: 'boolean' } });
//     expect(contentFound).toBe(true);

//     console.log('\n🎉 SUCCESS: Collection screen accessed!');
//   });

//   // Step 3: Preview a card
//   it('Should be able to preview a card', async () => {
//     console.log('\n📝 Step 3: Preview a card\n');
    
//     await aui.act('Tap on the first card in the list');
    
//     console.log('✅ Previewed a card');
    
//     // Wait for screen to load
//     await aui.waitFor(3000).exec();
//     console.log('⏳ Waited for screen to load\n');
    
//     const cardPreview = await aui.ask('Is the text "Ability" with a sentence of the card ability description visible on the screen?', { json_schema: { type: 'boolean' } });
//     expect(cardPreview).toBe(true);
    
//     console.log('✅ Ability text visible');
    
//     // Wait for screen to load
//     await aui.waitFor(3000).exec();
//     console.log('⏳ Waited for screen to load\n');

//     await aui.act("Tap the card once to close the card preview");

//     await aui.waitFor(3000).exec();
//     console.log('⏳ Waited for screen to load\n');

//     const cardPreviewClosed = await aui.ask('Is the card preview closed?', { json_schema: { type: 'boolean' } });
//     expect(cardPreviewClosed).toBe(true);

//     console.log('✅ Card preview closed');
//   });

//   // Step 4: Go to the "Edit Decks" tab
//   it('Should be able to navigate to Edit Decks tab', async () => {
//     console.log('\n📝 Step 4: Navigate to Edit Decks tab\n');
    
//     await aui.act('Tap on the "Starter Deck" button');
    
//     console.log('✅ Navigated to Edit Decks tab');
    
//     // Wait for screen to load
//     await aui.waitFor(3000).exec();
//     console.log('⏳ Waited for screen to load\n');

//     const titleVisible = await aui.ask('Is the title "Starter Deck" visible on the screen?', { json_schema: { type: 'boolean' } });
//     expect(titleVisible).toBe(true);

//     console.log('✅ Title "Starter Deck" visible');
//   });

//   // Step 5: Remove a card from the deck
//   it('Should be able to remove a card from the deck', async () => {
//     console.log('\n📝 Step 5: Remove a card from the deck\n');

//     await aui.waitFor(3000).exec();
//     console.log('⏳ Waited for screen to load\n');

//     // const cardOnDeckCount = await aui.ask('Locate a red and green button, on the right side of it, you should see a card image with a number counter formatted as "x/20" on the screen. How many cards are on the deck based on the current visible counter (x)?', { json_schema: { type: 'number' } });
//     // expect(cardOnDeckCount).toBe(20);

//     // console.log(`Card counter before removal: ${cardOnDeckCount}`);
//     // console.log('✅ Card counter visible');

//     await aui.act('Beside the card with the number counter, you should see a set of cards formatted in a 6x2 grid. Tap on the first card in the list');
//     await aui.waitFor(3000).exec();
//     console.log('⏳ Waited for screen to load\n');

//     const cardPreview = await aui.ask('Is the text "Ability" with a sentence of the card ability description visible on the screen?', { json_schema: { type: 'boolean' } });
//     expect(cardPreview).toBe(true);

//     const removeButtonVisible = await aui.ask('Is the button with the text "Remove" visible on the screen?', { json_schema: { type: 'boolean' } });
//     expect(removeButtonVisible).toBe(true);

//     await aui.act('Tap on the "Remove" button');

//     await aui.waitFor(3000).exec();

//     // const cardAfterRemovedCount = await aui.ask('Relocate the card counter, you should see a card image with a number counter formatted as "x/20" on the screen. How many cards are on the deck based on the current visible counter (x)?', { json_schema: { type: 'number' } });
//     // expect(cardAfterRemovedCount).toBe(19);

//     // console.log(`Card counter after removal: ${cardAfterRemovedCount}`);
//     console.log('✅ Card removed');
//   });

//   // Step 6: Add a card to the deck
//   it('Should be able to add a card to the deck', async () => {
//     console.log('\n📝 Step 6: Add a card to the deck\n');

//     // const cardOnDeckCount = await aui.ask('Locate a red and green button, on the right side of it, you should see a card image with a number counter formatted as "x/20" on the screen. How many cards are on the deck based on the current visible counter (x)?', { json_schema: { type: 'number' } });
//     // expect(cardOnDeckCount).toBe(19);

//     // console.log(`Card counter before addition: ${cardOnDeckCount}`);
    
//     await aui.act('Now you should see a list of cards with 3 cards arrangement in a row, some greyed out (unavailable) and some are highlighted (available). Tap on a card in the list that is available and not greyed out. If there is no card available, scroll down until you see a card that is available and not greyed out, then tap on it. If you click correctly, you should see the card preview with the ability description and "Add" buttonvisible on the screen.');

//     await aui.waitFor(3000).exec();

//     const cardPreview = await aui.ask('Is the text "Ability" with a sentence of the card ability description visible on the screen?', { json_schema: { type: 'boolean' } });
//     expect(cardPreview).toBe(true);

//     const addButtonVisible = await aui.ask('Is the button with the text "Add" visible on the screen?', { json_schema: { type: 'boolean' } });
//     expect(addButtonVisible).toBe(true);

//     await aui.act('Tap on the "Add" button');

//     await aui.waitFor(3000).exec();
    
//     // const cardAfterAddedCount = await aui.ask('Relocate the card counter, you should see a card image with a number counter formatted as "x/20" on the screen. How many cards are on the deck based on the current visible counter (x)?', { json_schema: { type: 'number' } });
//     // expect(cardAfterAddedCount).toBe(20);
    
//     // console.log(`Card counter after addition: ${cardAfterAddedCount}`);
//     console.log('✅ Added a card to the deck');

//     // Save the changes
//     await aui.act('Tap on the "Save" button, which is a button with a disk icon located on the right side of the screen.');

//     await aui.waitFor(3000).exec();

//     await aui.act('A popup titled "Save Deck" should appear. Tap on the "Continue" button to save the changes.');

//     await aui.waitFor(3000).exec();

//     const saveSuccess = await aui.ask('Is the text "Save deck successful" visible on the screen?', { json_schema: { type: 'boolean' } });
//     expect(saveSuccess).toBe(true);
//     console.log('✅ Deck saved successfully');

//     await aui.act('Tap on the "X" button to close the popup.');

//   });

//   // ------------------------------
//   // Booster Pack Flow
//   // ------------------------------
//   // Step 1: Navigate to Booster Pack tab
//   it('should navigate to Booster Pack tab', async () => {
//     console.log('📝 Step 1: Tap on Booster Pack\n');
    
//     // Natural language command - Caesar AI interprets and clicks Collection
//     await aui.act('Navigate to the bottom of the screen,  below the "Play" button you should see a set of 5 buttons. From the set of 5 buttons, Tap the "Booster Pack" button, which is the first button from the left. The button looks like a Card Box with two crossing swords inside of it. After you click the button, if you see the "Booster Pack" text title on the screen, it means you are on the correct page, otherwise, you are on the wrong page');
//     console.log('✅ Clicked Booster Pack using natural language');
    
//     // Wait for screen to load
//     await aui.waitFor(3000).exec();
//     console.log('⏳ Waited for Booster Pack screen to load\n');

//     // Check if we're on Booster Pack screen
//     const isOnBoosterPack = await aui.ask(
//       'Is the text "BOOSTER PACK" visible on the screen?',
//       { json_schema: { type: 'boolean' } }
//     );
    
//     console.log(`On Booster Pack screen: ${isOnBoosterPack ? '✅ Yes' : '❌ No'}`);
//     expect(isOnBoosterPack).toBe(true);
//   });

//   // Step 2: Can view the pack information
//   it('should be able to view the pack information', async () => {
//     console.log('📝 Step 2: View the pack information\n');
    
//     await aui.act('Locate the brown colored booster pack. Below the pack you should see a text indicates "Pack Information". Tap on the text to view the pack information.');
//     await aui.waitFor(5000).exec();
//     console.log('⏳ Waited for pack information to open\n');

//     const normalPackInfo = await aui.ask('Did you see a pop-up dialog box indicating the pack information on the screen?', { json_schema: { type: 'boolean' } });
//     expect(normalPackInfo).toBe(true);

//     await aui.act('Tap on the "X" button to close the pack information.');

//     await aui.act('Swipe to the right and locate the golden colored booster pack. Below the pack you should see a text indicates "Pack Information". Tap on the text to view the pack information.');
//     await aui.waitFor(5000).exec();
//     console.log('⏳ Waited for premium pack information to open\n');

//     const premiumPackInfo = await aui.ask('Did you see a pop-up dialog box indicating the premium pack information on the screen?', { json_schema: { type: 'boolean' } });
//     expect(premiumPackInfo).toBe(true);

//     await aui.act('Tap on the "X" button to close the premium pack information.');

//     console.log('✅ Viewed pack information');
//   });

//   // Step 3: Open the premium booster pack
//   it('should open a premium booster', async () => {
//     console.log('📝 Step 3: Open a premium booster\n');
    
//     await aui.act('Now your task is to open the premium booster pack, which is the golden colored booster pack. Below the pack you should see a button to open the booster pack. Tap on the button to open the pack one time, then input swipe 539 50 539 2000 to open the pack.');

//     await aui.waitFor(5000).exec();
//     console.log('⏳ Waited for booster pack to open\n');

//     const boosterPackOpen = await aui.ask('Did you see a card with the button "Open All" below it on the screen?', { json_schema: { type: 'boolean' } });
//     expect(boosterPackOpen).toBe(true);

//     await aui.act('Tap on the "Open All" button to finish the opening process.');
//     await aui.waitFor(5000).exec();

//     await aui.act('Tap on the "Next" button to finish the process.')

//     console.log('✅ Opened a normal booster');
//   });

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

  // ------------------------------
  // Battle Pass Flow
  // ------------------------------
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
