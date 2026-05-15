import type { JSX } from "react";
import { FormattedMessage } from "react-intl";

interface Column {
    key: string;
    label: string;
    onClick?: () => void;
    order?: "asc" | "desc" | null;
    render?: (row: any) => JSX.Element;
}

interface TableProps {
    columns: Column[];
    data: any[];
    loading?: boolean;
}

export default function Table({ columns, data, loading }: TableProps) {
    return (
        <div className="table p-4">

            {loading && (
                <p className="info-text text-sm">
                    <FormattedMessage id="common.loading" />
                </p>
            )}

            {!loading && data.length === 0 && (
                <p className="py-2 info-text">
                    <FormattedMessage id="common.noData" />
                </p>
            )}

            {!loading && data.length > 0 && (
                <table className="table-inner">
                    <thead>
                        <tr>
                            {columns.map(col => (
                                <th
                                    key={col.key}
                                    className={`table-header-cell col-${col.key} ${col.onClick ? "cursor-pointer" : ""}`}
                                    onClick={col.onClick}
                                >
                                    <FormattedMessage id={col.label} />

                                    {col.order === "asc" && <span> ▲</span>}
                                    {col.order === "desc" && <span> ▼</span>}
                                </th>
                            ))}
                        </tr>
                    </thead>

                    <tbody>
                        {data.map((row, index) => (
                            <tr key={index} className="table-row">
                                {columns.map(col => (
                                    <td key={col.key} className={`table-cell col-${col.key}`}>
                                        {col.render ? col.render(row) : row[col.key]}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}