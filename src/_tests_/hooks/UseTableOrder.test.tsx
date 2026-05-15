import { describe, it, expect } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useTableOrder } from "../../hooks/UseTableOrder";

describe("useTableOrder", () => {
    it("inicia con el campo y dirección asc", () => {
        const { result } = renderHook(() =>
            useTableOrder<"name" | "age">("name")
        );

        expect(result.current.orderField).toBe("name");
        expect(result.current.orderDirection).toBe("asc");
    });

    it("cambiar a un campo distinto pone dirección asc", () => {
        const { result } = renderHook(() =>
            useTableOrder<"name" | "age">("name")
        );

        act(() => result.current.toggleOrder("age"));

        expect(result.current.orderField).toBe("age");
        expect(result.current.orderDirection).toBe("asc");
    });

    it("si se pulsa el mismo campo alterna asc ↔ desc", () => {
        const { result } = renderHook(() =>
            useTableOrder<"name" | "age">("name")
        );

        act(() => result.current.toggleOrder("name"));
        expect(result.current.orderDirection).toBe("desc");

        act(() => result.current.toggleOrder("name"));
        expect(result.current.orderDirection).toBe("asc");
    });
});
