# E2E Test Suite - Complete Documentation

## Overview
This document provides a comprehensive line-by-line breakdown of all tests and scenarios covered in `pixelmon-e2e.test.ts`.

**File Structure**: 2949 lines covering 8 major test suites with 22 individual test cases.

---

## Test Suite Structure

### Lines 1-43: Setup and Configuration

**Lines 1-3**: Imports
- `dotenv/config`: Environment variables
- `askui-helper`: AskUI automation helper
- `child_process`: For executing ADB commands

**Lines 5-22**: Documentation Header
- Describes the complete test flow sequence
- Lists all 10 major steps in the E2E test suite

**Lines 24-32**: `beforeAll` Hook
- Launches the Pixelmon TCG app via ADB
- Waits 8 seconds for app initialization
- Runs once before all tests

**Lines 34-43**: `afterAll` Hook
- Force stops the app after all tests complete
- Cleanup and teardown

---

## PART 1: ACCOUNT FLOW TESTS (Lines 45-330)

### Test Suite: Account Flow Tests
**Purpose**: Test account management features including logout, login, and user ID operations.

---

### Test 1: Account Screen Elements Verification (Lines 48-115)
**Test Name**: `should navigate to Account screen and verify all required elements`
**Timeout**: 300 seconds (5 minutes)

**Scenarios Covered**:
1. **App Visibility Check** (Lines 52-67)
   - Verifies app is open and visible
   - Relaunches app if not visible
   - Ensures app is in foreground

2. **Navigate to Account Screen** (Lines 69-77)
   - Clicks Account button
   - Waits for screen transition

3. **Verify Account Heading** (Lines 79-86)
   - Checks for "Account" heading/title
   - Confirms navigation was successful

4. **Verify Logout Option** (Lines 88-95)
   - Checks for "Logout" or "Log out" button
   - Ensures logout functionality is accessible

5. **Verify User ID Display** (Lines 97-104)
   - Checks for user ID or user identifier
   - Confirms user information is displayed

6. **Verify Delete Account Option** (Lines 106-113)
   - Checks for "Delete Account" option
   - Ensures account deletion feature is present

**End State**: On Account screen

---

### Test 2: Logout and Re-Login Flow (Lines 117-227)
**Test Name**: `should logout and re-login without clicking Start Game button`
**Timeout**: 300 seconds (5 minutes)

**Scenarios Covered**:
1. **Account Screen Verification** (Lines 121-133)
   - Checks if already on Account screen
   - Navigates to Account screen if needed

2. **Logout Process** (Lines 135-139)
   - Clicks Logout button
   - Initiates logout flow

3. **Login Screen Verification** (Lines 141-165)
   - Verifies navigation to login screen
   - Checks for Login button or Google sign-in options
   - Confirms logout was successful

4. **Login Flow** (Lines 167-212)
   - Clicks Login button
   - Selects Google sign-in option
   - Chooses registered email: `shubhamtestfinal@gmail.com`
   - Waits for login to complete

5. **Start Game Button Verification** (Lines 214-225)
   - Verifies "Start Game" button is visible
   - **IMPORTANT**: Does NOT click Start Game button
   - Confirms login was successful

**End State**: On Start Game screen (button visible but not clicked)

---

### Test 3: Copy User ID Flow (Lines 229-329)
**Test Name**: `should copy user ID and return to main screen`
**Timeout**: 300 seconds (5 minutes)

**Scenarios Covered**:
1. **Navigate to Account Screen** (Lines 233-244)
   - Clicks Account button
   - Verifies Account screen is open

2. **Copy User ID** (Lines 246-262)
   - Clicks copy button/icon next to user ID
   - Verifies copy action completed (checks for toast/confirmation)
   - Tests clipboard functionality

3. **Close Account Screen** (Lines 264-268)
   - Clicks cross/X button
   - Returns to previous screen

4. **Main Screen Verification** (Lines 270-294)
   - Verifies return to main screen
   - Checks for "Pixelmon TCG" text
   - Confirms navigation back to home

5. **Logout for Next Test Suite** (Lines 296-327)
   - Navigates to Account screen
   - Clicks Logout button
   - Verifies return to login/Start Game screen
   - Prepares app state for Options Flow Tests

