import { UiControlClient, UiController } from 'askui';

let aui: UiControlClient;

jest.setTimeout(60 * 1000 * 60);

beforeAll(async () => {
  // For Android testing:
  // 1. Start Android emulator or connect physical device
  // 2. Start AskUI Controller with Android runtime:
  //    askui-controller --runtime android --device-id <device-id>
  //    Example: askui-controller --runtime android --device-id emulator-5554
  // 3. Verify device ID with: adb devices
  
  aui = await UiControlClient.build({
    credentials: {
      workspaceId: process.env.ASKUI_WORKSPACE_ID || '',
      token: process.env.ASKUI_TOKEN || '',
    },
    // The uiControllerUrl remains the same for both desktop and Android
    // The AskUI Controller determines the target based on its startup arguments
    uiControllerUrl: process.env.ASKUI_CONTROLLER_URL || 'http://127.0.0.1:6769',
  });

  await aui.connect();
  
  // Optional: Verify controller configuration
  const controllerArgs = await aui.getControllerStartingArguments();
  console.log('AskUI Controller Runtime:', controllerArgs.runtime);
  if (controllerArgs.runtime === 'android') {
    console.log('Android Device ID:', controllerArgs.deviceId);
  }
});

afterAll(async () => {
  aui.disconnect();
});

export { aui };
