import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor, within } from "@testing-library/react";
import { IntlProvider } from "react-intl";
import RegisterLoginModal from "../../components/RegisterLoginModal";

vi.mock("../../components/Modal", () => ({
    default: ({ isOpen, children }: any) =>
        isOpen ? <div>{children}</div> : null
}));

vi.mock("../../services/AuthService", () => ({
    authService: {
        signUp: vi.fn(),
        signIn: vi.fn()
    }
}));

vi.mock("../../services/UserService", () => ({
    userService: {
        createUser: vi.fn()
    }
}));

vi.mock("../../services/Logging", () => ({
    default: {
        info: vi.fn(),
        error: vi.fn()
    }
}));

const messages = {
    "registerLogin.register": "Register",
    "registerLogin.login": "Login",
    "registerLogin.name": "Name",
    "registerLogin.email": "Email",
    "registerLogin.password": "Password",
    "error.emailAlreadyInUse": "Email already in use",
    "error.invalidEmail": "Invalid email",
    "error.weakPassword": "Weak password",
    "error.userNotFound": "User not found",
    "error.wrongPassword": "Wrong password",
    "error.tooManyRequests": "Too many requests",
    "error.unknownError": "Unknown error"
};

const renderModal = (
    isOpen = true,
    onClose = vi.fn()
) => render(
    <IntlProvider locale="es" messages={messages}>
        <RegisterLoginModal
            isOpen={isOpen}
            onClose={onClose}
        />
    </IntlProvider>
);

describe("RegisterLoginModal", () => {

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("renderiza el modal cuando isOpen es true", () => {
        renderModal(true);

        expect(
            screen.getByRole("heading", { name: "Register" })
        ).toBeInTheDocument();

        expect(
            screen.getByRole("heading", { name: "Login" })
        ).toBeInTheDocument();
    });

    it("resetea los campos al abrirse", () => {
        renderModal(true);

        const emails = screen.getAllByPlaceholderText("Email");
        const passwords = screen.getAllByPlaceholderText("Password");

        expect(emails[0]).toHaveValue("");
        expect(passwords[0]).toHaveValue("");
        expect(emails[1]).toHaveValue("");
        expect(passwords[1]).toHaveValue("");
    });

    it("realiza registro correctamente y llama a onClose", async () => {
        const { authService } = await import("../../services/AuthService");
        const { userService } = await import("../../services/UserService");

        vi.mocked(authService.signUp).mockResolvedValue({
            user: {
                uid: "123",
                reload: vi.fn()
            }
        } as any);

        vi.mocked(userService.createUser)
            .mockResolvedValue(undefined);

        const onClose = vi.fn();

        renderModal(true, onClose);

        const registerSection = screen
            .getByRole("heading", { name: "Register" })
            .parentElement!;

        fireEvent.change(
            within(registerSection).getByPlaceholderText("Name"),
            { target: { value: "Daniel" } }
        );

        fireEvent.change(
            within(registerSection).getByPlaceholderText("Email"),
            { target: { value: "test@test.com" } }
        );

        fireEvent.change(
            within(registerSection).getByPlaceholderText("Password"),
            { target: { value: "123456" } }
        );

        fireEvent.click(
            within(registerSection).getByRole("button", {
                name: "Register"
            })
        );

        await waitFor(() => {
            expect(authService.signUp)
                .toHaveBeenCalledWith(
                    "test@test.com",
                    "123456"
                );

            expect(userService.createUser)
                .toHaveBeenCalled();

            expect(onClose)
                .toHaveBeenCalled();
        });
    });

    it("muestra error de registro traducido", async () => {
        const { authService } = await import("../../services/AuthService");

        vi.mocked(authService.signUp)
            .mockRejectedValue({
                code: "auth/invalid-email"
            });

        renderModal(true);

        const registerSection = screen
            .getByRole("heading", { name: "Register" })
            .parentElement!;

        fireEvent.change(
            within(registerSection).getByPlaceholderText("Email"),
            { target: { value: "bademail" } }
        );

        fireEvent.change(
            within(registerSection).getByPlaceholderText("Password"),
            { target: { value: "123" } }
        );

        fireEvent.click(
            within(registerSection).getByRole("button", {
                name: "Register"
            })
        );

        expect(
            await screen.findByText("Invalid email")
        ).toBeInTheDocument();
    });

    it("realiza login correctamente y llama a onClose", async () => {
        const { authService } = await import("../../services/AuthService");

        vi.mocked(authService.signIn)
            .mockResolvedValue({} as any);

        const onClose = vi.fn();

        renderModal(true, onClose);

        const loginSection = screen
            .getByRole("heading", { name: "Login" })
            .parentElement!;

        fireEvent.change(
            within(loginSection).getByPlaceholderText("Email"),
            { target: { value: "test@test.com" } }
        );

        fireEvent.change(
            within(loginSection).getByPlaceholderText("Password"),
            { target: { value: "123456" } }
        );

        fireEvent.click(
            within(loginSection).getByRole("button", {
                name: "Login"
            })
        );

        await waitFor(() => {
            expect(authService.signIn)
                .toHaveBeenCalledWith(
                    "test@test.com",
                    "123456"
                );

            expect(onClose)
                .toHaveBeenCalled();
        });
    });

    it("muestra error de login traducido", async () => {
        const { authService } = await import("../../services/AuthService");

        vi.mocked(authService.signIn)
            .mockRejectedValue({
                code: "auth/wrong-password"
            });

        renderModal(true);

        const loginSection = screen
            .getByRole("heading", { name: "Login" })
            .parentElement!;

        fireEvent.change(
            within(loginSection).getByPlaceholderText("Email"),
            { target: { value: "test@test.com" } }
        );

        fireEvent.change(
            within(loginSection).getByPlaceholderText("Password"),
            { target: { value: "wrong" } }
        );

        fireEvent.click(
            within(loginSection).getByRole("button", {
                name: "Login"
            })
        );

        expect(
            await screen.findByText("Wrong password")
        ).toBeInTheDocument();
    });
});