import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import ProtectedRoute from "../../routes/ProtectedRoute";
import { AuthContext } from "../../contexts/AuthContext";
import { Role } from "../../entities/Entities";

vi.mock("react-router-dom", async () => {
    const actual = await vi.importActual<any>("react-router-dom");
    return {
        ...actual,
        Navigate: vi.fn(() => <div>mock-navigate</div>)
    };
});

describe("ProtectedRoute", () => {

    it("permite acceso cuando hay usuario", () => {

        const mockUser = {
            id: "1",
            nombre: "Daniel",
            email: "daniel@test.com",
            avatar: "",
            fechaRegistro: new Date().toISOString(),
            rol: Role.USER,
            activo: true
        };

        render(
            <AuthContext.Provider value={{ user: mockUser, setUser: vi.fn(), loading: false }}>
                <ProtectedRoute>
                    <div>contenido-protegido</div>
                </ProtectedRoute>
            </AuthContext.Provider>
        );

        expect(screen.getByText("contenido-protegido")).toBeInTheDocument();
    });

    it("redirige cuando NO hay usuario", () => {

        render(
            <AuthContext.Provider value={{ user: null, setUser: vi.fn(), loading: false }}>
                <ProtectedRoute>
                    <div>contenido-protegido</div>
                </ProtectedRoute>
            </AuthContext.Provider>
        );

        expect(screen.getByText("mock-navigate")).toBeInTheDocument();
    });
});