**End State**: On login/Start Game screen

---

## PART 2: OPTIONS FLOW TESTS (Lines 332-838)

### Test Suite: Options Flow Tests
**Purpose**: Test options/settings screen and all sub-pages (Terms, Privacy, Customer Service, Report Bug).

---

### Test 1: Options Screen Elements Verification (Lines 335-407)
**Test Name**: `should navigate to Options screen and verify all required elements`
**Timeout**: 300 seconds (5 minutes)

**Scenarios Covered**:
1. **Start Game Button Handling** (Lines 339-358)
   - Checks if Start Game button is visible
   - Clicks Start Game if present (NEW FIX)
   - Verifies Play button on homepage
   - Ensures proper state for Options access

2. **Navigate to Options Screen** (Lines 360-365)
   - Clicks Options button
   - Waits for screen transition

3. **Verify Options Title** (Lines 367-374)
   - Checks for "Options" text/title
   - Confirms Options screen opened

4. **Verify Audio Section** (Lines 376-383)
   - Checks for audio section or audio settings
   - Confirms audio controls are present

5. **Verify Terms of Service** (Lines 385-393)
   - Checks for "Terms of Service" text
   - Confirms legal link is present

6. **Verify Privacy Policy** (Lines 395-402)
   - Checks for "Privacy Policy" text
   - Confirms privacy link is present

7. **Verify Customer Service** (Lines 404-411)
   - Checks for "Customer Service" text
   - Confirms support link is present

8. **Verify Report a Bug** (Lines 413-420)
   - Checks for "Report a Bug" text
   - Confirms bug reporting link is present

9. **Return to Previous Screen** (Lines 422-426)
   - Clicks back button
   - Returns to previous screen

**End State**: Back on previous screen (likely main screen or Start Game screen)

---

### Test 2: Terms of Service Page (Lines 409-490)
**Test Name**: `should navigate to Terms of Service page and verify all elements`
**Timeout**: 300 seconds (5 minutes)

**Scenarios Covered**:
1. **Navigate to Options Screen** (Lines 413-416)
   - Clicks Options button
   - Ensures Options screen is open

2. **Open Terms of Service** (Lines 418-422)
   - Clicks "Terms of Service" button/text
   - Navigates to Terms page

3. **Verify Terms Page** (Lines 424-448)
   - Checks for "Terms of Service" heading
   - Verifies Terms content/legal text is displayed
   - Confirms navigation was successful

4. **Verify Terms Heading** (Lines 450-457)
   - Checks for "Terms of Service" heading at top
   - Confirms proper page structure

5. **Verify Mon Logo in Header** (Lines 459-466)
   - Checks for "mon" logo or text in header
   - Verifies branding is present

6. **Return to Options Screen** (Lines 468-488)
   - Presses Android back button (KEYCODE_BACK)
   - Verifies return to Options screen
   - Confirms navigation works correctly

**End State**: Back on Options screen

---

### Test 3: Privacy Policy Page (Lines 492-581)
**Test Name**: `should navigate to Privacy Policy page and verify all elements`
**Timeout**: 300 seconds (5 minutes)

**Scenarios Covered**:
1. **Options Screen Check** (Lines 496-507)
   - Verifies if already on Options screen
   - Navigates to Options if needed

2. **Open Privacy Policy** (Lines 509-513)
   - Clicks "Privacy Policy" button/text
   - Navigates to Privacy page

3. **Verify Privacy Page** (Lines 515-539)
   - Checks for "Privacy Policy" heading
   - Verifies Privacy content/legal text
   - Confirms navigation was successful

4. **Verify Privacy Heading** (Lines 541-548)
   - Checks for "Privacy Policy" heading at top
   - Confirms proper page structure

5. **Verify Mon Logo in Header** (Lines 550-557)
   - Checks for "mon" logo or text in header
   - Verifies branding is present

6. **Return to Options Screen** (Lines 559-579)
   - Presses Android back button
   - Verifies return to Options screen

**End State**: Back on Options screen

---

### Test 4: Customer Service Page (Lines 583-663)
**Test Name**: `should navigate to Customer Service page and verify all elements`
**Timeout**: 300 seconds (5 minutes)

