import 'dotenv/config';
import { aui } from '../helpers/askui-helper';
import { execSync } from 'child_process';

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

  it('should navigate to Collection using natural language', async () => {
    console.log('📝 Step 1: Tap on Collection\n');
    
    // Natural language command - Caesar AI interprets and clicks Collection
    await aui.act('Tap on Collection');
    
    console.log('✅ Clicked Collection using natural language');
    
    // Wait for screen to load
    await aui.waitFor(3000).exec();
    console.log('⏳ Waited for Collection screen to load\n');
  });

  it('should verify Collection screen is displayed', async () => {
    console.log('📝 Step 2: Check what\'s on the Collection screen\n');
    
    // Check if we're on Collection screen
    const isOnCollection = await aui.ask(
      'Is the text "COLLECTION" visible on the screen?',
      { json_schema: { type: 'boolean' } }
    );
    
    console.log(`On Collection screen: ${isOnCollection ? '✅ Yes' : '❌ No'}`);
    expect(isOnCollection).toBe(true);
    
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
    
    console.log('\n🎉 SUCCESS: Collection screen accessed!');
  });

  it('should extract all visible text using natural language', async () => {
    console.log('\n📝 Step 3: Extract all visible text from screen\n');
    
    // Ask Caesar AI to extract all text
    const allText = await aui.ask(
      'List all the text visible on the screen',
      { 
        json_schema: { 
          type: 'array',
          items: { type: 'string' }
        }
      }
    );
    
    console.log('Found text elements:');
    allText.forEach((text: string, index: number) => {
      console.log(`  ${index + 1}. "${text}"`);
    });
  });

  it('should perform complex interaction using natural language', async () => {
    console.log('\n📝 Step 4: Complex natural language interaction\n');
    
    // Natural language can handle complex scenarios
    await aui.act('Look at the Collection screen and wait for everything to load');
    
    console.log('✅ Caesar AI observed the screen');
    
    // Can ask questions about the screen
    const screenDescription = await aui.ask(
      'What is the main content on this screen?',
      {
        json_schema: {
          type: 'string'
        }
      }
    );
    
    console.log(`\n🤖 Caesar AI says: "${screenDescription}"`);
  });

  it('should take screenshot', async () => {
    console.log('\n📸 Taking screenshot...');
    
    await aui.annotate();
    
    console.log('✅ Screenshot saved!');
  });

  afterAll(() => {
    console.log('\n' + '='.repeat(70));
    console.log('🎉 NATURAL LANGUAGE TEST COMPLETE!');
    console.log('='.repeat(70));
    console.log('\n💡 What you just saw:');
    console.log('  ✓ Natural language commands: aui.act("Tap on Collection")');
    console.log('  ✓ AI verification: aui.ask("Is there text Decks?")');
    console.log('  ✓ Data extraction: aui.ask("List all text")');
    console.log('  ✓ Complex interactions with plain English');
    console.log('\n🆚 Traditional API vs Natural Language:');
    console.log('  Traditional: await aui.click().text().withText("Collection").exec()');
    console.log('  Natural:     await aui.act("Tap on Collection")');
  });
});
