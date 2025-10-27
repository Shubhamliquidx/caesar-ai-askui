import 'dotenv/config';
import { aui } from '../helpers/askui-helper';
import { execSync } from 'child_process';

describe('Pixelmon TCG - Collection Flow', () => {
  
  beforeAll(async () => {
    console.log('🚀 Launching Pixelmon TCG...');
    execSync('adb shell monkey -p com.PixelPalsStudio.PixelmonTCG -c android.intent.category.LAUNCHER 1');
    
    // Wait for app to fully load
    await aui.waitFor(8000).exec();
    console.log('✅ App launched!\n');
  });

  it('should navigate to Collection and verify Decks and Cards are displayed', async () => {
    console.log('📝 Step 1: Verify we are on home screen');
    
    // Check if we're on home screen by looking for HOME text
    try {
      await aui.expect().text().withText('HOME').exists().exec();
      console.log('✅ Confirmed: On home screen\n');
    } catch (e) {
      console.log('⚠️  HOME text not found, continuing anyway...\n');
    }

    console.log('📝 Step 2: Click on COLLECTION');
    
    // Click on Collection button
    await aui.click().text().withText('COLLECTION').exec();
    console.log('✅ Clicked COLLECTION button');
    
    // Wait for collection screen to load
    await aui.waitFor(3000).exec();
    console.log('⏳ Waited for screen to load\n');

    console.log('📝 Step 3: Verify "Decks" text is present');
    
    // Verify "Decks" text exists
    try {
      await aui.expect().text().withText('Decks').exists().exec();
      console.log('✅ Found: "Decks" text on screen');
    } catch (e) {
      // Try case variations
      try {
        await aui.expect().text().withText('DECKS').exists().exec();
        console.log('✅ Found: "DECKS" text on screen');
      } catch (e2) {
        console.log('❌ Failed: "Decks" text not found');
        throw new Error('Decks text not found on collection screen');
      }
    }

    console.log('📝 Step 4: Verify "Cards" text is present');
    
    // Verify "Cards" text exists
    try {
      await aui.expect().text().withText('Cards').exists().exec();
      console.log('✅ Found: "Cards" text on screen');
    } catch (e) {
      // Try case variations
      try {
        await aui.expect().text().withText('CARDS').exists().exec();
        console.log('✅ Found: "CARDS" text on screen');
      } catch (e2) {
        console.log('❌ Failed: "Cards" text not found');
        throw new Error('Cards text not found on collection screen');
      }
    }

    console.log('\n🎉 SUCCESS: Collection screen verified!');
    console.log('   - Navigation to Collection: ✅');
    console.log('   - "Decks" text present: ✅');
    console.log('   - "Cards" text present: ✅');
  });

  it('should display all text elements on Collection screen', async () => {
    console.log('\n📋 Listing all text elements on Collection screen:');
    
    const textElements = await aui.get().text().exec();
    
    console.log(`\nFound ${textElements.length} text elements:\n`);
    textElements.forEach((element, index) => {
      console.log(`  ${index + 1}. "${element.text}"`);
    });
  });

  it('should take screenshot of Collection screen', async () => {
    console.log('\n📸 Taking annotated screenshot of Collection screen...');
    
    await aui.annotate();
    
    console.log('✅ Screenshot saved!');
    console.log('📁 Check your project folder for the annotated image');
  });

  afterAll(() => {
    console.log('\n' + '='.repeat(60));
    console.log('✅ Collection Flow Test Complete!');
    console.log('='.repeat(60));
  });
});