**Scenarios Covered**:
1. **Options Screen Check** (Lines 587-598)
   - Verifies if already on Options screen
   - Navigates to Options if needed

2. **Open Customer Service** (Lines 600-604)
   - Clicks "Customer Service" button/text
   - Navigates to Customer Service page

3. **Verify Customer Service Page** (Lines 606-630)
   - Checks for "what can we help you with ?" text
   - Verifies Customer Service content
   - Confirms navigation was successful

4. **Verify Help Text** (Lines 632-639)
   - Checks for "what can we help you with ?" text
   - Confirms support message is displayed

5. **Return to Options Screen** (Lines 641-661)
   - Presses Android back button
   - Verifies return to Options screen

**End State**: Back on Options screen

---

### Test 5: Report a Bug Page (Lines 665-745)
**Test Name**: `should navigate to Report a Bug page and verify all elements`
**Timeout**: 300 seconds (5 minutes)

**Scenarios Covered**:
1. **Options Screen Check** (Lines 669-680)
   - Verifies if already on Options screen
   - Navigates to Options if needed

2. **Open Report a Bug** (Lines 682-686)
   - Clicks "Report a Bug" button/text
   - Navigates to Report Bug page

3. **Verify Report Bug Page** (Lines 688-712)
   - Checks for "what can we help you with ?" text
   - Verifies Report Bug content/form
   - Confirms navigation was successful

4. **Verify Help Text** (Lines 714-721)
   - Checks for "what can we help you with ?" text
   - Confirms support message is displayed

5. **Return to Options Screen** (Lines 723-743)
   - Presses Android back button
   - Verifies return to Options screen

**End State**: Back on Options screen

---

### Test 6: Back Button Navigation (Lines 747-837)
**Test Name**: `should click back button on Options screen and return to main screen`
**Timeout**: 300 seconds (5 minutes)

**Scenarios Covered**:
1. **Options Screen Check** (Lines 751-761)
   - Verifies if already on Options screen
   - Navigates to Options if needed

2. **Verify Options Screen** (Lines 763-770)
   - Confirms Options screen is open
   - Verifies "Options" text is visible

3. **Click Back Button** (Lines 772-776)
   - Clicks back button in top right corner
   - Returns to previous screen

4. **Main Screen Verification** (Lines 778-802)
   - Verifies return to main screen
   - Checks for "Pixelmon TCG" text
   - Confirms navigation back to home

5. **Logout for Next Test Suite** (Lines 804-835)
   - Navigates to Account screen
   - Clicks Logout button
   - Verifies return to login/Start Game screen
   - Prepares app state for Login Flow Tests

**End State**: On login/Start Game screen

---

## PART 3: PRE-LOGIN SETUP (Lines 840-853)

### Test Suite: Pre-Login Setup
**Purpose**: Prepare app state for login flow testing.

---

### Test: Kill App (Lines 842-852)
**Test Name**: `should kill app to prepare for login flow test`
**Timeout**: 30 seconds

**Scenarios Covered**:
1. **Force Stop App** (Lines 844-851)
   - Force stops Pixelmon TCG app via ADB
   - Ensures clean state for login tests
   - Waits 2 seconds after stopping

**End State**: App is killed/stopped

---

## PART 4: LOGIN FLOW TESTS (Lines 855-971)

### Test Suite: Login Flow Tests
**Purpose**: Test complete login flow and verify homepage access.

---

### Test: Auto-Login Flow (Lines 859-970)
**Test Name**: `should auto login and verify homepage Play button`
**Timeout**: 300 seconds (5 minutes)

**Scenarios Covered**:
1. **Launch App** (Lines 862-886)
   - Launches app via ADB (app was killed in previous step)
   - Verifies app is visible
   - Relaunches if not visible

2. **Auto-Login Detection** (Lines 888-929)
   - Waits for auto-login to complete
   - Checks for "Start Game" button (indicates logged in)
   - Checks for login screen elements
   - Handles login in progress state
   - Waits up to 10 attempts for login completion

3. **Click Start Game** (Lines 931-946)
   - Looks for "Start Game" button
   - Clicks Start Game button
   - Waits for navigation

4. **Homepage Verification** (Lines 948-968)
   - Verifies Play button is visible
   - Checks for home page/main screen
   - Confirms successful login and navigation
   - Verifies all expected elements

