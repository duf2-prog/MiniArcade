import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useDebounce } from "../../hooks/UseDebounce";

vi.useFakeTimers();

describe("useDebounce", () => {
    beforeEach(() => {
        vi.clearAllTimers();
    });

    it("devuelve el valor inicial inmediatamente", () => {
        const { result } = renderHook(() => useDebounce("hola", 300));
        expect(result.current).toBe("hola");
    });

    it("no actualiza el valor antes del delay", () => {
        const { result, rerender } = renderHook(
            ({ value }) => useDebounce(value, 300),
            { initialProps: { value: "a" } }
        );

        rerender({ value: "b" });

        expect(result.current).toBe("a");

        act(() => {
            vi.advanceTimersByTime(299);
        });

        expect(result.current).toBe("a");
    });

    it("actualiza el valor después del delay", () => {
        const { result, rerender } = renderHook(
            ({ value }) => useDebounce(value, 300),
            { initialProps: { value: "a" } }
        );

        rerender({ value: "b" });

        act(() => {
            vi.advanceTimersByTime(300);
        });

        expect(result.current).toBe("b");
    });

    it("solo aplica el último valor si hay cambios rápidos", () => {
        const { result, rerender } = renderHook(
            ({ value }) => useDebounce(value, 300),
            { initialProps: { value: "a" } }
        );

        rerender({ value: "b" });
        act(() => vi.advanceTimersByTime(100));

        rerender({ value: "c" });
        act(() => vi.advanceTimersByTime(100));

        rerender({ value: "d" });
        act(() => vi.advanceTimersByTime(100));

        expect(result.current).toBe("a");

        act(() => vi.advanceTimersByTime(300));

        expect(result.current).toBe("d");
    });
});
