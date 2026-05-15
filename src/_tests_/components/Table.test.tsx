import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import Table from "../../components/Table";
import { IntlProvider } from "react-intl";

const messages = {
    "common.loading": "Loading",
    "common.noData": "No data",
    "col.name": "Name",
    "col.score": "Score"
};

const renderTable = (props: any) =>
    render(
        <IntlProvider locale="es" messages={messages}>
            <Table {...props} />
        </IntlProvider>
    );

describe("Table", () => {

    it("muestra loading cuando loading es true", () => {
        renderTable({
            loading: true,
            columns: [],
            data: []
        });

        expect(screen.getByText("Loading")).toBeInTheDocument();
    });

    it("muestra estado vacío cuando no hay datos y no está loading", () => {
        renderTable({
            loading: false,
            columns: [],
            data: []
        });

        expect(screen.getByText("No data")).toBeInTheDocument();
    });

    it("renderiza columnas y datos correctamente", () => {
        const columns = [
            { key: "name", label: "col.name" },
            { key: "score", label: "col.score" }
        ];

        const data = [
            { name: "Daniel", score: 100 },
            { name: "Ana", score: 200 }
        ];

        renderTable({ loading: false, columns, data });

        expect(screen.getByText("Name")).toBeInTheDocument();
        expect(screen.getByText("Score")).toBeInTheDocument();

        expect(screen.getByText("Daniel")).toBeInTheDocument();
        expect(screen.getByText("Ana")).toBeInTheDocument();
    });

    it("ejecuta onClick cuando una columna es clicable", () => {
        const onClick = vi.fn();

        const columns = [
            { key: "name", label: "col.name", onClick }
        ];

        const data = [{ name: "Daniel" }];

        renderTable({ loading: false, columns, data });

        fireEvent.click(screen.getByText("Name"));

        expect(onClick).toHaveBeenCalledTimes(1);
    });

    it("muestra icono ascendente cuando order es asc", () => {
        const columns = [
            { key: "name", label: "col.name", order: "asc" }
        ];

        renderTable({
            loading: false,
            columns,
            data: [{ name: "Daniel" }]
        });

        expect(screen.getByText("▲")).toBeInTheDocument();
    });

    it("muestra icono descendente cuando order es desc", () => {
        const columns = [
            { key: "name", label: "col.name", order: "desc" }
        ];

        renderTable({
            loading: false,
            columns,
            data: [{ name: "Daniel" }]
        });

        expect(screen.getByText("▼")).toBeInTheDocument();
    });

    it("usa render personalizado cuando se define render en columna", () => {
        const columns = [
            {
                key: "name",
                label: "col.name",
                render: (row: any) => <span>Custom: {row.name}</span>
            }
        ];

        const data = [{ name: "Daniel" }];

        renderTable({ loading: false, columns, data });

        expect(screen.getByText("Custom: Daniel")).toBeInTheDocument();
    });
});