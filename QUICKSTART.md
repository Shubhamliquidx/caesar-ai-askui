# Quick Start Guide

## Step 1: Install AskUI Desktop App

The AskUI desktop app (AskUI-Suite.dmg) has been downloaded to your Downloads folder.

To install:
```bash
open ~/Downloads/AskUI-Suite.dmg
```

Then drag the AskUI app to your Applications folder and launch it.

## Step 2: Get Your Credentials

1. Sign up at https://app.askui.com
2. Get your credentials:
   - Access Token
   - Workspace ID

## Step 3: Configure Environment

Create a `.env` file in the project root:

```bash
cp .env.example .env
```

Edit `.env` and add your credentials:
```
ASKUI_TOKEN=your_actual_token
ASKUI_WORKSPACE_ID=your_actual_workspace_id
```

## Step 4: Start AskUI Controller

Launch the AskUI desktop app you installed in Step 1. It needs to be running for tests to work.

## Step 5: Run Your First Test

```bash
npm test
```

## Next Steps

### Using Caesar AI

Caesar AI allows you to write automation tests in natural language. Edit `test/example.test.ts` and try:

```typescript
await aui.exec('Click on the login button');
await aui.exec('Type "user@example.com" in the email field');
await aui.exec('Type "password123" in the password field');
await aui.exec('Click submit');
```

### Using Traditional API

You can also use the traditional AskUI API:

```typescript
await aui.click().button().withText('Login').exec();
await aui.type('user@example.com').textfield().contains().text('email').exec();
```

### Resources

- [AskUI Docs](https://docs.askui.com)
- [Caesar AI Guide](https://docs.askui.com/docs/general/Caesar/overview)
- [API Reference](https://docs.askui.com/docs/api/API/table-of-contents)
