using System.Text.Json;
namespace ControllerMapper;
public static class ConfigLoader
{
    public static Mapping Load(string path)
    {
        if (!File.Exists(path))
        {
            throw new FileNotFoundException($"Config file not found at: {path}");
        }
        try
        {
            string json = File.ReadAllText(path);
            var options = new JsonSerializerOptions
            {
                PropertyNameCaseInsensitive = true,
                ReadCommentHandling = JsonCommentHandling.Skip
            };
            var mapping = JsonSerializer.Deserialize<Mapping>(json, options);
            return mapping ?? throw new Exception("Deserialized mapping is null");
        }
        catch (Exception ex)
        {
            throw new Exception($"Failed to parse config: {ex.Message}", ex);
        }
    }
}