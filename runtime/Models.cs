using System.Text.Json.Serialization;
namespace ControllerMapper;
public class Mapping
{
    public string Title { get; set; } = "Untitled";
    public string Version { get; set; } = "1.0";
    public string ControllerType { get; set; } = "xbox";
    public string DefaultMode { get; set; } = "default";
    public List<Mode> Modes { get; set; } = new();
}
public class Mode
{
    public string Id { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public Dictionary<string, Binding> Bindings { get; set; } = new();
}
public class Binding
{
    public Action? Tap { get; set; }
    public Action? Hold { get; set; }
    public Action? DoubleTap { get; set; }
    public Action? Release { get; set; }
}
public class Action
{
    [JsonPropertyName("type")]
    public string Type { get; set; } = "key"; // key, mouseBtn, mouseMove, macro, modeSwitch
    [JsonPropertyName("value")]
    public string Value { get; set; } = string.Empty;
    [JsonPropertyName("params")]
    public Dictionary<string, object>? Params { get; set; }
}