**End State**: On MAIN SCREEN (homepage with Play button visible)

---

## PART 5: PROFILE FLOW TESTS (Lines 973-1529)

### Test Suite: Profile Flow Tests
**Purpose**: Test profile management features including icon change, name change, and user ID operations.

---

### Test 1: Profile Screen Elements (Lines 977-1068)
**Test Name**: `should navigate to home page, open Profile and verify all elements`
**Timeout**: 600 seconds (10 minutes)

**Scenarios Covered**:
1. **Homepage Verification** (Lines 1004-1021)
   - Verifies on home page
   - Checks for Play button if not on home page
   - Ensures correct starting state

2. **Navigate to Profile** (Lines 1025-1032)
   - Finds and clicks profile icon (top left corner)
   - Uses natural language to locate golden circular icon with red creature
   - Waits for profile screen to load

3. **Verify Profile Screen** (Lines 1034-1039)
   - Checks for "Profile" heading
   - Verifies profile-related content
   - Confirms navigation was successful

4. **Verify Player Level and Score** (Lines 1041-1048)
   - Checks for "Player Level" or "Level"
   - Verifies numerical "Score" is displayed
   - Confirms player stats are visible

5. **Verify Username and User ID** (Lines 1050-1057)
   - Checks for "Username" display
   - Verifies "User ID" is shown
   - Confirms user information is present

6. **Verify Collected Cards Section** (Lines 1059-1066)
   - Checks for "Collected Cards" or "Unique Cards" section
   - Verifies card list is displayed
   - Confirms collection data is visible

**End State**: On Profile screen

---

### Test 2: Profile Icon Change (Lines 1070-1192)
**Test Name**: `should change profile icon using pencil icon and save`
**Timeout**: 300 seconds (5 minutes)

**Scenarios Covered**:
1. **Profile Screen Check** (Lines 1074-1095)
   - Verifies if already on Profile screen
   - Navigates to Profile if needed

2. **Click Pencil Icon** (Lines 1099-1109)
   - Finds and clicks pencil icon near profile image
   - Waits for icon selection screen to load

3. **Verify Icon Selection Screen** (Lines 1111-1140)
   - Checks for icon options/grid
   - Verifies Save/Confirm button is present
   - Confirms icon selection screen opened

4. **Verify Multiple Icons Available** (Lines 1142-1149)
   - Checks for multiple icon/image options
   - Confirms selection choices are available

5. **Save Icon Selection** (Lines 1151-1159)
   - Clicks Save button
   - Waits for navigation back to profile

6. **Verify Return to Profile** (Lines 1161-1190)
   - Verifies return to profile page
   - Checks for Profile heading/content
   - Confirms icon selection screen is closed
   - Verifies icon change was saved

**End State**: Back on Profile screen with new icon

---

### Test 3: Player Name/Tag Change (Lines 1194-1381)
**Test Name**: `should change player name/tag using pencil icon, confirm, and then cancel`
**Timeout**: 300 seconds (5 minutes)

**Scenarios Covered**:

**PART 1: Change Name Flow**
1. **Profile Screen Check** (Lines 1198-1219)
   - Verifies if already on Profile screen
   - Navigates to Profile if needed

2. **Click Pencil Icon Beside Name** (Lines 1223-1233)
   - Finds and clicks pencil icon beside player name tag
   - Waits for name change screen to load

3. **Verify Change Player Tag Screen** (Lines 1235-1264)
   - Checks for "Change Player Tag" or "Change Name" heading
   - Verifies name input field is present
   - Confirms Confirm/Save button is available

4. **Verify Name Change Options** (Lines 1266-1273)
   - Checks for options to change name
   - Confirms input field is available

5. **Enter Random Name** (Lines 1275-1283)
   - Generates random name: `Player{randomNumber}`
   - Taps on name input field
   - Clears existing text
   - Types new random name

6. **Confirm Name Change** (Lines 1285-1293)
   - Clicks Confirm button
   - Waits for navigation back to profile

7. **Verify Return After Confirm** (Lines 1295-1324)
   - Verifies return to profile page
   - Confirms name change screen is closed
   - Verifies name was updated

