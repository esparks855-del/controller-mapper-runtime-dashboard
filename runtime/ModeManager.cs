namespace ControllerMapper;
public class ModeManager
{
    private readonly Mapping _mapping;
    private readonly ActionExecutor _executor;
    private Mode _currentMode;
    public ModeManager(Mapping mapping)
    {
        _mapping = mapping;
        _executor = new ActionExecutor();
        _currentMode = _mapping.Modes.FirstOrDefault(m => m.Id == _mapping.DefaultMode)
                       ?? _mapping.Modes.First();
    }
    public void HandleInput(string buttonId, string type)
    {
        if (!_currentMode.Bindings.TryGetValue(buttonId, out var binding)) return;
        Action? action = type switch
        {
            "tap" => binding.Tap,
            "hold" => binding.Hold,
            "doubleTap" => binding.DoubleTap,
            "release" => binding.Release,
            _ => null
        };
        if (action != null)
        {
            if (action.Type == "modeSwitch")
            {
                SwitchMode(action.Value);
            }
            else
            {
                _executor.Execute(action);
            }
        }
    }
    private void SwitchMode(string modeId)
    {
        var newMode = _mapping.Modes.FirstOrDefault(m => m.Id == modeId);
        if (newMode != null)
        {
            _currentMode = newMode;
            Console.WriteLine($"[Mode] Switched to: {newMode.Name}");
        }
    }
}