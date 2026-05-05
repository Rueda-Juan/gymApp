import React from "react";
import { render, act, waitFor } from "@testing-library/react-native";
import { useActiveWorkout } from "../../model/useActiveWorkout";
import { useWorkoutTimer } from "../useWorkoutTimer";

jest.mock("../../model/useActiveWorkout");
jest.mock("@/shared/lib/time", () => ({
  formatElapsedTime: (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m.toString().padStart(2, "0")}:${sec.toString().padStart(2, "0")}`;
  },
}));

function mockStartTime(startTime: number | null) {
  (useActiveWorkout as unknown as jest.Mock).mockImplementation(
    (selector: Function) => selector({ startTime }),
  );
}

function renderHook() {
  let result: ReturnType<typeof useWorkoutTimer>;

  function TestComponent() {
    result = useWorkoutTimer();
    return null;
  }

  const rendered = render(React.createElement(TestComponent));
  return {
    getResult: () => result!,
    unmount: rendered.unmount,
    rerender: () => rendered.rerender(React.createElement(TestComponent)),
  };
}

describe("useWorkoutTimer", () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.restoreAllMocks();
  });

  it("calcula segundos transcurridos correctamente", async () => {
    const now = 1000000;
    jest.spyOn(Date, "now").mockReturnValue(now);
    mockStartTime(now - 5000);

    const { getResult } = renderHook();

    // El primer render ya debería tener el valor calculado
    await waitFor(() => {
      expect(getResult().elapsedSeconds).toBe(5);
    });
  });

  it("incrementa con cada tick", () => {
    const now = 1000000;
    let currentTime = now;
    jest.spyOn(Date, "now").mockImplementation(() => currentTime);
    mockStartTime(now);

    const { getResult } = renderHook();

    expect(getResult().elapsedSeconds).toBe(0);

    currentTime = now + 1000;
    act(() => {
      jest.advanceTimersByTime(1000);
    });
    expect(getResult().elapsedSeconds).toBe(1);

    currentTime = now + 2000;
    act(() => {
      jest.advanceTimersByTime(1000);
    });
    expect(getResult().elapsedSeconds).toBe(2);
  });

  // •••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••
  // Reset
  // •••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••

  describe("reset al limpiar startTime", () => {
    it("resetea a 0 cuando startTime pasa a null", () => {
      const now = 1000000;
      jest.spyOn(Date, "now").mockReturnValue(now + 1000);
      mockStartTime(now);

      const { getResult, rerender } = renderHook();

      act(() => {
        jest.advanceTimersByTime(1000);
      });
      expect(getResult().elapsedSeconds).toBe(1);

      mockStartTime(null);
      rerender();

      expect(getResult().elapsedSeconds).toBe(0);
    });
  });

  // •••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••
  // Formato
  // •••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••

  describe("formato", () => {
    it("expone formatTime como función de utilidad", () => {
      mockStartTime(null);
      const { getResult } = renderHook();

      expect(typeof getResult().formatTime).toBe("function");
      expect(getResult().formatTime(90)).toBe("01:30");
    });
  });

  // •••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••
  // Cleanup
  // •••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••

  describe("cleanup", () => {
    it("limpia el intervalo al desmontarse", () => {
      // Previene: memory leak por intervalo no limpiado
      const now = Date.now();
      jest.spyOn(Date, "now").mockReturnValue(now);
      mockStartTime(now);

      const spyClear = jest.spyOn(global, "clearInterval");
      const { unmount } = renderHook();

      unmount();

      expect(spyClear).toHaveBeenCalled();
      spyClear.mockRestore();
    });
  });
});
