import { describe, it, expect, vi, afterEach, beforeAll } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { IntlProvider } from "react-intl";
import Navbar from "../../components/Navbar";
import { AuthContext } from "../../contexts/AuthContext";
import { LanguageContext } from "../../contexts/LangContext";

vi.mock("../../services/AuthService", () => ({
    authService: {
        signOut: vi.fn()
    }
}));

vi.mock("../../components/RegisterLoginModal", () => ({
    default: ({ isOpen }: { isOpen: boolean }) =>
        isOpen ? <div>Auth Modal</div> : null
}));

beforeAll(() => {
    class ResizeObserverMock {
        observe() { }
        unobserve() { }
        disconnect() { }
    }

    globalThis.ResizeObserver = ResizeObserverMock as any;
});

afterEach(() => {
    vi.clearAllMocks();
});

const messages = {
    "navbar.spanish": "ES",
    "navbar.english": "EN",
    "navbar.ranking": "Ranking",
    "navbar.register_login": "Register/Login",
    "navbar.adminView": "Admin",
    "navbar.profile": "Profile",
    "navbar.logout": "Logout",
    "common.loading": "Loading"
};

const renderNavbar = (user: any, locale = "es") => {
    return render(
        <AuthContext.Provider
            value={{
                user,
                loading: false,
                setUser: vi.fn()
            } as any}
        >
            <LanguageContext.Provider
                value={{
                    locale,
                    changeLanguage: vi.fn()
                } as any}
            >
                <IntlProvider locale="es" messages={messages}>
                    <MemoryRouter>
                        <Navbar />
                    </MemoryRouter>
                </IntlProvider>
            </LanguageContext.Provider>
        </AuthContext.Provider>
    );
};

describe("Navbar", () => {

    it("muestra logo, ranking y selector de idioma", () => {
        renderNavbar(null);

        expect(screen.getByText("MiniArcade"))
            .toBeInTheDocument();

        expect(screen.getByText("Ranking"))
            .toBeInTheDocument();

        expect(screen.getByRole("button", { name: /es/i }))
            .toBeInTheDocument();
    });

    it("muestra botón de login si NO hay usuario", () => {
        renderNavbar(null);

        expect(screen.getByText("Register/Login"))
            .toBeInTheDocument();
    });

    it("muestra link admin si el usuario es ADMIN", () => {
        renderNavbar({
            id: "1",
            rol: "ADMIN",
            avatar: "a.png"
        });

        expect(screen.getByText("Admin"))
            .toBeInTheDocument();
    });

    it("muestra avatar, profile y logout si el usuario está logueado", () => {
        renderNavbar({
            id: "1",
            rol: "USER",
            avatar: "avatar.png"
        });

        expect(screen.getByAltText("avatar"))
            .toBeInTheDocument();

        expect(screen.getByText("Profile"))
            .toBeInTheDocument();

        expect(screen.getByText("Logout"))
            .toBeInTheDocument();
    });

    it("abre el modal al pulsar Register/Login", async () => {
        renderNavbar(null);

        fireEvent.click(
            screen.getByText("Register/Login")
        );

        expect(await screen.findByText("Auth Modal"))
            .toBeInTheDocument();
    });

    it("logout llama a authService.signOut y redirige", async () => {
        const { authService } = await import("../../services/AuthService");

        Object.defineProperty(window, "location", {
            writable: true,
            value: { href: "" }
        });

        renderNavbar({
            id: "1",
            rol: "USER",
            avatar: "avatar.png"
        });

        fireEvent.click(
            screen.getByText("Logout")
        );

        await waitFor(() => {
            expect(authService.signOut)
                .toHaveBeenCalled();

            expect(window.location.href)
                .toBe("/");
        });
    });
});