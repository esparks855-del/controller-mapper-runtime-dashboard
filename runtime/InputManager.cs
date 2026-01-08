using static ControllerMapper.NativeMethods;
namespace ControllerMapper;
public class InputManager
{
    private XINPUT_STATE _prevState;
    private readonly Dictionary<ushort, ButtonState> _buttonStates = new();
    private const int TAP_THRESHOLD_MS = 200;
    private const int HOLD_THRESHOLD_MS = 300;
    private const int DOUBLE_TAP_WINDOW_MS = 250;
    private class ButtonState
    {
        public bool IsPressed;
        public DateTime PressTime;
        public DateTime ReleaseTime;
        public int TapCount;
        public bool Handled;
    }
    public delegate void InputEventHandler(string buttonId, string type);
    public event InputEventHandler? OnInputEvent;
    public void Update()
    {
        XINPUT_STATE state;
        uint result = XInputGetState(0, out state);
        if (result != ERROR_SUCCESS) return;
        // Check buttons (Simplified mask check for demo)
        CheckButton(state, _prevState, 0x1000, "A");
        CheckButton(state, _prevState, 0x2000, "B");
        CheckButton(state, _prevState, 0x4000, "X");
        CheckButton(state, _prevState, 0x8000, "Y");
        // Triggers and Sticks would go here...
        _prevState = state;
    }
    private void CheckButton(XINPUT_STATE current, XINPUT_STATE prev, ushort mask, string id)
    {
        bool isDown = (current.Gamepad.wButtons & mask) != 0;
        bool wasDown = (prev.Gamepad.wButtons & mask) != 0;
        if (!_buttonStates.ContainsKey(mask)) _buttonStates[mask] = new ButtonState();
        var bState = _buttonStates[mask];
        if (isDown && !wasDown) // Press
        {
            bState.IsPressed = true;
            bState.PressTime = DateTime.Now;
            bState.Handled = false;
            // Check for double tap
            if ((DateTime.Now - bState.ReleaseTime).TotalMilliseconds < DOUBLE_TAP_WINDOW_MS)
            {
                bState.TapCount++;
            }
            else
            {
                bState.TapCount = 1;
            }
        }
        else if (!isDown && wasDown) // Release
        {
            bState.IsPressed = false;
            bState.ReleaseTime = DateTime.Now;
            var pressDuration = (DateTime.Now - bState.PressTime).TotalMilliseconds;
            if (pressDuration < TAP_THRESHOLD_MS)
            {
                // Potential Tap or Double Tap
                // In a real engine, we'd wait slightly to confirm no second tap comes
                if (bState.TapCount == 2)
                {
                    OnInputEvent?.Invoke(id, "doubleTap");
                    bState.TapCount = 0;
                }
                else
                {
                    // Immediate tap for responsiveness (or delay for strict double tap support)
                    OnInputEvent?.Invoke(id, "tap");
                }
            }
        }
        else if (isDown) // Holding
        {
            if (!bState.Handled && (DateTime.Now - bState.PressTime).TotalMilliseconds > HOLD_THRESHOLD_MS)
            {
                OnInputEvent?.Invoke(id, "hold");
                bState.Handled = true; // Trigger hold once
            }
        }
    }
}