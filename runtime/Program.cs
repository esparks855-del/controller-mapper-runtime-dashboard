using ControllerMapper;
class Program
{
    static void Main(string[] args)
    {
        Console.WriteLine("Controller Mapper Runtime v1.0");
        string configPath = "config.json";
        if (args.Length > 0) configPath = args[0];
        try
        {
            Console.WriteLine($"Loading config from: {configPath}");
            var mapping = ConfigLoader.Load(configPath);
            Console.WriteLine($"Loaded Profile: {mapping.Title} ({mapping.Modes.Count} modes)");
            var modeManager = new ModeManager(mapping);
            var inputManager = new InputManager();
            inputManager.OnInputEvent += (btn, type) =>
            {
                // Console.WriteLine($"Event: {btn} -> {type}");
                modeManager.HandleInput(btn, type);
            };
            Console.WriteLine("Runtime started. Press Ctrl+C to exit.");
            Console.WriteLine("Listening for XInput controller...");
            // Main Loop
            while (true)
            {
                inputManager.Update();
                Thread.Sleep(10); // 100Hz polling
            }
        }
        catch (Exception ex)
        {
            Console.ForegroundColor = ConsoleColor.Red;
            Console.WriteLine($"Fatal Error: {ex.Message}");
            Console.ResetColor();
        }
    }
}