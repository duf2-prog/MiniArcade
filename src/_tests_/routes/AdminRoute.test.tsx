import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import AdminRoute from "../../routes/AdminRoute";
import { AuthContext } from "../../contexts/AuthContext";
import { Role } from "../../entities/Entities";

vi.mock("react-router-dom", async () => {
    const actual = await vi.importActual<any>("react-router-dom");
    return {
        ...actual,
        Navigate: vi.fn(() => <div>mock-navigate</div>)
    };
});

describe("AdminRoute", () => {

    it("permite acceso cuando el usuario es admin", () => {

        const mockUser = {
            id: "1",
            nombre: "Daniel",
            email: "daniel@test.com",
            avatar: "",
            fechaRegistro: new Date().toISOString(),
            rol: Role.ADMIN,
            activo: true
        };

        render(
            <AuthContext.Provider value={{ user: mockUser, setUser: vi.fn(), loading: false }}>
                <AdminRoute>
                    <div>contenido-admin</div>
                </AdminRoute>
            </AuthContext.Provider>
        );

        expect(screen.getByText("contenido-admin")).toBeInTheDocument();
    });

    it("redirige cuando el usuario NO es admin", () => {

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
                <AdminRoute>
                    <div>contenido-admin</div>
                </AdminRoute>
            </AuthContext.Provider>
        );

        expect(screen.getByText("mock-navigate")).toBeInTheDocument();
    });

    it("redirige cuando NO hay usuario", () => {

        render(
            <AuthContext.Provider value={{ user: null, setUser: vi.fn(), loading: false }}>
                <AdminRoute>
                    <div>contenido-admin</div>
                </AdminRoute>
            </AuthContext.Provider>
        );

        expect(screen.getByText("mock-navigate")).toBeInTheDocument();
    });
});