**PART 2: Cancel Flow**
8. **Click Pencil Icon Again** (Lines 1328-1338)
   - Clicks pencil icon beside name again
   - Opens name change screen again

9. **Cancel Name Change** (Lines 1340-1348)
   - Clicks Cancel button
   - Cancels without saving changes

10. **Verify Return After Cancel** (Lines 1350-1379)
    - Verifies return to profile page
    - Confirms name change screen is closed
    - Verifies cancel worked correctly

**End State**: Back on Profile screen

---

### Test 4: Player Level and User ID Masking (Lines 1383-1528)
**Test Name**: `should verify player level, test user ID masking/unmasking, and navigate back to homepage`
**Timeout**: 300 seconds (5 minutes)

**Scenarios Covered**:

**PART 1: Verify Player Level**
1. **Profile Screen Check** (Lines 1387-1408)
   - Verifies if already on Profile screen
   - Navigates to Profile if needed

2. **Verify Player Level** (Lines 1412-1419)
   - Checks for player level at top of screen
   - Verifies level number is displayed (any number: 1, 2, 3, etc.)

**PART 2: User ID Masking/Unmasking**
3. **Check Current User ID State** (Lines 1423-1430)
   - Checks if user ID is currently visible or masked
   - Determines initial state

4. **Find Eye Icon** (Lines 1432-1437)
   - Looks for eye icon near user ID field
   - Verifies masking/unmasking control exists

5. **Mask User ID (if visible)** (Lines 1439-1452)
   - If user ID is visible, clicks eye icon to mask it
   - Verifies user ID is now masked (not visible)
   - Confirms masking functionality works

6. **Unmask User ID** (Lines 1457-1468)
   - Clicks eye icon again to unmask
   - Verifies user ID is now visible
   - Confirms unmasking functionality works

7. **Handle No Eye Icon** (Lines 1469-1477)
   - If no eye icon found, verifies current state
   - Logs current visibility state

**PART 3: Navigate Back to Homepage**
8. **Click Back Button** (Lines 1481-1489)
   - Clicks back button
   - Waits for navigation to homepage

9. **Homepage Verification** (Lines 1491-1527)
   - Verifies landing on homepage
   - Checks for Play button
   - Confirms Profile screen is closed
   - Verifies all expected elements

**End State**: On MAIN SCREEN (homepage with Play button)

---

## PART 6: MAIL FLOW TESTS (Lines 1531-1909)

### Test Suite: Mail Flow Tests
**Purpose**: Test mail/inbox functionality including reward claiming and navigation.

---

### Test 1: Mail Screen Elements (Lines 1535-1604)
**Test Name**: `should navigate to home page, open Mail and verify all elements`
**Timeout**: 600 seconds (10 minutes)

**Scenarios Covered**:
1. **Homepage Verification** (Lines 1539-1555)
   - Verifies on home page
   - Checks for Play button if not on home page
   - Ensures correct starting state

2. **Navigate to Mail** (Lines 1559-1570)
   - Finds and clicks envelope icon (top right corner)
   - Uses natural language to locate envelope with red notification dot
   - Waits for mail screen to load

3. **Verify Mail Screen** (Lines 1572-1602)
   - Checks for "Mail" heading
   - Verifies mail messages/inbox content
   - Confirms mail screen opened successfully

**End State**: On Mail screen

---

### Test 2: Mail Rewards Claim Flow (Lines 1606-1908)
**Test Name**: `should claim rewards from mail entries and verify tick marks`
**Timeout**: 600 seconds (10 minutes)

**Scenarios Covered**:

**PART 1: Check and Claim Mail Entries**
1. **Mail Screen Check** (Lines 1610-1631)
   - Verifies if already on Mail screen
   - Navigates to Mail if needed

2. **Check Mail List** (Lines 1635-1648)
   - Checks for mail entries in the list
   - Determines if mails are available

3. **Check Claimed vs Unclaimed Mails** (Lines 1650-1675)
   - Identifies unclaimed mails (without tick marks)
   - Identifies claimed mails (with tick marks)
   - Categorizes mail status

4. **Claim Unclaimed Mail** (Lines 1677-1816)
   - If unclaimed mail exists:
     - Clicks on unclaimed mail entry
     - Checks for claimable items
     - Clicks "Claim" or "Claim Reward" button
     - Handles multiple reward screens (gems, diamonds, etc.)
     - Clicks "Tap to Continue" for each reward screen
     - Verifies tick mark appears after claiming
     - Returns to mail list

