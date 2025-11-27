import 'dotenv/config';
import { aui } from '../helpers/askui-helper';
import { execSync } from 'child_process';

/**
 * PIXELMON-SHOP: Natural language flow for testing Shop screen
 * Steps:
 * 1) Launch the app
 * 2) Login flow should complete
 * 3) Click on Start Game
 * 4) Land on home page verifying Play button
 * 5) Click on shop icon (located at bottom left, second icon from left)
 * 6) Verify that user lands on shop screen and heading should be "Shop"
 */

describe('Pixelmon TCG - Shop Flow - Natural Language', () => {
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

  it('should login, navigate to home page, open Shop and verify all elements', async () => {
    console.log('🛒 Starting Shop Flow Test...');
    
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

    // ========== PART 2: SHOP FLOW ==========

    // 5) Find and click shop icon (bottom left, second icon from left)
    console.log('🛒 Step 5: Looking for and clicking shop icon...');
    await aui.waitFor(3000).exec(); // Wait for home screen to fully load
    
    // Natural language command to find and click shop icon
    // Shop icon is located at bottom left, second icon from the left
    await aui.act('Navigate to the bottom left area of the screen. Look for the second icon from the left in the bottom navigation bar. This should be the shop icon. Tap on this shop icon which is the second icon from the left in the bottom navigation area');
    console.log('✅ Clicked shop icon using natural language');
    
    // Wait for screen to load after clicking shop icon
    await aui.waitFor(3000).exec();
    console.log('⏳ Waited for screen to load after clicking shop icon');

    // Check if intermediate shop details screen appears (with "do not show this message again")
    console.log('🔍 Step 5a: Checking for intermediate shop details screen...');
    const hasShopDetailsScreen = await aui.ask(
      'Do you see a screen or popup with details about the shop that contains text like "do not show this message again" or similar shop information message?',
      { json_schema: { type: 'boolean' } }
    );
    
    if (hasShopDetailsScreen) {
      console.log('ℹ️ Shop details screen detected, clicking cross button to close it...');
      // Click on cross button to close the shop details screen
      await aui.act('Tap on the cross button or X button to close the shop details screen or popup');
      await aui.waitFor(2000).exec();
      console.log('✅ Clicked cross button to close shop details screen');
    } else {
      console.log('ℹ️ No shop details screen detected, proceeding to shop screen...');
    }

    // Wait for shop screen to load
    await aui.waitFor(2000).exec();
    console.log('⏳ Waited for shop screen to load');

    // 6) Verify that shop screen opens with "Shop" heading
    console.log('🛒 Step 6: Verifying shop screen opened...');
    let isOnShopScreen = false;
    for (let i = 0; i < 5; i++) {
      console.log(`   Checking shop screen (attempt ${i + 1}/5)...`);
      
      // Check multiple indicators
      const hasShopHeading = await aui.ask(
        'Do you see a heading or title that says "Shop" at the top of the screen?',
        { json_schema: { type: 'boolean' } }
      );
      
      const hasShopContent = await aui.ask(
        'Do you see shop-related content like items for sale, products, or shop-related items on the screen?',
        { json_schema: { type: 'boolean' } }
      );
      
      const isShopScreenOpen = await aui.ask(
        'Has the shop section or shop screen opened up? Are you viewing shop content or items for purchase?',
        { json_schema: { type: 'boolean' } }
      );
      
      if (hasShopHeading || hasShopContent || isShopScreenOpen) {
        isOnShopScreen = true;
        console.log('✅ Shop screen opened!');
        break;
      }
      
      await aui.waitFor(2000).exec();
    }
    expect(isOnShopScreen).toBe(true);
    
    // Additional verification - verify "Shop" heading specifically
    console.log('📋 Verifying "Shop" heading is displayed...');
    const hasShopHeading = await aui.ask(
      'Do you see a heading or title that says "Shop" on the shop screen?',
      { json_schema: { type: 'boolean' } }
    );
    expect(hasShopHeading).toBe(true);
    console.log('✅ "Shop" heading verified');
    console.log('✅ Test completed successfully - shop screen opened and verified!');
  }, 600000);

  it('should verify all three shop sections: Gem/Diamond Shop, Bundle Shop, and Base Set', async () => {
    console.log('🛒 Starting Shop Sections Verification Test...');
    
    // Assumes we're already on the shop screen from Test 1
    // Verify we're on shop screen
    console.log('📱 Verifying we are on shop screen...');
    const isOnShopScreen = await aui.ask(
      'Are you on the shop screen with "Shop" heading visible?',
      { json_schema: { type: 'boolean' } }
    );
    expect(isOnShopScreen).toBe(true);
    console.log('✅ On shop screen');

    // ========== PART 1: VERIFY GEM AND DIAMOND SHOP (FIRST ICON FROM LEFT) ==========

    // 1) Click on first icon on the left - should open gem and diamond shop
    console.log('💎 Step 1: Clicking on first icon from left (Gem and Diamond Shop)...');
    await aui.act('Navigate to the left side of the shop screen. Look for the first icon from the left in the shop navigation or tab area. This should be the gem and diamond shop icon. Tap on this first icon from the left');
    await aui.waitFor(3000).exec();
    console.log('✅ Clicked first icon from left');

    // Verify gem and diamond shop opened with message
    console.log('🔍 Verifying Gem and Diamond Shop section...');
    let isGemDiamondShopOpen = false;
    for (let i = 0; i < 5; i++) {
      console.log(`   Checking gem and diamond shop (attempt ${i + 1}/5)...`);
      
      const hasGemShop = await aui.ask(
        'Do you see a gem shop section or gem-related items for purchase on the screen?',
        { json_schema: { type: 'boolean' } }
      );
      
      const hasDiamondShop = await aui.ask(
        'Do you see a diamond shop section or diamond-related items for purchase on the screen?',
        { json_schema: { type: 'boolean' } }
      );
      
      const hasGoldShop = await aui.ask(
        'Do you see a gold shop section or gold-related items for purchase on the screen?',
        { json_schema: { type: 'boolean' } }
      );
      
      const hasCurrencyMessage = await aui.ask(
        'Do you see a message that says "buy various currencies like gold and diamond" or similar text about buying currencies?',
        { json_schema: { type: 'boolean' } }
      );
      
      if ((hasGemShop || hasDiamondShop || hasGoldShop) && hasCurrencyMessage) {
        isGemDiamondShopOpen = true;
        console.log('✅ Gem and Diamond Shop section verified!');
        break;
      }
      
      await aui.waitFor(2000).exec();
    }
    expect(isGemDiamondShopOpen).toBe(true);
    
    // Verify the specific message
    const hasCurrencyMessage = await aui.ask(
      'Do you see a message that says "buy various currencies like gold and diamond" on the gem and diamond shop screen?',
      { json_schema: { type: 'boolean' } }
    );
    expect(hasCurrencyMessage).toBe(true);
    console.log('✅ Currency message verified: "buy various currencies like gold and diamond"');

    // ========== PART 2: VERIFY BUNDLE SHOP (SECOND ICON FROM LEFT) ==========

    // 2) Click on second icon from left - should open bundle shop
    console.log('📦 Step 2: Clicking on second icon from left (Bundle Shop)...');
    await aui.act('Navigate to the left side of the shop screen. Look for the second icon from the left in the shop navigation or tab area. This should be the bundle shop icon. Tap on this second icon from the left');
    await aui.waitFor(3000).exec();
    console.log('✅ Clicked second icon from left');

    // Verify bundle shop opened with three bundles and message
    console.log('🔍 Verifying Bundle Shop section...');
    let isBundleShopOpen = false;
    for (let i = 0; i < 5; i++) {
      console.log(`   Checking bundle shop (attempt ${i + 1}/5)...`);
      
      const hasNewPlayerBundle = await aui.ask(
        'Do you see a "New Player Bundle" or bundle labeled for new players in the bundle shop?',
        { json_schema: { type: 'boolean' } }
      );
      
      const hasDeckBoostBundle = await aui.ask(
        'Do you see a "Deck Boost Bundle" or bundle labeled for deck boosting in the bundle shop?',
        { json_schema: { type: 'boolean' } }
      );
      
      const hasCompletionistBundle = await aui.ask(
        'Do you see a "Completionist Bundle" or bundle labeled for completionists in the bundle shop?',
        { json_schema: { type: 'boolean' } }
      );
      
      const hasBundleMessage = await aui.ask(
        'Do you see a message that says "grab value packed deals with cards currency and more" or similar text about value-packed deals?',
        { json_schema: { type: 'boolean' } }
      );
      
      const hasThreeBundles = await aui.ask(
        'Do you see three different bundles displayed in the bundle shop section?',
        { json_schema: { type: 'boolean' } }
      );
      
      if ((hasNewPlayerBundle || hasDeckBoostBundle || hasCompletionistBundle || hasThreeBundles) && hasBundleMessage) {
        isBundleShopOpen = true;
        console.log('✅ Bundle Shop section verified!');
        break;
      }
      
      await aui.waitFor(2000).exec();
    }
    expect(isBundleShopOpen).toBe(true);
    
    // Verify the specific message
    const hasBundleMessage = await aui.ask(
      'Do you see a message that says "grab value packed deals with cards currency and more" on the bundle shop screen?',
      { json_schema: { type: 'boolean' } }
    );
    expect(hasBundleMessage).toBe(true);
    console.log('✅ Bundle message verified: "grab value packed deals with cards currency and more"');
    
    // Verify bundles are present (no specific count required)
    const areBundlesPresent = await aui.ask(
      'Do you see bundles or bundle items displayed in the bundle shop section?',
      { json_schema: { type: 'boolean' } }
    );
    expect(areBundlesPresent).toBe(true);
    console.log('✅ Bundles verified in bundle shop');

    // ========== PART 3: VERIFY BASE SET (THIRD ICON FROM LEFT) ==========

    // 3) Click on third icon from left - should open base set
    console.log('🎴 Step 3: Clicking on third icon from left (Base Set)...');
    await aui.act('Navigate to the left side of the shop screen. Look for the third icon from the left in the shop navigation or tab area. This should be the base set icon. Tap on this third icon from the left');
    await aui.waitFor(3000).exec();
    console.log('✅ Clicked third icon from left');

    // Verify base set opened with message
    console.log('🔍 Verifying Base Set section...');
    let isBaseSetOpen = false;
    for (let i = 0; i < 5; i++) {
      console.log(`   Checking base set (attempt ${i + 1}/5)...`);
      
      const hasBaseSet = await aui.ask(
        'Do you see a "Base Set" section or base set-related content on the screen?',
        { json_schema: { type: 'boolean' } }
      );
      
      const hasBoosterPacks = await aui.ask(
        'Do you see booster packs or pack-related items in the base set section?',
        { json_schema: { type: 'boolean' } }
      );
      
      const hasBaseSetMessage = await aui.ask(
        'Do you see a message that says "open booster pack to expand your collection" or similar text about opening booster packs?',
        { json_schema: { type: 'boolean' } }
      );
      
      const hasThreePacks = await aui.ask(
        'Do you see three different packs or booster packs displayed in the base set section?',
        { json_schema: { type: 'boolean' } }
      );
      
      if ((hasBaseSet || hasBoosterPacks || hasThreePacks) && hasBaseSetMessage) {
        isBaseSetOpen = true;
        console.log('✅ Base Set section verified!');
        break;
      }
      
      await aui.waitFor(2000).exec();
    }
    expect(isBaseSetOpen).toBe(true);
    
    // Verify the specific message
    const hasBaseSetMessage = await aui.ask(
      'Do you see a message that says "open booster pack to expand your collection" on the base set screen?',
      { json_schema: { type: 'boolean' } }
    );
    expect(hasBaseSetMessage).toBe(true);
    console.log('✅ Base Set message verified: "open booster pack to expand your collection"');
    
    // Verify three packs are present
    const hasThreePacks = await aui.ask(
      'Do you see three different packs or booster packs in the base set section?',
      { json_schema: { type: 'boolean' } }
    );
    expect(hasThreePacks).toBe(true);
    console.log('✅ Three packs verified in Base Set section');
    
    console.log('✅ Test completed successfully - all three shop sections verified!');
  }, 600000);

  it('should verify Gem Shop and Gold Shop UI elements and purchase popup', async () => {
    console.log('💎 Starting Gem and Gold Shop UI Verification Test...');
    
    // Assumes we're already on the shop screen from previous tests
    // Verify we're on shop screen
    console.log('📱 Verifying we are on shop screen...');
    const isOnShopScreen = await aui.ask(
      'Are you on the shop screen with "Shop" heading visible?',
      { json_schema: { type: 'boolean' } }
    );
    expect(isOnShopScreen).toBe(true);
    console.log('✅ On shop screen');

    // ========== PART 1: NAVIGATE TO GEM AND GOLD SHOP ==========

    // 1) Verify it's on the first icon from left (gem and gold shop)
    console.log('💎 Step 1: Navigating to Gem and Gold Shop (first icon from left)...');
    await aui.act('Navigate to the left side of the shop screen. Look for the first icon from the left in the shop navigation or tab area. This should be the gem and diamond shop icon. Tap on this first icon from the left');
    await aui.waitFor(3000).exec();
    console.log('✅ Clicked first icon from left');

    // Verify gem and gold shop is open
    console.log('🔍 Verifying Gem and Gold Shop section is open...');
    let isGemGoldShopOpen = false;
    for (let i = 0; i < 5; i++) {
      const hasGemShop = await aui.ask(
        'Do you see a gem shop section or gem-related items for purchase on the screen?',
        { json_schema: { type: 'boolean' } }
      );
      
      const hasGoldShop = await aui.ask(
        'Do you see a gold shop section or gold-related items for purchase on the screen?',
        { json_schema: { type: 'boolean' } }
      );
      
      if (hasGemShop || hasGoldShop) {
        isGemGoldShopOpen = true;
        console.log('✅ Gem and Gold Shop section is open!');
        break;
      }
      await aui.waitFor(2000).exec();
    }
    expect(isGemGoldShopOpen).toBe(true);

    // ========== PART 2: GEM SHOP UI VERIFICATION ==========

    console.log('💎 ========== GEM SHOP UI VERIFICATION ==========');

    // 2) Click on any random gem (e.g., gem 90)
    console.log('💎 Step 2: Clicking on a random gem item (e.g., gem 90)...');
    await aui.act('Look for gem items or gem packages available for purchase in the gem shop section. Click on any random gem item, for example a gem package that shows "90" or similar gem amount');
    await aui.waitFor(3000).exec();
    console.log('✅ Clicked on gem item');

    // 3) Verify purchase popup opens with "buy this item?" and details
    console.log('🔍 Step 3: Verifying purchase popup opened...');
    let isPurchasePopupOpen = false;
    for (let i = 0; i < 5; i++) {
      const hasBuyPopup = await aui.ask(
        'Do you see a popup or dialog that says "buy this item?" or similar purchase confirmation message?',
        { json_schema: { type: 'boolean' } }
      );
      
      const hasGemDetails = await aui.ask(
        'Do you see details about the gem item including its quantity, price, or other purchase information in the popup?',
        { json_schema: { type: 'boolean' } }
      );
      
      if (hasBuyPopup && hasGemDetails) {
        isPurchasePopupOpen = true;
        console.log('✅ Purchase popup opened with gem details!');
        break;
      }
      await aui.waitFor(2000).exec();
    }
    expect(isPurchasePopupOpen).toBe(true);

    // Close the popup using cross button
    console.log('❌ Closing purchase popup...');
    await aui.act('Tap on the cross button or X button to close the purchase popup and return to the shop page');
    await aui.waitFor(2000).exec();
    console.log('✅ Closed purchase popup');

    // Verify landed back on shop page
    const isBackOnShopPage = await aui.ask(
      'Are you back on the gem and gold shop page after closing the purchase popup?',
      { json_schema: { type: 'boolean' } }
    );
    expect(isBackOnShopPage).toBe(true);
    console.log('✅ Successfully returned to shop page');

    // ========== PART 3: GOLD SHOP UI VERIFICATION ==========

    console.log('🪙 ========== GOLD SHOP UI VERIFICATION ==========');

    // Navigate to gold shop section (if separate from gem shop)
    console.log('🪙 Step 4: Navigating to Gold Shop section...');
    // Check if gold shop is already visible or needs navigation
    const isGoldShopVisible = await aui.ask(
      'Do you see gold items or gold packages available for purchase on the current screen?',
      { json_schema: { type: 'boolean' } }
    );
    
    if (!isGoldShopVisible) {
      // May need to scroll or navigate to gold shop
      console.log('   Gold shop not immediately visible, looking for gold shop section...');
      await aui.act('Scroll or navigate to find the gold shop section with gold items or gold packages available for purchase');
      await aui.waitFor(2000).exec();
    }

    // 5) Click on any random gold amount (e.g., gold 600)
    console.log('🪙 Step 5: Clicking on a random gold item (e.g., gold 600)...');
    await aui.act('Look for gold items or gold packages available for purchase in the gold shop section. Click on any random gold item, for example a gold package that shows "600" or similar gold amount');
    await aui.waitFor(3000).exec();
    console.log('✅ Clicked on gold item');

    // 6) Verify purchase popup opens with "buy this item?" and details
    console.log('🔍 Step 6: Verifying purchase popup opened for gold...');
    let isGoldPurchasePopupOpen = false;
    for (let i = 0; i < 5; i++) {
      const hasBuyPopup = await aui.ask(
        'Do you see a popup or dialog that says "buy this item?" or similar purchase confirmation message?',
        { json_schema: { type: 'boolean' } }
      );
      
      const hasGoldDetails = await aui.ask(
        'Do you see details about the gold item including its quantity, price, or other purchase information in the popup?',
        { json_schema: { type: 'boolean' } }
      );
      
      if (hasBuyPopup && hasGoldDetails) {
        isGoldPurchasePopupOpen = true;
        console.log('✅ Purchase popup opened with gold details!');
        break;
      }
      await aui.waitFor(2000).exec();
    }
    expect(isGoldPurchasePopupOpen).toBe(true);

    // Close the popup using cross button
    console.log('❌ Closing gold purchase popup...');
    await aui.act('Tap on the cross button or X button to close the purchase popup and return to the shop page');
    await aui.waitFor(2000).exec();
    console.log('✅ Closed gold purchase popup');

    // Verify landed back on shop page
    const isBackOnGoldShopPage = await aui.ask(
      'Are you back on the gem and gold shop page after closing the gold purchase popup?',
      { json_schema: { type: 'boolean' } }
    );
    expect(isBackOnGoldShopPage).toBe(true);
    console.log('✅ Successfully returned to shop page');

    console.log('✅ Test completed successfully - Gem and Gold Shop UI elements and purchase popup verified!');
  }, 600000);

  it('should verify Bundle Shop UI elements and purchase popup', async () => {
    console.log('📦 Starting Bundle Shop UI Verification Test...');
    
    // Assumes we're already on the shop screen from previous tests
    // Verify we're on shop screen
    console.log('📱 Verifying we are on shop screen...');
    const isOnShopScreen = await aui.ask(
      'Are you on the shop screen with "Shop" heading visible?',
      { json_schema: { type: 'boolean' } }
    );
    expect(isOnShopScreen).toBe(true);
    console.log('✅ On shop screen');

    // ========== PART 1: NAVIGATE TO BUNDLE SHOP ==========

    // 1) Click on second icon from left which opens up bundle shop
    console.log('📦 Step 1: Clicking on second icon from left (Bundle Shop)...');
    await aui.act('Navigate to the left side of the shop screen. Look for the second icon from the left in the shop navigation or tab area. This should be the bundle shop icon. Tap on this second icon from the left');
    await aui.waitFor(3000).exec();
    console.log('✅ Clicked second icon from left');

    // Verify bundle shop is open
    console.log('🔍 Verifying Bundle Shop section is open...');
    let isBundleShopOpen = false;
    for (let i = 0; i < 5; i++) {
      const hasBundleShop = await aui.ask(
        'Do you see a bundle shop section with bundles available for purchase on the screen?',
        { json_schema: { type: 'boolean' } }
      );
      
      const hasBundles = await aui.ask(
        'Do you see any bundles or bundle packages displayed on the screen?',
        { json_schema: { type: 'boolean' } }
      );
      
      if (hasBundleShop || hasBundles) {
        isBundleShopOpen = true;
        console.log('✅ Bundle Shop section is open!');
        break;
      }
      await aui.waitFor(2000).exec();
    }
    expect(isBundleShopOpen).toBe(true);

    // ========== PART 2: VERIFY BUNDLES AND PURCHASE LIMITS ==========

    // 2) Verify that bundles are present (any number of bundles)
    console.log('📦 Step 2: Verifying bundles are present...');
    const hasBundles = await aui.ask(
      'Do you see any bundles or bundle packages displayed in the bundle shop section?',
      { json_schema: { type: 'boolean' } }
    );
    expect(hasBundles).toBe(true);
    console.log('✅ Bundles verified');

    // Verify specific bundle names (optional - if they exist)
    const hasNewPlayerBundle = await aui.ask(
      'Do you see a "New Player Bundle" or bundle labeled for new players in the bundle shop?',
      { json_schema: { type: 'boolean' } }
    );
    
    const hasDeckBoostBundle = await aui.ask(
      'Do you see a "Deck Boost Bundle" or bundle labeled for deck boosting in the bundle shop?',
      { json_schema: { type: 'boolean' } }
    );
    
    const hasCompletionistBundle = await aui.ask(
      'Do you see a "Completionist Bundle" or bundle labeled for completionists in the bundle shop?',
      { json_schema: { type: 'boolean' } }
    );
    
    if (hasNewPlayerBundle || hasDeckBoostBundle || hasCompletionistBundle) {
      console.log('✅ Bundle names verified');
    } else {
      console.log('ℹ️ Specific bundle names not found, but bundles are present');
    }

    // 3) Verify that there is purchase limit on the bundles
    console.log('🔢 Step 3: Verifying purchase limits on bundles...');
    
    // Check for purchase limit indicators
    const hasPurchaseLimit1 = await aui.ask(
      'Do you see a purchase limit displayed on any bundle that shows "purchase limit 1/1" or similar purchase limit indicator?',
      { json_schema: { type: 'boolean' } }
    );
    
    const hasPurchaseLimitNoLimit = await aui.ask(
      'Do you see a purchase limit displayed on any bundle that shows "no purchase limit" or "unlimited" or similar text indicating no purchase limit?',
      { json_schema: { type: 'boolean' } }
    );
    
    const hasPurchaseLimitText = await aui.ask(
      'Do you see purchase limit information displayed on the bundles, such as "purchase limit" text or purchase limit indicators?',
      { json_schema: { type: 'boolean' } }
    );
    
    expect(hasPurchaseLimit1 || hasPurchaseLimitNoLimit || hasPurchaseLimitText).toBe(true);
    console.log('✅ Purchase limits verified on bundles');

    // ========== PART 3: VERIFY PRICING INFORMATION ==========

    // 4) Verify that price is shown (how many diamonds will be charged)
    console.log('💎 Step 4: Verifying price/diamonds information is displayed...');
    
    const hasDiamondPrice = await aui.ask(
      'Do you see diamond prices or diamond amounts displayed on the bundles showing how many diamonds will be charged to buy each bundle?',
      { json_schema: { type: 'boolean' } }
    );
    
    const hasPriceDisplay = await aui.ask(
      'Do you see price information or cost information displayed on the bundles?',
      { json_schema: { type: 'boolean' } }
    );
    
    expect(hasDiamondPrice || hasPriceDisplay).toBe(true);
    console.log('✅ Price/diamonds information verified');

    // ========== PART 4: BUNDLE PURCHASE POPUP VERIFICATION ==========

    console.log('💳 ========== BUNDLE PURCHASE POPUP VERIFICATION ==========');

    // 5) Click on diamond icon/blue icon which opens up "buy this item" popup
    console.log('💎 Step 5: Clicking on diamond icon or blue icon to open purchase popup...');
    await aui.act('Look for a bundle in the bundle shop section. Find the diamond icon or blue icon or purchase button on one of the bundles. Tap on this diamond icon or blue icon to initiate the purchase');
    await aui.waitFor(3000).exec();
    console.log('✅ Clicked on diamond icon/blue icon');

    // Verify purchase popup opens with "buy this item?"
    console.log('🔍 Verifying purchase popup opened...');
    let isBundlePurchasePopupOpen = false;
    for (let i = 0; i < 5; i++) {
      const hasBuyPopup = await aui.ask(
        'Do you see a popup or dialog that says "buy this item?" or similar purchase confirmation message?',
        { json_schema: { type: 'boolean' } }
      );
      
      const hasBundleDetails = await aui.ask(
        'Do you see details about the bundle including its name, contents, or other purchase information in the popup?',
        { json_schema: { type: 'boolean' } }
      );
      
      if (hasBuyPopup && hasBundleDetails) {
        isBundlePurchasePopupOpen = true;
        console.log('✅ Purchase popup opened with bundle details!');
        break;
      }
      await aui.waitFor(2000).exec();
    }
    expect(isBundlePurchasePopupOpen).toBe(true);

    // Verify that name and details about bundle is displayed in the popup
    console.log('📋 Verifying bundle name and details in popup...');
    const hasBundleName = await aui.ask(
      'Do you see the bundle name displayed in the purchase popup?',
      { json_schema: { type: 'boolean' } }
    );
    
    const hasBundleDetails = await aui.ask(
      'Do you see detailed information about the bundle contents, what items are included, or other bundle details in the purchase popup?',
      { json_schema: { type: 'boolean' } }
    );
    
    expect(hasBundleName).toBe(true);
    expect(hasBundleDetails).toBe(true);
    console.log('✅ Bundle name and details verified in popup');

    // Close the popup using cross button
    console.log('❌ Closing bundle purchase popup...');
    await aui.act('Tap on the cross button or X button to close the purchase popup and return to the bundle shop page');
    await aui.waitFor(2000).exec();
    console.log('✅ Closed bundle purchase popup');

    // Verify landed back on shop page
    const isBackOnShopPage = await aui.ask(
      'Are you back on the bundle shop page after closing the purchase popup?',
      { json_schema: { type: 'boolean' } }
    );
    expect(isBackOnShopPage).toBe(true);
    console.log('✅ Successfully returned to bundle shop page');

    console.log('✅ Test completed successfully - Bundle Shop UI elements and purchase popup verified!');
  }, 600000);

  it('should verify Base Set UI elements and purchase popup', async () => {
    console.log('🎴 Starting Base Set UI Verification Test...');
    
    // 1) Verify that user is on shop page
    console.log('📱 Step 1: Verifying we are on shop screen...');
    const isOnShopScreen = await aui.ask(
      'Are you on the shop screen with "Shop" heading visible?',
      { json_schema: { type: 'boolean' } }
    );
    expect(isOnShopScreen).toBe(true);
    console.log('✅ On shop screen');

    // ========== PART 1: NAVIGATE TO BASE SET ==========

    // 2) Click on third icon from top on the left side (base set)
    console.log('🎴 Step 2: Clicking on third icon from top on left side (Base Set)...');
    await aui.act('Navigate to the shop page. On the left side of the screen, look for a vertical list of icons. Count from the top: first icon, second icon, third icon. Tap on the third icon from the top on the left side. This should be the Base Set icon');
    await aui.waitFor(3000).exec();
    console.log('✅ Clicked third icon from top on left side');

    // 3) Verify that you are on base set page
    console.log('🔍 Step 3: Verifying Base Set page is open...');
    let isBaseSetPageOpen = false;
    for (let i = 0; i < 5; i++) {
      const hasBaseSet = await aui.ask(
        'Do you see a "Base Set" section or base set-related content on the screen?',
        { json_schema: { type: 'boolean' } }
      );
      
      const hasBaseSetHeading = await aui.ask(
        'Do you see a heading or title that says "Base Set" on the screen?',
        { json_schema: { type: 'boolean' } }
      );
      
      const hasBoosterPacks = await aui.ask(
        'Do you see booster packs or pack-related items in the base set section?',
        { json_schema: { type: 'boolean' } }
      );
      
      if (hasBaseSet || hasBaseSetHeading || hasBoosterPacks) {
        isBaseSetPageOpen = true;
        console.log('✅ Base Set page is open!');
        break;
      }
      await aui.waitFor(2000).exec();
    }
    expect(isBaseSetPageOpen).toBe(true);

    // ========== PART 2: VERIFY PACKS AND PRICING ==========

    // 4) Verify that different purchase options like packs are available on the base set page
    console.log('📦 Step 4: Verifying packs are available on Base Set page...');
    const hasPacks = await aui.ask(
      'Do you see different packs or booster packs available for purchase on the base set page?',
      { json_schema: { type: 'boolean' } }
    );
    expect(hasPacks).toBe(true);
    console.log('✅ Packs verified on Base Set page');

    // 5) Verify that purchase amount is written with respect to diamonds and gold
    console.log('💎 Step 5: Verifying purchase amounts (diamonds and gold) are displayed...');
    
    const hasDiamondPrice = await aui.ask(
      'Do you see diamond prices or diamond amounts displayed on the packs showing how many diamonds will be charged to buy each pack?',
      { json_schema: { type: 'boolean' } }
    );
    
    const hasGoldPrice = await aui.ask(
      'Do you see gold prices or gold amounts displayed on the packs showing how many gold coins will be charged to buy each pack?',
      { json_schema: { type: 'boolean' } }
    );
    
    const hasPriceDisplay = await aui.ask(
      'Do you see price information or cost information displayed on the packs, either in diamonds or gold?',
      { json_schema: { type: 'boolean' } }
    );
    
    expect(hasDiamondPrice || hasGoldPrice || hasPriceDisplay).toBe(true);
    console.log('✅ Purchase amounts (diamonds and/or gold) verified');

    // ========== PART 3: BASE SET PURCHASE POPUP VERIFICATION ==========

    console.log('💳 ========== BASE SET PURCHASE POPUP VERIFICATION ==========');

    // 6) Click on any random pack to open purchase popup
    console.log('🎴 Step 6: Clicking on a random pack to open purchase popup...');
    await aui.act('Look for a pack or booster pack available for purchase on the base set page. Click on any random pack to initiate the purchase');
    await aui.waitFor(3000).exec();
    console.log('✅ Clicked on pack');

    // Verify purchase popup opens
    console.log('🔍 Verifying purchase popup opened...');
    let isPackPurchasePopupOpen = false;
    for (let i = 0; i < 5; i++) {
      const hasBuyPopup = await aui.ask(
        'Do you see a popup or dialog that says "buy this item?" or similar purchase confirmation message?',
        { json_schema: { type: 'boolean' } }
      );
      
      const hasPackDetails = await aui.ask(
        'Do you see details about the pack including its name, contents, or other purchase information in the popup?',
        { json_schema: { type: 'boolean' } }
      );
      
      if (hasBuyPopup && hasPackDetails) {
        isPackPurchasePopupOpen = true;
        console.log('✅ Purchase popup opened with pack details!');
        break;
      }
      await aui.waitFor(2000).exec();
    }
    expect(isPackPurchasePopupOpen).toBe(true);

    // Close the popup using cross button
    console.log('❌ Closing pack purchase popup...');
    await aui.act('Tap on the cross button or X button to close the purchase popup and return to the base set page');
    await aui.waitFor(2000).exec();
    console.log('✅ Closed pack purchase popup');

    // Verify landed back on base set page
    const isBackOnBaseSetPage = await aui.ask(
      'Are you back on the base set page after closing the purchase popup?',
      { json_schema: { type: 'boolean' } }
    );
    expect(isBackOnBaseSetPage).toBe(true);
    console.log('✅ Successfully returned to base set page');

    console.log('✅ Test completed successfully - Base Set UI elements and purchase popup verified!');
  }, 600000);
});

