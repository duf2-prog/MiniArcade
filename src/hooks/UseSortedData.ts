import { useEffect, useState } from "react";
import { sortByField } from "../utils/SortByField";

export function useSortedData<T>(
    loader: () => Promise<T[]>,
    orderField: keyof T,
    orderDirection: "asc" | "desc"
) {
    const [data, setData] = useState<T[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            setLoading(true);
            const raw = await loader();
            const sorted = sortByField(raw, orderField, orderDirection);
            setData(sorted);
            setLoading(false);
        };
        load();
    }, [loader, orderField, orderDirection]);

    return { data, loading };
}