5. **Verify Claimed Mails Cannot Be Claimed Again** (Lines 1819-1856)
   - If claimed mail exists:
     - Clicks on claimed mail entry
     - Verifies no "Claim" button is available
     - Confirms claimed mails cannot be re-claimed
     - Returns to mail list

**PART 2: Close Mail Screen**
6. **Close Mail Screen** (Lines 1859-1865)
   - Clicks cross/X button
   - Closes mail screen

7. **Homepage Verification** (Lines 1867-1907)
   - Verifies landing on homepage
   - Checks for Play button
   - Confirms Mail screen is closed
   - Verifies all expected elements

**End State**: On MAIN SCREEN (homepage with Play button)

---

## PART 7: GAME MODE FLOW TESTS (Lines 1911-2148)

### Test Suite: Game Mode Flow Tests
**Purpose**: Test game mode selection and information display.

---

### Test: Game Mode Change Flow (Lines 1915-2147)
**Test Name**: `should navigate to home page, open game mode screen, interact with info icon, choose mode and verify on main screen`
**Timeout**: 600 seconds (10 minutes)

**Scenarios Covered**:
1. **Homepage Verification** (Lines 1919-1935)
   - Verifies on home page
   - Checks for Play button if not on home page
   - Ensures correct starting state

2. **Navigate to Game Mode** (Lines 1939-1949)
   - Finds and clicks game mode icon (golden shield icon)
   - Uses natural language to locate shield with horned insect emblem
   - Waits for game mode screen to load

3. **Verify Game Mode Screen** (Lines 1951-1991)
   - Checks for game mode selection screen
   - Verifies different game mode options are available
   - Confirms Practice mode is visible
   - Confirms Duel mode is visible

4. **Click Info Icon** (Lines 1993-2003)
   - Finds and clicks exclamation mark (!) icon
   - Waits for message to appear

5. **Verify Info Message** (Lines 2005-2021)
   - Checks for message/information popup
   - Verifies message is displayed after clicking info icon

6. **Close Info Message** (Lines 2023-2033)
   - Clicks cross/X button to close message
   - Waits for message to close

7. **Verify Return to Game Mode Screen** (Lines 2035-2056)
   - Verifies message is closed
   - Confirms game mode screen is displayed again
   - Verifies all mode options are visible

8. **Choose Game Mode** (Lines 2058-2091)
   - Checks which modes are available (Practice or Duel)
   - Selects Practice mode if available
   - Otherwise selects Duel mode
   - Or selects any available game mode
   - Waits for navigation back to main screen

9. **Verify Return to Main Screen** (Lines 2093-2114)
   - Verifies return to main screen/homepage
   - Checks for big "Play" button
   - Confirms navigation was successful

10. **Verify Game Mode Display** (Lines 2116-2144)
    - Verifies game mode information is displayed above Play button
    - Checks for chosen game mode text (Practice or Duel)
    - Confirms mode selection is visible on main screen

**End State**: On MAIN SCREEN (homepage with Play button and selected game mode displayed)

---

## PART 8: SHOP FLOW TESTS (Lines 2150-2920)

### Test Suite: Shop Flow Tests
**Purpose**: Test shop functionality including navigation, UI verification, and purchase popup interactions (without actual purchases).

---

### Test 1: Shop Screen Navigation (Lines 2154-2253)
**Test Name**: `should navigate to home page, open Shop and verify all elements`
**Timeout**: 600 seconds (10 minutes)

**Scenarios Covered**:
1. **Homepage Verification** (Lines 2181-2174)
   - Verifies on home page
   - Checks for Play button if not on home page
   - Ensures correct starting state

2. **Navigate to Shop** (Lines 2178-2189)
   - Finds and clicks shop icon (bottom left, second icon from left)
   - Uses natural language to locate shop icon in bottom navigation
   - Waits for screen to load

3. **Handle Shop Details Screen** (Lines 2191-2206)
   - Checks for intermediate shop details screen
   - Looks for "do not show this message again" text
   - Clicks cross button to close if present
   - Handles optional informational popup

