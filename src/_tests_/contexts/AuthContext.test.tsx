import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, waitFor } from "@testing-library/react";
import { AuthProvider, AuthContext } from "../../contexts/AuthContext";
import { authService } from "../../services/AuthService";
import { userService } from "../../services/UserService";

vi.mock("../../services/AuthService", () => ({
    authService: {
        onAuthStateChanged: vi.fn(),
        signOut: vi.fn()
    }
}));

vi.mock("../../services/UserService", () => ({
    userService: {
        getUserById: vi.fn()
    }
}));

const mockOnAuthStateChanged = (callbackUser: any) => {
    (authService.onAuthStateChanged as any).mockImplementation((cb: any) => {
        cb(callbackUser);
        return () => { };
    });
};

const TestComponent = () => (
    <AuthProvider>
        <AuthContext.Consumer>
            {(value) => (
                <div>
                    <span data-testid="user">
                        {value.user ? value.user.id : "null"}
                    </span>
                </div>
            )}
        </AuthContext.Consumer>
    </AuthProvider>
);

describe("AuthContext", () => {

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("user = null cuando no hay usuario autenticado", async () => {
        mockOnAuthStateChanged(null);

        const { findByTestId } = render(<TestComponent />);

        expect(await findByTestId("user")).toHaveTextContent("null");
    });

    it("carga usuario correctamente cuando auth devuelve user válido", async () => {
        mockOnAuthStateChanged({ uid: "123" });

        (userService.getUserById as any).mockResolvedValue({
            id: "123",
            activo: true,
            email: "test@test.com"
        });

        const { findByTestId } = render(<TestComponent />);

        expect(await findByTestId("user")).toHaveTextContent("123");
    });

    it("cierra sesión si usuario está inactivo", async () => {
        mockOnAuthStateChanged({ uid: "123" });

        (userService.getUserById as any).mockResolvedValue({
            id: "123",
            activo: false,
            email: "test@test.com"
        });

        render(<TestComponent />);

        await waitFor(() => {
            expect(authService.signOut).toHaveBeenCalled();
        });
    });

    it("user = null si falla la carga del perfil", async () => {
        mockOnAuthStateChanged({ uid: "123" });

        (userService.getUserById as any).mockRejectedValue(
            new Error("error")
        );

        const { findByTestId } = render(<TestComponent />);

        expect(await findByTestId("user")).toHaveTextContent("null");
    });
});