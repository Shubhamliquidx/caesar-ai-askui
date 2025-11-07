import 'dotenv/config';
import { aui } from '../helpers/askui-helper';
import { execSync } from 'child_process';
import { getDefaultAutoSelectFamily } from 'net';

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
    console.log('🚀 Launching Pixelmon TCG...');
    execSync('adb shell monkey -p com.PixelPalsStudio.PixelmonTCG -c android.intent.category.LAUNCHER 1');
    
    // Wait for app to fully load
    await aui.waitFor(8000).exec();
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
    
    // Check what content is available
    const screenContent = await aui.ask(
      'What text or elements are visible on this screen? List them.',
      {
        json_schema: {
          type: 'array',
          items: { type: 'string' }
        }
      }
    );
    
    console.log('\n📋 Content found on screen:');
    screenContent.forEach((item: string, index: number) => {
      console.log(`  ${index + 1}. ${item}`);
    });

    const contentFound = await aui.ask('Is the text "Bengu", "Bengusi", and "Bengutani" visible on the screen?', { json_schema: { type: 'boolean' } });
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

    const cardOnDeckCount = await aui.ask('How many cards are on the deck?', { json_schema: { type: 'number' } });
    expect(cardOnDeckCount).toBe(20);
    
    await aui.act('Below the title "Starter Deck", you should see a list of small cards. Tap on the first card in the list');

    const cardPreview = await aui.ask('Is the text "Ability" with a sentence of the card ability description visible on the screen?', { json_schema: { type: 'boolean' } });
    expect(cardPreview).toBe(true);

    const removeButtonVisible = await aui.ask('Is the button with the text "Remove" visible on the screen?', { json_schema: { type: 'boolean' } });
    expect(removeButtonVisible).toBe(true);

    await aui.act('Tap on the "Remove" button');

    const cardAfterRemovedCount = await aui.ask('How many cards are on the deck?', { json_schema: { type: 'number' } });
    expect(cardAfterRemovedCount).toBe(19);

    console.log('✅ Card removed');
  });

  // Step 6: Add a card to the deck
  it('Should be able to add a card to the deck', async () => {
    console.log('\n📝 Step 6: Add a card to the deck\n');

    const cardOnDeckCount = await aui.ask('How many cards are on the deck?', { json_schema: { type: 'number' } });
    expect(cardOnDeckCount).toBe(19);
    
    await aui.act('Now you should see a list of cards with 3 cards arrangement in a row. Tap on the first card in the list.');

    await aui.waitFor(3000).exec();

    const cardPreview = await aui.ask('Is the text "Ability" with a sentence of the card ability description visible on the screen?', { json_schema: { type: 'boolean' } });
    expect(cardPreview).toBe(true);

    const addButtonVisible = await aui.ask('Is the button with the text "Add" visible on the screen?', { json_schema: { type: 'boolean' } });
    expect(addButtonVisible).toBe(true);

    await aui.act('Tap on the "Add" button');
    
    const cardAfterAddedCount = await aui.ask('How many cards are on the deck?', { json_schema: { type: 'number' } });
    expect(cardAfterAddedCount).toBe(20);
    
    console.log('✅ Added a card to the deck');
  });

  // it('should perform complex interaction using natural language', async () => {
  //   console.log('\n📝 Step 4: Complex natural language interaction\n');
    
  //   // Natural language can handle complex scenarios
  //   await aui.act('Look at the Collection screen and wait for everything to load');
    
  //   console.log('✅ Caesar AI observed the screen');
    
  //   // Can ask questions about the screen
  //   const screenDescription = await aui.ask(
  //     'What is the main content on this screen?',
  //     {
  //       json_schema: {
  //         type: 'string'
  //       }
  //     }
  //   );
    
  //   console.log(`\n🤖 Caesar AI says: "${screenDescription}"`);
  // });

  // it('should take screenshot', async () => {
  //   console.log('\n📸 Taking screenshot...');
    
  //   await aui.annotate();
    
  //   console.log('✅ Screenshot saved!');
  // });

  // afterAll(() => {
  //   console.log('\n' + '='.repeat(70));
  //   console.log('🎉 NATURAL LANGUAGE TEST COMPLETE!');
  //   console.log('='.repeat(70));
  //   console.log('\n💡 What you just saw:');
  //   console.log('  ✓ Natural language commands: aui.act("Tap on Collection")');
  //   console.log('  ✓ AI verification: aui.ask("Is there text Decks?")');
  //   console.log('  ✓ Data extraction: aui.ask("List all text")');
  //   console.log('  ✓ Complex interactions with plain English');
  //   console.log('\n🆚 Traditional API vs Natural Language:');
  //   console.log('  Traditional: await aui.click().text().withText("Collection").exec()');
  //   console.log('  Natural:     await aui.act("Tap on Collection")');
  // });
});
