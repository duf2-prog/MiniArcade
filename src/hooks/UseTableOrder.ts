import { useState } from "react";

export function useTableOrder<T extends string>(initialField: T) {
    const [orderField, setOrderField] = useState<T>(initialField);
    const [orderDirection, setOrderDirection] = useState<"asc" | "desc">("asc");

    const toggleOrder = (field: T) => {
        if (orderField === field) {
            setOrderDirection(prev => (prev === "asc" ? "desc" : "asc"));
        } else {
            setOrderField(field);
            setOrderDirection("asc");
        }
    };

    return { orderField, orderDirection, toggleOrder };
}