4. **Verify Shop Screen** (Lines 2212-2251)
   - Checks for "Shop" heading at top
   - Verifies shop-related content is displayed
   - Confirms shop screen opened successfully
   - Verifies "Shop" heading specifically

**End State**: On Shop screen

---

### Test 2: Shop Sections Verification (Lines 2255-2447)
**Test Name**: `should verify all three shop sections: Gem/Diamond Shop, Bundle Shop, and Base Set`
**Timeout**: 600 seconds (10 minutes)

**Scenarios Covered**:

**PART 1: Gem and Diamond Shop**
1. **Shop Screen Check** (Lines 2259-2267)
   - Verifies on shop screen
   - Confirms "Shop" heading is visible

2. **Navigate to Gem/Diamond Shop** (Lines 2271-2275)
   - Clicks first icon from left
   - Opens gem and diamond shop section

3. **Verify Gem/Diamond Shop** (Lines 2277-2319)
   - Checks for gem shop section
   - Checks for diamond shop section
   - Checks for gold shop section
   - Verifies currency message: "buy various currencies like gold and diamond"
   - Confirms section opened successfully

**PART 2: Bundle Shop**
4. **Navigate to Bundle Shop** (Lines 2323-2327)
   - Clicks second icon from left
   - Opens bundle shop section

5. **Verify Bundle Shop** (Lines 2329-2384)
   - Checks for "New Player Bundle"
   - Checks for "Deck Boost Bundle"
   - Checks for "Completionist Bundle"
   - Verifies bundle message: "grab value packed deals with cards currency and more"
   - Checks for three bundles displayed
   - Confirms bundles are present

**PART 3: Base Set**
6. **Navigate to Base Set** (Lines 2388-2392)
   - Clicks third icon from left
   - Opens base set section

7. **Verify Base Set** (Lines 2394-2444)
   - Checks for "Base Set" section
   - Checks for booster packs
   - Verifies base set message: "open booster pack to expand your collection"
   - Checks for three packs displayed
   - Confirms section opened successfully

**End State**: On Base Set section of Shop screen

---

### Test 3: Gem and Gold Shop UI Verification (Lines 2449-2604)
**Test Name**: `should verify Gem Shop and Gold Shop UI elements and purchase popup`
**Timeout**: 600 seconds (10 minutes)

**Scenarios Covered**:

**PART 1: Navigate to Gem/Gold Shop**
1. **Shop Screen Check** (Lines 2453-2461)
   - Verifies on shop screen

2. **Navigate to Gem/Gold Shop** (Lines 2465-2492)
   - Clicks first icon from left
   - Verifies gem and gold shop section is open

**PART 2: Gem Shop UI Verification**
3. **Click Gem Item** (Lines 2498-2502)
   - Clicks on random gem item (e.g., gem 90)
   - Opens purchase popup

4. **Verify Purchase Popup** (Lines 2504-2525)
   - Checks for "buy this item?" popup
   - Verifies gem details (quantity, price) in popup
   - Confirms popup opened successfully

5. **Close Popup** (Lines 2527-2539)
   - Clicks cross/X button
   - Closes purchase popup
   - Verifies return to shop page

**PART 3: Gold Shop UI Verification**
6. **Navigate to Gold Shop** (Lines 2545-2558)
   - Checks if gold shop is visible
   - Scrolls/navigates to gold shop if needed

7. **Click Gold Item** (Lines 2560-2564)
   - Clicks on random gold item (e.g., gold 600)
   - Opens purchase popup

8. **Verify Gold Purchase Popup** (Lines 2566-2587)
   - Checks for "buy this item?" popup
   - Verifies gold details (quantity, price) in popup
   - Confirms popup opened successfully

9. **Close Gold Popup** (Lines 2589-2601)
   - Clicks cross/X button
   - Closes purchase popup
   - Verifies return to shop page

**End State**: On Gem/Gold Shop page

---

### Test 4: Bundle Shop UI Verification (Lines 2606-2788)
**Test Name**: `should verify Bundle Shop UI elements and purchase popup`
**Timeout**: 600 seconds (10 minutes)

**Scenarios Covered**:

**PART 1: Navigate to Bundle Shop**
1. **Shop Screen Check** (Lines 2610-2618)
   - Verifies on shop screen

