using System.Runtime.InteropServices;
using static ControllerMapper.NativeMethods;
namespace ControllerMapper;
public class ActionExecutor
{
    public void Execute(Action action)
    {
        if (action == null) return;
        switch (action.Type)
        {
            case "key":
                SendKey(action.Value);
                break;
            case "mouseBtn":
                SendMouseClick(action.Value);
                break;
            case "mouseMove":
                // Basic implementation for relative move
                break;
            case "macro":
                Console.WriteLine($"[Macro] Executing: {action.Value}");
                break;
        }
    }
    private void SendKey(string keyName)
    {
        if (Enum.TryParse<ConsoleKey>(keyName, true, out var key))
        {
            ushort vk = (ushort)key; // Simplified mapping, real app needs full VK map
            var inputs = new INPUT[2];
            // Press
            inputs[0].type = INPUT_KEYBOARD;
            inputs[0].u.ki.wVk = vk;
            // Release
            inputs[1].type = INPUT_KEYBOARD;
            inputs[1].u.ki.wVk = vk;
            inputs[1].u.ki.dwFlags = KEYEVENTF_KEYUP;
            SendInput((uint)inputs.Length, inputs, Marshal.SizeOf(typeof(INPUT)));
            Console.WriteLine($"[Input] Key Tap: {keyName}");
        }
    }
    private void SendMouseClick(string btn)
    {
        var inputs = new INPUT[2];
        inputs[0].type = INPUT_MOUSE;
        inputs[1].type = INPUT_MOUSE;
        if (btn.ToLower() == "left")
        {
            inputs[0].u.mi.dwFlags = MOUSEEVENTF_LEFTDOWN;
            inputs[1].u.mi.dwFlags = MOUSEEVENTF_LEFTUP;
        }
        else if (btn.ToLower() == "right")
        {
            inputs[0].u.mi.dwFlags = MOUSEEVENTF_RIGHTDOWN;
            inputs[1].u.mi.dwFlags = MOUSEEVENTF_RIGHTUP;
        }
        SendInput((uint)inputs.Length, inputs, Marshal.SizeOf(typeof(INPUT)));
        Console.WriteLine($"[Input] Mouse Click: {btn}");
    }
}