import { describe, it, expect, vi, beforeAll } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Modal from "../../components/Modal";

beforeAll(() => {
    class ResizeObserverMock {
        observe() { }
        unobserve() { }
        disconnect() { }
    }

    globalThis.ResizeObserver = ResizeObserverMock as any;
});

describe("Modal", () => {

    it("no renderiza contenido cuando isOpen es false", () => {
        render(
            <Modal isOpen={false} onClose={() => { }}>
                <div>Contenido</div>
            </Modal>
        );

        expect(screen.queryByText("Contenido"))
            .not.toBeInTheDocument();
    });

    it("renderiza contenido cuando isOpen es true", async () => {
        render(
            <Modal isOpen={true} onClose={() => { }}>
                <div>Contenido</div>
            </Modal>
        );

        expect(await screen.findByText("Contenido"))
            .toBeInTheDocument();
    });

    it("llama a onClose al pulsar Escape", async () => {
        const onClose = vi.fn();

        render(
            <Modal isOpen={true} onClose={onClose}>
                <div>Contenido</div>
            </Modal>
        );

        fireEvent.keyDown(document, {
            key: "Escape",
            code: "Escape"
        });

        await waitFor(() => {
            expect(onClose)
                .toHaveBeenCalled();
        });
    });

    it("renderiza correctamente el panel modal", async () => {
        render(
            <Modal isOpen={true} onClose={() => { }}>
                <div>Contenido</div>
            </Modal>
        );

        expect(await screen.findByText("Contenido"))
            .toBeInTheDocument();

        expect(document.querySelector(".modal-panel"))
            .toBeInTheDocument();
    });
});