2. **Navigate to Bundle Shop** (Lines 2622-2649)
   - Clicks second icon from left
   - Verifies bundle shop section is open

**PART 2: Verify Bundles and Purchase Limits**
3. **Verify Bundles Present** (Lines 2653-2682)
   - Checks for bundles or bundle packages
   - Verifies specific bundle names (New Player, Deck Boost, Completionist)
   - Confirms bundles are displayed

4. **Verify Purchase Limits** (Lines 2684-2704)
   - Checks for purchase limit indicators
   - Looks for "purchase limit 1/1" or similar
   - Checks for "no purchase limit" or "unlimited" text
   - Verifies purchase limit information is displayed

**PART 3: Verify Pricing Information**
5. **Verify Price Display** (Lines 2708-2722)
   - Checks for diamond prices on bundles
   - Verifies price/cost information is displayed
   - Confirms pricing is visible

**PART 4: Bundle Purchase Popup Verification**
6. **Click Bundle Purchase Button** (Lines 2728-2732)
   - Clicks diamond icon or blue icon on bundle
   - Opens purchase popup

7. **Verify Purchase Popup** (Lines 2734-2771)
   - Checks for "buy this item?" popup
   - Verifies bundle name in popup
   - Verifies bundle details (contents, items included) in popup
   - Confirms popup opened with correct information

8. **Close Popup** (Lines 2773-2785)
   - Clicks cross/X button
   - Closes purchase popup
   - Verifies return to bundle shop page

**End State**: On Bundle Shop page

---

### Test 5: Base Set UI Verification (Lines 2790-2919)
**Test Name**: `should verify Base Set UI elements and purchase popup`
**Timeout**: 600 seconds (10 minutes)

**Scenarios Covered**:

**PART 1: Navigate to Base Set**
1. **Shop Screen Check** (Lines 2794-2801)
   - Verifies on shop screen

2. **Navigate to Base Set** (Lines 2805-2837)
   - Clicks third icon from top on left side
   - Verifies base set page is open

**PART 2: Verify Packs and Pricing**
3. **Verify Packs Available** (Lines 2841-2848)
   - Checks for different packs or booster packs
   - Confirms packs are available for purchase

4. **Verify Purchase Amounts** (Lines 2850-2869)
   - Checks for diamond prices on packs
   - Checks for gold prices on packs
   - Verifies price information is displayed
   - Confirms pricing in both currencies

**PART 3: Base Set Purchase Popup Verification**
5. **Click Pack** (Lines 2875-2879)
   - Clicks on random pack
   - Opens purchase popup

6. **Verify Purchase Popup** (Lines 2881-2902)
   - Checks for "buy this item?" popup
   - Verifies pack details (name, contents) in popup
   - Confirms popup opened successfully

7. **Close Popup** (Lines 2904-2916)
   - Clicks cross/X button
   - Closes purchase popup
   - Verifies return to base set page

**End State**: On Base Set page

---

## Summary Statistics

### Test Suites: 8
1. Account Flow Tests (3 tests)
2. Options Flow Tests (6 tests)
3. Pre-Login Setup (1 test)
4. Login Flow Tests (1 test)
5. Profile Flow Tests (4 tests)
6. Mail Flow Tests (2 tests)
7. Game Mode Flow Tests (1 test)
8. Shop Flow Tests (5 tests)

### Total Test Cases: 23

### Total Lines: 2949

### Key Features Tested:
- ✅ Account management (logout, login, user ID)
- ✅ Options/settings navigation
- ✅ Legal pages (Terms, Privacy)
- ✅ Support pages (Customer Service, Report Bug)
- ✅ Login flow (auto-login, manual login)
- ✅ Profile management (icon, name, level, user ID masking)
- ✅ Mail/inbox functionality
- ✅ Reward claiming
- ✅ Game mode selection
- ✅ Shop navigation
- ✅ Shop sections (Gem, Bundle, Base Set)
- ✅ Purchase popup verification (without actual purchases)

### Important Notes:
- **No actual purchases are made** - only popup verification
- All tests use natural language commands via AskUI
- Tests are designed to run sequentially
- Each test suite ensures correct state for next suite
- Comprehensive UI element verification throughout

