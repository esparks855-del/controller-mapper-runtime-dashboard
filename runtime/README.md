# Controller Mapper Runtime (C#)
This is the standalone Windows runtime engine for the Controller Mapper project. It runs as a background console application, reading XInput controller states and simulating keyboard/mouse input based on a JSON configuration.
## Requirements
- Windows 10/11
- .NET 8.0 SDK (to build)
- .NET 8.0 Runtime (to run)
- An Xbox-compatible controller (XInput)
## Building
1. Open a terminal in this directory.
2. Run the build command:
   ```bash
   dotnet build -c Release
   ```
## Running
1. Create a `config.json` file (or export one from the web dashboard).
2. Run the executable:
   ```bash
   ./bin/Release/net8.0/ControllerMapper.exe config.json
   ```
## Architecture
- **Program.cs**: Entry point, sets up the main loop.
- **ConfigLoader.cs**: Deserializes JSON into C# objects.
- **InputManager.cs**: Polls XInput and detects Tap/Hold/DoubleTap.
- **ModeManager.cs**: Routes inputs to actions based on the active mode.
- **ActionExecutor.cs**: Executes actions (SendInput).
- **NativeMethods.cs**: P/Invoke definitions for Windows APIs.