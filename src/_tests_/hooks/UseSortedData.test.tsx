import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { sortByField } from "../../utils/SortByField";
import { useSortedData } from "../../hooks/UseSortedData";

vi.mock("../../utils/SortByField", () => ({
    sortByField: vi.fn()
}));

describe("useSortedData", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("carga datos y los ordena correctamente", async () => {
        const loader = vi.fn().mockResolvedValue([
            { id: 2, name: "B" },
            { id: 1, name: "A" }
        ]);

        vi.mocked(sortByField).mockReturnValue([
            { id: 1, name: "A" },
            { id: 2, name: "B" }
        ]);

        const { result } = renderHook(() =>
            useSortedData(loader, "id", "asc")
        );

        expect(result.current.loading).toBe(true);

        await act(async () => { });

        expect(loader).toHaveBeenCalled();
        expect(sortByField).toHaveBeenCalledWith(
            [
                { id: 2, name: "B" },
                { id: 1, name: "A" }
            ],
            "id",
            "asc"
        );

        expect(result.current.data).toEqual([
            { id: 1, name: "A" },
            { id: 2, name: "B" }
        ]);

        expect(result.current.loading).toBe(false);
    });

    it("se vuelve a ejecutar si cambia orderField", async () => {
        const loader = vi.fn().mockResolvedValue([{ id: 1, name: "A" }]);

        vi.mocked(sortByField).mockReturnValue([{ id: 1, name: "A" }]);

        const { rerender } = renderHook(
            ({ field }) => useSortedData(loader, field, "asc"),
            { initialProps: { field: "id" } }
        );

        await act(async () => { });

        expect(loader).toHaveBeenCalledTimes(1);

        rerender({ field: "name" });

        await act(async () => { });

        expect(loader).toHaveBeenCalledTimes(2);
    });

    it("se vuelve a ejecutar si cambia orderDirection", async () => {
        const loader = vi.fn().mockResolvedValue([{ id: 1 }]);

        vi.mocked(sortByField).mockReturnValue([{ id: 1 }]);

        const { rerender } = renderHook(
            ({ dir }) => useSortedData(loader, "id", dir as "asc" | "desc"),
            { initialProps: { dir: "asc" } }
        );

        await act(async () => { });

        rerender({ dir: "desc" });

        await act(async () => { });

        expect(loader).toHaveBeenCalledTimes(2);
    });
});
