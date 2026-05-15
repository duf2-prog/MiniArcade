export function sortByField<T>(
    data: T[],
    field: keyof T,
    direction: "asc" | "desc"
): T[] {
    return [...data].sort((a, b) => {
        const A = a[field];
        const B = b[field];

        if (A < B) return direction === "asc" ? -1 : 1;
        if (A > B) return direction === "asc" ? 1 : -1;
        return 0;
    });
}
