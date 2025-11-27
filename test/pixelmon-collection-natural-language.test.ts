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

describe('Pixelmon TCG - Collection Flow (Natural Language)', () => {
  
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
